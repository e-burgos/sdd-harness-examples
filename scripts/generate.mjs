#!/usr/bin/env node
/**
 * Regenerates every example in this repo from a published @e-burgos/sdd-harness.
 *
 * Nothing here is hand-written: each example is whatever `harness init` produces
 * for that mode, pruned of build output. If an example ever drifts from the
 * published CLI, this script is the bug — not the example.
 *
 *   node scripts/generate.mjs            # uses the version in VERSION
 *   node scripts/generate.mjs 0.4.1      # pins a version
 *   node scripts/generate.mjs --latest   # resolves the npm latest tag
 */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';

const PKG = '@e-burgos/sdd-harness';
const REPO = resolve(import.meta.dirname, '..');

/** Each example: the config it is generated from, and any follow-up commands. */
const EXAMPLES = [
  {
    dir: 'flexi-market',
    config: 'configs/nx.json',
    // springboot is reachable through `add app`, not through the config schema
    // (its AppType union stops at fastify) — see the README's "Known gaps".
    after: [['add', 'app', 'springboot', '--name', 'orders-api']],
  },
  {
    dir: 'pulse-api',
    config: 'configs/standalone.json',
    after: [],
  },
];

/** Build output and VCS metadata — regenerable, never committed. */
const PRUNE = ['node_modules', '.git', 'dist', '.nx', 'target', 'build', '.venv', '__pycache__'];

function run(cmd, args, cwd) {
  execFileSync(cmd, args, { cwd, stdio: 'inherit' });
}

function resolveVersion() {
  const arg = process.argv[2];
  if (arg && arg !== '--latest') return arg.replace(/^v/, '');
  if (arg === '--latest') {
    return execFileSync('npm', ['view', PKG, 'version'], { encoding: 'utf-8' }).trim();
  }
  return readFileSync(join(REPO, 'VERSION'), 'utf-8').trim();
}

/** Depth-first removal of regenerable directories, symlinks left untouched. */
function prune(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      if (PRUNE.includes(entry.name)) {
        rmSync(path, { recursive: true, force: true });
      } else {
        prune(path);
      }
    }
  }
}

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) n += 1;
    else if (entry.isDirectory()) n += countFiles(join(dir, entry.name));
    else n += 1;
  }
  return n;
}

const version = resolveVersion();
const spec = `${PKG}@${version}`;
console.log(`\n=== Regenerating examples from ${spec} ===\n`);

const work = mkdtempSync(join(tmpdir(), 'sdd-examples-'));

for (const example of EXAMPLES) {
  console.log(`\n--- ${example.dir} (${example.config}) ---\n`);
  const config = join(REPO, example.config);
  if (!existsSync(config)) throw new Error(`Missing config: ${example.config}`);
  cpSync(config, join(work, 'harness.config.json'));

  run('npx', ['--yes', spec, 'init', '--config', 'harness.config.json'], work);

  const generated = join(work, example.dir);
  if (!existsSync(generated) || !statSync(generated).isDirectory()) {
    throw new Error(
      `${spec} did not produce ${example.dir}/ — the "project.name" in ${example.config} must match the example directory.`,
    );
  }

  for (const args of example.after) {
    run('npx', ['--yes', spec, ...args], generated);
  }

  prune(generated);

  const target = join(REPO, example.dir);
  rmSync(target, { recursive: true, force: true });
  cpSync(generated, target, { recursive: true, verbatimSymlinks: true });
  console.log(`\n✓ ${example.dir}: ${countFiles(target)} files\n`);
}

writeFileSync(join(REPO, 'VERSION'), `${version}\n`);
rmSync(work, { recursive: true, force: true });

console.log(`\n=== Done — examples now reflect ${spec} ===\n`);
