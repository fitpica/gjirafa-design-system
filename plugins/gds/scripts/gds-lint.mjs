#!/usr/bin/env node
/**
 * GDS lint for product code.
 *
 *   node gds-lint.mjs <file.vue|file.html> [...]   check files, exit 1 on problems
 *   node gds-lint.mjs --hook                        Claude Code PostToolUse hook (reads the event on stdin)
 *
 * As a hook it only looks at .vue / .html files that use gds- classes. When it finds problems
 * it prints them to stderr and exits 2, so Claude sees them and fixes the file. Anything
 * unexpected (bad input, unreadable file, internal error) exits 0 so it never blocks work.
 *
 * Data (classes + component contracts) comes from gds-data.json, generated from the GDS repo.
 */

import { readFileSync } from 'fs';
import { dirname, resolve, extname } from 'path';
import { fileURLToPath } from 'url';
import { createLinter, vueTemplate } from './lint-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(resolve(HERE, 'gds-data.json'), 'utf8'));
const linter = createLinter({ cssClasses: data.cssClasses, contracts: data.contracts });

function lintFile(file) {
  const ext = extname(file).toLowerCase();
  if (!['.vue', '.html', '.htm'].includes(ext)) return null;
  let src = readFileSync(file, 'utf8');
  if (ext === '.vue') src = vueTemplate(src);
  if (!src.includes('gds-')) return null;
  return { problems: linter.lint(src, { lenient: true }), uncovered: linter.uncovered(src) };
}

function format(file, problems) {
  return [
    `GDS lint (v${data.version}): ${problems.length} problem(s) in ${file}`,
    ...problems.map(p => `  - [${p.rule}] ${p.message}`),
    'Fix these so the markup follows the GDS component contracts (gds-ui skill, components/<id>.md).',
    'If GDS lacks what you need, do not invent a class: say it is missing.',
  ].join('\n');
}

if (process.argv.includes('--hook')) {
  try {
    const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
    const file = input?.tool_input?.file_path;
    if (!file) process.exit(0);
    const result = lintFile(resolve(input.cwd ?? process.cwd(), file));
    if (!result || !result.problems.length) process.exit(0);
    process.stderr.write(format(file, result.problems) + '\n');
    process.exit(2);
  } catch {
    process.exit(0);
  }
} else {
  const files = process.argv.slice(2);
  if (!files.length) { console.error('Usage: node gds-lint.mjs <file.vue|file.html> [...]'); process.exit(1); }
  let failed = 0;
  for (const f of files) {
    const result = lintFile(resolve(f));
    if (!result) { console.log(`- ${f}: skipped (not .vue/.html, or no gds- classes)`); continue; }
    if (result.uncovered.length) console.log(`  ${f}: not covered by a contract yet: ${result.uncovered.join(', ')}`);
    if (result.problems.length) { failed++; console.error(format(f, result.problems)); }
    else console.log(`✓ ${f}`);
  }
  process.exit(failed ? 1 : 0);
}
