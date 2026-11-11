# GDS design tokens (W3C DTCG 2025.10)

Machine-readable tokens for tools and AI agents, in the [Design Tokens Community Group format 2025.10](https://www.designtokens.org/tr/2025.10/).

| File | What it holds |
|---|---|
| `foundation.tokens.json` | Raw palette, spacing, radius, type, shadow, motion, z-index (129 tokens) |
| `semantic.tokens.json` | Meaning-based tokens for the default theme (codex). They alias foundation tokens, e.g. `color.text.primary` → `{color.neutral.700}` |
| `themes/vpplayer.tokens.json` | The 5 tokens that differ in the VP Player theme |
| `gds.resolver.json` | Resolver: foundation + semantic, then the `theme` modifier (`codex` default, `vpplayer`) |

Every token carries `$extensions["com.gjirafa.gds"]` with its CSS custom property (`cssVar`) and SCSS source variable (`scss`).

## Source of truth

For now **SCSS is the source** (`src/tokens`, `src/themes`, written by `npm run figma:sync`). These files are generated from it:

```bash
npm run tokens        # SCSS → tokens/*.json
npm run test:tokens   # resolve each theme and compare every --gds-* value with the compiled CSS
```

`npm run build` runs both and writes `dist/tokens.json` (one file, default theme). Do not edit these JSON files by hand; change the SCSS and regenerate.

## Known gaps

DTCG 2025.10 has no type for four values, so they are kept as raw CSS under `$extensions["com.gjirafa.gds"].unstandardTokens` in `foundation.tokens.json`:

- `--gds-letter-spacing-tight` / `-normal` / `-wide` (em units; DTCG dimensions allow px and rem only)
- `--gds-scroll-shadow-rgb` (an `r, g, b` triple used inside `rgba()`)

Component tokens (`--btn-*`, `--table-*`, …) are not exported yet.
