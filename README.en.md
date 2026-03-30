# PrismRail

An open-source browser extension prototype for long conversations on ChatGPT, Gemini, Claude, DeepSeek, Doubao, GLM, and Grok.

It is designed to solve two main problems:

1. Long conversations become heavy and janky to scroll.
2. Historical messages are hard to revisit without an independent timeline navigator.

## Features

- Right-side timeline navigator with a fixed module length and 12 markers
- The 12 markers always represent the first turn, the 10% to 100% progress buckets, and the final reply end
- The rail length stays fixed and the markers remain evenly distributed on the center axis
- Hover preview based on local text excerpts, with no paid API required, and without tooltip flicker
- Safe long-thread performance optimizations
  - `content-visibility`
  - `contain`
  - oversized code block collapsing
  - lazy-loading hints for images
- Adapter-based support for ChatGPT, Gemini, Claude, DeepSeek, Doubao, GLM, and Grok
- Responsive behavior for desktop, phone, and iPad-sized viewports

## Project Structure

- `dist/extension/`
  Built extension output that can be loaded as an unpacked extension
- `src/`
  Source code for adapters, timeline, performance, background, and options
- `docs/`
  PRD, architecture, UI spec, QA checklist, and disclaimer
- `tests/`
  Native Node tests
- `scripts/build.mjs`
  Zero-dependency build script

## How To Test

### 1. Prepare the environment

- Install Node.js locally
- Run commands in the project root

### 2. Build the extension

```bash
npm run build
```

After the build finishes, the extension output will be available in [dist/extension](/Users/staklab/Desktop/Website——improve/dist/extension).

### 3. Run automated tests

```bash
npm test
```

This currently verifies:

- excerpt generation logic
- adapter registry and host matching logic

### 4. Run the full check

```bash
npm run check
```

This runs the build first and then the tests. It is the recommended pre-release check.

### 5. Manual testing

Recommended manual test flow:

1. Open a long conversation on ChatGPT, Gemini, Claude, DeepSeek, Doubao, GLM, or Grok.
2. Confirm that a separate right-side timeline appears and does not overlap the browser's native scrollbar.
3. Confirm the rail always renders 12 markers: the first turn, the 10% to 100% progress buckets, and the final reply end.
4. Click the first-turn and percentage markers and confirm they jump to the start of the mapped conversation segment. Click the final marker and confirm it jumps to the end of the final reply.
5. Click timeline nodes and confirm smooth jumps to the correct message.
6. Hover timeline nodes and confirm the local preview tooltip is stable and does not flicker.
7. Check long code blocks and confirm the expand/collapse behavior works correctly.
8. Resize the page to desktop, iPad, and narrow mobile widths and verify the layout still works.

## How To Use

### Chrome / Edge

1. Run:

```bash
npm run build
```

2. Open the browser extensions page.
3. Enable developer mode.
4. Choose "Load unpacked".
5. Select [dist/extension](/Users/staklab/Desktop/Website——improve/dist/extension).
6. Open a conversation page on ChatGPT, Gemini, Claude, DeepSeek, Doubao, GLM, or Grok.

### Safari

Safari cannot load this folder directly like Chrome. You need to convert the Web Extension into a Safari extension container before running it. The repository already contains the source and built output, but Safari still requires an extra packaging step.

## In-Page Usage

- A fixed-length timeline rail appears on the right side of the page.
- Click a node to jump to the related message.
- Hover a node to see a locally generated preview excerpt without tooltip flicker.
- On long conversations, the extension automatically applies safe optimization strategies.

## Options Page

The built output includes an options page:

- [dist/extension/options.html](/Users/staklab/Desktop/Website——improve/dist/extension/options.html)

You can configure:

- whether the extension is enabled
- the heavy-thread message threshold
- preview length
- whether long code blocks should collapse
- the default collapsed code block height

## Documentation Index

- [PRD](/Users/staklab/Desktop/Website——improve/docs/PRD.md)
- [Architecture](/Users/staklab/Desktop/Website——improve/docs/ARCHITECTURE.md)
- [UI Spec](/Users/staklab/Desktop/Website——improve/docs/UI-SPEC.md)
- [QA Checklist](/Users/staklab/Desktop/Website——improve/docs/QA-CHECKLIST.md)
- [Disclaimer](/Users/staklab/Desktop/Website——improve/docs/DISCLAIMER.md)
- [Privacy Policy](/Users/staklab/Desktop/Website——improve/docs/PRIVACY-POLICY.md)
- [Store Listing](/Users/staklab/Desktop/Website——improve/docs/STORE-LISTING.md)
- [Release Guide](/Users/staklab/Desktop/Website——improve/docs/RELEASE.md)

## Known Limitations

- If the target sites change their DOM structure, the adapters may need updates.
- Safari and mobile browser extension availability still depends on platform policy and browser version.
- The current strategy prioritizes safe optimization and does not aggressively rewrite large parts of the host page DOM.

## License

Released under the MIT License. See [LICENSE](/Users/staklab/Desktop/Website——improve/LICENSE).
