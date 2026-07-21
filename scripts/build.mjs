import { mkdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

await rm(new URL('../dist', import.meta.url), { recursive: true, force: true });
execFileSync('tsc', ['-p', 'tsconfig.build.json'], { stdio: 'inherit' });
execFileSync('tsc', ['-p', 'tsconfig.cjs.json'], { stdio: 'inherit' });
await mkdir(new URL('../dist/cjs', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/cjs/package.json', import.meta.url), '{"type":"commonjs"}\n');
