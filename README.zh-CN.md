# PrismRail

面向 ChatGPT、Gemini、Claude、DeepSeek、豆包、GLM、Grok 等 LLM 在线对话页面的开源浏览器插件原型。

它主要解决两类问题：

1. 长对话页面越来越卡，滚动时掉帧、延迟、内存占用上升。
2. 历史消息难以快速定位，需要一个独立于浏览器原生滚动条的右侧时间轴。

## 核心功能

- 页面右侧时间轴导航，固定模块长度，节点固定为 12 个
- 12 个节点依次为：首对话、10% 到 100% 的进度节点、最后回复尾部
- 所有节点都沿中轴均匀分布，模块长度始终固定
- 独立悬浮预览，基于本地文本摘录，不依赖付费 API，并修复了鼠标悬浮频闪
- 安全优先的长对话性能优化
  - `content-visibility`
  - `contain`
  - 超长代码块折叠
  - 图片懒加载提示
- ChatGPT、Gemini、Claude、DeepSeek、豆包、GLM、Grok 的站点适配层
- 适配桌面端、手机端、iPad 视口

## 项目结构

- `dist/extension/`
  已构建的浏览器插件产物，可直接用于解包加载
- `src/`
  插件源码，包括 adapter、timeline、performance、background、options
- `docs/`
  PRD、架构、UI 规格、QA 清单、免责声明
- `tests/`
  Node 原生测试
- `scripts/build.mjs`
  无第三方依赖的构建脚本

## 如何测试

### 1. 环境准备

- 需要本地安装 Node.js
- 在项目根目录执行命令

### 2. 运行构建

```bash
npm run build
```

构建成功后，插件产物会生成在 [dist/extension](/Users/staklab/Desktop/Website——improve/dist/extension)。

### 3. 运行测试

```bash
npm test
```

这会执行当前仓库中的 Node 测试，验证：

- 文本摘录逻辑
- 站点 adapter 注册与识别逻辑

### 4. 一键检查

```bash
npm run check
```

这个命令会先构建，再执行测试，适合作为提交前检查。

### 5. 手动功能测试

建议至少做下面几组测试：

1. 打开 ChatGPT、Gemini、Claude、DeepSeek、豆包、GLM 或 Grok 中任意一个长对话页面。
2. 确认页面右侧出现固定长度的独立时间轴，且没有和浏览器原生滚动条重叠。
3. 确认节点固定为 12 个，依次是首对话、10% 到 100% 的进度节点，以及最后回复尾部。
4. 点击首对话到 100% 节点时，确认跳转到对应对话段落的开头；点击最后尾部节点时，确认跳转到最后一段回复的尾部。
5. 点击时间轴节点，确认页面能平滑跳转到对应消息。
6. 鼠标悬浮到节点，确认本地预览摘要稳定显示且不频闪。
7. 在超长代码块消息中确认“展开代码/收起代码”行为正常。
8. 在桌面宽屏、iPad 尺寸、手机窄屏下观察时间轴布局是否仍可用。

## 如何使用

### Chrome / Edge

1. 先执行：

```bash
npm run build
```

2. 打开浏览器扩展管理页。
3. 开启“开发者模式”。
4. 选择“加载已解压的扩展程序”。
5. 选择目录 [dist/extension](/Users/staklab/Desktop/Website——improve/dist/extension)。
6. 打开 ChatGPT、Gemini、Claude、DeepSeek、豆包、GLM 或 Grok 的对话页面开始使用。

### Safari

Safari 不能像 Chrome 一样直接加载这个目录，需要先将 Web Extension 转换为 Safari 扩展容器后再运行。当前仓库已经提供了浏览器扩展源码和构建产物，但 Safari 还需要额外打包流程。

## 使用方式

### 页面内

- 页面右侧会出现固定长度的时间轴导航栏。
- 点击节点可以跳转到对应消息位置。
- 悬浮节点可以查看本地摘录出来的预览内容，预览层独立渲染，不会因 hover 抖动产生频闪。
- 当对话很长时，插件会自动应用安全的性能优化策略。

### 设置页

当前构建产物里包含设置页：

- [dist/extension/options.html](/Users/staklab/Desktop/Website——improve/dist/extension/options.html)

你可以在扩展的设置页中调整：

- 是否启用插件
- 进入重负载模式的消息阈值
- 摘录长度
- 是否折叠超长代码块
- 代码块默认折叠高度

## 文档索引

- [PRD](/Users/staklab/Desktop/Website——improve/docs/PRD.md)
- [Architecture](/Users/staklab/Desktop/Website——improve/docs/ARCHITECTURE.md)
- [UI Spec](/Users/staklab/Desktop/Website——improve/docs/UI-SPEC.md)
- [QA Checklist](/Users/staklab/Desktop/Website——improve/docs/QA-CHECKLIST.md)
- [Disclaimer](/Users/staklab/Desktop/Website——improve/docs/DISCLAIMER.md)
- [Privacy Policy](/Users/staklab/Desktop/Website——improve/docs/PRIVACY-POLICY.md)
- [Store Listing](/Users/staklab/Desktop/Website——improve/docs/STORE-LISTING.md)
- [Release Guide](/Users/staklab/Desktop/Website——improve/docs/RELEASE.md)

## 已知限制

- 目标站点 DOM 结构如果变更，插件可能需要更新 adapter。
- Safari 和移动端浏览器是否支持安装扩展，取决于各平台政策与版本。
- 当前策略以“安全优化”为主，不会强行重写宿主网站的大段 DOM。

## 许可证

项目基于 MIT License 发布，详见 [LICENSE](/Users/staklab/Desktop/Website——improve/LICENSE)。
