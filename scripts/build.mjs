import * as sass from 'sass';
import CleanCSS from 'clean-css';
import { writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

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

// 5. Design tokens (W3C DTCG 2025.10): regenerate tokens/ from SCSS, prove the
//    JSON resolves to exactly the compiled CSS for every theme, then bundle
//    dist/tokens.json. The old extractor matched no --gds-* names, so it wrote
//    an empty file.
for (const step of ['extract', 'check', 'bundle']) {
  execFileSync(process.execPath, [resolve(__dirname, 'tokens.mjs'), step], { stdio: 'inherit' });
}

// 6. AI guide: regenerate the component sections of brand.md from components/*.json
execFileSync(process.execPath, [resolve(__dirname, 'brand.mjs'), 'write'], { stdio: 'inherit' });

// 7. Claude Code plugin: regenerate version, lint copy, data and component docs
execFileSync(process.execPath, [resolve(__dirname, 'plugin.mjs'), 'write'], { stdio: 'inherit' });

// 8. Docs for AI agents: docs/llms.txt, docs/llms-full.txt, docs/md/components/*.md
execFileSync(process.execPath, [resolve(__dirname, 'llms.mjs'), 'write'], { stdio: 'inherit' });

console.log('\nBuild complete.');
