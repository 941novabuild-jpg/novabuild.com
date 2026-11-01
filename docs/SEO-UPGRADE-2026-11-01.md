# Nova Build 主站 SEO 基础升级

采用用户指定的 https://github.com/AgriciDaniel/claude-seo ，阅读技术 SEO、本地服务、结构化数据、网站地图和质量门槛指导。没有运行其安装器，也没有购买服务。

## 已实施
- 保留现有 12 个 URL、品牌设计、真实照片、图片交互和 Nova Leads 询价接收接口。
- 以首页、五项服务、服务区域为七个主要索引页面。各页面拥有独立标题、描述、canonical、社交分享信息。
- Tile、Custom Work、Whole-Home 页面补充各自工作范围、材料及现场条件、初步沟通信息；不复制城市模板，不添加未经确认价格、地址、评价或资质。
- 首页增加 Tile 可抓取链接；服务区域页面明确业务覆盖并连接各服务。
- 使用 Organization、WebSite、WebPage、Service 和 BreadcrumbList，未添加虚假 LocalBusiness 地址或评分。
- 工具页、隐私页排除搜索索引；原本 noindex 的 study 页继续 noindex，但允许 follow。它们仍可访问，noindex 不是访问控制。
- sitemap 仅列七个主要索引页面。预览环境统一 noindex，正式环境允许索引。
- 首页、区域和隐私页移除没有交互用途的框架脚本，保留真实 HTML、CSS 与询价脚本。画廊页交互脚本保留。
- SEO 配置集中在 seo/pages.json，构建时同步 HTML/RSC，自动验证避免重复元信息。

## 验证
- npm run build 与 npm run verify：12 路由及本地资源通过。
- node scripts/verify-seo.mjs：元信息唯一性、canonical、robots、结构化数据解析、图片资源、sitemap、首页服务链接通过。
- CONTEXT=deploy-preview 构建：noindex 策略通过；随后重新构建 production。
- node --test tests/inquiry.test.mjs：8 项通过，不提交真实客户数据。
- 本地浏览器检查首页及 Tile 页面；1280px 桌面和 390px 手机未见横向溢出，原有视觉保持。

## 边界与下一步
这是主站 SEO 基础实施，不是已证明的排名增长。未取得 Search Console 索引/查询数据、真实用户 Core Web Vitals 或完整外链数据；没有宣称通过 Google 富媒体结果测试。
下一步在已验证所有权的 Search Console 提交 https://nova941.com/sitemap.xml，观察实际索引和搜索查询；继续补充有项目事实支持的案例。无需为各城市批量生成近似页面。

依据：https://developers.google.com/search/docs/appearance/structured-data/organization
https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
