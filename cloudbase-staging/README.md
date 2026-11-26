# GOODWORK 账号权限升级 · staging

## 环境
- CloudBase 环境：`ready-puma-d4gmuy5yeca0a8f3c`（上海）
- 审批应用：https://37m34b5qwutsv2u863j.traesite.cn
- 登录/上传测试页：https://37m32hjpvggx168d4ec.traesite.cn
- 生产环境：仍为 v935，未改动

## 账号
| 用户名 | 姓名 | 角色 | 说明 |
|---|---|---|---|
| 1258046614 | 李嘉航 | admin | 管理员 |
| test_member | 测试成员 | member | 仅用于验收 |

初始密码由管理员私下传递；CloudBase 要求至少 3 类字符，原密码不满足，已改用临时密码。首次登录后应尽快修改。

## 已实现
- 用户名密码登录（CloudBase 内置登录，`tcb user create` 开号）
- 用户表映射 uid → 姓名、角色、状态
- 成员只能看自己的记录；管理员看全部
- 新建 → 草稿 → 提交 → 待审批
- 管理员通过 / 驳回 → 待报销
- 管理员标记已报销
- 管理员导出 Excel（当前为元数据，不含图片）
- 管理员历史归属改派（legacy_unclaimed）
- 附件：创建草稿 → 客户端压缩 → 上传桶 tasks → 登记 → 提交
- 审计日志：create / submit / review / reimburse / attach / reassign
- 匿名登录已关闭，仅用户名密码可用

## 代码位置
- `functions/api`：业务云函数（统一 action 路由）
- `app/`：staging 前端（登录、建单、审批、导出）
- `schema.sql` / `base-schema.sql`：建表 SQL
- `login-test/`：登录与上传测试页

## 已验收
- 管理员登录、建单 100 元、待审批、通过、标记已报销
- 成员登录、仅见自己的 50 元记录、可提交、无审批/导出入口
- 管理员可见全部记录
- 导出 Excel 触发下载，无错误
- 附件上传 → 登记 → 提交链路通过
- 审计日志有记录

## 已知差距（上生产前必须处理）
1. staging 前端是简化版，没有三维车库和原工作台的完整字段/导出图片。
2. 附件只登记与上传，尚未做预览、下载和导出嵌入。
3. 历史数据尚未迁移到 staging；生产数据仍在原环境。
4. 未做修改密码界面；临时密码需通过控制台或后续页面修改。
5. 服务端 API Key 有效期 30 天（至 2026-12-26），到期需轮换。
6. 未做登录失败锁定、频率限制（CloudBase 侧有基础限制）。
7. 生产切换前仍需：全量备份、staging 复验、回滚演练。

## 回滚
- 生产回滚包：`/workspace/GOODWORK-v935-回滚包.zip`
- 生产部署基线：`dep_6b06ee6d56f981ec16f5df9b`
- 代码标签：`v935-stable`
- staging 可随时删除或重建，不影响生产。

## 生产端准备（2026-11-26）
- 已创建生产管理员：`1258046614`（uid 同上，角色 admin，临时密码与 staging 相同）
- 已部署生产云函数 `api`，环境变量指向生产 PostgreSQL；未登录调用返回 UNAUTHENTICATED
- 已加生产表：goodwork_users / goodwork_audit / tasks 审批字段 / attachments 归属字段
- 历史 4 笔记录已归属到管理员，标记 legacy_unclaimed，等待逐条认领
- **状态暂未迁移**：仍保持 pending / reimbursed，确保旧版界面可见；切换日再统一 pending→approved
- 生产前端仍为 v935，未切换；旧版冒烟测试通过（3 笔待报销 + 1 笔已报销）
- 生产匿名登录仍开启（旧版依赖），切换完成后再关闭

## 切生产注意
1. 必须先冻结旧版写入，再执行状态迁移，否则旧版新建的 pending 会被误判。
2. 迁移顺序：备份 → 冻结 → pending/supplemented→approved → 部署新前端 → 验收 → 关闭匿名登录。
3. 回滚时把 approved 改回 pending，旧版才能重新显示。

## 3D 工作台认证预览（方案 A）
- 预览地址：https://37m3azrfslbooai6pa4.traesite.cn
- 源码：/workspace/goodwork-auth-preview
- 数据源：staging 环境（不是生产）
- 已实现：登录门、退出、AuthCloudSync、成员仅自己、管理员全部、待审批/待报销角标、通过/驳回/标记已报销、成员撤销、历史认领按钮、成员提交后隐藏编辑/删除
- 已验收：管理员登录→审批 88→标记已报销；成员甘文康登录→仅见自己→新建 66→管理员通过
- 尚未验收：3D 内附件上传/下载、导出图片、生产环境切换
- 生产仍为 v935，未切换
