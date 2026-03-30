# 实现蓝图

## 1. 最小可行实现

- 基于 Manifest V3 的浏览器扩展
- 内容脚本注入目标站点
- 通过 Adapter 层抽取消息节点
- 对消息应用安全性能增强
- 注入右侧时间轴

## 2. 建议文件结构

```text
src/
  adapters/
  background/
  core/
  options/
  performance/
  timeline/
  ui/
  manifest.json
scripts/
  build.mjs
tests/
```

## 3. Manifest 设计

- `content_scripts`：匹配 ChatGPT、Gemini、Claude
- `permissions`：`storage`
- `options_page`：暴露阈值配置
- `background`：初始化默认设置

## 4. 内容脚本职责

- 识别站点
- 扫描消息节点
- 生成摘要与标签
- 应用性能优化
- 渲染时间轴并绑定跳转

## 5. 性能优化路径

- 默认：`content-visibility` + contain + 惰性媒体 + 代码块折叠
- 观察器：DOM 变更节流刷新
- 实验能力：后续可加入更激进的消息冻结

## 6. 时间轴实现路径

- 每条消息映射为一个 timeline record
- 节点 hover 展示本地 excerpt
- 点击调用 `scrollIntoView`
- 滚动过程中按视口中心点更新 active 节点

## 7. 站点抽象方式

- `BaseAdapter` 定义统一接口
- `ChatGPTAdapter` / `GeminiAdapter` / `ClaudeAdapter` 提供选择器与角色识别
- `registry` 负责按 hostname 选型

## 8. 结论

- 首版以“可靠、轻依赖、可维护”为优先级
- 真正完全回收宿主页面内存并非插件可低风险解决的问题
- 但通过减少离屏渲染成本和历史消息展开成本，依然能显著改善长对话滚动体验
