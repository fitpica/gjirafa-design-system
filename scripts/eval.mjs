/**
 * AI evals: can Claude Code, with the GDS plugin, build real screens correctly?
 *
 *   node scripts/eval.mjs                     run every task in evals/tasks/
 *   node scripts/eval.mjs all-entries settings run some tasks
 *   node scripts/eval.mjs --grade <dir>       only grade an existing output folder
 *
 * For each task: a fresh empty project, `claude -p` with the plugin from plugins/gds,
 * then the produced index.html is graded:
 *   - lint against the component contracts (problems = 0 to pass)
 *   - axe WCAG 2.2 AA in Chromium with the local CSS (violations = 0 to pass)
 *   - sans-serif base font, screenshot, classes not covered by a contract
 * Results: evals/results/<timestamp>/<task>/ (git-ignored) and a summary table.
 *
 * Needs the Claude Code CLI signed in (or ANTHROPIC_API_KEY). Costs roughly $0.30–0.80 per task.
 * Not run in CI by default for that reason.
 */

import { execFileSync, spawnSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, mkdtempSync, copyFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { compiledClasses, loadContracts } from './components.mjs';
import { createLinter } from './lib/lint-core.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TASKS = resolve(ROOT, 'evals/tasks');
const linter = createLinter({ cssClasses: [...compiledClasses()], contracts: loadContracts().map(c => c.data) });
const CSS = readFileSync(resolve(ROOT, 'docs/gjirafa-ds.css'), 'utf8');

async function grade(dir) {
  const file = join(dir, 'index.html');
  if (!existsSync(file)) return { pass: false, error: 'no index.html produced' };
  const html = readFileSync(file, 'utf8');
  const problems = linter.lint(html, { lenient: true });
  const uncovered = linter.uncovered(html);
  const gdsLink = /cdn\.jsdelivr\.net\/gh\/fitpica\/gjirafa-design-system@v[\d.]+\/docs\/gjirafa-ds\.css/.test(html);
  const customRules = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].reduce((n, m) => n + (m[1].match(/\{/g) || []).length, 0);

  const { chromium } = await import('@playwright/test');
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const local = html.replace(/<link[^>]+gjirafa-ds\.css[^>]*>/, `<style>${CSS}</style>`).replace(/<style>/, '<style>*,*::before,*::after{animation:none!important;transition:none!important}</style><style>');
  await page.setContent(local, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  await page.screenshot({ path: join(dir, 'shot.png'), fullPage: true });
  await browser.close();

  const violations = axe.violations.map(v => ({ id: v.id, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
  const sans = !/^\s*("?Times|serif)/i.test(font);
  return {
    pass: problems.length === 0 && violations.length === 0 && sans && gdsLink,
    lintProblems: problems, axeViolations: violations, baseFontSansSerif: sans, gdsCdnLink: gdsLink,
    customCssRules: customRules, uncoveredClasses: uncovered,
  };
}

function runClaude(task, prompt, dir) {
  execFileSync('git', ['init', '-q'], { cwd: dir });
  writeFileSync(join(dir, 'README.md'), '# CMS prototype\n');
  const args = ['-p', '--plugin-dir', resolve(ROOT, 'plugins/gds'), '--permission-mode', 'acceptEdits', '--output-format', 'json',
    `${prompt}\n\nWrite the file to ${join(dir, 'index.html')}. When done, reply with one short paragraph.`];
  const r = spawnSync('claude', args, { cwd: dir, encoding: 'utf8', input: '', maxBuffer: 64 * 1024 * 1024, timeout: 15 * 60 * 1000 });
  let meta = {};
  try { const j = JSON.parse(r.stdout); meta = { cost: j.total_cost_usd, turns: j.num_turns, result: (j.result || '').slice(0, 2000) }; } catch { meta = { error: (r.stderr || r.stdout || '').slice(0, 2000) }; }
  return meta;
}

const argv = process.argv.slice(2);
if (argv[0] === '--grade') {
  const g = await grade(resolve(argv[1]));
  console.log(JSON.stringify(g, null, 2));
  process.exit(g.pass ? 0 : 1);
}

const all = readdirSync(TASKS).filter(f => f.endsWith('.md')).map(f => f.slice(0, -3)).sort();
const tasks = argv.length ? argv : all;
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outRoot = resolve(ROOT, 'evals/results', stamp);
const rows = [];
for (const task of tasks) {
  if (!all.includes(task)) { console.error(`Unknown task "${task}". Available: ${all.join(', ')}`); process.exit(1); }
  const work = mkdtempSync(join(tmpdir(), `gds-eval-${task}-`));
  console.log(`▶ ${task} (in ${work})`);
  const meta = runClaude(task, readFileSync(join(TASKS, `${task}.md`), 'utf8'), work);
  const out = join(outRoot, task);
  mkdirSync(out, { recursive: true });
  if (existsSync(join(work, 'index.html'))) copyFileSync(join(work, 'index.html'), join(out, 'index.html'));
  const g = await grade(out);
  writeFileSync(join(out, 'report.json'), JSON.stringify({ task, ...meta, ...g }, null, 2));
  rows.push({ task, ...meta, ...g });
  console.log(`  ${g.pass ? '✓ pass' : '✗ fail'} · lint ${g.lintProblems?.length ?? '–'} · axe ${g.axeViolations?.length ?? '–'} · custom CSS rules ${g.customCssRules ?? '–'} · $${(meta.cost ?? 0).toFixed(2)}`);
}

const md = [
  `# GDS AI evals — ${stamp}`, '',
  '| Task | Pass | Lint problems | axe violations | Sans font | CDN link | Custom CSS rules | Not covered | Cost |',
  '|---|---|---|---|---|---|---|---|---|',
  ...rows.map(r => `| ${r.task} | ${r.pass ? '✓' : '✗'} | ${r.lintProblems?.length ?? '–'} | ${r.axeViolations?.length ?? '–'} | ${r.baseFontSansSerif ? '✓' : '✗'} | ${r.gdsCdnLink ? '✓' : '✗'} | ${r.customCssRules ?? '–'} | ${(r.uncoveredClasses || []).length} | $${(r.cost ?? 0).toFixed(2)} |`),
  '',
];
writeFileSync(join(outRoot, 'summary.md'), md.join('\n'));
console.log('\n' + md.join('\n') + `\nResults: ${outRoot}`);
process.exit(rows.every(r => r.pass) ? 0 : 1);
