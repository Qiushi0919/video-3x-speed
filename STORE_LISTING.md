# Chrome Web Store Listing Draft

## Name

Video Speed Freestyle by Qiushi

## Summary

Freestyle HTML5 video speed with global, per-tab, and hold-to-speed controls.

## Description

Video Speed Freestyle by Qiushi keeps HTML5 videos playing at your chosen speed. It defaults to 3x and includes a small toolbar popup for pausing the extension, choosing another playback rate, setting a current-tab-only speed, or setting the temporary speed used while holding the Right Arrow key.

The extension works locally in your browser. It does not collect analytics, browsing history, page content, video content, or personal data.

## Single purpose

Change HTML5 video playback speed on web pages.

## Permission justification

Storage permission is used only to remember whether the extension is enabled, which regular speed the user selected, and which temporary hold speed the user selected.

Active tab permission is used only when the toolbar popup is open, so the selected speed can be applied immediately to the current tab.

The content script runs on web pages so it can find HTML5 video elements and set their playback speed.

## Privacy practices

Data collection: None.

User data usage: The extension does not collect, transmit, sell, or share user data.
