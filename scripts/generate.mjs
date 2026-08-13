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

/**
 * One entry per mode of the CLI.
 *
 * `init` generates from scratch out of a config file. `configure` installs SDD onto a project
 * that already exists, so it needs a seed to install onto — the seed lives in the repo so you
 * can diff it against the generated result and see exactly what the command added.
 */
const EXAMPLES = [
  { dir: 'flexi-market', kind: 'init', config: 'configs/nx.json' },
  { dir: 'pulse-api', kind: 'init', config: 'configs/standalone.json' },
  {
    dir: 'legacy-shop',
    kind: 'configure',
    seed: 'seeds/legacy-shop',
    args: [
      'configure',
      'sdd',
      '--name',
      'legacy-shop',
      '--description',
      'Storefront API that adopted SDD without touching a line of its own code.',
    ],
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
  const source = example.config ?? example.seed;
  console.log(`\n--- ${example.dir} (${example.kind}: ${source}) ---\n`);

  const generated = join(work, example.dir);

  if (example.kind === 'init') {
    const config = join(REPO, example.config);
    if (!existsSync(config)) throw new Error(`Missing config: ${example.config}`);
    cpSync(config, join(work, 'harness.config.json'));
    run('npx', ['--yes', spec, 'init', '--config', 'harness.config.json'], work);
    if (!existsSync(generated) || !statSync(generated).isDirectory()) {
      throw new Error(
        `${spec} did not produce ${example.dir}/ — the "project.name" in ${example.config} must match the example directory.`,
      );
    }
  } else {
    const seed = join(REPO, example.seed);
    if (!existsSync(seed)) throw new Error(`Missing seed: ${example.seed}`);
    // configure sdd runs *inside* an existing repo, so the seed is copied first
    // and the command installs on top of it.
    cpSync(seed, generated, { recursive: true });
    run('npx', ['--yes', spec, ...example.args], generated);
    if (!existsSync(join(generated, 'sdd', 'global.json'))) {
      throw new Error(`${spec} did not install sdd/ into ${example.dir}/`);
    }
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
