# NOVA SEO 与统计配置交付（2026-11-02）

## 已完成
- Search Console 域名资源 `sc-domain:nova941.com`：业务账号 941novabuild@gmail.com 已通过现有 DNS 自动验证；没有修改 DNS。
- `https://nova941.com/sitemap.xml` 提交成功，Google 显示 processed successfully、7 discovered pages。
- 收录报告的历史快照（10/22）为 7 个已索引页面。服务区域页单独检查显示已索引，实时检测可抓取/可索引、有效面包屑。不将历史报告当作最新发布的即时收录证明。
- GA4 账户 NOVA Build `414302507`；资源 NOVA Build — nova941.com `561865147`；数据流 `16252927298`；Measurement ID `G-D88PBW68G4`。
- 美国/洛杉矶时区、美元。可选账号数据共享关闭，增强型衡量关闭；不启用 Google Signals 或个性化广告。
- Search Console 与 GA4 已关联。
- 经用户明确批准，关联现有 Ads 账户 Nova Build `132-657-7070`；自动标记开启，个性化广告关闭，Ads 用户额外管理 Analytics 权限关闭。
- `nova_inquiry_received` 为 GA4 关键事件，不设虚构金额；导入 Ads 为 Request quote / Secondary（仅观察，不用于出价）。电话、短信点击没有被作为有效咨询转化。
- 网站统计代码已上线（提交 b2f325e）。业务表单与 Nova Leads 后端保持原有实现。

## 统计与隐私行为
- 只有访客在页尾 Analytics preferences 主动允许后才加载 Google。
- 可撤回，默认关闭。本地/预览域名不加载 Google。
- 手动 page_view；nova_call_click、nova_text_click 仅表示点击意向。
- 仅后端确认 receipt 后发 nova_inquiry_received，排除 QA，按 receipt 去重。没有把收到咨询说成已核实有效客户。
- 不发送姓名、联系方式、项目自由文本、receipt、完整 query/hash。页面位置使用干净路径，referrer 只保留来源域名。
- Google Ads 自动标记已开启，但当前 GA 页面位置会去掉点击参数、广告存储默认拒绝，因此不能宣称 Ads 点击归因已经接通或验证；正式投放前还需设计相应同意与归因策略，并测试。

## 验证
- build、12 个页面/资源及 SEO 检查通过。
- 8 个表单测试、4 个统计测试通过：默认拒绝/允许/撤回、预览禁用、重复 receipt 排除、QA 排除、客户端路由更新、隐私路径隔离。
- 桌面和 390px 手机检查统计入口；无横向溢出、按钮可点击。
- 正式 nova941.com/privacy 已出现新隐私内容及偏好入口；允许后只有一个对应 Google tag。
- GA4 Realtime 实际显示 1 位美国测试访问者，隐私页 1 次 page_view。未创建虚假生产询价来填充转化数据。
- 新资源报告存在处理延迟；实时访问成功不等于真实 Ads 归因、有效咨询或实际 Core Web Vitals 达标。

## 剩余
- Google Business Profile：现有 Nova Build 资料尚未验证、公开不可见。电话/网址正确，未新建重复资料。Get verified 打开空白 iframe，刷新后仍空白，尚未看到验证方式；需账号持有人在 Google 商家资料继续验证。不要把 Nexo Custom Interiors 误当成 NOVA。
- 正式投放前：实际询价事件接收核验、Ads 归因测试；Secondary 不自动改成出价用 Primary。
- 本次没有启动广告、改变预算或产生广告费用；没有真实用户 CWV 数据。
