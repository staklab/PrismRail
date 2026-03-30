# 测试与发布流程

## 1. 本地测试前准备

1. 确认本地安装了 Node.js。
2. 进入项目根目录。
3. 执行：

```bash
npm run check
```

该命令会重新构建 `dist/extension`，并执行自动化测试。

如果要生成可直接上传到商店后台的压缩包，再执行：

```bash
npm run package
```

输出位置：

- `dist/packages/prismrail-v0.1.0-chromium.zip`

## 2. 自动化测试范围

当前自动化测试覆盖：

- 文本摘录逻辑
- 站点适配器注册与域名匹配
- 12 节点时间轴采样逻辑
- 尾部节点激活逻辑

## 3. 手动功能测试流程

建议至少在以下站点各测 1 次长对话页面：

- ChatGPT
- Gemini
- Claude
- DeepSeek
- 豆包
- GLM
- Grok

手动检查项：

1. 页面右侧是否出现固定长度的时间轴。
2. 时间轴是否与浏览器原生滚动条错开。
3. 节点是否固定为 12 个。
4. 第 1 个节点是否跳转到首对话开头。
5. 10% 到 100% 节点是否跳转到对应内容分段的开头。
6. 最后一个节点是否跳转到最后回复的尾部。
7. 悬浮预览是否稳定显示且不频闪。
8. 长代码块的折叠/展开是否正常。
9. 桌面宽屏、iPad 宽度、手机窄屏下布局是否仍然可用。

## 4. Chrome / Edge 解包测试

1. 执行：

```bash
npm run build
```

2. 打开浏览器扩展管理页。
3. 开启开发者模式。
4. 选择“加载已解压的扩展程序”。
5. 选择目录：

`dist/extension`

6. 打开目标 LLM 网站长对话页面进行测试。

## 5. Safari 测试

Safari 不能直接加载 `dist/extension`，需要先通过 Safari Web Extension 流程转换为 Safari 扩展容器，再使用 Xcode 运行与调试。

## 6. GitHub 发布建议流程

1. 运行：

```bash
npm run check
```

2. 确认以下目录和文件已更新：

- `dist/extension/`
- `src/icons/`
- `README.md`
- `docs/`

3. 建议同时发布以下文档：

- `README.md`
- `CONTRIBUTING.md`
- `docs/PRIVACY-POLICY.md`
- `docs/STORE-LISTING.md`
- `docs/DISCLAIMER.md`

4. 如果本地还没有 git 仓库，可执行：

```bash
git init -b main
git add .
git commit -m "Initial release: PrismRail v0.1.0"
```

5. 在 GitHub 创建一个空仓库后，可执行：

```bash
git remote add origin <你的-github-仓库-url>
git push -u origin main
```

6. 建议开启 GitHub Pages，用来公开托管隐私政策与发布文档。

推荐方式：

1. 进入 GitHub 仓库的 `Settings > Pages`
2. Source 选择 `Deploy from a branch`
3. Branch 选择 `main`
4. Folder 选择 `/docs`

这样你可以把以下页面作为公开 URL 提交到商店后台：

- `https://<你的用户名>.github.io/<你的仓库名>/privacy-policy.html`
- `https://<你的用户名>.github.io/<你的仓库名>/`

7. 在 GitHub 仓库中建议附带以下内容：

- 项目名称：`PrismRail`
- 项目简介：长 AI 对话页面的玻璃感时间轴导航插件
- 演示截图
- 解包安装方式
- 支持站点列表
- 已知限制
- 免责声明

8. 如果准备打浏览器商店包，建议额外准备：

- 128px 与 512px 图标
- 商店封面图 / 截图
- 简短描述与详细描述
- 隐私声明

## 7. Chrome Web Store 提交流程

1. 准备压缩包：`npm run package`
2. 打开 Chrome Developer Dashboard。
3. 上传 `dist/packages/` 下的 zip 文件。
4. 填写：

- Store Listing
- Privacy
- Distribution
- Test Instructions

5. 上传素材：

- 128x128 图标
- 至少 1 张 1280x800 或 640x400 截图
- 440x280 small promo tile
- 可选 1400x560 marquee tile

官方参考：

- Chrome Web Store 发布流程：
  [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish/)
- Chrome 图片规范：
  [Supplying Images](https://developer.chrome.com/docs/webstore/images/)
- Chrome Store Listing 字段：
  [Complete your listing information](https://developer.chrome.com/docs/webstore/cws-dashboard-listing/)
- Chrome 开发者政策：
  [Program Policies](https://developer.chrome.com/docs/webstore/program-policies/policies)

## 8. Microsoft Edge Add-ons 提交流程

1. 准备压缩包：`npm run package`
2. 登录 Microsoft Partner Center。
3. 创建新的 extension submission。
4. 上传 zip 包。
5. 填写：

- Availability
- Properties
- Store listings
- Notes for certification

6. 上传素材：

- logo
- small promotional tile
- 可选 large promotional tile
- 可选 screenshots
- privacy policy link

官方参考：

- Edge 发布流程：
  [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)
- Edge 发布概览与所需材料：
  [Overview of Microsoft Edge extensions](https://learn.microsoft.com/en-us/microsoft-edge/extensions/)

## 9. 当前仓库已准备好的商店资产

- 隐私政策：
  [docs/PRIVACY-POLICY.md](/Users/staklab/Desktop/Website——improve/docs/PRIVACY-POLICY.md)
- 商店文案：
  [docs/STORE-LISTING.md](/Users/staklab/Desktop/Website——improve/docs/STORE-LISTING.md)
- 小宣传图：
  [assets/store/prismrail-promo-440x280.png](/Users/staklab/Desktop/Website——improve/assets/store/prismrail-promo-440x280.png)
- 宽横幅：
  [assets/store/prismrail-marquee-1400x560.png](/Users/staklab/Desktop/Website——improve/assets/store/prismrail-marquee-1400x560.png)
- 扩展图标：
  [src/icons/prismrail-128.png](/Users/staklab/Desktop/Website——improve/src/icons/prismrail-128.png)
  [src/icons/prismrail-512.png](/Users/staklab/Desktop/Website——improve/src/icons/prismrail-512.png)

## 10. 当前图标资产

源码图标：

- `src/icons/prismrail.svg`

位图图标：

- `src/icons/prismrail-16.png`
- `src/icons/prismrail-32.png`
- `src/icons/prismrail-48.png`
- `src/icons/prismrail-128.png`
- `src/icons/prismrail-256.png`
- `src/icons/prismrail-512.png`
- `src/icons/prismrail-1024.png`

构建后会自动复制到：

- `dist/extension/icons/`
