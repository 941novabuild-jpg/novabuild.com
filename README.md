# Nova Build — GitHub / Netlify 部署包

这是可独立部署的静态网站，正式域名设置为 **https://nova941.com**。包含 7 个页面、404 页面、所有图片、样式、站点地图和 Netlify 配置。不需要 ChatGPT 登录、Sites 服务、数据库、API key 或付费插件。

## 推荐：上传到 GitHub，交给 Netlify 自动部署

1. 解压 ZIP，打开解压后的文件夹。
2. 先备份你原来仓库里的网站；然后用本包作为该仓库的新网站内容。不要只把 ZIP 文件上传，也不要直接混入旧项目的 `package.json`、框架配置或重定向规则。
3. 将本文件夹内的 `site`、`scripts`、`routes.json`、`package.json`、`package-lock.json`、`netlify.toml`、`.gitignore`、`README.md`、`ASSETS.md` 放到仓库根目录。README 和 netlify.toml 应位于同一级。`dist` 是已生成的部署文件，可以不上传到 GitHub。
4. 在 Netlify 连接这个仓库。如果已经连接，提交更新即可触发部署。检查旧站设置是否仍指定旧目录或旧框架插件。
5. 部署设置：
   - Base directory：留空（如果文件位于仓库根目录）。
   - Build command：`npm run build`
   - Publish directory：`dist`
   - Node.js：22（配置文件已指定）。
   - 不需要额外环境变量。
6. 如果旧站配置了 Next.js 等框架专用插件，本包不需要这些插件；将站点按普通静态网站配置。不要配置 `/* → /index.html` 的 SPA 重写，否则未知页面和服务页面可能被错误处理。
7. 部署成功后，在 Netlify 域名设置中使用 `nova941.com` 作为主域名。如果它已经绑定同一个 Netlify 站点，通常无需改 DNS；如果尚未绑定，按 Netlify 为你的域名显示的记录配置。DNS 没有包含在本 ZIP 中，也没有被本次工作修改。
8. 在 Netlify 配好 www 到主域名的跳转和 HTTPS。主域名统一为非 www 的 `https://nova941.com`。

## 也可以手动部署

包内的 `dist` 已完成构建。可以将 **dist 文件夹内容**用于 Netlify 的静态文件手动部署。你现有的 GitHub 自动部署工作流建议优先使用上面的方式。

## 本地编辑及检查

- 页面内容：`site/index.html` 和 `site/**/index.html`，都是普通 HTML，可以直接修改文字。
- 样式：`site/styles.css`（保留现有网站编译后的完整样式）。
- 图片：`site/projects/`、`site/nova-art.png`、`site/same-sky.jpg`。
- 构建：`npm run build`
- 自动检查：`npm test`
- 本地预览：构建后运行 `python3 -m http.server 8080 --directory dist`，在浏览器打开 http://localhost:8080 。不要直接双击 HTML；网站使用以 `/` 开头的资源地址。

修改 `site` 后必须重新构建。不要只修改 dist，否则下次部署会被覆盖。

## 搜索收录行为

- 正式 production 构建允许搜索引擎抓取，canonical 和 sitemap 均使用 https://nova941.com 。允许抓取并不保证被收录或取得排名。
- Netlify Deploy Preview / Branch Deploy 构建会自动设置 noindex 和禁止抓取。
- 本地构建默认生成 production 文件。
- 若先部署到默认 netlify.app 地址，请尽快确认正式域名绑定；本站 canonical 始终指向你确认的正式域名。
- 正式域名生效后，再在 Search Console 提交 https://nova941.com/sitemap.xml 。本次没有连接 Search Console、Google Business Profile 或 Google Ads。

## 已实现与尚未接入

已实现：手机适配、导航、服务详情、服务区域、(206) 699-9000 点击拨号和短信入口、页面标题和描述、canonical、Organization 结构化数据、站点地图、robots.txt、404 页面。

未接入：联系表单、邮件发送、客户资料收集、GA4、Google Ads 转化追踪。点击电话只打开拨号应用，不会自动拨打；点击也不等于真实来电。

本版使用业主提供并确认归属的 NOVA Build 项目照片。施工中照片保留明确说明。未编造评分、资质、地点或案例。

隐私说明保持简洁，说明本站未主动添加分析或广告工具；以后加入表单或追踪时需要同步更新。

## 文件来源与现有预览

本包从现有 Nova Build 网站导出，并去除了私人预览提示和平台运行依赖。Sites 预览与此独立部署包分开管理。这个文件包尚未上传到你的 GitHub 或 Netlify，也没有自动替换旧网站。

Netlify 官方配置说明：https://docs.netlify.com/build/configure-builds/file-based-configuration/

## 2.0 更新
本包包含完整的 2.0 视觉升级，以及 Nova941.com、电话与短信入口、两张原有品牌图片。已替换为真实项目照片，保留施工阶段说明。

## 本次确认版本 · 2026-09-09
使用 IMG_7088 首屏照片、ROOM FOR WHAT’S NEXT. 标题，以及比例微调后的右侧竖排菜单。沿用原版 SVG 图标，不含已撤回的横排导航和新图标套装。IMG_5354 翻新前木色厨房照片已排除。

## 在 VS Code 的现有 GitHub 仓库更新
先保存现有工作并检查 Source Control 的未提交改动。复制本包的源文件到仓库根目录时，保留原仓库的 `.git` 文件夹；不要重新初始化仓库。若仓库原来是其他框架，先整理旧框架配置，避免混用。运行构建和检查后，在 Source Control 提交并推送到 Netlify 监听的分支。仅在 VS Code 保存文件不会更新网站，必须推送后由 Netlify 部署。
