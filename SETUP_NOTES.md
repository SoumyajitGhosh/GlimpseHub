# Claude Code setup — changes since clone

This is the single running log of everything done to this repository with Claude Code, in
chronological order. New work gets appended here rather than tracked in a separate file.

## 1. Initial Claude Code setup (tooling/context only)

Nothing in this section is required for GlimpseHub to build, run, or deploy — it's tooling/context
for AI-assisted development only.

### 1.1 Project context file

**`CLAUDE.local.md`** (repo root) — a context file describing the codebase (MERN stack, backend
Express/Mongoose/Socket.IO conventions, frontend React/Vite/classic-Redux conventions, commands,
env vars, known quirks) so Claude Code sessions don't have to re-derive this from scratch each time.

- Loads automatically for any Claude Code session started in this repo.
- Kept **local/untracked** (not `CLAUDE.md`) since it's machine-specific working context, not
  something the team necessarily wants synced — see the `.gitignore` entry below.
- Originally drafted at the *user* level (`~/.claude/CLAUDE.md`, outside the repo) and then moved
  here per request, since global user-level context was bleeding into unrelated projects.

### 1.2 `.gitignore` (repo root)

The repo previously had no root-level `.gitignore` (only `backend/.gitignore` and
`frontend/.gitignore` existed). Added one covering:
- `CLAUDE.local.md` and `.claude/settings.local.json` — local Claude Code state, not shared
- `node_modules`, `.env*`, logs, OS/editor cruft (standard boilerplate, harmless overlap with the
  two sub-package `.gitignore`s)

### 1.3 Claude Code skills

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

#### Size summary

| Location | Size | Files |
|---|---|---|
| `.claude/skills/senior-fullstack/` | 44K | 8 |
| `backend/.claude/skills/` | 244K | 15 |
| `frontend/.claude/skills/` | 28K | 3 |
| **Total** | **~316K** | **26** |

All markdown/text except `senior-fullstack`'s 3 small Python scripts (scaffolders + analyzer) —
these are tooling Claude can shell out to on request; they are never imported into or run by the
GlimpseHub application itself.

**What's tracked vs. not:** `.gitignore` and all three `.claude/skills/` trees were committed in
`411f79b` ("Add Claude Code context and design/backend skills"). `CLAUDE.local.md` remains
**untracked by design** (matched by `.gitignore`) — it will never be committed unless that rule is
removed. No application code was touched in this phase — only new files were added.

## 2. Dependency vulnerability fixes (commit `f82af67`)

Dependabot flagged vulnerabilities across both packages; fixed without any application-code changes
since the affected API surface was unchanged across the bumped versions:

- **Backend**: bumped `axios`, `cloudinary`, `compression`, `express`, `handlebars`, `mongoose`,
  `morgan`, `socket.io`, `validator` within existing semver ranges; major-bumped `multer` 1.x→2.3.0
  and `nodemailer` 6.x→9.1.1 (both had advisories only fixed in those lines).
- **Frontend**: bumped `axios`, `react-router-dom`, and transitive deps within range; major-bumped
  `vite` 5.x→6.4.3 (two advisories only fixed in 6.x) and `vite-plugin-pwa` 0.20.5→1.3.0 (peer-dep
  compat with Vite 6). `vite.config.js` needed no changes; build/dev-server boot/lint verified clean.

## 3. Frontend modernization (commit `a988607`)

A four-phase pass to modernize the frontend's tooling and establish accessibility as a first-class
concern (it was previously near-absent: ~15 total `aria-*`/`role=`/`alt=`/`tabIndex` hits in all of
`src/`, zero focus-visible/skip-link/`.sr-only` CSS, no theming mechanism). Kept the existing
architecture in place throughout — no Redux Toolkit, no TypeScript, no react-query, no rewrite.

- **Phase 1 — foundations**: migrated all SASS partials from `@import` to `@use`/`@forward`; added
  a spacing scale; introduced CSS custom properties as a real token layer (`--color-bg`,
  `--color-text`, `--color-accent`, etc.), enabling `prefers-color-scheme`/`data-theme` dark mode
  with light-mode defaults pixel-identical to before; added an `.sr-only` + `:focus-visible` utility
  layer and a skip link (`src/components/SkipLink/`).
- **Phase 2 — accessibility remediation**: `Modal`/`OptionsDialog` gained `role="dialog"`,
  Escape-to-close, a focus trap, and focus restore on close; form inputs (`FormInput`,
  `FormTextarea`, `EditProfileForm`, `ChangePasswordForm`) gained real `<label htmlFor>`
  associations; the password-visibility toggle became a keyboard-operable `<button>`; icon-only nav
  controls gained `aria-label`s; post/avatar `alt` text improved; fixed an invalid
  interactive-inside-interactive nesting in `MobileNav`'s mobile notification icon.
- **Phase 3 — dependency currency**: bumped `vite-plugin-svgr`, `@vitejs/plugin-react`, `formik`,
  and all ESLint plugins/`globals` to current stable. Deliberately held back react-router-dom v7 and
  Vite 8 as separate, scoped migrations — attempting Vite 8 actually broke `npm install` via a real
  peer conflict, confirming that call.
- **Phase 4 — React/routing polish**: fixed the `react-spring`/React `useTransition` naming
  collision (aliased the react-spring import); lazy-loaded four components that were eagerly
  imported despite only being reachable via already-lazy routes; replaced raw pathname-string
  chrome-hiding logic in `App.jsx` with a `matchPath`-driven route config — which surfaced and fixed
  a dead-code bug in `Footer`'s visibility condition (it had reduced to "show only on `/`" instead of
  the apparent intent of "hide only on auth pages and in chat").

Verification throughout: no test runner exists in this project, so verification was `npm run lint`
(baseline 357 problems → 379 after Phase 3, entirely from newer ESLint plugin versions surfacing
pre-existing patterns via new rules, not from this work), plus `npm run build` and a `npm run dev`
boot check after every phase.
