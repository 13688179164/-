import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as T from './textures.js';

/* ============================================================
   World atelier
   ============================================================ */

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const unitPlane = new THREE.PlaneGeometry(1, 1);
const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 20);
const unitSphere = new THREE.SphereGeometry(1, 20, 14);

function addBox(parent, material, size, pos, opts = {}) {
  const mesh = new THREE.Mesh(unitBox, material);
  mesh.scale.set(size[0], size[1], size[2]);
  mesh.position.set(pos[0], pos[1], pos[2]);
  if (opts.ry) mesh.rotation.y = opts.ry;
  if (opts.rx) mesh.rotation.x = opts.rx;
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.receive !== false;
  parent.add(mesh);
  return mesh;
}

function addCyl(parent, material, radius, height, pos, opts = {}) {
  const mesh = new THREE.Mesh(unitCyl, material);
  mesh.scale.set(radius, height, radius);
  mesh.position.set(pos[0], pos[1], pos[2]);
  if (opts.rx) mesh.rotation.x = opts.rx;
  if (opts.rz) mesh.rotation.z = opts.rz;
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.receive !== false;
  parent.add(mesh);
  return mesh;
}

function addSphere(parent, material, radius, pos, opts = {}) {
  const mesh = new THREE.Mesh(unitSphere, material);
  mesh.scale.set(radius * (opts.sx || 1), radius * (opts.sy || 1), radius * (opts.sz || 1));
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.receive !== false;
  parent.add(mesh);
  return mesh;
}

function addPlane(parent, material, size, pos, rotation = [-Math.PI / 2, 0, 0]) {
  const mesh = new THREE.Mesh(unitPlane, material);
  mesh.scale.set(size[0], size[1], 1);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function glowSprite(texture, color, scale, opacity = 0.5) {
  const mat = new THREE.SpriteMaterial({
    map: texture, color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

/* ---------- draw-call compaction ---------- */
function mergeOpaqueByMaterial(group) {
  group.updateWorldMatrix(true, true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const buckets = new Map();
  group.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh) return;
    if (!o.material || Array.isArray(o.material)) return;
    if (o.material.transparent || o.material.isShaderMaterial || o.userData.noMerge) return;
    const attrs = Object.keys(o.geometry.attributes).sort().join(',') + (o.geometry.index ? '|i' : '|n');
    const key = `${o.material.uuid}|${o.castShadow ? 1 : 0}|${o.receiveShadow ? 1 : 0}|${o.renderOrder}|${attrs}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        material: o.material, cast: o.castShadow, receive: o.receiveShadow,
        order: o.renderOrder, list: [],
      });
    }
    buckets.get(key).list.push(o);
  });
  const tmp = new THREE.Matrix4();
  for (const bucket of buckets.values()) {
    if (bucket.list.length < 2) continue;
    const geos = bucket.list.map((m) => {
      const g = m.geometry.clone();
      g.applyMatrix4(tmp.copy(inv).multiply(m.matrixWorld));
      return g;
    });
    const merged = mergeGeometries(geos, false);
    if (!merged) {
      geos.forEach((g) => g.dispose());
      continue;
    }
    const mesh = new THREE.Mesh(merged, bucket.material);
    mesh.castShadow = bucket.cast;
    mesh.receiveShadow = bucket.receive;
    mesh.renderOrder = bucket.order;
    group.add(mesh);
    bucket.list.forEach((m) => m.removeFromParent());
    geos.forEach((g) => g.dispose());
  }
}

function mergeStaticDecor(scene, pickableSet) {
  scene.updateMatrixWorld(true);
  const buckets = new Map();
  scene.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh) return;
    if (pickableSet.has(o)) return;
    if (!o.material || Array.isArray(o.material)) return;
    if (o.material.transparent || o.material.isShaderMaterial || o.userData.noMerge) return;
    if (o.userData.entryId) return;
    const attrs = Object.keys(o.geometry.attributes).sort().join(',') + (o.geometry.index ? '|i' : '|n');
    const key = `${o.material.uuid}|${o.castShadow ? 1 : 0}|${o.receiveShadow ? 1 : 0}|${o.renderOrder}|${attrs}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        material: o.material, cast: o.castShadow, receive: o.receiveShadow,
        order: o.renderOrder, list: [],
      });
    }
    buckets.get(key).list.push(o);
  });
  for (const bucket of buckets.values()) {
    if (bucket.list.length < 2) continue;
    const geos = bucket.list.map((m) => {
      const g = m.geometry.clone();
      g.applyMatrix4(m.matrixWorld);
      return g;
    });
    const merged = mergeGeometries(geos, false);
    if (!merged) {
      geos.forEach((g) => g.dispose());
      continue;
    }
    const mesh = new THREE.Mesh(merged, bucket.material);
    mesh.castShadow = bucket.cast;
    mesh.receiveShadow = bucket.receive;
    mesh.renderOrder = bucket.order;
    scene.add(mesh);
    bucket.list.forEach((m) => m.removeFromParent());
    geos.forEach((g) => g.dispose());
  }
}

/* ---------------- dossier content ---------------- */
const META = {
  garage: {
    code: 'GW-01', name: 'GOODWORK 古德車房', en: 'AUTO ATELIER · MAIN STAGE', category: '门店资产',
    tags: ['双层玻璃幕墙', '金边主招牌', '报销主入口'],
    desc: '古德車房是整个工作台的叙事核心：一层是举升工位与接待区，二层是调度与归档办公区。点击幕墙将触发三段缓动运镜，场景虚化后直接进入报销申请。',
    specs: [['建筑面积', '286 m²'], ['建筑层数', '2F / 9.4 m'], ['维修工位', '4 POSTS'], ['启用年份', '2016']],
    docs: [['01', '门店租赁结算单', 'GW-2026-10-118', '待归档'], ['02', '举升机保养工单', 'GW-2026-11-082', '已验真']],
    amount: 12800,
    preset: { category: '门店运营', entity: 'GOODWORK 古德車房', vendor: '古德車房设备服务部', cost: 'GW-STORE-01 · 门店运营', note: '门店一层举升机液压系统季度保养，含密封件更换与安全复检。' },
  },
  finance: {
    code: 'GW-02', name: '财务室 · FINANCE', en: 'REVIEW & TREASURY', category: '建筑设施',
    tags: ['二级审批', '付款排程', '场景审批'],
    desc: '财务室承担全部场景单据的复核、预算占用与付款排程。夜间窗口保留暖光，苏禾在此完成 NPC 任务链的最终审批。',
    specs: [['工位数量', '6 DESKS'], ['在办单据', '12'], ['审批时效', '1.8 h'], ['系统', 'SCENE→ERP']],
    docs: [['01', '夜间付款排程表', 'FIN-2026-1122', '处理中'], ['02', '门店费用月报', 'FIN-2026-11-M', '已生成']],
    amount: 6400,
    preset: { category: '水电与物业', entity: '财务室', vendor: '城市物业管理处', cost: 'GW-FIN-02 · 财务共享', note: '财务室夜间照明与空调延时服务费，含季度能耗分摊。' },
  },
  warehouse: {
    code: 'GW-03', name: '仓储中心 · DEPOT', en: 'PARTS & LOGISTICS', category: '建筑设施',
    tags: ['配件入库', '耗材领用', '配送调度'],
    desc: '仓储中心负责配件、耗材的入库与领用。配送车阿凯从这里出发，把票据与配件送往门店和宿舍。',
    specs: [['仓储面积', '168 m²'], ['库位', '212'], ['今日出库', '38 件'], ['盘点状态', '已同步']],
    docs: [['01', '配件采购入库单', 'DEP-2026-11-071', '待校验'], ['02', '耗材领用明细', 'DEP-2026-11-064', '已归档']],
    amount: 18600,
    preset: { category: '设备采购', entity: '仓储中心', vendor: '华东汽配供应链', cost: 'GW-DEPOT-03 · 仓储物流', note: '制动片与滤芯季度补货，共 42 个 SKU，已验收入库。' },
  },
  dorm: {
    code: 'GW-04', name: '员工宿舍 · DORM', en: 'STAFF RESIDENCE', category: '建筑设施',
    tags: ['员工保障', '水电分摊', '夜间值守'],
    desc: '员工宿舍为夜班技师与仓储同事提供轮班休息。宿舍水电、物业与生活物料费用按月归集，形成稳定的保障类报销。',
    specs: [['房间数', '12 ROOMS'], ['入住率', '83%'], ['本月水电', '¥ 9,200'], ['值守', '24 h']],
    docs: [['01', '宿舍水电结算单', 'DOR-2026-11-014', '已验真'], ['02', '生活物料清单', 'DOR-2026-11-009', '待归档']],
    amount: 9200,
    preset: { category: '水电与物业', entity: '员工宿舍', vendor: '员工生活服务中心', cost: 'GW-DORM-04 · 员工保障', note: '员工宿舍本月水电与物业分摊，12 间房，含夜班公共区域照明。' },
  },
  sign: {
    code: 'GW-05', name: '金边主招牌', en: 'MONUMENT SIGN', category: '标识资产',
    tags: ['3000K 暖光', '亚克力发光字', '夜间识别'],
    desc: '主招牌以 10.4 米金边灯箱承载双品牌识别，暖白发光字在夜雾中形成门店第一视觉锚点。灯箱变压器与亚克力面板按季度计提维护。',
    specs: [['尺寸', '10.4 × 2.15 m'], ['色温', '3000 K'], ['光源', 'LED 模组 × 18'], ['上次维护', '2026-09-08']],
    docs: [['01', '招牌光衰检测报告', 'SGN-2026-09-02', '已验真'], ['02', '发光字维护报价', 'SGN-2026-11-01', '待审批']],
    amount: 4800,
    preset: { category: '门店运营', entity: 'GOODWORK 古德車房', vendor: '城市光影标识工程', cost: 'GW-STORE-01 · 门店运营', note: '主招牌 LED 模组更换与亚克力面板抛光，恢复夜间识别亮度。' },
  },
  lightbox: {
    code: 'GW-06', name: '竖式灯箱', en: 'VERTICAL LIGHTBOX', category: '标识资产',
    tags: ['5.6 m 竖向', '双面发光', '古德車房'],
    desc: '竖式灯箱贴近入口右侧结构柱，以纵向排列的「古德車房」四字强化远距识别。灯箱内部走线独立，可单独计量维护费用。',
    specs: [['高度', '5.6 m'], ['面板', '双面亚克力'], ['功率', '220 W'], ['回路', 'SGN-B2']],
    docs: [['01', '灯箱电气检测单', 'SGN-2026-10-06', '已验真'], ['02', '季度电费分摊', 'SGN-2026-11-03', '处理中']],
    amount: 3200,
    preset: { category: '门店运营', entity: 'GOODWORK 古德車房', vendor: '城市光影标识工程', cost: 'GW-STORE-01 · 门店运营', note: '竖式灯箱季度电气检测与双面面板清洁，含镇流器巡检。' },
  },
  blade: {
    code: 'GW-07', name: '双面侧招', en: 'BLADE SIGN', category: '标识资产',
    tags: ['侧向识别', '双面灯箱', '巷道导视'],
    desc: '双面侧招垂直于主立面伸出，服务侧向车流与巷道行人。夜间与主招牌形成层次，是门店导视系统的第三层。',
    specs: [['外挑', '2.9 m'], ['可视距离', '60 m'], ['光源', 'LED × 6'], ['安装', '2024-05']],
    docs: [['01', '侧招支架探伤报告', 'SGN-2026-08-04', '已验真'], ['02', '面板更换工单', 'SGN-2026-10-11', '已归档']],
    amount: 2600,
    preset: { category: '门店运营', entity: 'GOODWORK 古德車房', vendor: '城市光影标识工程', cost: 'GW-STORE-01 · 门店运营', note: '侧招支架防腐处理与双面灯箱面板更换，含高空作业费。' },
  },
  liftCar: {
    code: 'GW-08', name: '举升机与复古轿跑', en: 'LIFTED RETRO COUPE', category: '维修设备',
    tags: ['双柱液压', '在修车辆', '保养科目'],
    desc: '一层工位的双柱液压举升机托起一台奶油色复古轿跑，这是全场景最亮的视觉焦点。液压油、密封件与安全复检费用按月归集。',
    specs: [['举升高度', '1.30 m'], ['额定载荷', '3.2 t'], ['车辆状态', '液压复检'], ['责任技师', '郑野']],
    docs: [['01', '液压系统保养单', 'LFT-2026-11-021', '待归档'], ['02', '安全复检记录', 'LFT-2026-10-018', '已验真']],
    amount: 12800,
    preset: { category: '设备维修与保养', entity: 'GOODWORK 古德車房', vendor: '古德車房设备服务部', cost: 'GW-STORE-01 · 门店运营', note: '双柱举升机液压油更换、密封件保养与额定载荷安全复检。' },
  },
  ticketBox: {
    code: 'GW-09', name: '票据箱', en: 'TICKET DROP', category: '业务设施',
    tags: ['票据归集', '任务起点', '扫码验真'],
    desc: '票据箱是 NPC 任务链的起点。工单、发票与过路费凭条在此归集，林晓取票后前往审批终端发起场景单据。',
    specs: [['待归集', '12 张'], ['今日已取', '06 次'], ['验真方式', 'OCR + 电子签'], ['联动', '取票任务']],
    docs: [['01', '今日票据清单', 'TCK-2026-11-22', '待归集'], ['02', 'OCR 验真日志', 'TCK-2026-11-22-L', '实时']],
    amount: 0, amountNote: '待归集 12 张票据',
    preset: { category: '门店运营', entity: 'GOODWORK 古德車房', vendor: '场景票据归集', cost: 'GW-STORE-01 · 门店运营', note: '归集门店夜间工单与发票，发起批量报销。' },
  },
  terminal: {
    code: 'GW-10', name: '审批终端', en: 'APPROVAL TERMINAL', category: '业务设施',
    tags: ['在线审批', '人脸识别', '状态同步'],
    desc: '审批终端把场景动作转成业务流：员工刷卡、人脸核验、选择单据，审批状态实时回写右上角的通道。NPC 任务的「提交」节点在这里完成。',
    specs: [['在线审批', '08 单'], ['平均响应', '0.8 s'], ['核验方式', '工号 + 人脸'], ['终端编号', 'TRM-02']],
    docs: [['01', '终端审批流水', 'TRM-2026-11-22', '实时'], ['02', '设备巡检记录', 'TRM-2026-11-01', '已验真']],
    amount: 0, amountNote: '在线单据 8 单',
    preset: { category: '设备采购', entity: 'GOODWORK 古德車房', vendor: '场景智能终端', cost: 'GW-STORE-01 · 门店运营', note: '审批终端年度维保与耗材更换。' },
  },
  parking: {
    code: 'GW-11', name: '停车指引牌', en: 'PARKING SIGN', category: '门店设施',
    tags: ['停车导视', '月租车位', '夜间反光'],
    desc: '门前停车指引牌引导客户进入侧巷车位。停车位月租与导视牌维护归入门店运营费用，由系统按车位数量自动分摊。',
    specs: [['车位', '6'], ['月租', '¥ 2,400'], ['反光等级', 'IV 类'], ['维护周期', '季度']],
    docs: [['01', '车位月租结算单', 'PRK-2026-11-006', '已验真'], ['02', '导视牌维护单', 'PRK-2026-09-012', '已归档']],
    amount: 2400,
    preset: { category: '水电与物业', entity: 'GOODWORK 古德車房', vendor: '城市停车管理', cost: 'GW-STORE-01 · 门店运营', note: '门前 6 个客户车位月度租金，含导视牌反光维护。' },
  },
  lamp: {
    code: 'GW-12', name: '门前路灯', en: 'STREET LAMPS', category: '能源设施',
    tags: ['钠灯暖光', '夜间照明', '能耗计量'],
    desc: '五盏暖色路灯构成门店前的安全照明带，也是湿柏油上最长的那几道金色倒影。照明电费与灯头维护按季度结算。',
    specs: [['灯杆', '5 × 6.4 m'], ['色温', '2700 K'], ['总功率', '1.1 kW'], ['本月电费', '¥ 1,860']],
    docs: [['01', '路灯电费单', 'LMP-2026-11-031', '已验真'], ['02', '灯头维护记录', 'LMP-2026-10-007', '已归档']],
    amount: 1860,
    preset: { category: '水电与物业', entity: 'GOODWORK 古德車房', vendor: '城市照明管理处', cost: 'GW-STORE-01 · 门店运营', note: '门前 5 盏路灯季度电费与灯头清洁维护。' },
  },
  truck: {
    code: 'GW-13', name: '配送车', en: 'DELIVERY VAN', category: '运输资产',
    tags: ['配件配送', '里程核算', '夜间班次'],
    desc: '配送车承担门店与仓储中心之间的夜间配件转运。里程、过路费与保养费用由车载终端自动回传，形成差旅交通类报销。',
    specs: [['今日里程', '86 km'], ['配送单', '12'], ['油耗', '9.4 L/100km'], ['司机', '阿凯']],
    docs: [['01', '夜间配送里程单', 'VAN-2026-11-22', '实时'], ['02', '车辆保养发票', 'VAN-2026-10-014', '已验真']],
    amount: 5600,
    preset: { category: '差旅与交通', entity: '仓储中心', vendor: '城市油品服务', cost: 'GW-DEPOT-03 · 仓储物流', note: '配送车夜间班次燃油、过路费与基础保养，按里程分摊。' },
  },
  trees: {
    code: 'GW-14', name: '行道树阵', en: 'STREET TREES', category: '景观资产',
    tags: ['四季植被', '绿化养护', '覆雪形态'],
    desc: '六棵行道树随季节改变色彩，冬季树冠会覆上一层薄雪。绿化养护、修剪与补植费用按季度形成景观类报销。',
    specs: [['乔木', '6 棵'], ['树种', '香樟 / 朴树'], ['养护周期', '季度'], ['当前形态', '季节同步']],
    docs: [['01', '绿化养护季度单', 'TRE-2026-Q4-01', '待审批'], ['02', '补植验收单', 'TRE-2026-09-004', '已验真']],
    amount: 3200,
    preset: { category: '水电与物业', entity: 'GOODWORK 古德車房', vendor: '城市绿化养护中心', cost: 'GW-STORE-01 · 门店运营', note: '门前 6 棵行道树季度修剪、病虫害防治与冬季防冻处理。' },
  },
  workbench: {
    code: 'GW-15', name: '维修工作台', en: 'WORKBENCH', category: '维修设备',
    tags: ['工具墙', '耗材领用', '焊接工位'],
    desc: '工作台背靠整面工具墙，焊接火花在玻璃后明灭。砂轮片、焊丝、手套等耗材按月领用，是金额最碎但频次最高的报销科目。',
    specs: [['台面', '2.6 m'], ['工具位', '48'], ['焊接工位', '1'], ['本月耗材', '¥ 4,600']],
    docs: [['01', '耗材领用明细', 'WRK-2026-11-038', '待归档'], ['02', '工具校准记录', 'WRK-2026-10-022', '已验真']],
    amount: 4600,
    preset: { category: '耗材与办公', entity: 'GOODWORK 古德車房', vendor: '工业耗材直采', cost: 'GW-STORE-01 · 门店运营', note: '维修工位本月焊接耗材、砂轮片与防护手套领用。' },
  },
  tires: {
    code: 'GW-16', name: '轮胎架', en: 'TIRE STACK', category: '库存资产',
    tags: ['轮胎库存', '以旧换新', '安全检测'],
    desc: '轮胎架存放待装与回收轮胎，胎压与磨损数据同步到工单。轮胎采购与回收处置费用通过库存系统生成采购类报销。',
    specs: [['库存', '18 条'], ['规格', '225/45 R18'], ['安全库存', '12 条'], ['本月更换', '9 条']],
    docs: [['01', '轮胎采购入库单', 'TIR-2026-11-016', '待校验'], ['02', '旧胎回收单', 'TIR-2026-11-009', '已归档']],
    amount: 7800,
    preset: { category: '设备采购', entity: 'GOODWORK 古德車房', vendor: '轮胎供应链', cost: 'GW-STORE-01 · 门店运营', note: '高性能轮胎 9 条采购补库，含旧胎环保回收处置。' },
  },
  reception: {
    code: 'GW-17', name: '前台接待区', en: 'RECEPTION', category: '门店资产',
    tags: ['客户接待', '物料补给', '夜间值守'],
    desc: '前台接待区为客户提供等候、咖啡与工单确认。饮品、清洁与印刷物料构成门店小额高频报销，系统按周自动归集。',
    specs: [['接待位', '2'], ['本月物料', '¥ 2,200'], ['咖啡机', '1'], ['客诉率', '0.4%']],
    docs: [['01', '接待物料清单', 'RCP-2026-11-021', '待归档'], ['02', '咖啡机租赁单', 'RCP-2026-10-008', '已验真']],
    amount: 2200,
    preset: { category: '耗材与办公', entity: 'GOODWORK 古德車房', vendor: '门店物料供应', cost: 'GW-STORE-01 · 门店运营', note: '接待区咖啡豆、瓶装水与工单印刷物料补充。' },
  },
};

