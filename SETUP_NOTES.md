# Claude Code setup — changes since clone

This documents everything added to the repository during initial Claude Code setup.
Nothing listed here is required for GlimpseHub to build, run, or deploy — it's tooling/context
for AI-assisted development only. **As of this writing, none of it has been committed yet.**

## 1. Project context file

**`CLAUDE.local.md`** (repo root) — a context file describing the codebase (MERN stack, backend
Express/Mongoose/Socket.IO conventions, frontend React/Vite/classic-Redux conventions, commands,
env vars, known quirks) so Claude Code sessions don't have to re-derive this from scratch each time.

- Loads automatically for any Claude Code session started in this repo.
- Kept **local/untracked** (not `CLAUDE.md`) since it's machine-specific working context, not
  something the team necessarily wants synced — see the `.gitignore` entry below.
- Originally drafted at the *user* level (`~/.claude/CLAUDE.md`, outside the repo) and then moved
  here per request, since global user-level context was bleeding into unrelated projects.

## 2. `.gitignore` (repo root)

The repo previously had no root-level `.gitignore` (only `backend/.gitignore` and
`frontend/.gitignore` existed). Added one covering:
- `CLAUDE.local.md` and `.claude/settings.local.json` — local Claude Code state, not shared
- `node_modules`, `.env*`, logs, OS/editor cruft (standard boilerplate, harmless overlap with the
  two sub-package `.gitignore`s)

## 3. Claude Code skills

Three "skill" packages (instruction sets Claude Code can load on demand) were added, sourced
from public MIT/Apache-2.0-licensed repositories and copied in verbatim. They're placed at
different levels of the tree based on what part of the stack they're relevant to:

```
GlimpseHub/
  .claude/skills/senior-fullstack/              <- repo-wide (cross-cutting)
  backend/.claude/skills/                       <- backend-only
    nodejs-backend-patterns/
    nosql-expert/
    api-security-best-practices/
    backend-dev-guidelines/
    LICENSE
    ANTHROPIC_ATTRIBUTION.md
  frontend/.claude/skills/                      <- frontend-only
    frontend-design/
    web-design-guidelines/
```

Claude Code discovers skills based on the working directory, so scoping them this way means a
backend-only session doesn't see frontend design skills and vice versa; the root-level one is
visible everywhere.

### Repo root — cross-cutting

| Skill | Source | Contents |
|---|---|---|
| `senior-fullstack` | [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) (MIT) | `SKILL.md`, architecture/workflow/tech-stack reference docs, 3 Python helper scripts (scaffolders + a code-quality analyzer) |

### `backend/` — Express / Mongoose / Socket.IO specific

| Skill | Why it's relevant here |
|---|---|
| `nodejs-backend-patterns` | General Node/Express patterns |
| `nosql-expert` | Matches the MongoDB/Mongoose data layer |
| `api-security-best-practices` | Matches the existing `jwt-simple` + `helmet` + `express-rate-limit` setup |
| `backend-dev-guidelines` | Architecture, async/error handling, middleware, routing/controllers, validation, testing — the largest of the four (~170K, all markdown) |

All four sourced from the same `davila7/claude-code-templates` repo as `senior-fullstack`.

### `frontend/` — React / design specific

| Skill | Source | Notes |
|---|---|---|
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) (Apache-2.0) | Aesthetic-direction guidance: typography, layout, avoiding "AI-generated" visual defaults |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (unlicensed on GitHub, published for this exact redistribution use case) | Thin wrapper — fetches live interface-guideline rules from `vercel-labs/web-interface-guidelines` at review time rather than storing them locally |

**Not included:** `ui-ux-pro-max` (also from `nextlevelbuilder/ui-ux-pro-max-skill`, MIT) was
added and then **removed** after review — it added 3.7MB / 73 files (font/icon/palette CSV+JSON
catalogs plus Python scripts requiring a Python interpreter) for a JS-only codebase. Its
functionality (aesthetic judgment, interface-rule checking) is already covered by the two skills
kept above without the size or the Python dependency.

## Size summary

| Location | Size | Files |
|---|---|---|
| `.claude/skills/senior-fullstack/` | 44K | 8 |
| `backend/.claude/skills/` | 244K | 15 |
| `frontend/.claude/skills/` | 28K | 3 |
| **Total** | **~316K** | **26** |

All markdown/text except `senior-fullstack`'s 3 small Python scripts (scaffolders + analyzer) —
these are tooling Claude can shell out to on request; they are never imported into or run by the
GlimpseHub application itself.

## What's tracked vs. not

- `.gitignore` and all three `.claude/skills/` trees are **new, untracked files** — not yet
  committed.
- `CLAUDE.local.md` is **untracked by design** (matched by the new `.gitignore`) — it will never
  be committed unless the ignore rule is removed.

## Nothing else changed

No application code, dependencies, configuration, or existing files were modified. Only new files
were added, as listed above.
