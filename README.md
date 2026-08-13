# sdd-harness — examples

Real output of [`@e-burgos/sdd-harness`](https://github.com/e-burgos/sdd-harness), so you can
read what the CLI generates before running it on your own machine.

Every directory here was produced by `harness init` and committed untouched. Nothing is
hand-written, nothing is trimmed for the demo: what you browse is what you get.

> **Generated from `@e-burgos/sdd-harness@0.4.0`** — see [`VERSION`](VERSION).

## The examples

| Directory | Mode | Command | What it shows |
| --- | --- | --- | --- |
| [`flexi-market/`](flexi-market) | Nx monorepo | `harness init` | Nx 23 + pnpm workspace with two apps — `portal` (React 19 + Vite) and `orders-api` (Spring Boot 3 hexagonal, Maven) — plus a `shared-types` lib, a Postgres service, and the full SDD system |
| [`pulse-api/`](pulse-api) | Standalone | `harness init --standalone` | One Fastify API with its code at the repo root, no Nx, same SDD system |

Both carry the complete portable kit under `sdd/`: the 7 cycle agents, 16+ skills, the gates as
slash commands under `prompts/`, strict JSON Schemas, the dependency-free docs viewer, and the
Hermes layer (`sdd/memory/`, `sdd/pricing.json`).

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

The two config files under [`configs/`](configs) are the exact inputs used here.

## How this repo stays honest

A stale example of a spec-driven kit is worse than no example: someone copies gates and schemas
that no longer exist. So nobody updates these by hand.

[`.github/workflows/regenerate.yml`](.github/workflows/regenerate.yml) checks the npm latest tag
every 6 hours, and when it moves ahead of [`VERSION`](VERSION) it runs
[`scripts/generate.mjs`](scripts/generate.mjs): generate from the **published** package, prune
build output, commit. That also makes it a smoke test — if a release cannot generate a workspace,
this repo goes red.

**Send pull requests to [e-burgos/sdd-harness](https://github.com/e-burgos/sdd-harness), not
here.** Anything committed to these directories is overwritten by the next release.

## Known gaps

- The third mode, `harness configure sdd` (installing SDD onto a project that already exists),
  is not represented yet: it prompts for the project name and description with no flags to skip
  them, so it cannot run unattended.
- `orders-api` is added with `harness add app springboot` rather than through `configs/nx.json`,
  because the config schema's app types stop at `fastify` — `springboot` and `hono` are reachable
  from the wizard and from `add app`, but not from `init --config`.

## Links

- CLI repo — https://github.com/e-burgos/sdd-harness
- npm — https://www.npmjs.com/package/@e-burgos/sdd-harness
- Docs — https://sdd.estebanburgos.com.ar/
