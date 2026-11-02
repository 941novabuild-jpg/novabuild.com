# SEO / Google Ads 配置补齐

## 本次已发布
代码提交 d648cc8；仍沿用 GitHub main → Netlify → nova941.com。

- 保留页面和服务 URL，12 个 .html 别名强制 301 到 canonical 路径。线上确认厨房别名重定向保留 utm_source 参数、目标 200；www 已有 301，不存在页面返回 404。
- 统计偏好区分：默认关闭、Analytics only、Analytics + ad measurement。旧 analytics 同意只保持统计权限，不自动升级为广告权限。个性化广告始终关闭。
- Google Consent Mode 的 analytics_storage / ad_storage / ad_user_data 根据明确选择设置；广告衡量允许时只将校验后的 gclid/gbraid/wbraid 加入 Google 页面上下文。任意 UTM 文本和客户输入不发送到 GA4。
- 用户同意统计后，在当前浏览器标签会话保存经过字段白名单、长度和格式校验的 campaign 参数；30 分钟无页面活动过期。没有同意时仅在当前页面内存读取，不持久保存。关闭跟踪时清除来源记录和对应第一方衡量 cookies。
- 表单依然要求单独可选的来源信息复选框；勾选后可沿用本次访问已获准保存的来源，拒绝时后端仍舍弃归因参数。来源仍是未核实的 URL 证据。
- 隐私文案同步。没有启用增强型转化、客户信息上传、再营销、Google Signals 或自动个性化广告。

## Google Ads 控制台修正
已保存并重新打开核验：
- Nova Build 132-657-7070；nova_inquiry_received / Request quote。
- Secondary，不用于出价。
- Value：Don't use a value（取消默认 $1；金额报表为 0，不代表项目收入）。
- Counting：Only one conversion（每次广告点击/互动仅计一次，而非每次提交都计数）。
- 不变更预算、广告状态或投放范围。

## 验证证据
- npm run build、npm run verify 通过（12 个页面/资源/SEO 元信息）。
- node --test tests/*.test.mjs：14 项通过；涵盖旧同意不升级、广告标识按同意隔离、来源跨页面保留、过期、撤回、QA 排除、receipt 去重及接口失败。
- 浏览器隔离测试：必填字段拦截；测试厨房询价收到合成后端回执 045c0c88-dcfa-4c8f-be34-c5542e51bdfc，提交后禁用按钮；无客户数据库写入和外发消息。
- 桌面、768px 平板、390px 手机检查，偏好按钮高度 44px，未见横向溢出。本地预览不加载 Google。
- 正式站偏好允许/撤回成功；Google tag 只加载一份。
- 线上 12 个页面均 200、canonical 正确、每页一个 H1 和统计脚本；生产 inquiry GET 显示 available=true / isTest=false（只读就绪检查，不等同生产写入验证）。
- 线上报告：../work/seo-live-followup-20261102.json（项目工作区，不是公开网站资源）。

## 暂停 / 尚未完成
- 商家验证按用户要求暂停。独立后台现已能打开，停在验证用邮寄地址步骤；Google 表示不公开、不接受 P.O. Box。未提交地址。
- 真正的 Ads 点击归因与成功询价匹配仍未用真实广告流量验证；不能用假 gclid 或模拟成功冒充。广告转化当前仅观察。
- 电话/短信仅统计点击，不证明收到电话/短信或有效客户。
- 尚未确定正式投放厨房还是浴室、预算及投放设置；本轮没有创建/启动广告，没有费用。
- 排名、查询、实际 Core Web Vitals 需后续真实数据。没有安排用户未请求的定期自动任务。

## 参考
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://docs.netlify.com/manage/routing/redirects/redirect-options/
