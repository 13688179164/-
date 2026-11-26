const cloud = require('@cloudbase/node-sdk');
const app = cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });

const ENDPOINT = process.env.PG_ENDPOINT;
const API_KEY = process.env.TCB_API_KEY;

async function q(sql, parameters = []) {
  const r = await fetch(`${ENDPOINT}/v1/rdb/exec-pgsql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, parameters, role: 'cloudbase_postgres' }),
  });
  const text = await r.text();
  if (!r.ok) {
    const err = new Error(text.slice(0, 300));
    err.status = r.status;
    throw err;
  }
  return JSON.parse(text);
}

async function currentUser() {
  const info = await app.auth().getUserInfo();
  const uid = info && info.uid;
  if (!uid) return null;
  const rows = await q(
    'select username, auth_uid, name, role, status from goodwork_users where auth_uid = $1',
    [uid]
  );
  if (!rows.length) return null;
  const u = rows[0];
  if (u.status !== 'active') return null;
  return u;
}

function fail(code, message) {
  return { ok: false, code, message };
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function text(v, max = 500) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

// 前端传的是 datetime-local 的“墙上时间”（不带时区）。云函数运行在 UTC，
// 若直接 new Date() 会被当作 UTC 解析，导致 +08 用户晚间填报的日期整体后移一天。
// 这里统一按门店本地时区（+08:00）解释；带时区的字符串保持原样。
function appliedAtIso(value) {
  const s = String(value == null ? '' : value).trim();
  if (!s) return new Date().toISOString();
  const hasTz = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(s);
  const d = new Date(hasTz ? s : `${s}+08:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

async function audit(actor, action, targetId, fromStatus, toStatus, detail) {
  await q(
    `insert into goodwork_audit
      (actor_uid, actor_name, action, target_type, target_id, from_status, to_status, detail)
     values ($1,$2,$3,'task',$4,$5,$6,$7::jsonb)`,
    [actor.auth_uid, actor.name, action, targetId, fromStatus, toStatus, JSON.stringify(detail || {})]
  );
}

async function listTasks(user, status) {
  const params = [];
  let where = '1=1';
  if (user.role !== 'admin') {
    params.push(user.auth_uid);
    where += ` and applicant_uid = $${params.length}`;
  }
  if (status && status !== 'all') {
    params.push(status);
    where += ` and status = $${params.length}`;
  }
  params.push(200);
  const tasks = await q(
    `select id, applicant, applicant_uid, amount, department, category, applied_at, content,
            status, has_invoice, invoice_received, reimbursed_at, reviewed_by, reviewed_at,
            review_note, legacy_unclaimed, updated_at
     from goodwork_tasks
     where ${where}
     order by applied_at desc
     limit $${params.length}`,
    params
  );
  const ids = tasks.map((t) => t.id);
  let attachments = [];
  if (ids.length) {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    attachments = await q(
      `select id, task_id, name, size, mime_type, cloud_file_id
       from goodwork_attachments where task_id in (${placeholders}) order by created_at`,
      ids
    );
  }
  const users = user.role === 'admin'
    ? await q('select username, auth_uid, name, role, status from goodwork_users order by role, username')
    : [];
  return { tasks, attachments, users };
}

exports.main = async (event) => {
  try {
    const user = await currentUser();
    if (!user) return fail('UNAUTHENTICATED', '未登录或账号未开通');
    const action = text(event && event.action, 40);

    if (action === 'profile') {
      await q('update goodwork_users set last_login_at = now() where auth_uid = $1', [user.auth_uid]);
      return { ok: true, user: { username: user.username, name: user.name, role: user.role } };
    }

    if (action === 'list') {
      return { ok: true, ...(await listTasks(user, text(event.status, 20))) };
    }

    if (action === 'create') {
      const amount = num(event.amount);
      if (!(amount > 0)) return fail('VALIDATION', '金额必须大于 0');
      const department = text(event.department, 40);
      const category = text(event.category, 40);
      const content = text(event.content, 1000);
      if (!department || !category) return fail('VALIDATION', '部门与分类不能为空');
      const clientId = text(event.clientId, 40);
      const id = /^GW-RB-[a-z0-9]{6,20}$/i.test(clientId)
        ? clientId
        : `GW-RB-${Math.random().toString(36).slice(2, 10)}`;
      const appliedAt = appliedAtIso(event.appliedAt);
      if (!appliedAt) return fail('VALIDATION', '日期格式不正确');
      const rows = await q(
        `insert into goodwork_tasks
          (id, applicant, amount, department, category, applied_at, content, status,
           has_invoice, applicant_uid, writer_device_id, created_at, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,'draft',$8,$9,$10,now(),now())
         returning id, status, amount, applied_at`,
        [id, user.name, amount, department, category, appliedAt, content,
          !!event.hasInvoice, user.auth_uid, 'web']
      );
      await audit(user, 'create', id, null, 'draft', { amount, category });
      return { ok: true, task: rows[0] };
    }

    if (action === 'update') {
      const id = text(event.taskId, 60);
      const amount = num(event.amount);
      if (!id || !(amount > 0)) return fail('VALIDATION', '参数不正确');
      const appliedAt = event.appliedAt ? appliedAtIso(event.appliedAt) : new Date().toISOString();
      if (!appliedAt) return fail('VALIDATION', '日期格式不正确');
      const rows = await q(
        `update goodwork_tasks
         set amount=$1, department=$2, category=$3, content=$4, has_invoice=$5,
             applied_at=$6, updated_at=now(), version=version+1
         where id=$7 and applicant_uid=$8 and status in ('draft','submitted')
         returning id, status`,
        [amount, text(event.department, 40), text(event.category, 40), text(event.content, 1000),
          !!event.hasInvoice, appliedAt,
          id, user.auth_uid]
      );
      if (!rows.length) return fail('INVALID_STATE', '当前状态不允许修改');
      await audit(user, 'update', id, rows[0].status, rows[0].status, {});
      return { ok: true, task: rows[0] };
    }

    if (action === 'remove') {
      const id = text(event.taskId, 60);
      if (!id) return fail('VALIDATION', '缺少任务 ID');
      // 管理员可删除任意状态的记录；成员只能删除自己的草稿
      if (user.role === 'admin') {
        const rows = await q(
          'delete from goodwork_tasks where id=$1 returning id, status, applicant_uid',
          [id]
        );
        if (!rows.length) return fail('INVALID_STATE', '记录不存在或已被删除');
        await q('delete from goodwork_attachments where task_id=$1', [id]);
        await audit(user, 'remove', id, rows[0].status, null, { byAdmin: true });
        return { ok: true, removed: rows[0] };
      }
      const rows = await q(
        `delete from goodwork_tasks where id=$1 and applicant_uid=$2 and status='draft' returning id`,
        [id, user.auth_uid]
      );
      if (!rows.length) return fail('INVALID_STATE', '只能删除自己的草稿');
      await q('delete from goodwork_attachments where task_id=$1', [id]);
      await audit(user, 'remove', id, 'draft', null, {});
      return { ok: true };
    }

    if (action === 'attach') {
      const id = text(event.taskId, 60);
      const name = text(event.name, 200);
      const mime = text(event.mime, 100);
      const fileID = text(event.fileID, 500);
      const size = Math.max(0, Math.min(Number(event.size) || 0, 10 * 1024 * 1024));
      if (!id || !fileID) return fail('VALIDATION', '附件信息不完整');
      const own = await q('select id from goodwork_tasks where id = $1 and applicant_uid = $2 and status = $3', [id, user.auth_uid, 'draft']);
      if (!own.length) return fail('INVALID_STATE', '只能在草稿状态上传附件');
      const attId = `att-${Math.random().toString(36).slice(2, 10)}`;
      await q(
        `insert into goodwork_attachments (id, task_id, name, size, mime_type, cloud_file_id, uploader_uid, storage_path)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [attId, id, name, size, mime, fileID, user.auth_uid, fileID]
      );
      await audit(user, 'attach', id, 'draft', 'draft', { name });
      return { ok: true, attachment: { id: attId, name } };
    }

    if (action === 'submit' || action === 'cancel') {
      const id = text(event.taskId, 60);
      if (!id) return fail('VALIDATION', '缺少任务 ID');
      const from = action === 'submit' ? 'draft' : 'submitted';
      const to = action === 'submit' ? 'submitted' : 'cancelled';
      const rows = await q(
        `update goodwork_tasks
         set status = $1, updated_at = now(), version = version + 1
         where id = $2 and applicant_uid = $3 and status = $4
         returning id, status`,
        [to, id, user.auth_uid, from]
      );
      if (!rows.length) return fail('INVALID_STATE', '当前状态不允许此操作');
      await audit(user, action, id, from, to, {});
      return { ok: true, task: rows[0] };
    }

    if (action === 'review') {
      if (user.role !== 'admin') return fail('FORBIDDEN', '只有管理员可以审批');
      const id = text(event.taskId, 60);
      const decision = text(event.decision, 20);
      if (!id || !['approve', 'reject'].includes(decision)) return fail('VALIDATION', '参数不正确');
      const to = decision === 'approve' ? 'approved' : 'rejected';
      const note = text(event.note, 500);
      const rows = await q(
        `update goodwork_tasks
         set status = $1, reviewed_by = $2, reviewed_at = now(), review_note = $3,
             updated_at = now(), version = version + 1
         where id = $4 and status = 'submitted'
         returning id, status`,
        [to, user.name, note, id]
      );
      if (!rows.length) return fail('INVALID_STATE', '该记录当前不在待审批状态');
      await audit(user, 'review', id, 'submitted', to, { note });
      return { ok: true, task: rows[0] };
    }

    if (action === 'reimburse') {
      if (user.role !== 'admin') return fail('FORBIDDEN', '只有管理员可以标记已报销');
      const id = text(event.taskId, 60);
      const rows = await q(
        `update goodwork_tasks
         set status = 'reimbursed', reimbursed_at = now(), updated_at = now(), version = version + 1
         where id = $1 and status = 'approved'
         returning id, status`,
        [id]
      );
      if (!rows.length) return fail('INVALID_STATE', '该记录当前不在待报销状态');
      await audit(user, 'reimburse', id, 'approved', 'reimbursed', {});
      return { ok: true, task: rows[0] };
    }

    if (action === 'reassign') {
      if (user.role !== 'admin') return fail('FORBIDDEN', '只有管理员可以改归属');
      const id = text(event.taskId, 60);
      const username = text(event.username, 60);
      const target = await q('select auth_uid, name from goodwork_users where username = $1 and status = $2', [username, 'active']);
      if (!target.length) return fail('NOT_FOUND', '目标账号不存在或已停用');
      const rows = await q(
        `update goodwork_tasks
         set applicant_uid = $1, applicant = $2, legacy_unclaimed = false, updated_at = now(), version = version + 1
         where id = $3
         returning id, applicant, applicant_uid`,
        [target[0].auth_uid, target[0].name, id]
      );
      if (!rows.length) return fail('NOT_FOUND', '记录不存在');
      await audit(user, 'reassign', id, null, null, { to: username });
      return { ok: true, task: rows[0] };
    }

    if (action === 'audit') {
      if (user.role !== 'admin') return fail('FORBIDDEN', '只有管理员可以查看审计');
      const rows = await q(
        `select id, actor_name, action, target_id, from_status, to_status, detail, created_at
         from goodwork_audit order by id desc limit 100`
      );
      return { ok: true, audit: rows };
    }

    return fail('UNKNOWN_ACTION', '未知操作');
  } catch (e) {
    console.error('api error', e && e.message);
    return fail('SERVER_ERROR', '服务暂时不可用，请稍后重试');
  }
};
