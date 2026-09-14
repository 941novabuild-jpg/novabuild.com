# Nova941 网站更新包 · 2026-09-14

包含当前确认的首页、五个分类页、照片墙、图片放大/缩放、厨房与浴室对比滑块，以及原有页面链接
正式域名 https://nova941.com · 电话 (206) 699-9000

## 推荐：通过现有 GitHub → Netlify 更新

1. 先备份现在的 GitHub 仓库文件，确认 VS Code 打开的是通过 Git Clone 获得的仓库
2. 将这个文件夹里面的所有内容复制到仓库根目录，覆盖同名文件，不要把整个外层文件夹放进去，不要删除仓库原有的 .git 文件夹
3. 本包中的 site 和 dist 都应完整替换旧的同名目录，不要只复制几张图片；其他业务文件如 scanner、clients 不要删除
4. 在 VS Code 终端运行：

```sh
npm run build
npm run verify
git status
git add site dist scripts routes.json package.json package-lock.json netlify.toml README.md .gitignore
git commit -m "Update Nova941 website September 14"
git push origin main
```

如出现 Git 合并冲突或身份验证错误，先停止，不要 force push，把错误发给 GPT 处理

5. Netlify 项目使用同一仓库，Production branch 为 main
   - Base directory：留空（网站在仓库根目录时）
   - Build command：npm run build
   - Publish directory：dist
   - Node.js：22
6. 等待 Netlify 显示 Published，再打开 Nova941.com 刷新检查

本包无 npm 依赖，不需要安装 React、运行后端或设置环境密钥
本包已附带匹配的 package-lock.json，请一起覆盖根目录旧锁文件；不要删除其他应用的锁文件

## 也可以手动上传

打开现有 Netlify 项目的 Deploys 页面，将本包里的 dist 文件夹拖入手动部署区域
上传的是 dist 里面以 index.html 开始的网站文件，不是整个源码文件夹
GitHub 自动部署仍连接时，之后 push 会再次覆盖手动上传版本，因此优先同步仓库

## 文件说明

- site：可复用的静态网站源文件，包含 HTML、照片、CSS、JS 和 .rsc 文件
- dist：已经生成的 Netlify 发布目录
- scripts：无依赖的复制构建与完整性检查
- netlify.toml：Netlify 构建配置

请保留 _next、comparisons、projects、images、所有 JS/CSS 和 .rsc 文件，删除它们会破坏照片放大和对比功能
页面文字可在 site 对应 HTML 中查看，但交互内容也包含编译数据；后续修改优先回到本对话统一重新导出，避免仅改 HTML 造成加载后内容不一致

网站未接入新的表单、广告像素或 Analytics
施工中照片保留现场状态；旧 study 路径保留且不加入搜索引擎 sitemap

## 发布后检查

- 首页厨房全景仅出现一次，Project Photos 只有一组分类入口
- 五个分类可从顶部互相切换
- Tile 有照片墙，照片可点开、缩放、切换和关闭
- Kitchen 两组对比、Bathroom 一组对比可拖动，箭头键与重置可用
- 手机无横向溢出，Call/Text 按钮正常

本包来自已确认源版本 12f78a0b780109abe91327524c437215cf3179ff，导出时仅做 Netlify 静态运行与正式域名适配
