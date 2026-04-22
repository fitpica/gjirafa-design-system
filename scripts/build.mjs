import * as sass from 'sass';
import CleanCSS from 'clean-css';
import { writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'src/index.scss');
const DIST = resolve(ROOT, 'dist');
const SRC_FONTS = resolve(ROOT, 'src/fonts');
const DIST_FONTS = resolve(DIST, 'fonts');

// Ensure dist/ and dist/fonts/ exist
mkdirSync(DIST, { recursive: true });
mkdirSync(DIST_FONTS, { recursive: true });

console.log('Compiling SCSS...');

// 1. Compile SCSS → CSS
const result = sass.compile(SRC, {
  style: 'expanded',
  loadPaths: [resolve(ROOT, 'src')],
});

const css = result.css;
writeFileSync(resolve(DIST, 'gjirafa-ds.css'), css);
console.log(`  ✓ dist/gjirafa-ds.css (${(css.length / 1024).toFixed(1)} KB)`);

// 2. Minify
const minified = new CleanCSS({ level: 2 }).minify(css);
writeFileSync(resolve(DIST, 'gjirafa-ds.min.css'), minified.styles);
console.log(`  ✓ dist/gjirafa-ds.min.css (${(minified.styles.length / 1024).toFixed(1)} KB)`);

// 3. Copy fonts src/fonts/ → dist/fonts/ (and → docs/fonts/ so the docs page
//    resolves the @font-face URL without a network round-trip).
const fontFiles = readdirSync(SRC_FONTS);
for (const file of fontFiles) {
  copyFileSync(resolve(SRC_FONTS, file), resolve(DIST_FONTS, file));
}
console.log(`  ✓ dist/fonts/ (${fontFiles.length} file${fontFiles.length === 1 ? '' : 's'} copied)`);

// 4. Copy CSS + fonts to docs/ for self-contained docs page
const DOCS = resolve(ROOT, 'docs');
const DOCS_FONTS = resolve(DOCS, 'fonts');
mkdirSync(DOCS, { recursive: true });
mkdirSync(DOCS_FONTS, { recursive: true });
copyFileSync(resolve(DIST, 'gjirafa-ds.css'), resolve(DOCS, 'gjirafa-ds.css'));
for (const file of fontFiles) {
  copyFileSync(resolve(SRC_FONTS, file), resolve(DOCS_FONTS, file));
}
console.log(`  ✓ docs/gjirafa-ds.css + docs/fonts/ (copied)`);

// 5. Extract tokens to JSON
const tokens = extractTokens(css);
writeFileSync(resolve(DIST, 'tokens.json'), JSON.stringify(tokens, null, 2));
console.log(`  ✓ dist/tokens.json`);

console.log('\nBuild complete.');

// ---------------------------------------------------------------------------
// Token extraction — parses :root block from compiled CSS
// ---------------------------------------------------------------------------
function extractTokens(cssText) {
  const tokens = {
    colors: { foundation: {}, semantic: {} },
    spacing: {},
    radius: {},
    typography: {},
    shadows: {},
    components: { button: {}, input: {} },
  };

  // Match all custom properties from :root
  const rootMatch = cssText.match(/:root\s*(?:,\s*\[data-theme="codex"\]\s*)?\{([^}]+)\}/);
  if (!rootMatch) return tokens;

  const props = rootMatch[1].matchAll(/--([^:]+):\s*([^;]+);/g);
  for (const [, name, value] of props) {
    const v = value.trim();

    if (name.startsWith('color-'))       tokens.colors.foundation[`--${name}`] = v;
    else if (name.startsWith('action-') || name.startsWith('text-') || name.startsWith('surface-') || name.startsWith('border-') || name.startsWith('status-'))
      tokens.colors.semantic[`--${name}`] = v;
    else if (name.startsWith('space-'))  tokens.spacing[`--${name}`] = v;
    else if (name.startsWith('radius-')) tokens.radius[`--${name}`] = v;
    else if (name.startsWith('font-') || name.startsWith('line-height-'))
      tokens.typography[`--${name}`] = v;
    else if (name.startsWith('shadow-')) tokens.shadows[`--${name}`] = v;
    else if (name.startsWith('btn-'))    tokens.components.button[`--${name}`] = v;
    else if (name.startsWith('input-'))  tokens.components.input[`--${name}`] = v;
    else if (name.startsWith('icon-'))   tokens.spacing[`--${name}`] = v;
  }

  return tokens;
}
