# Store Listing Materials

This file contains ready-to-use listing drafts for GitHub, Chrome Web Store, and Microsoft Edge Add-ons.

## Product Name

PrismRail

## One-line Summary

Glass-style timeline navigation for long AI conversations.

## Short Description

Navigate long AI chats with a fixed 12-point timeline rail and smoother long-thread browsing.

## Long Description

PrismRail is a local-first browser extension designed for long conversations on AI chat websites such as ChatGPT, Gemini, Claude, DeepSeek, Doubao, GLM, and Grok.

It solves two common problems:

1. Long AI threads become slow and awkward to browse.
2. Important earlier context is hard to relocate by scrolling alone.

PrismRail adds a subtle glass-style timeline rail on the right side of the page. The rail always stays fixed in length and uses 12 markers:

- the first conversation turn
- progress anchors from 10% through 100%
- a final marker that jumps to the end of the latest reply

Key features:

- fixed 12-point timeline rail
- start-of-segment jumps for the first and percentage markers
- end-of-reply jump for the final marker
- local hover previews with no paid API dependency
- long-thread rendering optimizations
- support for desktop, iPad, and narrow mobile layouts
- local-first behavior with no PrismRail server dependency for core features

PrismRail is designed to feel present but unobtrusive, helping you move through very long AI conversations without taking over the original page.

## GitHub Description

PrismRail is a glass-style browser extension that adds a fixed timeline rail to long AI conversations and makes heavy chat pages easier to navigate.

## Suggested Topics

- browser-extension
- chrome-extension
- edge-extension
- ai-tools
- chatgpt
- claude
- gemini
- deepseek
- productivity
- webextension

## Chrome Web Store Category Suggestion

Productivity

## Microsoft Edge Add-ons Category Suggestion

Productivity

## Privacy Statement Summary For Listing

PrismRail processes supported conversation pages locally in the browser to build timeline navigation and local previews. It does not require an account, does not upload conversation content to a PrismRail backend, and does not use a remote AI API for its core features.

## Test Notes For Reviewers

1. Load the extension on a supported site with a long conversation.
2. Confirm the right-side rail renders 12 fixed markers.
3. Click the first marker and verify it jumps to the first conversation turn.
4. Click percentage markers and verify they jump to the start of the mapped segment.
5. Click the final marker and verify it jumps to the end of the latest reply.
6. Hover any marker and verify the preview tooltip is stable and does not flicker.

## Required/Recommended Assets

### Chrome Web Store

- Required: 128x128 icon
- Required: at least 1 screenshot, 1280x800 or 640x400
- Required: 440x280 small promo tile
- Optional: 1400x560 marquee promo tile

### Microsoft Edge Add-ons

- Required: extension logo
- Recommended: screenshots
- Optional but useful: 440x280 small promotional tile
- Optional: 1400x560 large promotional tile

## Suggested Screenshot List

1. Long conversation with PrismRail visible on the right side.
2. Hover preview tooltip over a percentage marker.
3. Jump result at the beginning of a mapped segment.
4. Final marker jump landing at the end of the latest reply.
5. Narrow-width responsive layout.
