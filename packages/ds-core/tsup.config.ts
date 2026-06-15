import { defineConfig } from 'tsup';

export default defineConfig({
  // '.' entry + './popover' subpath entry → dist/index.* and dist/popover/index.*
  entry: ['src/index.ts', 'src/popover/index.ts', 'src/datepicker/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  target: 'es2020',
  outDir: 'dist',
  // Explicit .mjs / .cjs so the package.json exports map resolves unambiguously.
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.mjs' };
  },
});
