# PrismRail

[![License](https://img.shields.io/badge/license-MIT-111827.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-v0.1.0-2563eb.svg)](./CHANGELOG.md)
[![Check](https://img.shields.io/github/actions/workflow/status/staklab/PrismRail/check.yml?branch=main&label=check)](https://github.com/staklab/PrismRail/actions/workflows/check.yml)
[![Issues](https://img.shields.io/github/issues/staklab/PrismRail)](https://github.com/staklab/PrismRail/issues)

**Language / 语言**

[English](#en) | [中文](#zh)

A modern glass-style browser extension for navigating long AI conversations.  
一个用于长 AI 对话导航的现代玻璃风格浏览器插件。

[Issues](https://github.com/staklab/PrismRail/issues) · [Pull Requests](https://github.com/staklab/PrismRail/pulls) · [Contributing](./CONTRIBUTING.md) · [Changelog](./CHANGELOG.md)

<a id="en"></a>
## English

Switch language: [English](#en) | [中文](#zh)

### Overview

PrismRail adds a subtle timeline rail to the right side of long AI chat pages, helping users move through large conversations without relying only on the native scrollbar.

### Highlights

- Fixed-length glass timeline with **12 markers**
- Marker model:
  - first conversation turn
  - 10% to 100% progress anchors
  - end of the latest reply
- Start and percentage markers jump to the **start** of the mapped segment
- Final marker jumps to the **end** of the latest reply
- Stable local hover previews with no paid API
- Long-thread optimizations for smoother browsing
- Low-profile UI designed to blend into existing chat interfaces

### Supported Sites

- ChatGPT
- Gemini
- Claude
- DeepSeek
- Doubao
- GLM
- Grok

### Quick Start

```bash
npm install
npm run build
```

Then load `dist/extension` as an unpacked extension in Chrome or Edge.

### Contributing

Contributions are welcome.

- Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- Open an issue first for large changes
- Keep pull requests focused and easy to review

### Issues

Use GitHub Issues for bug reports, compatibility problems, adapter requests, and feature ideas.

- [Open a new issue](https://github.com/staklab/PrismRail/issues/new/choose)
- [Browse existing issues](https://github.com/staklab/PrismRail/issues)

### FAQ

**Does PrismRail send conversation content to a remote API?**  
No. Timeline previews are generated locally from page content.

**Is the extension intended to replace the native chat UI?**  
No. PrismRail is meant to stay lightweight and unobtrusive.

**Which browsers are supported?**  
The current release is built around Chromium-based browsers. Safari still requires a separate packaging flow.

### Documentation

- [Contributing](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
- [Support](./SUPPORT.md)
- [Changelog](./CHANGELOG.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [UI Spec](./docs/UI-SPEC.md)
- [PRD](./docs/PRD.md)
- [Privacy Policy](./docs/PRIVACY-POLICY.md)
- [Disclaimer](./docs/DISCLAIMER.md)
- [Release Guide](./docs/RELEASE.md)
- [GitHub Setup](./docs/GITHUB-SETUP.md)

### License

Released under the MIT License. See [LICENSE](./LICENSE).

---

<a id="zh"></a>
## 中文

切换语言：[English](#en) | [中文](#zh)

### 项目简介

PrismRail 是一个为长 AI 对话页面设计的右侧时间轴导航插件。它以尽量低打扰的方式融入 ChatGPT、Claude、Gemini 等页面，帮助用户在超长对话里快速定位、跳转和回溯上下文。

### 核心特性

- 固定长度的玻璃感时间轴，始终为 **12 个节点**
- 节点模型固定为：
  - 首对话
  - 10% 到 100% 的进度锚点
  - 最后一段回复的尾部
- 首节点和百分比节点跳转到对应内容段的**开头**
- 末节点跳转到最后一段回复的**结尾**
- 悬浮预览基于本地文本摘录，无需付费 API
- 针对长对话提供性能优化，减少浏览负担
- UI 风格尽量融入原页面，降低突兀感

### 已支持站点

- ChatGPT
- Gemini
- Claude
- DeepSeek
- 豆包
- GLM
- Grok

### 快速开始

```bash
npm install
npm run build
```

构建完成后，将 `dist/extension` 作为已解压扩展加载到 Chrome 或 Edge。

### 贡献

欢迎提交代码、文档优化、Bug 修复以及站点适配改进。

- 开始前请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)
- 如果是较大的改动，建议先提 Issue 再开始实现
- PR 尽量聚焦单一目标，方便 review

### Issues

Bug、兼容性问题、站点适配请求和功能建议都可以通过 GitHub Issues 提交。

- [提交新 Issue](https://github.com/staklab/PrismRail/issues/new/choose)
- [查看现有 Issues](https://github.com/staklab/PrismRail/issues)

### FAQ

**PrismRail 会把对话内容发送到远程 API 吗？**  
不会。时间轴预览基于页面本地内容生成。

**这个扩展会替代原网站的聊天界面吗？**  
不会。PrismRail 的定位是轻量、低侵入的导航层。

**当前支持哪些浏览器？**  
目前主要面向 Chromium 系浏览器。Safari 仍需要单独的打包流程。

### 文档入口

- [贡献指南](./CONTRIBUTING.md)
- [行为准则](./CODE_OF_CONDUCT.md)
- [安全策略](./SECURITY.md)
- [支持说明](./SUPPORT.md)
- [更新日志](./CHANGELOG.md)
- [技术架构](./docs/ARCHITECTURE.md)
- [UI 规格](./docs/UI-SPEC.md)
- [PRD](./docs/PRD.md)
- [隐私政策](./docs/PRIVACY-POLICY.md)
- [免责声明](./docs/DISCLAIMER.md)
- [发布说明](./docs/RELEASE.md)
- [GitHub 仓库设置建议](./docs/GITHUB-SETUP.md)

### 许可证

项目基于 [MIT License](./LICENSE) 发布。
