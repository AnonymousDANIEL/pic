# VIP Poster Studio

可正式部署的宣传图自动生成器。用户可在浏览器中上传 Logo、人物、背景与银行 Logo 条，实时编辑金额、日期、标题、颜色、描边、阴影和位置，并导出真实 **1254 × 1254 px** 的 JPG 或 PNG。

所有上传图片都只在当前浏览器本地处理，不会上传到服务器；第一版不需要数据库。

## 功能

- Company Logo、左右 Game Logo、人物、背景、Bank Logo Bar 独立上传
- 人物、Logo、资料卡、标题、`CUCI`、`RM Amount` 可直接拖动和四角缩放
- Master Amount 同步 Withdraw、Success、Headline 三种不同格式
- `CUCI` 与 `RM Amount` 是独立 Canvas Layer，可分别修改颜色、描边和阴影
- Solid、Gold Gradient、Silver Gradient 金额样式
- 日期、时间和 Use Current Time
- 浏览器 localStorage Preset、自动恢复与安全的储存空间错误处理
- JPG 80–100% Quality、PNG、一键导出和自动文件名
- 手机与电脑响应式界面
- 缺少默认素材时自动显示可用的 Canvas Placeholder，不会白屏

## Installation

要求 Node.js 20.9 或以上版本。

```bash
npm install
```

## Development

```bash
npm run dev
```

打开终端显示的本地网址。代码修改后网页会自动刷新。

## Build 与运行

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

`npm start` 会读取平台提供的 `PORT` 环境变量；代码没有写死 localhost 端口。

## Railway Deployment

### 最简单：GitHub 网页直接上传（支持全部文件放在根目录）

如果你不使用 Git 命令，请下载专用的 `vip-poster-studio-GITHUB-DIRECT-UPLOAD.zip`：

1. 先在电脑上 **解压 ZIP**，不要把 ZIP 文件本身上传到 GitHub。
2. 打开解压后的 `UPLOAD-ALL-FILES` 文件夹。
3. 在 GitHub Repository 点击 **Add file → Upload files**。
4. 把该文件夹里面的 **所有文件一次过拖进去**，然后 Commit changes。
5. Railway 会执行 `npm run build`；系统会自动把根目录文件恢复成 Next.js 所需的 `app/`、`components/`、`lib/` 和 `types/` 目录。

即使 GitHub 页面看起来像这样，所有 `.tsx`、`.ts` 文件都位于根目录，也可以正常部署；不要漏掉 `prepare-project.mjs`、`package.json` 或任何源码文件。

### 标准 Git Push

1. 在 GitHub 新建一个空 Repository，不要勾选自动创建 README。
2. 在本项目目录执行：

   ```bash
   git add .
   git commit -m "Initial production poster studio"
   git remote add origin https://github.com/YOUR_NAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

3. 登录 Railway，选择 **New Project → Deploy from GitHub repo**。
4. 授权 GitHub，并选择刚才的 Repository。
5. Railway 一般会自动识别以下命令；如需手动填写：

   - Build Command：`npm run build`
   - Start Command：`npm start`

6. 部署成功后进入项目的 **Settings / Networking**，选择 **Generate Domain**，即可获得公开 HTTPS 地址。
7. 以后每次 Push 到已连接的 GitHub 分支，Railway 会自动重新 Build 和 Deploy，网页会自动更新。

## Folder Structure

```text
app/                         Next.js 页面、Metadata 与全局样式
components/PosterStudio.tsx  应用状态、上传、Preset、导出流程
components/editor/           左侧 Accordion 编辑面板
components/canvas/           1254 × 1254 Konva 分层画布
lib/amount.ts                安全金额格式化
lib/defaultPoster.ts         Template 1 默认配置
lib/storage.ts               localStorage Preset 与 Autosave
types/poster.ts              PosterConfig 与所有类型
public/assets/               可替换的默认图片素材
```

## How to Replace Default Assets

把素材放入 `public/assets/`，使用以下文件名：

```text
company-logo.png
game-left.png
game-right.png
person.png
background.jpg
bank-bar.png
```

PNG、JPG、JPEG 和 WEBP 均可从网页后台临时上传。`person.png` 建议使用透明背景 PNG。默认素材不存在时，系统会自动使用内置 Canvas Placeholder。

## Environment Variables

当前版本不需要任何环境变量即可运行。`.env.example` 预留未来人物去背服务：

```text
PERSON_IMAGE_API_URL=
PERSON_IMAGE_API_KEY=
```

未设置这些变量不会影响普通人物上传、预览或导出。

## Troubleshooting

- **上传后没有显示**：确认格式为 PNG/JPG/JPEG/WEBP，且文件不超过 12MB。
- **刷新后上传图片消失**：这是预期的隐私设计；图片只保留当前 Session，文字、颜色与位置会自动保存。
- **导出失败**：尝试换用较小的图片，或刷新页面后重新上传。按钮在错误后会自动恢复。
- **Railway Build 失败**：确认 Node.js 版本符合 `package.json` 的 `engines`，Build/Start Command 与上方一致。
- **Railway 显示 `Cannot find module '@/lib/amount'`**：旧上传包的文件夹被压平了。使用新的 GitHub Direct Upload 包覆盖上传；`prepare-project.mjs` 会在 Build 前自动恢复目录。
- **背景太抢眼**：在 Background 中提高 Dark Overlay，或降低 Brightness、增加 Blur。