export const NPC_META = {
  'npc-lin': {
    code: 'NPC-01', name: '林晓 · 报销专员', en: 'CLAIMS SPECIALIST', category: 'NPC 员工',
    tags: ['取票任务', '提交任务', '场景巡游'],
    desc: '林晓负责从票据箱取票、到审批终端提交单据，再把审批包送到财务室。她的任务链对应右下角的流程指示，完成每一站都会点亮节点。',
    specs: [['工号', 'GW-0142'], ['角色', '报销专员'], ['当前任务', '取票 → 提交 → 审批'], ['寻路', 'A* 32×22']],
    docs: [['01', '今日取票任务', 'TSK-2026-11-22-01', '执行中'], ['02', '提交回执', 'TSK-2026-11-22-02', '待生成']],
    amount: 0, amountNote: '任务执行中', npc: true,
  },
  'npc-zheng': {
    code: 'NPC-02', name: '郑野 · 机修主管', en: 'WORKSHOP LEAD', category: 'NPC 员工',
    tags: ['设备巡检', '举升机', '库房周转'],
    desc: '郑野在举升机与工作台之间巡检，遇到障碍会自动重规划路径。他的巡检记录会直接关联设备维修类报销。',
    specs: [['工号', 'GW-0087'], ['角色', '机修主管'], ['巡检点', '举升机 / 工作台'], ['寻路', 'A* 32×22']],
    docs: [['01', '举升机巡检单', 'TSK-2026-11-22-04', '执行中'], ['02', '工具校准单', 'TSK-2026-11-22-05', '待归档']],
    amount: 0, amountNote: '巡检执行中', npc: true,
  },
  'npc-su': {
    code: 'NPC-03', name: '苏禾 · 财务复核', en: 'FINANCE REVIEWER', category: 'NPC 员工',
    tags: ['二级审批', '付款排程', '财务室'],
    desc: '苏禾从财务室走到审批终端，完成场景单据的二级复核。点击她可以查看当前审批队列与付款排程状态。',
    specs: [['工号', 'GW-0219'], ['角色', '财务复核'], ['待办', '12 单'], ['寻路', 'A* 32×22']],
    docs: [['01', '今日审批队列', 'TSK-2026-11-22-06', '处理中'], ['02', '付款排程', 'TSK-2026-11-22-07', '排队']],
    amount: 0, amountNote: '待审批 12 单', npc: true,
  },
  'npc-kai': {
    code: 'NPC-04', name: '阿凯 · 仓储配送', en: 'DEPOT COURIER', category: 'NPC 员工',
    tags: ['仓储动线', '配件配送', '宿舍补给'],
    desc: '阿凯推着配件箱往返于仓储中心与宿舍之间，是场景里移动距离最长的一名 NPC，负责把耗材和票据送达下一个节点。',
    specs: [['工号', 'GW-0164'], ['角色', '仓储配送'], ['今日里程', '86 km'], ['寻路', 'A* 32×22']],
    docs: [['01', '配送任务单', 'TSK-2026-11-22-08', '执行中'], ['02', '宿舍补给单', 'TSK-2026-11-22-09', '待签收']],
    amount: 0, amountNote: '配送执行中', npc: true,
  },
};

/* ============================================================ */

