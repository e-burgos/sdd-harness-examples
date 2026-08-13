# sdd-harness — examples

Real output of [`@e-burgos/sdd-harness`](https://github.com/e-burgos/sdd-harness), so you can
read what the CLI generates before running it on your own machine.

Every directory here was produced by the CLI and committed untouched. Nothing is hand-written,
nothing is trimmed for the demo: what you browse is what you get.

> Generated from the version in [`VERSION`](VERSION), always the latest published on npm.

## The examples — one per mode

| Directory | Mode | Command | What it shows |
| --- | --- | --- | --- |
| [`flexi-market/`](flexi-market) | Nx monorepo | `harness init` | Nx 23 + pnpm workspace with two apps — `portal` (React 19 + Vite) and `orders-api` (Spring Boot 3 hexagonal, Maven) — plus a `shared-types` lib, a Postgres service, and the full SDD system |
| [`pulse-api/`](pulse-api) | Standalone | `harness init --standalone` | One Fastify API with its code at the repo root, no Nx, same SDD system |
| [`legacy-shop/`](legacy-shop) | SDD harness | `harness configure sdd` | A project that **already existed** and adopted SDD without changing a line of its own code |

All three carry the complete portable kit under `sdd/`: the 7 cycle agents, 18 skills, the gates
as slash commands under `prompts/`, strict JSON Schemas, the dependency-free docs viewer, and the
Hermes layer (`sdd/memory/`, `sdd/pricing.json`).

### `legacy-shop` is the interesting one

The other two are generated from nothing. This one is installed **on top of** an existing
project, and the proof is in the repo: [`seeds/legacy-shop/`](seeds/legacy-shop) is the input.
Diff it against the result and you see exactly what the command did — and did not do:

- `src/` is byte-for-byte identical. The CLI never touches your code.
- The project's own `AGENTS.md` was **absorbed** into
  [`legacy-shop/sdd/dual-harness/AGENTS.md`](legacy-shop/sdd/dual-harness/AGENTS.md), not
  overwritten, before the root file became a symlink. Its rules are still there.
- `package.json` kept `start`, `test`, `lint` and version `2.7.3`; the `sdd:*` and `setup:agents`
  scripts were merged in alongside them.

### Where to look first

- **`sdd/README.md`** and **`sdd/HOW-TO-USE-SDD.md`** — the methodology as the user receives it.
- **`sdd/global.json`** — the single source of the project name and its registered subprojects.
- **`AGENTS.md` → `sdd/dual-harness/AGENTS.md`** — the dual harness. It is a symlink, and so are
  `CLAUDE.md`, `.claude/commands/` and everything under `.github/skills/`: one set of
  instructions that Claude Code and GitHub Copilot both read.
- **`sdd/schemas/`** — `additionalProperties: false` everywhere. `sdd/scripts/validate-sdd.mjs`
  is what enforces them, and it runs as part of `harness init`.

## Generate them yourself

```bash
npx @e-burgos/sdd-harness init
```

The interactive wizard asks for the name, mode, apps, libs and services. These examples take the
non-interactive path instead — the same one meant for agents and CI:

```bash
npx @e-burgos/sdd-harness init --config configs/nx.json
```

```bash
npx @e-burgos/sdd-harness configure sdd --name legacy-shop --description "..."
```

The inputs used here are the config files under [`configs/`](configs) and the seed project under
[`seeds/`](seeds) — nothing else.

## How this repo stays honest

A stale example of a spec-driven kit is worse than no example: someone copies gates and schemas
that no longer exist. So nobody updates these by hand.

[`.github/workflows/regenerate.yml`](.github/workflows/regenerate.yml) checks the npm latest tag
every 6 hours, and when it moves ahead of [`VERSION`](VERSION) it runs
[`scripts/generate.mjs`](scripts/generate.mjs): generate from the **published** package, prune
build output, commit. That also makes it a smoke test — if a release cannot generate a workspace,
this repo goes red.

**Send pull requests to [e-burgos/sdd-harness](https://github.com/e-burgos/sdd-harness), not
here.** Anything committed to the example directories is overwritten by the next release. The
configs and seeds, on the other hand, are inputs — those you can edit.

## Links

- CLI repo — https://github.com/e-burgos/sdd-harness
- npm — https://www.npmjs.com/package/@e-burgos/sdd-harness
- Docs — https://sdd.estebanburgos.com.ar/
