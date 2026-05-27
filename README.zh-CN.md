<p align="center">
  <img src="images/icon-128.png" width="96" height="96" alt="Video Speed Freestyle by Qiushi 图标">
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a>
</p>

<h1 align="center">Video Speed Freestyle by Qiushi</h1>

<p align="center">
  一个精致、轻量的 Manifest V3 Chrome 扩展，用自己的控制面板随心调整网页 HTML5 视频倍速。
</p>

<p align="center">
  <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-246BFE?style=for-the-badge">
  <img alt="Chrome Ready" src="https://img.shields.io/badge/Chrome-ready-22C55E?style=for-the-badge">
  <img alt="Privacy First" src="https://img.shields.io/badge/privacy-no%20tracking-182033?style=for-the-badge">
</p>

<p align="center">
  <img src="store-assets/usage-bilibili.png" width="920" alt="Video Speed Freestyle by Qiushi 在 B 站上的实际使用效果">
</p>

## 项目简介

Video Speed Freestyle by Qiushi 会为标准 HTML5 视频加上一层简洁的倍速控制。默认使用 `3x`，当网页播放器尝试把倍速改回去时，扩展会重新应用你选择的速度。

它刻意保持小而干净：没有分析统计、没有远程代码、没有账号系统，也没有额外的后台服务。

## 功能亮点

| 能力 | 说明 |
| --- | --- |
| 默认高倍速 | 新检测到的视频会自动设置为 `3x`。 |
| 持续校正 | 如果网页播放器重置倍速，扩展会再次应用你选择的速度。 |
| 工具栏弹窗 | 可以一键暂停扩展，或快速切换常用倍速。 |
| 精细调节 | 支持通过滑块选择 `0.25x` 到 `5x`。 |
| 标签页独立倍速 | 一个标签页看网课高倍速，另一个标签页听歌保持正常速度。 |
| 长按加速 | 按住右方向键可以临时切到指定倍速，松开后恢复原来的设置。 |
| 隐私优先 | 只通过 Chrome 存储保存开关状态和倍速数值。 |

## 界面展示

<p align="center">
  <img src="store-assets/screenshot-1280x800.png" width="920" alt="Video Speed Freestyle by Qiushi 产品展示图">
</p>

<p align="center">
  <img src="store-assets/small-promo-440x280.png" width="440" alt="Video Speed Freestyle by Qiushi 宣传图">
</p>

弹窗界面保持克制和直接：一个开关、一个常规倍速控制、一个标签页独立覆盖、一个长按倍速控制，以及四个常用预设。

在一些网页播放器内置倍速选项有限的情况下，Video Speed Freestyle by Qiushi 仍然可以通过自己的工具栏控制，把 HTML5 视频应用到更高倍速。

## 图标集

| 16px | 32px | 48px | 128px |
| --- | --- | --- | --- |
| <img src="images/icon-16.png" width="16" height="16" alt="16px 图标"> | <img src="images/icon-32.png" width="32" height="32" alt="32px 图标"> | <img src="images/icon-48.png" width="48" height="48" alt="48px 图标"> | <img src="images/icon-128.png" width="64" height="64" alt="128px 图标"> |

## 本地安装

1. 打开 `chrome://extensions/`。
2. 开启 `开发者模式`。
3. 点击 `加载未打包的扩展程序`。
4. 选择这个仓库的根目录。

## Chrome 插件商店上传包

运行打包脚本：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build.ps1
```

Chrome Web Store 上传用的 ZIP 会生成在：

```text
dist/video-3x-speed-chrome-web-store.zip
```

## 项目结构

```text
video-3x-speed/
|-- manifest.json
|-- content.js
|-- popup.html
|-- popup.css
|-- popup.js
|-- images/
|-- store-assets/
|-- scripts/
|-- PRIVACY.md
|-- LICENSE
|-- README.zh-CN.md
`-- STORE_LISTING.md
```

## 隐私

Video Speed Freestyle by Qiushi 不会收集、传输、出售或分享用户数据。它只保存：

- 扩展是否开启
- 用户选择的播放倍速和长按倍速

完整隐私说明见 [PRIVACY.md](PRIVACY.md)。

## 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 状态

这个仓库包含 Chrome Web Store 提交流程所需的源代码、商店文案、视觉素材和可打包的上传 ZIP 工作流。