export function createWorld(scene, renderer, quality = {}) {
  const isMobile = !!quality.isMobile;
  const refs = {
    glassMats: [], foliageMats: [], snowMats: [], groundSnowMats: [],
    skyUniforms: null, moonSprite: null, moonHalo: null, starsMat: null,
    streaks: [], cones: [], nebulaMats: [], labelEntries: [],
    roadMat: null, sidewalkMat: null,
  };
  const entries = [];
  const entryById = new Map();
  const pickables = [];
  const labels = [];
  let labelsVisible = true;
  let hoverEntry = null;
  let hoverPoint = new THREE.Vector3();

  /* ---------- environment map ---------- */
  const envTex = T.makeEnvTexture();
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromEquirectangular(envTex);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.55;
  envTex.dispose();
  pmrem.dispose();

  /* ---------- materials ---------- */
  const concreteTex = T.makeConcreteTexture();
  const brickTex = T.makeBrickTexture();
  const corrugatedTex = T.makeCorrugatedTexture();
  const sidewalkTex = T.makeSidewalkTexture();
  const asphaltTex = T.makeAsphaltTexture();

  const mats = {
    gold: new THREE.MeshStandardMaterial({ color: 0xb18d4f, metalness: 1, roughness: 0.3, envMapIntensity: 1.8, emissive: 0x221607, emissiveIntensity: 0.5 }),
    goldBright: new THREE.MeshStandardMaterial({ color: 0xd9b878, metalness: 1, roughness: 0.26, envMapIntensity: 1.9, emissive: 0x2a1c08, emissiveIntensity: 0.5 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: 0x1b2028, metalness: 0.85, roughness: 0.38, envMapIntensity: 1.2 }),
    black: new THREE.MeshStandardMaterial({ color: 0x070a0e, metalness: 0.5, roughness: 0.55 }),
    steel: new THREE.MeshStandardMaterial({ color: 0x6b737c, metalness: 1, roughness: 0.28, envMapIntensity: 1.6 }),
    concrete: new THREE.MeshStandardMaterial({ map: concreteTex, color: 0xb6bec8, roughness: 0.9, metalness: 0.08 }),
    concreteDark: new THREE.MeshStandardMaterial({ map: concreteTex, color: 0x7d858f, roughness: 0.92, metalness: 0.05 }),
    stone: new THREE.MeshStandardMaterial({ map: concreteTex, color: 0x969ca4, roughness: 0.82, metalness: 0.1 }),
    slab: new THREE.MeshStandardMaterial({ color: 0x363c45, roughness: 0.75, metalness: 0.2 }),
    brick: new THREE.MeshStandardMaterial({ map: brickTex, color: 0xc0c2c3, roughness: 0.88, metalness: 0.06 }),
    corrugated: new THREE.MeshStandardMaterial({ map: corrugatedTex, color: 0xa9b4be, roughness: 0.72, metalness: 0.35 }),
    interiorFloor: new THREE.MeshStandardMaterial({ color: 0x514b40, roughness: 0.38, metalness: 0.35, envMapIntensity: 1.1 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x5d4934, roughness: 0.7, metalness: 0.1 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xa9cdd4, metalness: 0.1, roughness: 0.055, transparent: true, opacity: 0.16,
      side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 2.6, clearcoat: 1, clearcoatRoughness: 0.05,
    }),
    carGlass: new THREE.MeshPhysicalMaterial({ color: 0x0c141c, metalness: 0.6, roughness: 0.06, envMapIntensity: 2.2, clearcoat: 1 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.9, metalness: 0.05 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xd7dde5, metalness: 1, roughness: 0.12, envMapIntensity: 2.2 }),
    warmGlow: new THREE.MeshBasicMaterial({ color: 0xffe0b4, toneMapped: false }),
    warmGlowSoft: new THREE.MeshBasicMaterial({ color: 0xffb46b, toneMapped: false }),
    coolGlow: new THREE.MeshBasicMaterial({ color: 0x8fe6d8, toneMapped: false }),
    redGlow: new THREE.MeshBasicMaterial({ color: 0xff4d3d, toneMapped: false }),
    headlight: new THREE.MeshBasicMaterial({ color: 0xfff0cf, toneMapped: false }),
    screen: new THREE.MeshBasicMaterial({ map: T.makeScreenTexture('approval'), toneMapped: false }),
    monitor: new THREE.MeshBasicMaterial({ map: T.makeScreenTexture('lift'), toneMapped: false }),
    white: new THREE.MeshStandardMaterial({ color: 0xd8d2c6, roughness: 0.65, metalness: 0.05 }),
    redPaint: new THREE.MeshStandardMaterial({ color: 0x8f241c, metalness: 0.35, roughness: 0.42 }),
    creamPaint: new THREE.MeshStandardMaterial({ color: 0xe4d8c0, metalness: 0.55, roughness: 0.3, envMapIntensity: 1.6 }),
    canopyDark: new THREE.MeshStandardMaterial({ color: 0x11151b, metalness: 0.4, roughness: 0.6 }),
    hedge: new THREE.MeshStandardMaterial({ color: 0x2e4434, roughness: 0.95 }),
    bark: new THREE.MeshStandardMaterial({ color: 0x3a3026, roughness: 0.95 }),
    planter: new THREE.MeshStandardMaterial({ color: 0x30343b, roughness: 0.8, metalness: 0.2 }),
  };
  refs.glassMats.push(mats.glass);
  refs.roadMat = null;

  const snowMat = new THREE.MeshStandardMaterial({
    color: 0xe6eef6, roughness: 0.88, metalness: 0.02, transparent: true, opacity: 0, depthWrite: false,
  });
  refs.snowMats.push({ mat: snowMat, base: 0.92 });

  /* ---------- lighting ---------- */
  const hemi = new THREE.HemisphereLight(0x88a8c6, 0x12151a, 0.9);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0x2c3e50, 0.5);
  scene.add(ambient);

  const moonLight = new THREE.DirectionalLight(0xb9d2e8, 2.15);
  moonLight.position.set(-24, 30, 18);
  moonLight.target.position.set(-2, 0, 2);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(1024, 1024);
  moonLight.shadow.camera.left = -38;
  moonLight.shadow.camera.right = 38;
  moonLight.shadow.camera.top = 32;
  moonLight.shadow.camera.bottom = -26;
  moonLight.shadow.camera.near = 1;
  moonLight.shadow.camera.far = 95;
  moonLight.shadow.bias = -0.0008;
  moonLight.shadow.normalBias = 0.025;
  scene.add(moonLight, moonLight.target);

  const warmInterior = new THREE.PointLight(0xffb268, 72, 20, 2);
  warmInterior.position.set(-1.5, 3.4, -2.2);
  scene.add(warmInterior);

  const warmUpper = new THREE.PointLight(0xffc282, 38, 16, 2);
  warmUpper.position.set(-0.5, 7.4, -1);
  scene.add(warmUpper);

  const upperWash = new THREE.PointLight(0xffd19a, 52, 13, 2);
  upperWash.position.set(3.0, 7.6, 0.6);
  scene.add(upperWash);

  const lowerWash = new THREE.PointLight(0xffb774, 44, 13, 2);
  lowerWash.position.set(4.6, 2.6, 1.0);
  scene.add(lowerWash);

  const signLight = new THREE.PointLight(0xffc07a, 20, 10, 2);
  signLight.position.set(-1.5, 6.6, 5.4);
  scene.add(signLight);

  const entranceLight = new THREE.PointLight(0xffc38a, 46, 17, 2);
  entranceLight.position.set(1.8, 3.9, 6.2);
  scene.add(entranceLight);

  const streetLightL = new THREE.PointLight(0xffb878, 34, 17, 2);
  streetLightL.position.set(-6.5, 5.5, 10.6);
  scene.add(streetLightL);

  const streetLightR = new THREE.PointLight(0xffb878, 34, 17, 2);
  streetLightR.position.set(14.2, 5.5, 10.6);
  scene.add(streetLightR);

  scene.fog = new THREE.FogExp2(0x0a111a, 0.0092);

  /* ---------- sky ---------- */
  const skyUniforms = {
    uTop: { value: new THREE.Color(0x050a14) },
    uMid: { value: new THREE.Color(0x0c1928) },
    uHorizon: { value: new THREE.Color(0x27313d) },
    uGlow: { value: new THREE.Color(0x8a6a3c) },
    uTime: { value: 0 },
  };
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: skyUniforms,
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec3 vDir;
      uniform vec3 uTop, uMid, uHorizon, uGlow;
      uniform float uTime;
      void main(){
        float h = clamp(vDir.y, -0.3, 1.0);
        vec3 col = mix(uHorizon, uMid, smoothstep(-0.02, 0.32, h));
        col = mix(col, uTop, smoothstep(0.28, 0.92, h));
        float band = sin(vDir.x * 3.1 + uTime * 0.02) * 0.5 + 0.5;
        float band2 = sin(vDir.x * 5.7 - vDir.z * 2.1 + uTime * 0.014) * 0.5 + 0.5;
        float aur = smoothstep(0.3, 0.52, h) * (1.0 - smoothstep(0.58, 0.9, h));
        col += vec3(0.07, 0.27, 0.3) * aur * band * 0.34;
        col += vec3(0.24, 0.12, 0.32) * aur * band2 * 0.16;
        float haze = pow(max(0.0, 1.0 - abs(h) * 6.5), 3.0);
        col += uGlow * haze * 0.22;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  refs.skyUniforms = skyUniforms;
  const sky = new THREE.Mesh(new THREE.SphereGeometry(160, 40, 24), skyMat);
  sky.renderOrder = -20;
  scene.add(sky);

  // stars
  {
    const count = isMobile ? 380 : 680;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const rnd = T.mulberry32(1123);
    for (let i = 0; i < count; i++) {
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(0.08 + rnd() * 0.92);
      const r = 145;
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.cos(phi) * r + 6;
      pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xc9d8e8, size: 0.7, sizeAttenuation: true, transparent: true, opacity: 0.8,
      map: T.makeGlowTexture(), alphaTest: 0.004, depthWrite: false,
      blending: THREE.AdditiveBlending, fog: false, toneMapped: false,
    });
    refs.starsMat = mat;
    const stars = new THREE.Points(geo, mat);
    stars.frustumCulled = false;
    scene.add(stars);
  }

  // moon + halo
  {
    const glowTex = T.makeGlowTexture();
    refs.moonSprite = glowSprite(glowTex, 0xe6f0fa, 10, 0.9);
    refs.moonSprite.position.set(27, 27.5, -98);
    scene.add(refs.moonSprite);
    refs.moonHalo = glowSprite(glowTex, 0x9fbdd8, 42, 0.2);
    refs.moonHalo.position.copy(refs.moonSprite.position);
    scene.add(refs.moonHalo);
  }

  // nebula veils
  {
    const glowTex = T.makeGlowTexture();
    const nebula = (color, scale, pos, opacity) => {
      const mat = new THREE.MeshBasicMaterial({
        map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending,
        depthWrite: false, fog: false, toneMapped: false,
      });
      const mesh = new THREE.Mesh(unitPlane, mat);
      mesh.scale.set(scale[0], scale[1], 1);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.renderOrder = -12;
      scene.add(mesh);
      refs.nebulaMats.push({ mat, base: opacity, phase: Math.random() * 6.28 });
      return mesh;
    };
    nebula(0x1d5a6a, [190, 70], [-40, 58, -125], 0.28);
    nebula(0x4a2f63, [150, 52], [55, 42, -120], 0.2);
  }

  // distant skyline (two layers)
  {
    const skyline = (seed, color, width, height, z, y, opacity) => {
      const tex = T.canvasTexture(2048, 512, (ctx, w, h) => {
        const rnd = T.mulberry32(seed);
        ctx.clearRect(0, 0, w, h);
        let x = 0;
        while (x < w) {
          const bw = 30 + rnd() * 110;
          const bh = 90 + rnd() * 330;
          const top = h - bh;
          ctx.fillStyle = 'rgba(9,13,20,0.94)';
          ctx.fillRect(x, top, bw - 2, bh);
          ctx.fillStyle = 'rgba(112,146,172,0.45)';
          ctx.fillRect(x, top, bw - 2, 2);
          ctx.fillStyle = 'rgba(80,120,150,0.1)';
          ctx.fillRect(x, top, 2, bh);
          // window dots
          for (let wy = top + 15; wy < h - 10; wy += 11) {
            for (let wx = x + 7; wx < x + bw - 7; wx += 11) {
              if (rnd() > 0.74) {
                ctx.fillStyle = rnd() > 0.42 ? 'rgba(255,196,126,0.55)' : 'rgba(115,208,216,0.38)';
                ctx.fillRect(wx, wy, 2, 2.5);
              }
            }
          }
          if (rnd() > 0.72) {
            ctx.strokeStyle = 'rgba(20,28,36,0.9)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(x + bw / 2, top); ctx.lineTo(x + bw / 2, top - 22); ctx.stroke();
            ctx.fillStyle = 'rgba(255,96,78,0.45)';
            ctx.fillRect(x + bw / 2 - 1, top - 23, 2, 2);
          }
          x += bw + 8 + rnd() * 20;
        }
      }, { anisotropy: 8 });
      const mat = new THREE.MeshBasicMaterial({ map: tex, color, transparent: true, opacity, depthWrite: false, fog: false, toneMapped: false });
      const mesh = new THREE.Mesh(unitPlane, mat);
      mesh.scale.set(width, height, 1);
      mesh.position.set(0, y, z);
      mesh.renderOrder = -8;
      scene.add(mesh);
    };
    skyline(334, 0xb8c9d9, 170, 40, -72, 14, 0.42);
    skyline(887, 0x8298ad, 220, 48, -104, 18, 0.3);
  }

  // city horizon haze
  {
    const tex = T.canvasTexture(2048, 512, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(20,40,58,0)');
      g.addColorStop(0.42, 'rgba(32,60,80,0.16)');
      g.addColorStop(0.72, 'rgba(55,75,88,0.3)');
      g.addColorStop(0.88, 'rgba(96,84,58,0.28)');
      g.addColorStop(1, 'rgba(20,28,36,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rnd = T.mulberry32(5501);
      for (let i = 0; i < 2600; i++) {
        const x = rnd() * w;
        const y = h * 0.6 + rnd() * h * 0.28;
        ctx.fillStyle = rnd() > 0.7 ? 'rgba(255,190,120,0.35)' : 'rgba(120,190,200,0.18)';
        ctx.fillRect(x, y, 1 + rnd() * 2, 1);
      }
    }, { anisotropy: 4 });
    const mat = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending,
      depthWrite: false, fog: false, toneMapped: false,
    });
    const mesh = new THREE.Mesh(unitPlane, mat);
    mesh.scale.set(230, 52, 1);
    mesh.position.set(0, 15, -95);
    mesh.renderOrder = -9;
    scene.add(mesh);
  }

  // mountain silhouette
  {
    const tex = T.canvasTexture(2048, 512, (ctx, w, h) => {
      const rnd = T.mulberry32(771);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(5,9,14,0.95)';
      ctx.beginPath();
      ctx.moveTo(0, h);
      let x = 0;
      while (x < w) {
        const peakH = h * (0.35 + rnd() * 0.45);
        ctx.lineTo(x + 40, h - peakH * 0.55);
        ctx.lineTo(x + 110, h - peakH);
        ctx.lineTo(x + 180, h - peakH * 0.5);
        x += 190 + rnd() * 80;
      }
      ctx.lineTo(w, h);
      ctx.closePath(); ctx.fill();
    }, { anisotropy: 4 });
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.8, depthWrite: false, fog: false, toneMapped: false });
    const mesh = new THREE.Mesh(unitPlane, mat);
    mesh.scale.set(240, 60, 1);
    mesh.position.set(-10, 14, -140);
    mesh.renderOrder = -10;
    scene.add(mesh);
  }

  /* ---------- ground ---------- */
  const ground = new THREE.Group();
  scene.add(ground);
  addPlane(ground, new THREE.MeshStandardMaterial({ color: 0x06090e, roughness: 0.9 }), [260, 260], [0, -0.09, 0]);

  const roadMat = new THREE.MeshPhysicalMaterial({
    map: asphaltTex, color: 0xe4ebf1, roughness: 0.34, metalness: 0.24, clearcoat: 1,
    clearcoatRoughness: 0.1, envMapIntensity: 1.35,
    emissive: 0x1b2b3a, emissiveMap: asphaltTex, emissiveIntensity: 0.5,
  });
  refs.roadMat = roadMat;
  const road = addPlane(ground, roadMat, [90, 18], [2, 0.012, 19]);
  road.receiveShadow = true;

  // additively re-read the wet asphalt so lane markings and puddles survive the night grade
  {
    const sheen = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({
      map: asphaltTex, color: 0x8aa7bd, transparent: true, opacity: 0.2,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    sheen.scale.set(90, 18, 1);
    sheen.rotation.x = -Math.PI / 2;
    sheen.position.set(2, 0.026, 19);
    scene.add(sheen);
    const pool = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({
      map: T.makeGlowTexture(), color: 0x4d6f8c, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    pool.scale.set(34, 20, 1);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 0.032, 17);
    scene.add(pool);
  }

  const sidewalkMat = new THREE.MeshStandardMaterial({
    map: sidewalkTex, color: 0xb9bec5, roughness: 0.5, metalness: 0.14, envMapIntensity: 0.85,
  });
  refs.sidewalkMat = sidewalkMat;
  const sidewalk = addPlane(ground, sidewalkMat, [90, 7.5], [2, 0.14, 6.75]);
  sidewalk.receiveShadow = true;

  addBox(ground, mats.stone, [90, 0.3, 0.34], [2, 0.13, 10.58], { cast: false });
  addBox(ground, mats.concreteDark, [90, 0.12, 0.2], [2, 0.28, 10.42], { cast: false });

  // snow accumulation on ground
  {
    const snowTex = T.makeSnowTexture();
    const snowGround = new THREE.MeshBasicMaterial({
      map: snowTex, color: 0xdfe9f3, transparent: true, opacity: 0, depthWrite: false,
    });
    refs.groundSnowMats.push({ mat: snowGround, base: 0.72 });
    const plane = addPlane(ground, snowGround, [90, 7.4], [2, 0.16, 6.75]);
    plane.renderOrder = 2;
    const snowRoadMat = new THREE.MeshBasicMaterial({
      map: snowTex, color: 0xc9d6e1, transparent: true, opacity: 0, depthWrite: false,
    });
    refs.groundSnowMats.push({ mat: snowRoadMat, base: 0.2 });
    const roadSnow = addPlane(ground, snowRoadMat, [90, 17.6], [2, 0.03, 19]);
    roadSnow.renderOrder = 2;
  }

  // puddles
  {
    const puddleMat = new THREE.MeshStandardMaterial({
      color: 0x060a10, roughness: 0.05, metalness: 0.95, envMapIntensity: 2.2, transparent: true, opacity: 0.85,
    });
    [[-13, 15.5, 4.2, 1.1], [10.2, 23.2, 5.4, 1.4], [23, 14, 3.4, 0.9], [-3.4, 24.5, 2.5, 0.8]].forEach(([x, z, sx, sz]) => {
      const m = new THREE.Mesh(new THREE.CircleGeometry(1, 32), puddleMat);
      m.rotation.x = -Math.PI / 2;
      m.scale.set(sx, sz, 1);
      m.position.set(x, 0.022, z);
      ground.add(m);
    });
  }

  /* ---------- reflections on wet asphalt ---------- */
  const streakTex = T.makeStreakTexture();
  function addStreak(x, z, w, l, color, opacity) {
    const mat = new THREE.MeshBasicMaterial({
      map: streakTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending,
      depthWrite: false, toneMapped: false,
    });
    const mesh = new THREE.Mesh(unitPlane, mat);
    mesh.scale.set(w, l, 1);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.04, z);
    scene.add(mesh);
    refs.streaks.push({ mat, base: opacity, phase: Math.random() * 6.28 });
  }
  addStreak(-1.2, 16.2, 10.5, 12.5, 0xffc477, 0.42);
  addStreak(-1.2, 19.8, 8.2, 8, 0xffd79a, 0.22);
  addStreak(5.8, 13.4, 2.4, 6.5, 0xffc06f, 0.3);
  addStreak(-18.8, 13.2, 6.4, 8.5, 0x66d8cc, 0.16);
  addStreak(15.2, 12.6, 7, 7.5, 0xffb46b, 0.16);
  addStreak(27, 13, 5, 7, 0xffc07a, 0.14);

  // warm spill onto the sidewalk in front of the entrance
  {
    const glowTex = T.makeGlowTexture();
    const spill = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({
      map: glowTex, color: 0xffbd7a, transparent: true, opacity: 0.24,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    spill.rotation.x = -Math.PI / 2;
    spill.scale.set(11, 7, 1);
    spill.position.set(1.2, 0.17, 6.6);
    scene.add(spill);
    const spill2 = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({
      map: glowTex, color: 0x74d7cc, transparent: true, opacity: 0.1,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    spill2.rotation.x = -Math.PI / 2;
    spill2.scale.set(8, 5, 1);
    spill2.position.set(-18.5, 0.16, 5.6);
    scene.add(spill2);
  }

  /* ---------- skyline rooftop haze ---------- */
  {
    const glowTex = T.makeGlowTexture();
    const haze = glowSprite(glowTex, 0x3e5c70, 120, 0.32);
    haze.position.set(0, 9, -48);
    scene.add(haze);
  }

  /* ---------- helper: screen materials ---------- */
  const screens = {
    approval: mats.screen,
    lift: mats.monitor,
  };

  /* ============================================================
     MAIN GARAGE
     ============================================================ */
  const garage = new THREE.Group();
  garage.position.set(-1, 0, -1.5);
  scene.add(garage);
  const shell = new THREE.Group();
  garage.add(shell);

  const W = 15, D = 9, H = 9.4;
  {
    addBox(shell, mats.stone, [W + 0.3, 0.32, D + 0.4], [0, 0.16, 0]);
    addBox(shell, mats.interiorFloor, [W - 0.4, 0.08, D - 0.3], [0, 0.35, 0], { cast: false });
    addBox(shell, mats.concreteDark, [W, H, 0.36], [0, H / 2, -4.32]);
    addBox(shell, mats.concreteDark, [0.36, H, D], [-7.32, H / 2, 0]);
    addBox(shell, mats.concreteDark, [0.36, H, 3.3], [7.32, H / 2, -2.55]);
    addBox(shell, mats.slab, [W + 0.1, 0.34, D], [0, 4.62, 0]);
    addBox(shell, mats.slab, [W + 0.6, 0.38, D + 0.6], [0, 9.2, 0]);

    // gold parapet trim
    addBox(shell, mats.gold, [W + 0.7, 0.08, 0.1], [0, 9.42, 4.85]);
    addBox(shell, mats.gold, [W + 0.7, 0.08, 0.1], [0, 9.42, -4.85]);
    addBox(shell, mats.gold, [0.1, 0.08, D + 0.7], [W / 2 + 0.34, 9.42, 0]);
    addBox(shell, mats.gold, [0.1, 0.08, D + 0.7], [-W / 2 - 0.34, 9.42, 0]);
    addBox(shell, mats.gold, [W + 0.5, 0.06, 0.12], [0, 4.79, 4.55]);
    addBox(shell, mats.darkMetal, [W + 0.5, 0.1, 0.16], [0, 4.72, 4.6]);

    // base kick panel
    addBox(shell, mats.stone, [W - 0.2, 0.55, 0.2], [0, 0.62, 4.44]);

    // front columns
    [-7.32, -4.88, -2.44, 0, 2.44, 4.88, 7.32].forEach((x) => {
      addBox(shell, mats.darkMetal, [0.18, 9.1, 0.2], [x, 4.55, 4.42]);
      addBox(shell, mats.gold, [0.055, 9.05, 0.22], [x + 0.1, 4.55, 4.47]);
    });

    // glass curtain walls
    const glassLower = addBox(shell, mats.glass, [W - 0.5, 3.95, 0.03], [0, 2.42, 4.45], { cast: false, receive: false });
    glassLower.userData.glass = true;
    const glassUpper = addBox(shell, mats.glass, [W - 0.5, 3.85, 0.03], [0, 7.02, 4.45], { cast: false, receive: false });
    glassUpper.userData.glass = true;
    const glassSide = addBox(shell, mats.glass, [0.03, 3.8, 4.2], [7.33, 7.0, 2.35], { cast: false, receive: false });
    glassSide.userData.glass = true;

    // glass reflection streaks
    const reflMat = new THREE.MeshBasicMaterial({
      color: 0x9fc8d4, transparent: true, opacity: 0.055, blending: THREE.AdditiveBlending,
      depthWrite: false, side: THREE.DoubleSide,
    });
    [-4.2, 1.1, 5.2].forEach((x, i) => {
      const m = new THREE.Mesh(unitPlane, reflMat);
      m.scale.set(1.2 + i * 0.4, 8.4, 1);
      m.position.set(x, 4.8, 4.49);
      m.rotation.z = 0.34;
      garage.add(m);
    });

    // entrance framing
    addBox(shell, mats.goldBright, [0.1, 4.15, 0.14], [0.95, 2.4, 4.51]);
    addBox(shell, mats.goldBright, [0.1, 4.15, 0.14], [3.35, 2.4, 4.51]);
    addBox(shell, mats.goldBright, [2.5, 0.08, 0.14], [2.15, 4.4, 4.51]);
    addBox(shell, mats.darkMetal, [0.05, 4.0, 0.1], [2.15, 2.35, 4.53]);
    addBox(shell, mats.gold, [0.035, 0.7, 0.06], [1.45, 1.9, 4.56]);
    addBox(shell, mats.gold, [0.035, 0.7, 0.06], [2.85, 1.9, 4.56]);

    // entrance canopy
    addBox(shell, mats.canopyDark, [4.6, 0.16, 1.5], [2.1, 3.68, 5.0]);
    addBox(shell, mats.gold, [4.66, 0.045, 1.56], [2.1, 3.78, 5.0]);
    for (let i = 0; i < 3; i++) {
      addCyl(shell, mats.warmGlow, 0.09, 0.03, [0.9 + i * 1.2, 3.585, 5.15], { cast: false });
    }
    addBox(shell, mats.stone, [4.8, 0.16, 1.8], [2.1, 0.1, 5.4], { cast: false });

    // roof equipment
    addBox(shell, mats.darkMetal, [1.5, 0.85, 1.2], [-4.2, 9.8, 0.6]);
    addBox(shell, mats.steel, [1.1, 0.12, 0.9], [-4.2, 10.25, 0.6]);
    for (let i = 0; i < 5; i++) addBox(shell, mats.black, [0.9, 0.018, 0.07], [-4.2, 10.2, 0.24 + i * 0.16], { cast: false });
    addBox(shell, mats.darkMetal, [1.1, 0.7, 0.9], [3.8, 9.73, -1.6]);
    addCyl(shell, mats.steel, 0.22, 1.1, [5.6, 10.0, 1.6]);
    addCyl(shell, mats.darkMetal, 0.26, 0.08, [5.6, 10.53, 1.6]);

    // interior ceiling light bars
    const lightBar = mats.warmGlow;
    [-3.4, 0.2, 3.6].forEach((z) => {
      [-4.4, 0, 4.4].forEach((x) => {
        addBox(garage, lightBar, [3.4, 0.045, 0.1], [x, 4.42, z], { cast: false });
      });
    });
    [-4.4, 0, 4.4].forEach((x) => {
      addBox(garage, lightBar, [3.4, 0.045, 0.1], [x, 8.95, -0.6], { cast: false });
    });

    // pendant lamps over reception
    [-1.4, 2.0].forEach((x) => {
      addCyl(garage, mats.gold, 0.012, 0.85, [x, 3.9, -2.8], { cast: false });
      addCyl(garage, mats.darkMetal, 0.22, 0.16, [x, 3.44, -2.8], { cast: false });
      addCyl(garage, mats.warmGlow, 0.18, 0.02, [x, 3.35, -2.8], { cast: false });
    });

    // back wall pegboard + tools
    const lowerBackdrop = new THREE.MeshBasicMaterial({ map: T.makeInteriorTexture('ground'), toneMapped: false });
    addPlane(shell, lowerBackdrop, [14.4, 4.0], [0, 2.28, -4.125], [0, 0, 0]);
    addBox(garage, mats.darkMetal, [8.2, 2.9, 0.08], [-0.6, 2.0, -4.1], { cast: false });
    addBox(garage, mats.wood, [8.2, 0.08, 0.16], [-0.6, 3.45, -4.08], { cast: false });
    const toolRnd = T.mulberry32(552);
    for (let i = 0; i < 22; i++) {
      const tx = -4.3 + (i % 11) * 0.68;
      const ty = 2.9 - Math.floor(i / 11) * 0.9;
      const kind = toolRnd();
      if (kind > 0.55) addCyl(garage, mats.steel, 0.022, 0.3 + toolRnd() * 0.2, [tx, ty, -4.04], { cast: false });
      else addBox(garage, mats.steel, [0.06, 0.26, 0.03], [tx, ty, -4.04], { cast: false });
    }

    // back shelving
    addBox(garage, mats.darkMetal, [3.3, 2.6, 0.5], [4.7, 1.5, -3.9], { cast: false });
    for (let s = 0; s < 4; s++) {
      addBox(garage, mats.steel, [3.1, 0.035, 0.46], [4.7, 0.45 + s * 0.62, -3.88], { cast: false });
    }
    for (let i = 0; i < 8; i++) {
      const bx = 3.5 + (i % 4) * 0.72;
      const by = 0.68 + Math.floor(i / 4) * 0.62;
      addBox(garage, i % 2 ? mats.wood : mats.black, [0.5, 0.32, 0.34], [bx, by, -3.85], { cast: false });
    }

    // stairs to second floor
    for (let i = 0; i < 10; i++) {
      const step = addBox(garage, mats.darkMetal, [1.05, 0.12, 0.36], [-6.55, 0.45 + i * 0.43, 3.2 - i * 0.37], { cast: false });
      step.receiveShadow = true;
      addBox(garage, mats.gold, [1.08, 0.015, 0.03], [-6.55, 0.45 + i * 0.43 + 0.07, 3.2 - i * 0.37 - 0.14], { cast: false });
    }
    // stair stringer
    const stringerMat = mats.darkMetal;
    addBox(garage, stringerMat, [0.06, 0.32, 4.1], [-7.08, 1.9, 1.55], { rx: -0.84, cast: false });
    addBox(garage, stringerMat, [0.06, 1.1, 0.06], [-6.1, 5.3, 3.2], { cast: false });
    // handrail
    addBox(garage, mats.gold, [0.04, 0.04, 4.0], [-6.08, 5.1, 1.6], { cast: false, rx: 0.05 });

    // second floor railing
    for (let i = 0; i < 10; i++) {
      addBox(garage, mats.gold, [0.035, 0.85, 0.035], [-6.4 + i * 1.4, 5.1, 3.72], { cast: false });
    }
    addBox(garage, mats.gold, [13.2, 0.045, 0.045], [-0.1, 5.52, 3.72], { cast: false });
    addBox(garage, mats.glass, [13.2, 0.7, 0.02], [-0.1, 5.08, 3.7], { cast: false, receive: false }).userData.glass = false;

    // second floor office
    addBox(garage, mats.wood, [3.0, 0.1, 1.2], [-2.0, 5.45, -0.9], { cast: false });
    addBox(garage, mats.darkMetal, [0.08, 0.7, 0.08], [-3.3, 5.05, -0.9], { cast: false });
    addBox(garage, mats.darkMetal, [0.08, 0.7, 0.08], [-0.7, 5.05, -0.9], { cast: false });
    addBox(garage, mats.darkMetal, [0.9, 0.55, 0.06], [-2.5, 5.85, -1.1], { cast: false });
    addPlane(garage, screens.lift, [0.8, 0.5], [-2.5, 5.85, -1.06], [0, 0, 0]);
    addBox(garage, mats.darkMetal, [0.85, 0.05, 0.6], [0.9, 5.5, -1.3], { cast: false });
    addBox(garage, mats.wood, [0.7, 0.06, 0.55], [0.9, 5.85, -1.3], { cast: false });
    addBox(garage, mats.darkMetal, [2.6, 1.9, 0.55], [4.6, 6.4, -3.8], { cast: false });
    for (let s = 0; s < 3; s++) addBox(garage, mats.steel, [2.4, 0.03, 0.5], [4.6, 5.75 + s * 0.55, -3.78], { cast: false });
    for (let i = 0; i < 6; i++) addBox(garage, i % 2 ? mats.creamPaint : mats.wood, [0.42, 0.28, 0.36], [3.6 + (i % 3) * 0.7, 5.9 + Math.floor(i / 3) * 0.55, -3.75], { cast: false });
    // upper plant
    addCyl(garage, mats.planter, 0.2, 0.35, [3.2, 5.6, 1.4], { cast: false });
    addSphere(garage, mats.hedge, 0.32, [3.2, 5.95, 1.4], { cast: false });

    // second floor glass warm interior glow plane
    const upperGlowMat = new THREE.MeshBasicMaterial({ color: 0xffb775, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    addPlane(garage, upperGlowMat, [13.8, 3.6], [0, 7.0, 4.3], [0, 0, 0]);
    const upperBackdrop = new THREE.MeshBasicMaterial({ map: T.makeInteriorTexture('upper'), toneMapped: false });
    addPlane(shell, upperBackdrop, [14.4, 4.0], [0, 6.9, -4.125], [0, 0, 0]);

    // interior wall washes + second-floor pendant lamps
    const washTex = T.makeGlowTexture();
    const washMat = new THREE.MeshBasicMaterial({
      map: washTex, color: 0xffb877, transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    });
    [-5, 0, 5].forEach((x) => {
      const wash = new THREE.Mesh(unitPlane, washMat);
      wash.scale.set(6, 5, 1);
      wash.position.set(x, 2.3, -3.9);
      garage.add(wash);
      const upper = new THREE.Mesh(unitPlane, washMat);
      upper.scale.set(6, 5, 1);
      upper.position.set(x, 7.0, -3.9);
      garage.add(upper);
    });
    [-4.5, 0, 4.5].forEach((x) => {
      addCyl(garage, mats.gold, 0.012, 0.8, [x, 8.55, -1.6], { cast: false });
      addCyl(garage, mats.darkMetal, 0.2, 0.1, [x, 8.12, -1.6], { cast: false });
      addCyl(garage, mats.warmGlow, 0.16, 0.02, [x, 8.05, -1.6], { cast: false });
      const glow = glowSprite(T.makeGlowTexture(), 0xffc98a, 1.4, 0.5);
      glow.position.set(x, 8.02, -1.6);
      garage.add(glow);
    });
    [-5.7, 5.7].forEach((x) => {
      addBox(garage, mats.warmGlow, [0.05, 2.4, 0.05], [x, 2.2, -3.98], { cast: false });
    });
  }
  mergeOpaqueByMaterial(shell);

  /* ---------- lift + car ---------- */
  {
    // posts
    [-5.6, -2.55].forEach((x) => {
      addBox(garage, mats.darkMetal, [0.3, 3.9, 0.3], [x, 1.95, -1.4]);
      addBox(garage, mats.gold, [0.32, 0.1, 0.32], [x, 3.86, -1.4]);
      addBox(garage, mats.gold, [0.05, 3.8, 0.05], [x + 0.16, 1.95, -1.4]);
    });
    addBox(garage, mats.darkMetal, [3.35, 0.26, 0.28], [-4.07, 3.78, -1.4]);
    addBox(garage, mats.gold, [2.9, 0.05, 0.05], [-4.07, 3.92, -1.4]);
    // platform arms
    addBox(garage, mats.darkMetal, [2.9, 0.14, 0.24], [-4.07, 1.26, -3.1]);
    addBox(garage, mats.darkMetal, [2.9, 0.14, 0.24], [-4.07, 1.26, 0.3]);
    addBox(garage, mats.gold, [2.7, 0.05, 0.08], [-4.07, 1.34, -3.1]);
    addCyl(garage, mats.steel, 0.09, 1.2, [-4.07, 1.8, -1.4]);

    const car = new THREE.Group();
    car.position.set(-4.07, 1.32, -1.4);
    garage.add(car);

    const bodyGeo = new RoundedBoxGeometry(1.92, 0.56, 3.85, 4, 0.2);
    const body = new THREE.Mesh(bodyGeo, mats.creamPaint);
    body.position.y = 0.66; body.castShadow = true; body.receiveShadow = true;
    car.add(body);

    const lower = new THREE.Mesh(new RoundedBoxGeometry(1.86, 0.26, 3.6, 3, 0.12), mats.creamPaint);
    lower.position.y = 0.42; car.add(lower);

    const cabin = new THREE.Mesh(new RoundedBoxGeometry(1.58, 0.56, 1.95, 4, 0.16), mats.creamPaint);
    cabin.position.set(0, 1.03, -0.12); cabin.castShadow = true;
    car.add(cabin);

    const screenGlass = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.36, 1.82, 3, 0.1), mats.carGlass);
    screenGlass.position.set(0, 1.06, -0.12);
    car.add(screenGlass);

    const roof = new THREE.Mesh(new RoundedBoxGeometry(1.44, 0.12, 1.5, 3, 0.06), mats.creamPaint);
    roof.position.set(0, 1.31, -0.18);
    car.add(roof);

    // hood + trunk
    addBox(car, mats.creamPaint, [1.76, 0.1, 1.2], [0, 0.98, 1.24], { cast: false });
    addBox(car, mats.creamPaint, [1.76, 0.1, 0.72], [0, 0.99, -1.42], { cast: false });

    // chrome bumpers and trim
    addBox(car, mats.chrome, [1.9, 0.12, 0.14], [0, 0.5, 1.94], { cast: false });
    addBox(car, mats.chrome, [1.9, 0.12, 0.14], [0, 0.5, -1.94], { cast: false });
    addBox(car, mats.chrome, [0.05, 0.05, 3.4], [0.97, 0.7, 0], { cast: false });
    addBox(car, mats.chrome, [0.05, 0.05, 3.4], [-0.97, 0.7, 0], { cast: false });

    // lights
    [-0.62, 0.62].forEach((x) => {
      addSphere(car, mats.headlight, 0.13, [x, 0.76, 1.9], { cast: false, sy: 0.9 });
      addBox(car, mats.redGlow, [0.26, 0.09, 0.04], [x, 0.74, -1.92], { cast: false });
    });
    // grille
    for (let i = 0; i < 4; i++) addBox(car, mats.chrome, [0.72, 0.018, 0.03], [0, 0.62 + i * 0.045, 1.97], { cast: false });
    // plate
    addBox(car, mats.goldBright, [0.42, 0.14, 0.02], [0, 0.3, 1.98], { cast: false });

    // wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 20);
    const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.24, 18);
    [-0.96, 0.96].forEach((x) => {
      [1.28, -1.32].forEach((z) => {
        const wheel = new THREE.Mesh(wheelGeo, mats.rubber);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.36, z);
        wheel.castShadow = true;
        car.add(wheel);
        const hub = new THREE.Mesh(hubGeo, mats.chrome);
        hub.rotation.z = Math.PI / 2;
        hub.position.set(x * 1.02, 0.36, z);
        car.add(hub);
      });
    });
    // cream body shadow gap
    addBox(car, mats.black, [1.8, 0.05, 3.4], [0, 0.39, 0], { cast: false });

    // snow cap on car roof
    const carSnow = new THREE.Mesh(new RoundedBoxGeometry(1.48, 0.03, 1.55, 3, 0.06), snowMat);
    carSnow.position.set(0, 1.38, -0.18);
    car.add(carSnow);
    mergeOpaqueByMaterial(car);
  }

  /* ---------- workbench / tires / reception / tool chest ---------- */
  {
    // workbench
    const wb = new THREE.Group();
    wb.position.set(2.9, 0, -3.55);
    garage.add(wb);
    addBox(wb, mats.wood, [2.6, 0.1, 0.85], [0, 1.0, 0]);
    addBox(wb, mats.darkMetal, [0.08, 1.0, 0.08], [-1.2, 0.5, -0.33]);
    addBox(wb, mats.darkMetal, [0.08, 1.0, 0.08], [1.2, 0.5, -0.33]);
    addBox(wb, mats.darkMetal, [0.08, 1.0, 0.08], [-1.2, 0.5, 0.33]);
    addBox(wb, mats.darkMetal, [0.08, 1.0, 0.08], [1.2, 0.5, 0.33]);
    addBox(wb, mats.steel, [0.42, 0.3, 0.3], [0.85, 1.2, 0.05]);
    addBox(wb, mats.darkMetal, [0.36, 0.06, 0.26], [0.85, 1.36, 0.05]);
    addBox(wb, mats.screen, [0.55, 0.36, 0.04], [-0.55, 1.3, -0.2], { rx: -0.1 });
    addBox(wb, mats.darkMetal, [0.06, 0.3, 0.06], [-0.55, 1.08, -0.2]);
    // drill + vice
    addBox(wb, mats.steel, [0.22, 0.18, 0.2], [0.2, 1.16, 0.12], { cast: false });
    addCyl(wb, mats.steel, 0.035, 0.3, [0.2, 1.32, 0.12], { cast: false });
    // small parts
    for (let i = 0; i < 5; i++) addBox(wb, i % 2 ? mats.gold : mats.steel, [0.1, 0.05, 0.08], [-0.9 + i * 0.17, 1.08, 0.25], { cast: false });

    // tire stacks
    const tireGeo = new THREE.TorusGeometry(0.3, 0.15, 10, 20);
    [-6.5, -6.3, -5.9].forEach((x, i) => {
      for (let s = 0; s < 3; s++) {
        const tire = new THREE.Mesh(tireGeo, mats.rubber);
        tire.rotation.x = Math.PI / 2;
        tire.position.set(x, 0.5 + s * 0.2, 2.4 + i * 0.05);
        tire.castShadow = true;
        garage.add(tire);
      }
      addBox(garage, mats.darkMetal, [0.8, 0.06, 0.8], [x, 0.4, 2.4], { cast: false });
    });

    // tool chest
    addBox(garage, mats.redPaint, [1.2, 1.35, 0.7], [5.6, 1.0, 1.7]);
    addBox(garage, mats.darkMetal, [1.24, 0.06, 0.74], [5.6, 1.71, 1.7]);
    for (let i = 0; i < 5; i++) {
      addBox(garage, mats.black, [1.14, 0.015, 0.02], [5.6, 0.55 + i * 0.22, 2.06], { cast: false });
      addBox(garage, mats.gold, [0.4, 0.025, 0.03], [5.6, 0.62 + i * 0.22, 2.07], { cast: false });
    }
    // casters
    [[5.1, 2.03], [6.1, 2.03], [5.1, 1.37], [6.1, 1.37]].forEach(([x, z]) => {
      addCyl(garage, mats.black, 0.07, 0.06, [x, 0.33, z], { rz: Math.PI / 2, cast: false });
    });

    // reception desk
    const rd = new THREE.Group();
    rd.position.set(4.4, 0, -2.3);
    garage.add(rd);
    addBox(rd, mats.wood, [2.6, 0.1, 0.7], [0, 1.02, 0]);
    addBox(rd, mats.darkMetal, [2.6, 0.95, 0.12], [0, 0.55, -0.3]);
    addBox(rd, mats.stone, [2.7, 0.06, 0.78], [0, 1.09, 0.02]);
    addBox(rd, mats.darkMetal, [0.06, 0.95, 0.6], [-1.3, 0.55, 0]);
    addBox(rd, mats.darkMetal, [0.06, 0.95, 0.6], [1.3, 0.55, 0]);
    addBox(rd, mats.darkMetal, [0.62, 0.46, 0.05], [-0.7, 1.5, -0.16], { rx: 0.08 });
    addPlane(rd, screens.lift, [0.54, 0.38], [-0.7, 1.5, -0.12], [0, 0, 0]);
    addBox(rd, mats.darkMetal, [0.62, 0.46, 0.05], [0.05, 1.5, -0.16], { rx: 0.08 });
    addPlane(rd, screens.approval, [0.54, 0.38], [0.05, 1.5, -0.12], [0, 0, 0]);
    // coffee machine
    addBox(rd, mats.darkMetal, [0.34, 0.44, 0.3], [1.0, 1.33, 0], { cast: false });
    addBox(rd, mats.warmGlow, [0.3, 0.05, 0.05], [1.0, 1.31, 0.16], { cast: false });
    addCyl(rd, mats.steel, 0.05, 0.14, [0.84, 1.22, 0.14], { cast: false });
    // chair
    addBox(rd, mats.black, [0.5, 0.08, 0.5], [0, 0.58, 0.95], { cast: false });
    addBox(rd, mats.black, [0.5, 0.6, 0.08], [0, 0.9, 1.18], { cast: false });
    addCyl(rd, mats.steel, 0.045, 0.5, [0, 0.3, 0.95], { cast: false });
    // plant
    addCyl(garage, mats.planter, 0.26, 0.45, [6.1, 0.55, 0.1], { cast: false });
    addSphere(garage, mats.hedge, 0.45, [6.1, 1.2, 0.1], { cast: false });
    addSphere(garage, mats.hedge, 0.32, [5.85, 1.55, 0.1], { cast: false });

    // small tool cart
    addBox(garage, mats.darkMetal, [0.62, 0.85, 0.45], [0.6, 0.72, 1.5]);
    addBox(garage, mats.gold, [0.48, 0.03, 0.03], [0.6, 0.95, 1.73], { cast: false });
    addBox(garage, mats.redPaint, [0.42, 0.1, 0.32], [0.6, 1.2, 1.5], { cast: false });
    mergeOpaqueByMaterial(wb);
    mergeOpaqueByMaterial(rd);
  }

  /* ---------- signs ---------- */
  const signFaceMat = new THREE.MeshBasicMaterial({ map: T.makeSignTexture(), toneMapped: false });
  const mainSign = new THREE.Group();
  mainSign.position.set(-0.35, 6.58, 4.62);
  garage.add(mainSign);
  addBox(mainSign, mats.goldBright, [10.4, 2.18, 0.2], [0, 0, 0]);
  addBox(mainSign, mats.black, [10.12, 1.9, 0.24], [0, 0, 0.02]);
  const signFace = new THREE.Mesh(unitPlane, signFaceMat);
  signFace.scale.set(9.98, 1.82, 1);
  signFace.position.set(0, 0, 0.155);
  mainSign.add(signFace);
  addBox(mainSign, mats.gold, [10.5, 0.04, 0.3], [0, 1.11, 0.02], { cast: false });
  addBox(mainSign, mats.gold, [10.5, 0.04, 0.3], [0, -1.11, 0.02], { cast: false });
  // snow cap on sign
  addBox(mainSign, snowMat, [10.3, 0.045, 0.28], [0, 1.15, 0.02], { cast: false });

  const lightbox = new THREE.Group();
  lightbox.position.set(6.72, 4.9, 4.63);
  garage.add(lightbox);
  addBox(lightbox, mats.goldBright, [0.98, 5.65, 0.28], [0, 0, 0]);
  addBox(lightbox, mats.black, [0.84, 5.5, 0.32], [0, 0, 0.02]);
  const vertFace = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({ map: T.makeVerticalSignTexture(), toneMapped: false }));
  vertFace.scale.set(0.8, 5.44, 1);
  vertFace.position.set(0, 0, 0.19);
  lightbox.add(vertFace);
  const lbGlow = glowSprite(T.makeGlowTexture(), 0xffbd72, 3.2, 0.12);
  lbGlow.position.set(0, 0, 0.6);
  lightbox.add(lbGlow);

  const bladeTex = T.makeBladeTexture();
  const bladeMatFace = new THREE.MeshBasicMaterial({ map: bladeTex, toneMapped: false });
  const bladeDark = mats.darkMetal;
  const blade = new THREE.Group();
  blade.position.set(-8.86, 5.45, 5.55);
  garage.add(blade);
  const bladePanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 2.35, 2.95),
    [bladeMatFace, bladeMatFace, bladeDark, bladeDark, bladeDark, bladeDark]
  );
  bladePanel.castShadow = true;
  blade.add(bladePanel);
  addBox(blade, mats.gold, [0.19, 0.06, 3.0], [0, 1.2, 0], { cast: false });
  addBox(blade, mats.gold, [0.19, 0.06, 3.0], [0, -1.2, 0], { cast: false });
  addBox(blade, mats.gold, [0.19, 2.45, 0.06], [0, 0, 1.49], { cast: false });
  addBox(blade, mats.gold, [0.19, 2.45, 0.06], [0, 0, -1.49], { cast: false });
  addBox(blade, mats.darkMetal, [0.14, 0.14, 1.4], [0.25, 0.9, 0.0], { cast: false });
  addBox(blade, mats.darkMetal, [0.14, 0.14, 1.4], [0.25, -0.9, 0.0], { cast: false });
  addBox(blade, mats.darkMetal, [1.0, 0.12, 0.12], [0.5, 0.9, -1.1], { cast: false });
  addBox(blade, mats.darkMetal, [1.0, 0.12, 0.12], [0.5, -0.9, -1.1], { cast: false });

  const roofSign = new THREE.Group();
  roofSign.position.set(-1.2, 10.0, 2.4);
  garage.add(roofSign);
  addBox(roofSign, mats.goldBright, [7.4, 1.1, 0.18], [0, 0, 0]);
  addBox(roofSign, mats.black, [7.16, 0.92, 0.22], [0, 0, 0.02]);
  const roofFace = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({ map: T.makeRoofSignTexture(), toneMapped: false }));
  roofFace.scale.set(7.02, 0.82, 1);
  roofFace.position.set(0, 0, 0.14);
  roofSign.add(roofFace);
  addBox(roofSign, mats.gold, [7.5, 0.04, 0.26], [0, 0.57, 0.02], { cast: false });
  addBox(roofSign, snowMat, [7.3, 0.045, 0.24], [0, 0.61, 0.02], { cast: false });
  [-3.2, 3.2].forEach((x) => addBox(roofSign, mats.darkMetal, [0.12, 0.65, 0.12], [x, -0.82, -0.02], { cast: false }));
  mergeOpaqueByMaterial(mainSign);
  mergeOpaqueByMaterial(lightbox);
  mergeOpaqueByMaterial(blade);
  mergeOpaqueByMaterial(roofSign);

  // garage roof snow blanket
  const roofSnow = addBox(garage, snowMat, [15.1, 0.035, 9.1], [0, 9.412, 0], { cast: false, receive: false });
  roofSnow.renderOrder = 1;
  const awningSnow = addBox(garage, snowMat, [4.64, 0.04, 1.54], [2.1, 3.81, 5.0], { cast: false });
  awningSnow.renderOrder = 1;

  /* ============================================================
     FINANCE OFFICE
     ============================================================ */
  const finance = new THREE.Group();
  finance.position.set(-18.75, 0, -1.5);
  scene.add(finance);
  const financeShell = new THREE.Group();
  finance.add(financeShell);
  {
    const FW = 12.6, FH = 8.2, FD = 8;
    addBox(financeShell, mats.stone, [FW + 0.2, 1.1, FD + 0.2], [0, 0.55, 0]);
    addBox(financeShell, mats.brick, [FW, FH - 1.1, FD], [0, 1.1 + (FH - 1.1) / 2, 0]);
    addBox(financeShell, mats.slab, [FW + 0.4, 0.35, FD + 0.4], [0, FH - 0.25, 0]);
    addBox(financeShell, mats.gold, [FW + 0.5, 0.06, 0.08], [0, FH - 0.05, FD / 2 + 0.15]);
    addBox(financeShell, mats.stone, [FW + 0.3, 0.5, 0.3], [0, 1.15, FD / 2 + 0.08]);
    // corner gold pilasters
    [-FW / 2, FW / 2].forEach((x) => {
      addBox(financeShell, mats.gold, [0.14, FH - 1.1, 0.14], [x, 1.1 + (FH - 1.1) / 2, FD / 2 + 0.02]);
    });

    // window band
    const winTex = T.makeWindowsTexture('finance', 41);
    const winMat = new THREE.MeshBasicMaterial({ map: winTex, transparent: true, toneMapped: false });
    const winBand = addPlane(financeShell, winMat, [9.6, 3.3], [0, 4.9, FD / 2 + 0.03], [0, 0, 0]);
    winBand.receiveShadow = false;
    // window mullions
    [-4.8, -1.6, 1.6, 4.8].forEach((x) => {
      addBox(financeShell, mats.gold, [0.07, 3.5, 0.12], [x, 4.9, FD / 2 + 0.08], { cast: false });
    });
    addBox(financeShell, mats.gold, [9.8, 0.07, 0.12], [0, 6.55, FD / 2 + 0.08], { cast: false });
    addBox(financeShell, mats.gold, [9.8, 0.07, 0.12], [0, 3.25, FD / 2 + 0.08], { cast: false });
    addBox(financeShell, mats.stone, [9.8, 0.12, 0.35], [0, 3.16, FD / 2 + 0.14], { cast: false });

    // entrance
    addBox(financeShell, mats.stone, [4.4, 0.16, 1.6], [0, 0.16, FD / 2 + 0.75], { cast: false });
    addBox(financeShell, mats.darkMetal, [2.2, 3.2, 0.12], [0, 1.68, FD / 2 + 0.06], { rx: 0, cast: false });
    addBox(financeShell, mats.glass, [1.9, 2.9, 0.04], [0, 1.6, FD / 2 + 0.14], { cast: false, receive: false }).userData.glass = true;
    addBox(financeShell, mats.goldBright, [2.4, 0.08, 0.14], [0, 3.28, FD / 2 + 0.08], { cast: false });
    addBox(financeShell, mats.goldBright, [0.08, 3.2, 0.14], [-1.14, 1.68, FD / 2 + 0.08], { cast: false });
    addBox(financeShell, mats.goldBright, [0.08, 3.2, 0.14], [1.14, 1.68, FD / 2 + 0.08], { cast: false });
    addBox(financeShell, mats.gold, [0.04, 0.75, 0.06], [-0.35, 1.45, FD / 2 + 0.18], { cast: false });
    addBox(financeShell, mats.gold, [0.04, 0.75, 0.06], [0.35, 1.45, FD / 2 + 0.18], { cast: false });
    // canopy
    addBox(financeShell, mats.canopyDark, [3.4, 0.14, 1.35], [0, 3.55, FD / 2 + 0.62]);
    addBox(financeShell, mats.gold, [3.46, 0.04, 1.4], [0, 3.64, FD / 2 + 0.62]);
    addBox(financeShell, snowMat, [3.4, 0.035, 1.35], [0, 3.67, FD / 2 + 0.62], { cast: false });
    [0].forEach(() => addCyl(financeShell, mats.warmGlow, 0.08, 0.03, [0, 3.47, FD / 2 + 0.9], { cast: false }));

    // finance sign
    const finSign = new THREE.Group();
    finSign.position.set(0, 7.2, FD / 2 + 0.2);
    finance.add(finSign);
    addBox(finSign, mats.goldBright, [5.6, 1.18, 0.16], [0, 0, 0]);
    addBox(finSign, mats.black, [5.4, 1.0, 0.2], [0, 0, 0.02]);
    const finFace = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({ map: T.makeFacilitySign('財務室', 'FINANCE · REVIEW & TREASURY', 1024, 224), toneMapped: false }));
    finFace.scale.set(5.3, 0.96, 1);
    finFace.position.set(0, 0, 0.13);
    finSign.add(finFace);

    // teal neon edge
    addBox(finance, new THREE.MeshBasicMaterial({ color: 0x54d8cc, toneMapped: false }), [0.05, 5.2, 0.06], [-FW / 2 + 0.1, 4.6, FD / 2 + 0.12], { cast: false });
    // rooftop units
    addBox(finance, mats.darkMetal, [1.2, 0.7, 1.0], [-3.2, FH + 0.18, -1.2]);
    addBox(finance, mats.steel, [0.08, 0.8, 0.08], [3.4, FH + 0.35, 0.6]);
    addCyl(finance, mats.darkMetal, 0.28, 0.9, [4.4, FH + 0.55, -2.2]);
    const finRoofSnow = addBox(finance, snowMat, [12.8, 0.03, 8.1], [0, FH - 0.06, 0], { cast: false });
    finRoofSnow.renderOrder = 1;
    mergeOpaqueByMaterial(finSign);
    addBox(finance, mats.coolGlow, [12.5, 0.045, 0.07], [0, FH + 0.05, FD / 2 + 0.12], { cast: false });
  }
  mergeOpaqueByMaterial(financeShell);

  /* ============================================================
     WAREHOUSE
     ============================================================ */
  const warehouse = new THREE.Group();
  warehouse.position.set(15.2, 0, -4);
  scene.add(warehouse);
  const warehouseShell = new THREE.Group();
  warehouse.add(warehouseShell);
  {
    const WW = 11.4, WH = 6.2, WD = 11;
    addBox(warehouseShell, mats.stone, [WW + 0.2, 0.9, WD + 0.2], [0, 0.45, 0]);
    addBox(warehouseShell, mats.corrugated, [WW, WH - 0.9, WD], [0, 0.9 + (WH - 0.9) / 2, 0]);
    addBox(warehouseShell, mats.slab, [WW + 0.3, 0.32, WD + 0.3], [0, WH - 0.12, 0]);
    addBox(warehouseShell, mats.gold, [WW + 0.34, 0.05, 0.08], [0, WH + 0.04, WD / 2 + 0.02]);
    // rollup door
    const rollTex = T.canvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#1b2027'; ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 22) {
        ctx.fillStyle = 'rgba(0,0,0,0.42)'; ctx.fillRect(0, y, w, 4);
        ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(0, y + 4, w, 1);
      }
      ctx.fillStyle = 'rgba(216,184,120,0.16)';
      ctx.font = '600 26px "SF Mono", Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LOADING 01', w / 2, h / 2);
    });
    const doorMat = new THREE.MeshStandardMaterial({ map: rollTex, color: 0xaab0b8, roughness: 0.55, metalness: 0.4 });
    addBox(warehouseShell, doorMat, [5.4, 4.1, 0.12], [0, 2.15, WD / 2 + 0.04], { cast: false });
    addBox(warehouseShell, mats.gold, [5.7, 0.1, 0.2], [0, 4.26, WD / 2 + 0.08], { cast: false });
    addBox(warehouseShell, mats.gold, [0.1, 4.2, 0.2], [-2.78, 2.15, WD / 2 + 0.08], { cast: false });
    addBox(warehouseShell, mats.gold, [0.1, 4.2, 0.2], [2.78, 2.15, WD / 2 + 0.08], { cast: false });
    // loading dock
    addBox(warehouseShell, mats.stone, [6.4, 0.5, 1.4], [0, 0.25, WD / 2 + 0.8], { cast: false });
    addBox(warehouseShell, mats.gold, [6.5, 0.04, 0.06], [0, 0.51, WD / 2 + 1.48], { cast: false });
    // high windows
    const whWinMat = new THREE.MeshBasicMaterial({ color: 0x84d9d0, transparent: true, opacity: 0.8, toneMapped: false });
    [-3.8, -1.6, 0.6, 2.8].forEach((x) => {
      addPlane(warehouseShell, whWinMat, [1.1, 0.55], [x, 5.3, WD / 2 + 0.02], [0, 0, 0]);
      addBox(warehouseShell, mats.gold, [1.2, 0.04, 0.08], [x, 5.6, WD / 2 + 0.06], { cast: false });
    });
    // depot sign
    const depSign = new THREE.Group();
    depSign.position.set(0, 4.85, WD / 2 + 0.18);
    warehouse.add(depSign);
    addBox(depSign, mats.goldBright, [4.9, 0.94, 0.14], [0, 0, 0]);
    addBox(depSign, mats.black, [4.72, 0.78, 0.18], [0, 0, 0.02]);
    const depFace = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({ map: T.makeFacilitySign('倉庫', 'DEPOT · PARTS & LOGISTICS', 1024, 200), toneMapped: false }));
    depFace.scale.set(4.64, 0.74, 1);
    depFace.position.set(0, 0, 0.12);
    depSign.add(depFace);

    // roof vents
    addBox(warehouse, mats.steel, [1.4, 0.6, 0.8], [-3.4, WH + 0.28, -1.8]);
    addCyl(warehouse, mats.darkMetal, 0.25, 1.0, [3.6, WH + 0.5, 2.0]);
    addCyl(warehouse, mats.gold, 0.27, 0.06, [3.6, WH + 1.0, 2.0]);
    const whRoofSnow = addBox(warehouse, snowMat, [11.5, 0.03, 11.1], [0, WH + 0.06, 0], { cast: false });
    whRoofSnow.renderOrder = 1;

    // pallets & crates in front
    addBox(warehouse, mats.wood, [1.5, 0.18, 1.1], [-4.1, 0.5, WD / 2 + 1.8], { cast: false });
    addBox(warehouse, mats.wood, [1.0, 0.8, 0.9], [-4.2, 1.0, WD / 2 + 1.8]);
    addBox(warehouse, mats.wood, [0.8, 0.62, 0.7], [-4.2, 1.7, WD / 2 + 1.8]);
    addBox(warehouse, mats.gold, [1.02, 0.04, 0.05], [-4.2, 1.42, WD / 2 + 2.26], { cast: false });
    addBox(warehouse, mats.black, [1.2, 0.9, 0.9], [-2.4, 0.62, WD / 2 + 2.0]);
    addBox(warehouse, mats.gold, [0.7, 0.03, 0.02], [-2.4, 0.8, WD / 2 + 2.46], { cast: false });
    mergeOpaqueByMaterial(depSign);
    addBox(warehouse, mats.warmGlow, [11.3, 0.045, 0.06], [0, WH + 0.07, WD / 2 + 0.1], { cast: false });
  }
  mergeOpaqueByMaterial(warehouseShell);

  /* ============================================================
     DORMITORY
     ============================================================ */
  const dorm = new THREE.Group();
  dorm.position.set(27, 0, -1.5);
  scene.add(dorm);
  const dormShell = new THREE.Group();
  dorm.add(dormShell);
  {
    const DW = 9.4, DH = 10.8, DD = 8.4;
    addBox(dormShell, mats.stone, [DW + 0.2, 1.0, DD + 0.2], [0, 0.5, 0]);
    addBox(dormShell, mats.brick, [DW, DH - 1, DD], [0, 1 + (DH - 1) / 2, 0]);
    addBox(dormShell, mats.slab, [DW + 0.4, 0.35, DD + 0.4], [0, DH - 0.2, 0]);
    addBox(dormShell, mats.gold, [DW + 0.44, 0.06, 0.08], [0, DH + 0.02, DD / 2 + 0.1]);
    // windows band
    const winTex = T.makeWindowsTexture('dorm', 73);
    const winMat = new THREE.MeshBasicMaterial({ map: winTex, transparent: true, toneMapped: false });
    addPlane(dormShell, winMat, [7.8, 8.8], [0, 6.15, DD / 2 + 0.03], [0, 0, 0]);
    // balcony slabs
    [4.35, 7.15].forEach((y) => {
      addBox(dormShell, mats.slab, [8.2, 0.14, 0.85], [0, y, DD / 2 + 0.42], { cast: false });
      addBox(dormShell, mats.gold, [8.2, 0.03, 0.06], [0, y + 0.36, DD / 2 + 0.83], { cast: false });
      for (let i = 0; i < 9; i++) addBox(dormShell, mats.gold, [0.025, 0.34, 0.025], [-3.8 + i * 0.95, y + 0.18, DD / 2 + 0.83], { cast: false });
      for (let i = 0; i < 5; i++) addBox(dormShell, snowMat, [1.4, 0.03, 0.2], [-3.2 + i * 1.6, y + 0.37, DD / 2 + 0.83], { cast: false });
    });
    // entrance
    addBox(dormShell, mats.darkMetal, [2.0, 2.9, 0.12], [0, 1.55, DD / 2 + 0.04], { cast: false });
    addBox(dormShell, mats.glass, [1.7, 2.6, 0.04], [0, 1.5, DD / 2 + 0.12], { cast: false, receive: false }).userData.glass = true;
    addBox(dormShell, mats.goldBright, [0.07, 2.9, 0.12], [-1.0, 1.55, DD / 2 + 0.08], { cast: false });
    addBox(dormShell, mats.goldBright, [0.07, 2.9, 0.12], [1.0, 1.55, DD / 2 + 0.08], { cast: false });
    addBox(dormShell, mats.canopyDark, [3.0, 0.12, 1.2], [0, 3.15, DD / 2 + 0.55]);
    addBox(dormShell, mats.gold, [3.05, 0.035, 1.24], [0, 3.23, DD / 2 + 0.55]);
    addBox(dormShell, snowMat, [3.0, 0.03, 1.2], [0, 3.26, DD / 2 + 0.55], { cast: false });
    addBox(dormShell, mats.stone, [3.4, 0.16, 1.2], [0, 0.16, DD / 2 + 0.6], { cast: false });
    // dorm sign
    const dormSign = new THREE.Group();
    dormSign.position.set(0, 3.85, DD / 2 + 0.2);
    dorm.add(dormSign);
    addBox(dormSign, mats.goldBright, [4.2, 0.86, 0.14], [0, 0, 0]);
    addBox(dormSign, mats.black, [4.04, 0.7, 0.18], [0, 0, 0.02]);
    const dormFace = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({ map: T.makeFacilitySign('宿舍', 'DORM · STAFF RESIDENCE', 1024, 200), toneMapped: false }));
    dormFace.scale.set(3.96, 0.66, 1);
    dormFace.position.set(0, 0, 0.12);
    dormSign.add(dormFace);

    // rooftop
    addCyl(dorm, mats.steel, 0.85, 1.7, [-2.2, DH + 0.75, -1.0]);
    addCyl(dorm, mats.gold, 0.88, 0.06, [-2.2, DH + 1.6, -1.0]);
    addCyl(dorm, mats.darkMetal, 0.1, 0.7, [-2.2, DH + 0.25, -1.0]);
    addBox(dorm, mats.darkMetal, [1.1, 0.7, 0.9], [2.2, DH + 0.3, 0.6]);
    addBox(dorm, mats.darkMetal, [0.45, 0.7, 0.45], [2.2, DH - 2.4, DD / 2 + 0.15]);
    const dormRoofSnow = addBox(dorm, snowMat, [9.5, 0.03, 8.5], [0, DH - 0.01, 0], { cast: false });
    dormRoofSnow.renderOrder = 1;
    mergeOpaqueByMaterial(dormSign);
    addBox(dorm, mats.warmGlow, [9.4, 0.045, 0.06], [0, DH + 0.07, DD / 2 + 0.1], { cast: false });
  }
  mergeOpaqueByMaterial(dormShell);

  /* ============================================================
     STREET FURNITURE
     ============================================================ */
  const street = new THREE.Group();
  scene.add(street);

  // street lamps
  const lampGroups = [];
  const lampPositions = [-20, -6.5, 4.8, 14.2, 25];
  const coneGeo = new THREE.ConeGeometry(2.1, 5.5, 24, 1, true);
  const lampHeadMat = new THREE.MeshBasicMaterial({ color: 0xffd7a0, toneMapped: false });
  lampPositions.forEach((x) => {
    const g = new THREE.Group();
    g.position.set(x, 0, 9.62);
    street.add(g);
    addCyl(g, mats.darkMetal, 0.09, 6.4, [0, 3.2, 0]);
    addCyl(g, mats.concreteDark, 0.2, 0.24, [0, 0.12, 0]);
    addBox(g, mats.darkMetal, [0.08, 0.08, 0.95], [0, 6.3, 0.42]);
    addBox(g, mats.darkMetal, [0.5, 0.12, 0.34], [0, 6.24, 0.85]);
    addBox(g, lampHeadMat, [0.38, 0.03, 0.24], [0, 6.17, 0.85], { cast: false });
    addBox(g, mats.gold, [0.52, 0.03, 0.36], [0, 6.31, 0.85], { cast: false });

    const headGlow = glowSprite(T.makeGlowTexture(), 0xffc987, 2.0, 0.62);
    headGlow.position.set(0, 6.15, 0.85);
    g.add(headGlow);

    const coneMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(0xffb974) }, uOpacity: { value: 0.075 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec2 vUv; uniform vec3 uColor; uniform float uOpacity; void main(){ float a = smoothstep(0.0,0.55,vUv.y) * uOpacity; gl_FragColor = vec4(uColor, a); }`,
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(0, 3.45, 0.85);
    cone.userData.nonPickable = true;
    g.add(cone);
    refs.cones.push({ mat: coneMat, base: 0.075 });

    const groundGlow = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({
      map: T.makeGlowTexture(), color: 0xffb974, transparent: true, opacity: 0.28,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    groundGlow.rotation.x = -Math.PI / 2;
    groundGlow.scale.set(6, 6, 1);
    groundGlow.position.set(0, 0.06, 0.85);
    groundGlow.userData.nonPickable = true;
    g.add(groundGlow);
    addStreak(x, 16.2, 3.1, 10, 0xffb974, 0.16);
    mergeOpaqueByMaterial(g);
    lampGroups.push(g);

    // warm light pool on the wet road in front of the sidewalk
    const roadPool = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({
      map: T.makeGlowTexture(), color: 0xffb974, transparent: true, opacity: 0.18,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    roadPool.rotation.x = -Math.PI / 2;
    roadPool.scale.set(9, 8, 1);
    roadPool.position.set(x, 0.055, 13.6);
    scene.add(roadPool);
  });

  // overhead cables
  {
    const cableMat = new THREE.LineBasicMaterial({ color: 0x0a0c10, transparent: true, opacity: 0.8 });
    const cablePoints = (offset, height) => {
      const pts = [];
      for (let x = -34; x <= 38; x += 2) {
        const sag = Math.sin(((x + 34) / 8) * Math.PI) * 0.22;
        pts.push(new THREE.Vector3(x, height - Math.abs(sag) + offset, 9.4));
      }
      return pts;
    };
    [0, 0.35, -0.3].forEach((o) => {
      const geo = new THREE.BufferGeometry().setFromPoints(cablePoints(o, 6.55));
      street.add(new THREE.Line(geo, cableMat));
    });
  }

  // trees
  const treeGroups = [];
  const treeXs = [-23.4, -13.2, 7.3, 19.2, 23.6, 30.4];
  treeXs.forEach((x, idx) => {
    const g = new THREE.Group();
    g.position.set(x, 0, 7.3);
    street.add(g);
    addCyl(g, mats.bark, 0.18, 2.6, [0, 1.3, 0]);
    addCyl(g, mats.bark, 0.1, 1.2, [0.35, 2.2, 0.1], { rz: -0.4, cast: false });
    addCyl(g, mats.planter, 0.85, 0.25, [0, 0.13, 0]);
    addCyl(g, mats.hedge, 0.7, 0.18, [0, 0.28, 0]);

    const foliageMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x2c4632), roughness: 0.92, metalness: 0.03,
    });
    refs.foliageMats.push({ mat: foliageMat, base: new THREE.Color(0x2c4632).offsetHSL((idx - 3) * 0.012, 0.02, 0) });
    const blobs = [
      [0, 3.4, 0, 1.5],
      [0.7, 3.0, 0.3, 1.05],
      [-0.75, 3.05, -0.3, 1.0],
      [0.1, 4.0, -0.2, 1.15],
    ];
    blobs.forEach(([bx, by, bz, br]) => {
      addSphere(g, foliageMat, br, [bx, by, bz], { sy: 0.85 });
      const cap = addSphere(g, snowMat, br * 0.82, [bx, by + br * 0.5, bz], { sy: 0.24, cast: false });
      cap.renderOrder = 1;
    });
    // tree ring glow in winter handled by snow; add subtle uplight
    treeGroups.push(g);
    g.scale.setScalar(0.82);
    mergeOpaqueByMaterial(g);
  });

  // planters + hedges at facade
  [[-6.6, 4.55], [6.15, 4.35], [-15.0, 4.2]].forEach(([x, z]) => {
    addBox(street, mats.planter, [2.0, 0.55, 1.0], [x, 0.3, z]);
    addBox(street, mats.hedge, [1.85, 0.4, 0.85], [x, 0.72, z], { cast: false });
    addBox(street, snowMat, [1.95, 0.03, 0.95], [x, 0.95, z], { cast: false }).renderOrder = 1;
  });

  // bollards
  for (let i = 0; i < 8; i++) {
    const x = -8.4 + i * 2.4;
    if (Math.abs(x - 2.1) < 1.5) continue;
    addCyl(street, mats.darkMetal, 0.08, 0.75, [x, 0.5, 9.85]);
    addCyl(street, mats.gold, 0.085, 0.04, [x, 0.89, 9.85], { cast: false });
  }

  // trash bin + hydrant
  addBox(street, mats.darkMetal, [0.55, 0.85, 0.55], [-10.8, 0.56, 8.7]);
  addBox(street, mats.gold, [0.57, 0.04, 0.57], [-10.8, 0.99, 8.7], { cast: false });
  addCyl(street, mats.redPaint, 0.14, 0.65, [-12.4, 0.46, 8.6]);
  addCyl(street, mats.redPaint, 0.22, 0.06, [-12.4, 0.8, 8.6]);
  addBox(street, mats.redPaint, [0.5, 0.12, 0.14], [-12.4, 0.62, 8.6], { cast: false });

  // ticket kiosk
  const ticketBox = new THREE.Group();
  ticketBox.position.set(2.3, 0, 6.3);
  scene.add(ticketBox);
  {
    addBox(ticketBox, mats.darkMetal, [1.05, 1.55, 0.62], [0, 0.9, 0]);
    addBox(ticketBox, mats.goldBright, [1.1, 0.08, 0.68], [0, 1.71, 0]);
    addBox(ticketBox, mats.black, [0.82, 0.52, 0.05], [0, 1.28, 0.32], { cast: false });
    addBox(ticketBox, mats.warmGlow, [0.55, 0.035, 0.06], [0, 1.12, 0.34], { cast: false });
    addBox(ticketBox, mats.gold, [0.55, 0.22, 0.03], [0, 1.34, 0.35], { cast: false });
    addBox(ticketBox, mats.black, [0.66, 0.16, 0.03], [0, 1.34, 0.37], { cast: false });
    addCyl(ticketBox, mats.gold, 0.12, 0.03, [-0.3, 0.28, 0.32], { rx: Math.PI / 2, cast: false });
    // small label
    const ticketLabel = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({ map: T.makeFacilitySign('票据箱', 'TICKET DROP', 512, 192), toneMapped: false }));
    ticketLabel.scale.set(0.86, 0.32, 1);
    ticketLabel.position.set(0, 1.34, 0.375);
    ticketBox.add(ticketLabel);
    addBox(ticketBox, snowMat, [1.0, 0.035, 0.6], [0, 1.76, 0], { cast: false }).renderOrder = 1;
    mergeOpaqueByMaterial(ticketBox);
  }

  // approval terminal
  const terminal = new THREE.Group();
  terminal.position.set(5.2, 0, 6.4);
  scene.add(terminal);
  {
    addBox(terminal, mats.darkMetal, [0.55, 1.45, 0.4], [0, 0.73, 0]);
    addBox(terminal, mats.gold, [0.6, 0.06, 0.45], [0, 0.05, 0]);
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 1.62, 0);
    screenGroup.rotation.x = -0.12;
    terminal.add(screenGroup);
    addBox(screenGroup, mats.black, [0.92, 0.62, 0.08], [0, 0, 0]);
    addPlane(screenGroup, screens.approval, [0.82, 0.52], [0, 0, 0.05], [0, 0, 0]);
    addBox(screenGroup, mats.gold, [0.96, 0.05, 0.1], [0, 0.35, 0], { cast: false });
    addCyl(terminal, mats.gold, 0.025, 0.6, [0, 1.28, 0], { cast: false });
    addBox(terminal, snowMat, [0.95, 0.03, 0.1], [0, 1.95, 0], { cast: false }).renderOrder = 1;
    mergeOpaqueByMaterial(terminal);
  }

  // parking sign
  const parking = new THREE.Group();
  parking.position.set(-6.7, 0, 7.6);
  scene.add(parking);
  {
    addCyl(parking, mats.steel, 0.055, 2.6, [0, 1.3, 0]);
    const signMat = T.canvasTexture(256, 320, (ctx, w, h) => {
      ctx.fillStyle = '#0e3c66'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(230,242,250,0.8)'; ctx.lineWidth = 5; ctx.strokeRect(10, 10, w - 20, h - 20);
      ctx.fillStyle = '#f2f7fb';
      ctx.font = '700 170px "Inter", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('P', w / 2, 120);
      ctx.font = '500 24px "Noto Sans CJK SC", "PingFang SC", sans-serif';
      ctx.fillText('古德車房 · 停車場', w / 2, 236);
      ctx.font = '400 17px "SF Mono", Menlo, monospace';
      ctx.fillStyle = 'rgba(220,235,245,0.6)';
      ctx.fillText('GOODWORK PARKING', w / 2, 276);
    });
    const sign = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({ map: signMat, toneMapped: false, side: THREE.DoubleSide }));
    sign.scale.set(0.95, 1.18, 1);
    sign.position.set(0, 2.2, 0);
    parking.add(sign);
    addBox(parking, mats.steel, [1.02, 1.25, 0.05], [0, 2.2, -0.04], { cast: false });
    addBox(parking, mats.steel, [1.02, 0.05, 0.05], [0, 2.82, -0.02], { cast: false });
    addBox(parking, snowMat, [1.0, 0.03, 0.08], [0, 2.85, 0], { cast: false }).renderOrder = 1;
    mergeOpaqueByMaterial(parking);
  }

  // delivery truck
  const truck = new THREE.Group();
  truck.position.set(10.8, 0, 6.7);
  scene.add(truck);
  {
    // cargo
    addBox(truck, mats.darkMetal, [3.4, 2.25, 2.15], [0.75, 1.65, 0]);
    addBox(truck, mats.corrugated, [3.36, 2.2, 2.16], [0.75, 1.65, 0], { cast: false });
    addBox(truck, mats.gold, [3.38, 0.08, 2.18], [0.75, 2.74, 0], { cast: false });
    addBox(truck, mats.gold, [0.05, 1.4, 0.04], [-0.88, 1.65, 1.09], { cast: false });
    // cab
    addBox(truck, mats.creamPaint, [1.85, 1.65, 2.0], [-2.05, 1.28, 0]);
    addBox(truck, mats.carGlass, [0.06, 0.65, 1.65], [-2.97, 1.72, 0], { cast: false });
    addBox(truck, mats.carGlass, [1.3, 0.6, 0.05], [-2.25, 1.7, 1.0], { cast: false });
    addBox(truck, mats.gold, [0.08, 0.5, 1.9], [-2.96, 1.0, 0], { cast: false });
    // wheels
    const truckWheel = new THREE.CylinderGeometry(0.42, 0.42, 0.26, 18);
    [[-2.35, 1.05], [-2.35, -1.05], [1.35, 1.05], [1.35, -1.05]].forEach(([x, z]) => {
      const wheel = new THREE.Mesh(truckWheel, mats.rubber);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.42, z);
      wheel.castShadow = true;
      truck.add(wheel);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.28, 14), mats.chrome);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(x, 0.42, z);
      truck.add(hub);
    });
    // lights
    addBox(truck, mats.headlight, [0.04, 0.18, 0.3], [-3.0, 0.9, 0.72], { cast: false });
    addBox(truck, mats.headlight, [0.04, 0.18, 0.3], [-3.0, 0.9, -0.72], { cast: false });
    addBox(truck, mats.redGlow, [0.04, 0.16, 0.22], [2.46, 1.0, 0.8], { cast: false });
    addBox(truck, mats.redGlow, [0.04, 0.16, 0.22], [2.46, 1.0, -0.8], { cast: false });
    // side logo plate
    const truckLogo = new THREE.Mesh(unitPlane, new THREE.MeshBasicMaterial({ map: T.makeRoofSignTexture(), toneMapped: false }));
    truckLogo.scale.set(2.2, 0.42, 1);
    truckLogo.position.set(0.75, 1.75, 1.09);
    truckLogo.rotation.y = 0;
    truck.add(truckLogo);
    addBox(truck, snowMat, [3.3, 0.035, 2.05], [0.75, 2.8, 0], { cast: false }).renderOrder = 1;
    mergeOpaqueByMaterial(truck);
  }

  // parcel stack near warehouse
  addBox(street, mats.wood, [0.9, 0.7, 0.8], [13.4, 0.45, 3.3]);
  addBox(street, mats.wood, [0.75, 0.55, 0.65], [14.3, 0.4, 3.4]);
  addBox(street, mats.wood, [0.6, 0.45, 0.55], [13.45, 1.05, 3.3]);

  // drainage grates
  for (let i = 0; i < 7; i++) {
    addBox(street, mats.black, [0.7, 0.02, 0.34], [-24 + i * 8, 0.32, 10.35], { cast: false });
  }

  /* ============================================================
     LABELS + ENTRIES
     ============================================================ */
  function makeLabelSprite(code, title, sub) {
    const tex = T.makeLabelTexture(code, title, sub);
    const mat = new THREE.SpriteMaterial({
      map: tex, transparent: true, depthWrite: false, depthTest: true, opacity: 0.92, toneMapped: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.9, 0.975, 1);
    sprite.userData.baseOpacity = 0.92;
    return sprite;
  }

  function registerEntry(def) {
    const entry = {
      ...def,
      focus: new THREE.Vector3(def.focus[0], def.focus[1], def.focus[2]),
      radius: def.radius || 1,
    };
    const objectPickables = [];
    def.objects.forEach((root) => {
      root.traverse((o) => {
        if ((o.isMesh || o.isInstancedMesh) && !o.userData.nonPickable) {
          o.userData.entryId = def.id;
          objectPickables.push(o);
        }
      });
    });
    entry.pickables = objectPickables;
    entries.push(entry);
    entryById.set(entry.id, entry);
    pickables.push(...objectPickables);

    if (def.label) {
      const sprite = makeLabelSprite(def.code, def.label[0], def.label[1]);
      sprite.position.set(def.labelPos[0], def.labelPos[1], def.labelPos[2]);
      scene.add(sprite);
      labels.push(sprite);
      entry.labelSprite = sprite;
    }
    return entry;
  }

  function meta(id) { return META[id]; }

  registerEntry({
    id: 'garage', ...meta('garage'), objects: [shell], focus: [-1, 5.4, 3.6], radius: 3.3,
    label: null,
    cameraStages: [[10.5, 7.4, 24], [3.2, 5.6, 16.5], [2.0, 4.9, 11.4]],
    cameraTargets: [[0.4, 4.8, 2.2], [2.0, 4.7, 2.8], [2.3, 4.5, 2.9]],
  });
  registerEntry({
    id: 'finance', ...meta('finance'), objects: [financeShell], focus: [-18.75, 5.4, 2.7], radius: 2.8,
    label: null,
    cameraStages: [[2.0, 7.0, 22], [-8.0, 5.3, 14.5]],
    cameraTargets: [[-8, 4.2, 0.5], [-17.5, 4.4, 1.4]],
  });
  registerEntry({
    id: 'warehouse', ...meta('warehouse'), objects: [warehouseShell], focus: [15.2, 4.4, 1.8], radius: 2.9,
    label: null,
    cameraStages: [[4.0, 6.6, 22], [9.0, 5.2, 15]],
    cameraTargets: [[4, 3.8, 1.8], [14.0, 3.6, 0.8]],
  });
  registerEntry({
    id: 'dorm', ...meta('dorm'), objects: [dormShell], focus: [27, 6.0, 2.8], radius: 2.9,
    label: null,
    cameraStages: [[16.0, 8.8, 25], [22.5, 7.2, 16]],
    cameraTargets: [[16, 4.6, 0], [27, 5.0, 1.0]],
  });
  registerEntry({
    id: 'sign', ...meta('sign'), objects: [mainSign], focus: [-1.35, 6.58, 3.4], radius: 2.1,
    label: null,
  });
  registerEntry({
    id: 'lightbox', ...meta('lightbox'), objects: [lightbox], focus: [5.72, 4.9, 3.6], radius: 1.3,
  });
  registerEntry({
    id: 'blade', ...meta('blade'), objects: [blade], focus: [-9.86, 5.45, 4.3], radius: 1.2,
  });
  registerEntry({
    id: 'liftCar', ...meta('liftCar'), objects: [garage.children.find((c) => c.isGroup && c.position.y === 1.32)], focus: [-5.2, 2.1, -2.8], radius: 1.5,
  });
  registerEntry({
    id: 'ticketBox', ...meta('ticketBox'), objects: [ticketBox], focus: [2.3, 0.95, 6.3], radius: 0.95,
    label: ['票据箱', 'TICKET DROP'], labelPos: [2.3, 2.55, 5.6],
  });
  registerEntry({
    id: 'terminal', ...meta('terminal'), objects: [terminal], focus: [5.2, 1.1, 6.4], radius: 0.9,
    label: ['审批终端', 'APPROVAL TERMINAL'], labelPos: [5.2, 2.85, 5.7],
  });
  registerEntry({
    id: 'parking', ...meta('parking'), objects: [parking], focus: [-6.7, 1.7, 7.6], radius: 0.95,
  });
  registerEntry({
    id: 'lamp', ...meta('lamp'), objects: lampGroups, focus: [4.8, 4.4, 9.9], radius: 1.4, dynamicFocus: true,
  });
  registerEntry({
    id: 'truck', ...meta('truck'), objects: [truck], focus: [10.8, 1.8, 6.7], radius: 1.8,
  });
  registerEntry({
    id: 'trees', ...meta('trees'),
    objects: street.children.filter((c) => c.isGroup && treeXs.some((x) => Math.abs(c.position.x - x) < 0.01)),
    focus: [7.3, 3.4, 7.3], radius: 1.7, dynamicFocus: true,
  });
  registerEntry({
    id: 'workbench', ...meta('workbench'), objects: [garage.children.find((c) => c.isGroup && c.position.x === 2.9 && c.position.z === -3.55)], focus: [1.9, 1.15, -5.0], radius: 1.05,
  });
  registerEntry({
    id: 'tires', ...meta('tires'),
    objects: garage.children.filter((c) => c.isMesh && c.geometry.type === 'TorusGeometry'),
    focus: [-7.2, 0.9, 0.9], radius: 0.9, dynamicFocus: true,
  });
  registerEntry({
    id: 'reception', ...meta('reception'), objects: [garage.children.find((c) => c.isGroup && c.position.x === 4.4 && c.position.z === -2.3)], focus: [3.4, 1.15, -3.8], radius: 1.05,
  });

  // fold every non-interactive static mesh into material batches
  mergeStaticDecor(scene, new Set(pickables));

  /* ---------- spark particles (welding) ---------- */
  const sparkCount = isMobile ? 84 : 140;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkColors = new Float32Array(sparkCount * 3);
  const sparkSizes = new Float32Array(sparkCount);
  const sparkLife = new Float32Array(sparkCount);
  const sparkVel = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i++) {
    sparkPositions[i * 3 + 1] = -10;
    sparkSizes[i] = 0.02;
  }
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3).setUsage(THREE.DynamicDrawUsage));
  sparkGeo.setAttribute('aColor', new THREE.BufferAttribute(sparkColors, 3).setUsage(THREE.DynamicDrawUsage));
  sparkGeo.setAttribute('aSize', new THREE.BufferAttribute(sparkSizes, 1).setUsage(THREE.DynamicDrawUsage));
  const sparkMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uScale: { value: 900 }, uOpacity: { value: 1 } },
    vertexShader: `
      attribute vec3 aColor; attribute float aSize;
      varying vec3 vColor; uniform float uScale;
      void main(){
        vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = max(1.0, aSize * uScale / max(0.5, -mv.z));
      }`,
    fragmentShader: `
      varying vec3 vColor;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.02, d);
        gl_FragColor = vec4(vColor, a);
      }`,
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  sparks.frustumCulled = false;
  scene.add(sparks);
  let sparkCursor = 0;
  let nextSparkBurst = 3.2;
  function emitSparks(n) {
    for (let k = 0; k < n; k++) {
      const i = sparkCursor;
      sparkCursor = (sparkCursor + 1) % sparkCount;
      sparkPositions[i * 3] = 1.72 + (Math.random() - 0.5) * 0.3;
      sparkPositions[i * 3 + 1] = 1.12 + Math.random() * 0.2;
      sparkPositions[i * 3 + 2] = -4.9 + (Math.random() - 0.5) * 0.2;
      const a = Math.random() * Math.PI * 2;
      const sp = 0.6 + Math.random() * 1.7;
      sparkVel[i * 3] = Math.cos(a) * sp * 0.5;
      sparkVel[i * 3 + 1] = 0.8 + Math.random() * 1.8;
      sparkVel[i * 3 + 2] = Math.sin(a) * sp * 0.5;
      sparkLife[i] = 0.5 + Math.random() * 0.7;
      const t = Math.random();
      sparkColors[i * 3] = 1;
      sparkColors[i * 3 + 1] = 0.55 + t * 0.4;
      sparkColors[i * 3 + 2] = 0.18 + t * 0.5;
      sparkSizes[i] = 0.022 + Math.random() * 0.025;
    }
    sparkGeo.attributes.aColor.needsUpdate = true;
    sparkGeo.attributes.aSize.needsUpdate = true;
  }
  function updateSparks(dt) {
    for (let i = 0; i < sparkCount; i++) {
      if (sparkLife[i] > 0) {
        sparkLife[i] -= dt;
        sparkVel[i * 3 + 1] -= 4.6 * dt;
        sparkPositions[i * 3] += sparkVel[i * 3] * dt;
        sparkPositions[i * 3 + 1] += sparkVel[i * 3 + 1] * dt;
        sparkPositions[i * 3 + 2] += sparkVel[i * 3 + 2] * dt;
        const life = Math.max(0, sparkLife[i]);
        sparkColors[i * 3 + 1] *= 0.985;
        sparkColors[i * 3 + 2] *= 0.97;
        if (sparkPositions[i * 3 + 1] < 0.4 || life <= 0) {
          sparkPositions[i * 3 + 1] = -10;
          sparkLife[i] = 0;
        }
        sparkSizes[i] *= 0.996;
      }
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.aColor.needsUpdate = true;
    sparkGeo.attributes.aSize.needsUpdate = true;
  }

  /* ---------- hover reticle ---------- */
  const hoverGroup = new THREE.Group();
  hoverGroup.visible = false;
  scene.add(hoverGroup);
  const reticleMat = new THREE.MeshBasicMaterial({
    color: 0xe8c87a, transparent: true, opacity: 0.9, side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, toneMapped: false,
  });
  const outerMat = reticleMat.clone();
  outerMat.opacity = 0.32;
  const ringMain = new THREE.Mesh(new THREE.RingGeometry(0.9, 0.955, 72), reticleMat);
  const ringOuter = new THREE.Mesh(new THREE.RingGeometry(1.045, 1.06, 72), outerMat);
  hoverGroup.add(ringMain, ringOuter);
  for (let i = 0; i < 4; i++) {
    const tick = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.012), reticleMat);
    const a = i * Math.PI / 2;
    tick.position.set(Math.cos(a) * 1.19, Math.sin(a) * 1.19, 0);
    tick.rotation.z = a;
    hoverGroup.add(tick);
  }
  const centerDot = new THREE.Mesh(new THREE.CircleGeometry(0.018, 12), reticleMat);
  hoverGroup.add(centerDot);
  hoverGroup.renderOrder = 999;

  function showHover(entry, point) {
    hoverEntry = entry;
    if (point) hoverPoint.copy(point);
    else hoverPoint.copy(entry.focus);
    hoverGroup.visible = true;
    hoverGroup.scale.setScalar(entry.radius);
  }
  function hideHover() {
    hoverEntry = null;
    hoverGroup.visible = false;
  }

  /* ---------- labels visible ---------- */
  function setLabelsVisible(v) {
    labelsVisible = v;
    labels.forEach((s) => { s.visible = v; });
  }

  /* ---------- seasonal application ---------- */
  function setSeason(state) {
    if (refs.skyUniforms) {
      refs.skyUniforms.uTop.value.copy(state.skyTop);
      refs.skyUniforms.uMid.value.copy(state.skyMid);
      refs.skyUniforms.uHorizon.value.copy(state.skyHorizon);
      refs.skyUniforms.uGlow.value.copy(state.skyGlow);
    }
    scene.fog.color.copy(state.fogColor);
    scene.fog.density = state.fogDensity;
    moonLight.color.copy(state.lightColor);
    moonLight.intensity = state.lightIntensity;
    hemi.color.copy(state.hemiSky);
    hemi.groundColor.copy(state.hemiGround);
    hemi.intensity = state.hemiIntensity;
    if (refs.starsMat) refs.starsMat.opacity = state.starOpacity;
    if (refs.moonSprite) {
      refs.moonSprite.material.color.copy(state.moonColor);
      refs.moonSprite.material.opacity = state.moonOpacity;
      refs.moonHalo.material.opacity = state.moonOpacity * 0.18;
    }
    refs.glassMats.forEach((m) => {
      m.color.copy(state.glassTint);
      m.opacity = state.glassOpacity;
    });
    refs.foliageMats.forEach(({ mat, base }) => {
      mat.color.copy(base).lerp(state.foliage, 0.94);
    });
    refs.snowMats.forEach(({ mat, base }) => {
      mat.opacity = base * state.snow;
      mat.visible = state.snow > 0.005;
    });
    refs.groundSnowMats.forEach(({ mat, base }) => {
      mat.opacity = base * state.snow;
      mat.visible = state.snow > 0.005;
    });
    if (refs.roadMat) {
      refs.roadMat.color.copy(state.groundTint);
      refs.roadMat.roughness = THREE.MathUtils.clamp(state.wet, 0.14, 0.42);
      refs.roadMat.envMapIntensity = 0.9 + (0.42 - state.wet) * 2.4;
    }
    if (refs.sidewalkMat) {
      refs.sidewalkMat.color.copy(state.sidewalkTint);
      refs.sidewalkMat.roughness = THREE.MathUtils.clamp(state.wet + 0.16, 0.24, 0.56);
    }
    refs.cones.forEach(({ mat, base }) => { mat.uniforms.uOpacity.value = base * state.coneOpacity; });
  }

  /* ---------- per-frame ---------- */
  const clockPoint = new THREE.Vector3();
  function update(dt, t, camera) {
    skyUniforms.uTime.value = t;
    // hover reticle billboard + pulse
    if (hoverEntry) {
      if (hoverEntry.getFocus) hoverEntry.getFocus(clockPoint);
      else if (hoverEntry.dynamicFocus) clockPoint.copy(hoverPoint);
      else clockPoint.copy(hoverEntry.focus);
      hoverGroup.position.copy(clockPoint);
      hoverGroup.quaternion.copy(camera.quaternion);
      hoverGroup.rotation.z += dt * 0.35;
      const pulse = 1 + Math.sin(t * 3.4) * 0.018;
      hoverGroup.scale.setScalar(hoverEntry.radius * pulse);
      reticleMat.opacity = 0.72 + Math.sin(t * 4.1) * 0.16;
    }
    // labels fade with distance
    if (labelsVisible) {
      for (const s of labels) {
        const d = camera.position.distanceTo(s.position);
        const targetOpacity = THREE.MathUtils.clamp(1.25 - d / 75, 0.28, 0.92);
        s.material.opacity += (targetOpacity - s.material.opacity) * Math.min(1, dt * 3);
      }
    }
    // neon shimmer
    refs.streaks.forEach(({ mat, base, phase }) => {
      mat.opacity = base * (0.86 + Math.sin(t * 0.9 + phase) * 0.14);
    });
    refs.nebulaMats.forEach(({ mat, base, phase }) => {
      mat.opacity = base * (0.8 + Math.sin(t * 0.12 + phase) * 0.2);
    });
    signLight.intensity = 9 + Math.sin(t * 2.1) * 0.9 + Math.sin(t * 7.3) * 0.4;
    warmInterior.intensity = 27 + Math.sin(t * 1.4) * 1.2;
    // sparks
    nextSparkBurst -= dt;
    if (nextSparkBurst <= 0) {
      emitSparks(isMobile ? 8 : 14);
      nextSparkBurst = 4.6 + Math.random() * 5.2;
    }
    updateSparks(dt);
  }

  function setViewScale(v) {
    sparkMat.uniforms.uScale.value = v;
  }

  /* ---------- nav info ---------- */
  const nav = {
    walkTargets: {
      garage: [2.2, 4.9], finance: [-18.75, 4.6], warehouse: [15.2, 4.1], dorm: [27, 4.5],
      ticketBox: [3.5, 8.0], terminal: [6.4, 8.2], liftCar: [-3.8, 4.6], workbench: [-2.5, 4.8],
      warehouseDock: [18.2, 4.0], dormDoor: [24.6, 4.6],
      wander: [[-11, 8.6], [-2.5, 9.2], [8.4, 8.8], [21.5, 8.7], [29.2, 8.9], [-25, 8.6], [1.8, 9.2]],
    },
    blockedRects: [
      [-10.2, 8.6, -7.5, 4.4],
      [-26.2, -11.3, -6.5, 3.3],
      [9.3, 22.3, -10.5, 2.2],
      [22.3, 32.5, -6.5, 3.4],
      [1.5, 3.2, 5.3, 7.3],
      [4.1, 6.2, 5.4, 7.4],
      [8.3, 14.0, 5.2, 8.2],
      [-8.0, -5.4, 6.8, 8.4],
      [-7.6, -5.8, 3.6, 5.6],
      [5.2, 7.2, 3.6, 5.4],
      [-14.1, -12.1, 7.0, 8.2],
      [-10.2, -9.4, 7.9, 9.4],
    ],
    treeXs,
  };

  return {
    entries, entryById, pickables, refs, nav,
    setSeason, update, showHover, hideHover, setLabelsVisible,
    setViewScale, registerEntry, makeLabelSprite, labels, scene,
    meta: META, npcMeta: NPC_META,
  };
}
