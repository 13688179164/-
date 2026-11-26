# GOODWORK 报销工作台 · v935 回滚包

- 基线提交：be443c7
- 标签：v935-stable
- 生产部署：dep_6b06ee6d56f981ec16f5df9b
- 导出时间：2026-11-26
- 数据表：goodwork_tasks 4 行 / goodwork_attachments 4 行 / goodwork_processed 3 行 / goodwork_meta 11 行

## 用途
账号权限升级期间，如出现登录、审批、权限或数据异常，按此包恢复。

## 回滚顺序
1. 在 Trae 托管控制台把生产站点回滚到 dep_6b06ee6d56f981ec16f5df9b（或重新部署 v935-stable 源码）。
2. 如数据库被误改，使用本目录 JSON 恢复对应表；恢复前先再导出一份当前数据。
3. 云存储附件不需要恢复，文件本身未被修改；若权限被收紧，先恢复公开读。
4. 验证：打开首页、列表可见、新建一笔测试单、导出 Excel、附件可预览。
5. 回滚完成后，在 staging 复现问题，不允许直接再次全量切换。

## 注意
- goodwork_meta.json 中含 7 个尚未迁移的旧附件 Base64 内容，属正常备份，不要外传。
- 本包不含云存储文件本体，也不含账号密码。
