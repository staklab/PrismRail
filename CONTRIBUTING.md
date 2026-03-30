# Contributing

Thanks for contributing to PrismRail.

## Local development

1. Run `npm run check`.
2. Load `dist/extension` as an unpacked extension in Chrome or Edge.
3. Test at least one supported LLM site before opening a pull request.

## Pull request expectations

- Keep permissions minimal.
- Avoid remote code and remote execution.
- Preserve the extension's local-first privacy model.
- Update docs when behavior, supported sites, or release steps change.

## Manual verification checklist

- Timeline still renders 12 markers.
- Start and percentage markers jump to segment starts.
- End marker jumps to the end of the final reply.
- Hover preview is stable and does not flicker.
- Long-thread performance does not regress on supported sites.
