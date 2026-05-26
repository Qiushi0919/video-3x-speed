<p align="center">
  <img src="images/icon-128.png" width="96" height="96" alt="Video 3x Speed icon">
</p>

<h1 align="center">Video 3x Speed</h1>

<p align="center">
  A polished Manifest V3 Chrome extension for keeping HTML5 videos at your preferred high-speed playback rate.
</p>

<p align="center">
  <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-246BFE?style=for-the-badge">
  <img alt="Chrome Ready" src="https://img.shields.io/badge/Chrome-ready-22C55E?style=for-the-badge">
  <img alt="Privacy First" src="https://img.shields.io/badge/privacy-no%20tracking-182033?style=for-the-badge">
</p>

<p align="center">
  <img src="store-assets/screenshot-1280x800.png" width="920" alt="Video 3x Speed product preview">
</p>

## Overview

Video 3x Speed gives every standard HTML5 video a focused speed control layer. It defaults to `3x`, keeps the chosen speed when pages try to reset playback rate, and includes a compact toolbar popup for quick adjustments.

The extension is intentionally small: no analytics, no remote code, no account system, and no background service doing extra work.

## Highlights

| Capability | Detail |
| --- | --- |
| Fast by default | New videos are set to `3x` automatically. |
| Persistent control | If a page resets playback speed, the extension applies your selected speed again. |
| Toolbar popup | Pause the extension or switch between preset speeds in one click. |
| Fine adjustment | Use the slider to choose any speed from `0.25x` to `5x`. |
| Privacy-first | Stores only the enable state and selected speed through Chrome storage. |

## Interface

<p align="center">
  <img src="store-assets/small-promo-440x280.png" width="440" alt="Video 3x Speed promotional tile">
</p>

The popup is designed to stay quiet and task-focused: one switch, one speed value, one slider, and four common presets.

## Real-World Usage

<p align="center">
  <img src="store-assets/usage-bilibili.png" width="920" alt="Video 3x Speed running on Bilibili">
</p>

On sites where the built-in player exposes only limited speed choices, Video 3x Speed can still apply a higher HTML5 playback rate through its own toolbar control.

## Icon Set

| 16px | 32px | 48px | 128px |
| --- | --- | --- | --- |
| <img src="images/icon-16.png" width="16" height="16" alt="16px icon"> | <img src="images/icon-32.png" width="32" height="32" alt="32px icon"> | <img src="images/icon-48.png" width="48" height="48" alt="48px icon"> | <img src="images/icon-128.png" width="64" height="64" alt="128px icon"> |

## Local Installation

1. Open `chrome://extensions/`.
2. Enable `Developer mode`.
3. Choose `Load unpacked`.
4. Select this project folder.

Select the root folder of this repository.

## Chrome Web Store Package

Build the upload package:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build.ps1
```

The Chrome Web Store upload file is created at:

```text
dist/video-3x-speed-chrome-web-store.zip
```

## Project Structure

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
`-- STORE_LISTING.md
```

## Privacy

Video 3x Speed does not collect, transmit, sell, or share user data. It only stores:

- whether the extension is enabled
- the selected playback speed

See [PRIVACY.md](PRIVACY.md) for the full privacy statement.

## Status

This repository contains the source code, listing copy, visual assets, and a store-ready ZIP build workflow for the Chrome Web Store submission process.
