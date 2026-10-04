# Claude Code setup — changes since clone

This is the single running log of everything done to this repository with Claude Code, in
chronological order. New work gets appended here rather than tracked in a separate file.

## Summary — what's been done, at a glance

A quick-reference index before the full chronological log below. Each row links to the
section with the full detail (what changed, why, and how it was verified).

| # | What | Status |
|---|---|---|
| [§1](#1-initial-claude-code-setup-tooling-context-only) | Claude Code context/tooling (`CLAUDE.local.md`, `.gitignore`, skill packages) | Done |
| [§2](#2-dependency-vulnerability-fixes-commit-f82af67) | First Dependabot fix pass (backend + frontend, within-range bumps) | Done |
| [§3](#3-frontend-modernization-commit-a988607) | Frontend modernization: SASS `@use`, theming/dark-mode, a11y foundations, dependency currency, React/routing polish | Done |
| [§4](#4-frontend-test-runner--eslint-regression-fix) | First frontend test runner (Vitest + RTL) + an ESLint plugin-bump regression fix | Done |
| [§5](#5-react-router-dom-v7-migration-done--see-85) | react-router-dom v7 migration | Done (landed as §8.5 Phase 6) |
| [§6](#6-frontend-audit-slash-command) | `/frontend-audit` reusable slash command | Done |
| [§7](#7-mcp-servers-for-frontend-work-mcpjson) | MCP servers for frontend work (context7, chrome-devtools, playwright) | Done |
| [§8](#8-full-frontend-modernization-roadmap) | Full modernization roadmap (Phases 0–10): lint burndown, shared HTTP client, Redux Toolkit, router v7, Vite 7, React 19, CI, PWA, a11y | **Done — all 10 phases** |
| [§8.10](#810-phase-5--typescript-migration) | Phase 5: full `.jsx`/`.js` → `.tsx`/`.ts` TypeScript migration (bigger scope than the roadmap's "incremental JSDoc" plan) | **Done** — 333 → 0 `tsc` errors, `npm run build` passes |
| [§9](#9-backend-dependency-vulnerability-fixes-round-2-8--0) | Backend `npm audit` fixes, round 2 (bcrypt major bump) | Done — 8 → 0 vulnerabilities |
| [§10](#10-fixed-the-two-chat-ui-bugs-flagged-but-left-in-8103) | The two chat UI bugs flagged in §8.10.3 | Done |
| [§11](#11-post-upload-failures-cloudinary-credentials-error-codes-temp-cleanup) | Post-upload failures: shared Cloudinary client, proper error codes, temp-file cleanup | Done — verified end to end |
| [§12](#12-chat-ui-redesign-conversation-state-fixes-responsive-new-post-modal) | Chat UI redesign, conversation-state fixes, responsive new-post modal | Done |

**Current repo state**: both packages build clean, `npm audit` is 0 on both, the frontend
has 55 passing tests and is fully typed. See the final-state tables at the end of §8.10 and
§9 for exact before/after metrics.

**Still open** (not yet started, or deliberately deferred — see the linked section for why):
- RTK Query (§8's Phase 4), forms → react-hook-form + zod (§8's Phase 9)
- The a11y interactive-element follow-up — 40 `jsx-a11y` warnings (§8.9, §10)
- The §8.10 `no-unused-expressions` lint regression (27 errors, tracked since the TS migration began)
- A real backend test runner (`npm test` is still `exit 1` — never attempted)
- A real feature bug, found but not fixed: `profileDispatch({type: "INCREMENT_POST_COMMENTS_COUNT"})` has been a silent no-op since the Redux Toolkit migration (§8.4) — needs a design decision, see the end of §8.10's final-state notes
- README.md's own "Areas to improve" list (Redis for socket scaling, Dockerize, analytics)

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

## 4. Frontend test runner + ESLint regression fix

### 4.1 Vitest + React Testing Library

Added the frontend's first test runner (there was none — `src/utils/test/testUtils.js` was dead
Enzyme-era code; neither `enzyme` nor `check-prop-types` were installed, so it couldn't run).

- devDependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- `vite.config.js` gained a `test: { environment: 'jsdom', globals: true, setupFiles: './src/utils/test/setupTests.js' }`
  block — Vitest reads Vite's own config, no separate config file needed.
- `package.json` scripts: `test` (`vitest run`), `test:watch` (`vitest`).
- Replaced `testUtils.js` with `setupTests.js` (jest-dom matchers) and a working `storeFactory.js`
  (same redux-store-for-tests helper, fixed to use `legacy_createStore` — plain `createStore` was
  removed in Redux 5, so the old helper was already broken independent of the missing Enzyme deps).
- Added two starter test files establishing the pattern for future tests: `Button.test.jsx`
  (presentational, no dependencies) and `UserCard.test.jsx` (connected component wrapped in
  `<Provider>`/`<MemoryRouter>`, using `storeFactory`).

### 4.2 ESLint regression fix (the 357→379 delta from section 3, Phase 3)

Fixed the ~22 problems newly surfaced by the `eslint-plugin-react-hooks` 5→7 and
`eslint-plugin-react-refresh` bumps — deliberately left the pre-existing 357-problem baseline
(mostly `react/prop-types` and `no-unused-vars`) alone; that's a separate, much larger cleanup.

- **`react-refresh/only-export-components` (5 files)**: all false positives on `connect()`-wrapped
  components. Fixed at the config level — added `extraHOCs: ['connect']` to the rule options in
  `eslint.config.js` rather than touching each file.
- **`react-hooks/refs` (12 occurrences)**: three different real patterns —
  - `ChatSidebar.jsx` / `UsersList.jsx` had a "snapshot state into a ref once" idiom
    (`useRef(state.data).current`) that dereferenced `.current` at render time and was declared
    *after* its first use. Reordered the declarations and stopped dereferencing at render time —
    `.current` is now only read where it's used (inside the effect).
  - `ChatSidebar.jsx` / `UsersList.jsx` / `SearchSuggestion.jsx` passed `componentRef.current` (a
    resolved DOM node, read during render) into `useScrollPositionThrottled`. Changed the hook
    (`src/hooks/useScrollPositionThrottled.js`) to accept the ref object itself and resolve
    `.current` inside its effect — a real correctness improvement, not just a lint fix, since it
    removes a first-render race where the listener could bind to `window` before the ref attached.
  - `PulsatingIcon.jsx` reads a *caller-owned* ref (`elementRef.current`) during render to decide
    whether to skip the initial animation. Left as-is with a scoped
    `eslint-disable-next-line react-hooks/refs` + comment — rewriting to avoid this would change
    animation timing behavior with no test coverage to verify against.
  - `useSearchUsersDebounced.js` returns a lazily-initialized ref's `.current` (a memoized debounced
    function) from a custom hook — the documented React "instance value" pattern
    (react.dev/reference/react/useRef). Still flagged by this rule version; suppressed with a scoped
    disable + comment rather than restructuring a working, documented pattern.
- **`react-hooks/set-state-in-effect` (4 occurrences)**:
  - `NewPostButton.jsx` used `useState`+`useEffect` purely to relay a selected file into
    `showModal`/`navigate`. Removed the state indirection entirely — the file is now handled
    directly in the `<input onChange>` handler, which is a strict simplification (one fewer render
    per file selection, no behavior change).
  - `SearchSuggestion.jsx`'s "start fetching more once `result` reaches the page size" effect was a
    textbook prop-change reaction; converted to the render-time "adjusting state when a prop
    changes" pattern (tracking `prevResultLength`) instead of a `useEffect`.
  - `NotificationButton.jsx`'s two effects (auto-show the unread-notification popup with a 10s
    auto-hide timer, and dismiss it when the notification feed opens) are stateful timer
    choreography for a live UI feature with no test coverage. Left as-is with scoped
    `eslint-disable-next-line` comments rather than risk changing popup timing behavior.
- **`react-hooks/immutability` (1 occurrence)**: same `ChatSidebar.jsx` ref-ordering issue as above,
  resolved by the same reorder.

Verification: `npm test` (6 tests, 2 files, all passing), `npm run lint` (351 errors + 6 warnings =
357 — back to the pre-Phase-3 baseline, with the 4 previously-regressed rules at zero), `npm run
build` (succeeds, output unchanged in shape). No backend or browser was available in this session to
manually exercise the touched screens (chat sidebar infinite scroll, followers/following list,
mention search, new-post file picker, notification popup) — that manual pass is still recommended
before merging, given `useScrollPositionThrottled`'s signature change and the two
`useEffect`→render-time-state rewrites touch real user-facing timing/scroll behavior.

## 5. react-router-dom v7 migration (done — see §8.5)

Landed as Phase 6 of the roadmap (§8.5): a straight bump that keeps the declarative
`<Routes>/<Route>` tree. Adopting v7's data-router APIs (`createBrowserRouter`, loaders/actions)
was deliberately left out and remains a separate, larger follow-up.

## 6. `/frontend-audit` slash command

Sections 4 and 5 above were produced by asking Claude Code to "act as a senior frontend architect,
review recent frontend changes, suggest follow-ups, then implement the ones I pick." That workflow is
now a reusable project slash command: **`.claude/commands/frontend-audit.md`**. Running `/frontend-audit`
in this repo repeats the same assess → recommend → (user picks) → implement → log-to-SETUP_NOTES.md →
commit flow without having to restate it, including the guardrails established during this session:
no new architectural patterns (no RTK/react-query/TS), lint/test regressions get scoped to what
actually regressed rather than absorbing the whole pre-existing backlog, and risky-but-untested
behavioral fixes get a commented `eslint-disable` instead of a silent rewrite.

## 7. MCP servers for frontend work (`.mcp.json`)

Added the repo's first MCP server config — project-scoped and **committed** so any clone gets the
same tooling. All three are stdio servers launched on demand via `npx` (nothing runs until a session
uses them; the first launch of each downloads the package, ~30s).

**`.mcp.json`** (repo root):

| Server | Package | Use |
|---|---|---|
| `context7` | `@upstash/context7-mcp` | Version-accurate docs/snippets for React 18, Vite 6, `react-router` v6 **and** v7, `react-redux` 9, `reselect`, `react-spring`, Vitest + Testing Library — supports the section 5 router migration without API guesswork. Optional `CONTEXT7_API_KEY` env raises rate limits. |
| `chrome-devtools` | `chrome-devtools-mcp` (Chrome team) | Real Chrome against `localhost:5173`: performance traces, network waterfall, console errors, DOM/CSS inspection. Covers the perf/network debugging `claude-in-chrome` doesn't. |
| `playwright` | `@playwright/mcp` (Microsoft) | Accessibility-tree snapshot automation for repeatable E2E flows (login, post, comment, chat); pairs with `web-design-guidelines`. |

**`.claude/settings.json`** (new, committed) — `enabledMcpjsonServers: ["context7", "chrome-devtools", "playwright"]`
so the servers load without the per-project approval prompt.

Requires Node's `npx` on PATH (already used by the frontend toolchain). No secrets stored. Verify
with `/mcp` after restarting Claude Code in this repo.

## 8. Full frontend modernization roadmap

Asked Claude Code (as a senior frontend architect) to survey the frontend and propose a
modernization plan. Unlike sections 3–5, this pass explicitly puts the previously-deferred
architectural changes on the table (**RTK, RTK Query, incremental TypeScript, forms**) and
commits to **finishing the PWA** rather than removing it. The roadmap is a sequence of
independently-shippable phases, one small PR each; all ten phases are now done (detail in §8.1–§8.10).

**Phases** (S ≈ <½ day, M ≈ 1–3 days, L ≈ multi-PR):

| # | Phase | Notes |
|---|---|---|
| 0 | Doc + cleanup | dead-code removal, `prop-types` declared, ESLint Node/Vitest env blocks + `jsx-a11y` (warn) + Prettier, `import.meta.env.DEV` in `store.js`, Vitest coverage, `SetttingsButton`→`SettingsButton`. **Done — this section's commit.** |
| 1 | Lint backlog burndown | 357 → ~0; unused-`React` imports, `exhaustive-deps`, small rules; `react/prop-types` decided with Phase 5 |
| 2 | HTTP client foundation | one `apiClient.js` axios instance + interceptors; fixes the network-error crash (`err.response` deref) across all 9 service files; `AbortController` in `useSearchUsersDebounced` |
| 3 | Redux Toolkit | `configureStore`, then `createSlice` one slice per PR, **`socket` last with the io instance moved out of state** |
| 4 | RTK Query | axios `baseQuery`; convert the refetch-on-remount reads first (feed, suggested/hashtag posts, profile), then mutations with tag invalidation |
| 5 | Incremental types | `jsconfig.json` + `checkJs` + typed JSDoc, leaf-inward (services → redux → hooks → validation); then disable `react/prop-types` |
| 6 | React Router v7 | future-flags first, then straight bump — declarative `<Routes>` API, no data-router changes (that's a separate follow-up, see §5) |
| 7 | Vite 6 → 7 | stay off Vite 8 (broke `npm install`, see §3) |
| 8 | react-spring → `@react-spring/web` | umbrella package has no React 19 peer; pin `@9` on React 18 |
| 9 | Forms → react-hook-form + zod | 7 of 9 forms are hand-rolled; zod schemas reuse `utils/validation.js` and double as the type source |
| 10 | React 18 → 19 | optional, last, its own project; gated on Phases 8–9 |

**Cross-cutting:** add CI (GitHub Actions: `lint` + `build` + `test` + later `tsc --noEmit`)
right after Phase 0 — the repo has none today.

**Split into their own follow-ups, not bundled:** the PWA build-out (real manifest + icons +
offline strategy + update prompt), router data-router APIs, full `.tsx` conversion, full
RTKQ migration of all ~40 service functions, React 19, and the a11y gap remediation
(non-keyboard `onClick`s, missing `alt`s, `aria-live` on `Alert`, a real theme-toggle
control — the `data-theme`/`localStorage` plumbing already exists from §3).

### 8.1 Phase 0 — what changed

- **Dead code removed:** `src/serviceWorker.js` (orphaned CRA helper pointing at a
  non-existent `/service-worker.js`), `src/App.css` (unimported Vite-template leftover),
  `src/assets/react.svg`, `src/index.css` (only held inert `@tailwind` directives — Tailwind
  isn't installed; the real reset lives in `sass/base/_base.scss`), and the commented
  `why-did-you-render` / `serviceWorker` blocks in `main.jsx`.
- **`prop-types`** promoted to an explicit `dependency` — 16 files import it at runtime but
  it was only resolving via a transitive hoist from `eslint-plugin-react` (breaks under pnpm
  / stricter installs).
- **ESLint config** (`eslint.config.js`): added a Node-globals block for `*.config.js`
  (fixes the `process is not defined` error) and a Vitest-globals block for test files;
  added `eslint-plugin-jsx-a11y` (recommended set, forced to **warn** — the a11y backlog is
  a tracked follow-up); added `eslint-config-prettier` last to cede formatting to Prettier.
- **Prettier** added (`.prettierrc.json` — 2-space, double-quote, es5 trailing commas to
  match existing style; `.prettierignore`) with `format` / `format:check` scripts. Not yet
  run across the tree — that's a Phase 1 mechanical pass so the diff stays reviewable.
- **`redux/store.js`**: `process.env.NODE_ENV === 'development'` → `import.meta.env.DEV`
  (the rest of the app already uses `import.meta.env`; this was the last `process.env` ref).
- **Vitest coverage:** `@vitest/coverage-v8` + `test:coverage` script + a `coverage` block
  in `vite.config.js` with a deliberately low 2% floor (current: ~3.3% lines). `coverage/`
  gitignored.
- **`SetttingsButton/` → `SettingsButton/`** (three t's → two), updating the three importers
  (`Modal.jsx` componentMap, `ProfileHeader.jsx`, `ProfilePage.jsx`).

Verification: `npm run lint` (424 problems = 350 errors + 74 warnings; errors down 1 from
the 351 baseline via the `store.js` fix, +68 new warnings all from `jsx-a11y`), `npm run
build` (clean, PWA `sw.js` still generated), `npm test` (6/6 pass), `npm run test:coverage`
(passes the 2% floor). No backend/browser available this session — no manual smoke of the
touched screens (Profile page, modals) was possible; that pass is still recommended before
merge, though Phase 0 changes no component logic.

### 8.2 Phase 1 — lint backlog: 357 problems → 0 errors

Branch `frontend-modernization-phase-1`, five commits. The 357-problem ESLint baseline
(carried since §3) is now **0 errors**; 68 `jsx-a11y` warnings remain and are deferred to
the dedicated a11y follow-up.

- **`react/prop-types` disabled** (was 225 of the 357). Runtime PropTypes is being replaced
  by `checkJs` + typed JSDoc in Phase 5; ~225 components never declared `propTypes`, so
  backfilling a pattern we're removing is wasted work. `coverage/` also added to the ESLint
  `ignores` (flat config doesn't read `.gitignore`).
- **Unused `React` imports dropped from 78 files** — the jsx-runtime transform (already
  configured) means `React` needn't be in scope for JSX. Line deleted or reduced to its
  named imports. Cleared ~78 of the 109 `no-unused-vars`.
- **Remaining `no-unused-vars` (~31)**: dead imports/vars removed; unused `catch (err)` →
  bare `catch`; the dead GitHub-OAuth locals in `LoginPage` folded into the existing
  commented block; `no-unused-vars` given `{ ignoreRestSiblings: true }` for the deliberate
  `const { x, ...rest }` key-omit idiom used in reducers.
- **Small rules**: `no-unescaped-entities` (9) → `&apos;`/`&quot;`; `display-name` (3) →
  named `memo()`/`forwardRef()` function expressions (`Header`, `Modal`, `Card`);
  `jsx-key` (2) → keyed the mapped elements (`Chats`, `ChatUsers`, `SuggestedPosts`);
  `no-prototype-builtins` (1) → `"onClick" in option`; `no-extra-boolean-cast` (1).
- **`react-hooks/exhaustive-deps` (6 warnings)**: added the stable `dispatch` dep where
  safe (`ChatWindow`, `Chats`, `ProfilePage`, `ChatSidebar` scroll effect); scoped
  `eslint-disable` + rationale on the two genuinely intentional effects — `ChatSidebar`'s
  one-time mount profile fetch and `NotificationButton`'s 10s auto-hide timer choreography
  — per the §4.2 guardrail (no silent behavioural rewrites without test coverage).
- **Tree-wide Prettier pass** (`.prettierrc.json` from Phase 0): pure formatting, 161 files,
  mostly 4-space → 2-space reindent. Its own commit
  (`fdc03fbe5cdadd4a7c7dd94ddd03564b7e802498`), recorded in the new repo-root
  `.git-blame-ignore-revs` so `git blame` skips it (GitHub honours the file automatically;
  locally `git config blame.ignoreRevsFile .git-blame-ignore-revs`). Vendored
  `.claude/skills` and `README.md` are prettier-ignored.

Verification per commit: `npm run lint` (0 errors), `npm test` (6/6), `npm run build`
(clean, PWA `sw.js` still generated). Same caveat as Phase 0 — no backend/browser this
session, so the manual smoke of the touched screens (chat sidebar/window, notification
popup, profile, comment vote/delete, new-post crop) is still recommended before merge;
Phase 1 is mechanical but the `exhaustive-deps` dep-array additions and the keyed-Fragment
rewrite in `Chats.jsx` do touch render behaviour.

### 8.3 Phase 2 — shared HTTP client

Branch `frontend-modernization-phase-2`. Replaces the 9 hand-rolled service modules'
per-call `axios(...)` + `try/catch` with one axios instance.

- **New `src/services/apiClient.js`**: an `axios.create({ baseURL: '${VITE_BACKEND_URI}/api' })`
  instance with two interceptors —
  - *request*: attaches `localStorage.token` as the bare `authorization` header (the backend
    reads the raw value, no `Bearer` prefix) unless the caller already set one. This means
    the previously-unauthenticated reads (`getPost`, `getComments`, `getUserProfile`,
    `searchUsers`, …) now send the token when one exists — harmless on the public routes and
    a latent-bug fix on the `optionalAuth` ones (follow / vote state now populates).
  - *response*: `normalizeError()` (exported, unit-tested) turns **every** failure into a
    real `Error` with a readable `.message` plus `.status` / `.isNetworkError`. This fixes
    the crash that every service shared — `throw new Error(err.response.data.error)` throws
    a second `TypeError` on any network error, CORS failure, or timeout because
    `err.response` is `undefined`. Aborted requests pass through untouched.
  - `authHeader(token)` helper replaces the repeated `{ headers: { authorization } }` literal.
- **All ~40 functions across the 8 axios services migrated** to `apiClient.<method>("/path", …)`;
  the `try/catch` blocks are gone (the interceptor rejects with a clean error). JSDoc kept.
  `socketService.js` (socket.io, not axios) is unchanged. Fixed in passing:
  `userService.removeAvatar` was missing its `await` (its `catch` could never fire);
  `searchUsers` still swallows non-abort errors (returns `[]` now, not `undefined`) but
  re-throws `ERR_CANCELED` so the caller can ignore aborts.
- **`useSearchUsersDebounced`** now creates an `AbortController` per keystroke and aborts the
  previous in-flight search, so a slow earlier response can't overwrite a later query's
  results. Also drops a stale-response write via `signal.aborted` guard.
- **Error payloads normalised in the thunks**: `chatActions` / `profilePageActions` were
  dispatching `payload: err` (the whole object into the store); now `payload: err.message`,
  matching `feedActions` / `userActions` and shrinking the non-serializable-state surface
  ahead of Phase 3.
- **Tests**: `apiClient.test.js` (normalizeError + authHeader), `postService.test.js`,
  `userService.test.js`, `authenticationServices.test.js` — mock `./apiClient`, assert
  method/path/headers and error propagation. Suite 6 → **28 tests**; line coverage
  3.4% → ~7%.

Verification: `npm run lint` (0 errors, 68 jsx-a11y warnings), `npm test` (28/28),
`npm run build` (clean), `npm run test:coverage` (passes floor). No backend this session —
the manual pass matters more here than in Phases 0–1: every network call in the app now
routes through the new client. Smoke login (credential + token-resume), feed, profile +
follow, post/comment/vote, chat send, avatar upload/remove, notification read, and the
user type-ahead before merge.

### 8.4 Phase 3 — Redux Toolkit

Branch `frontend-modernization-phase-3`, seven commits (3.1 + one per slice pair + socket).

- **3.1 — `configureStore`**: `@reduxjs/toolkit` added; `legacy_createStore` +
  `applyMiddleware` replaced. Thunk is bundled (direct `redux-thunk` dep removed);
  `redux-logger` kept in dev via `getDefaultMiddleware().concat(logger)`; Redux DevTools on
  in dev. `serializableCheck` / `immutableCheck` enabled. `storeFactory` moved to
  `configureStore` (checks off).
- **3.2 — all 8 slices → `createSlice`**, one `<slice>Slice.js` per slice replacing the
  Types/Actions/Reducer(/Selectors) quartet; ~60 consumer files rewired (import specifiers
  only — public thunk/selector names unchanged, so component call sites are untouched);
  Immer removes every hand-spread update and all three `JSON.parse(JSON.stringify())` deep
  clones. Order: `modal`+`alert` → `feed`+`notification` → `profilePage`+`chat` → `user` →
  `socket`.
- **Bugs fixed in passing** (each with a test):
  - `feed`: `removePost` used `if (postIndex)` — deleting the post at index 0 silently did
    nothing. Now `if (index !== -1)`.
  - `user`: `signInStart`'s failed-token-resume did `dispatch(signOut)` (the thunk creator,
    never invoked) so a bad stored token was never cleared. Now `dispatch(signOut())`.
  - `socket`: `socketReducer`'s `DISCONNECT` case called `state.socket.disconnect()` — a
    mutation inside a reducer. Gone (see below).
  - `chat`: `pushMessageAction`'s `{ types: … }` typo is documented rather than "fixed" —
    fixing it would double-append the sent message (it also arrives via the `newMessage`
    socket echo). The thunk now deliberately only flips the sending flag.
- **`socket` — the live io instance is out of Redux.** `services/socketService.js` is now
  the socket module singleton (`openSocket` / `getSocket` / `closeSocket`); `openSocket`
  tears down any existing connection first (fixes a leaked-socket-on-reconnect bug). The
  slice holds only `{ connected, error }` and now tracks `connect` / `disconnect` /
  `connect_error` (status was never tracked before). The `socket.socket` serializable /
  immutable-check exemptions are gone; only `modal.modals` (render props) and
  `alert.onClick` (callback) remain exempt.
- **Deferred to Phase 5**: typed `RootState` / `AppDispatch` and typed
  `useAppSelector` / `useAppDispatch` hooks — meaningless without the TS layer.
- **Tests**: one `*Slice.test.js` per converted slice (reducers are pure — cheap, high
  value). Suite 28 → **55 tests**.

Verification per commit: `npm run lint` (0 errors), `npm test`, `npm run build` (clean, PWA
`sw.js` still generated). No backend/browser this session — this is the phase most in need
of a manual pass: every screen reads from the store. Before merge, smoke the full set —
auth (login, signup, token-resume, logout), feed load + infinite scroll + new-post appears,
profile + follow/unfollow counts, post vote / bookmark, comment + reply + vote + delete,
avatar change/remove, edit profile, notifications (list, mark-read, live arrival), chat
(sidebar list + scroll, open conversation, send, live receive), and modal/alert behaviour
throughout.

### 8.5 Phases 6–8 — dependency migrations

Branch `frontend-modernization-phase-6-8`, three commits. These are independent of the RTK
work and of each other; grouped only because each is small.

- **6 — react-router-dom 6 → 7** (`^6.30.6` → `^7.18.3`). The app uses the declarative
  `<BrowserRouter>` / `<Routes>` API with no data-router features, so this is a straight
  bump: the v6 `future` flags are v7 defaults and `react-router-dom` remains a re-export
  shim. Added `future={{ v7_startTransition, v7_relativeSplatPath }}` on v6 first, verified,
  then bumped and removed the redundant prop. `matchPath` / `useParams` (5) / `useLocation`
  (6) / `Link`+`NavLink` (16) / `Navigate` / `Outlet` are unchanged in v7. Data-router
  adoption (`createBrowserRouter`, loaders/actions) remains a separate follow-up (§5 / §8).
- **7 — Vite 6 → 7** (`^6.4.3` → `^7.3.6`). `@vitejs/plugin-react`, `vite-plugin-svgr`,
  `vite-plugin-pwa`, `vitest` all resolve against Vite 7 with no peer conflict (unlike the
  Vite 8 attempt in §3). `vite.config.js` unchanged. `npm run dev` boots and serves 200.
- **8 — `react-spring` → `@react-spring/web`** (`^9.7.5`). Only `useTransition` + `animated`
  are used (7 files); swapped the meta-package for the scoped web package — identical API,
  import specifier only. Dropping the umbrella also removes its
  `@react-spring/three` / `@react-three/fiber` transitive tree, which **cleared all 7
  npm-audit high-severity advisories (now 0 vulnerabilities)** and removed a stray React 19
  peer requirement, pre-clearing that Phase 10 blocker.

Verification per commit: `npm run lint` (0 errors), `npm test` (55/55), `npm run build`
(clean). Manual passes still outstanding: every route (Phase 6) and every animation —
toast alert, pulsating unread icon, options dialog, notification popup (Phase 8).

### Dependency state after Phases 0–8

| Package | Was (at clone / §1) | Now |
|---|---|---|
| State | classic Redux + `redux-thunk` + `redux-logger` | `@reduxjs/toolkit` 2.12 (`createSlice` ×8) |
| HTTP | per-call `axios(...)` | one `apiClient` axios instance + interceptors |
| Router | `react-router-dom` 6.30 | `react-router-dom` 7.18 |
| Build | Vite 5 → 6 (§2) | Vite 7.3 |
| Animation | `react-spring` (umbrella) | `@react-spring/web` 9.7 |
| Tests | none → Vitest, 6 tests (§4) | Vitest, 55 tests, coverage wired |
| Lint | 357 problems | 0 errors, 68 `jsx-a11y` warnings (tracked) |
| `npm audit` | 9 (2 mod, 7 high) | **0** |

Still pending: Phase 4 (RTK Query), Phase 5 (incremental TS), Phase 9 (forms → RHF + zod),
Phase 10 (React 19), the a11y follow-up, CI, and the PWA build-out.

### 8.6 Phase 10 — React 18 → 19

Branch `frontend-modernization-phase-6-8`.

- `react` / `react-dom` `^18.3.1` → `^19.2.8`; `@types/react` / `@types/react-dom` → `^19`.
- Pre-checked the known v19 removals against this codebase: no `defaultProps` on function
  components (0 occurrences — `.propTypes` via `prop-types` is unaffected and stays), no
  `ReactDOM.render` / `unmountComponentAtNode` / `findDOMNode` / `react-dom/test-utils` /
  `createFactory` / `react-test-renderer`. `main.jsx` was already on `createRoot` +
  `StrictMode`. So the bump needed no code changes.
- **`@react-spring/web` `^9.7.5` → `^10.1.2`** as part of this phase: v9.7.5's peer range
  caps at React 18, and 9.7.5 is its last v9 release. v10's only breaking change is
  `SpringContext` → `SpringContextProvider` (0 uses here — the app only uses `useTransition`
  + `animated`), and v10's peer range includes React 19. `npm audit` stays at 0.
- `@vitejs/plugin-react` 4.7 and `react-router` 7 already support React 19; no config change.

Verification: `npm run lint` (0 errors, 68 a11y warnings — unchanged), `npm test` (55/55),
`npm run build` (clean). Manual pass still outstanding: every animation (react-spring v10)
and a general click-through, since no backend/browser was available this session.

### 8.7 CI — GitHub Actions

Added `.github/workflows/ci.yml` (the repo's first CI). Runs on push to
`main` / `development` / `messenger-development` and on every PR. Two independent jobs
(there is no root `package.json`):

- **frontend**: `npm ci` → `npm run lint` → `npm test` (Vitest, 55) → `npm run build`
  (with a dummy `VITE_BACKEND_URI`). Node 22, npm cache keyed on `frontend/package-lock.json`.
- **backend**: `npm ci` → parse-only smoke check (`node --check` over every non-`node_modules`
  `.js` file). Not a real test run — `npm test` is deliberately `exit 1`, and most backend
  modules connect to Mongo / start a server on `require`, so executing them in CI isn't
  viable. Catches syntax errors only.

Both jobs verified locally (lint/test/build green; backend parse check passes).

### 8.8 PWA build-out

`vite-plugin-pwa` was already wired but stub-configured (`registerType: 'autoUpdate'`,
`devOptions.enabled: true`, a one-line `{ theme_color }` manifest, no icons). Finished it:

- **Icons** — `public/pwa-icon.svg` (the camera glyph, white on a `#0a0a0a` rounded square)
  is the source. Ran `@vite-pwa/assets-generator` (`--preset minimal-2023`) **once** to emit
  `public/pwa-{64,192,512}x512.png`, `maskable-icon-512x512.png`,
  `apple-touch-icon-180x180.png`, `favicon.ico`, then **uninstalled the generator** — it
  pulls a `sharp` with 3 open high-severity libvips CVEs and would have regressed the
  Phase-8 "0 vulnerabilities". `npm audit` stays at 0. To regenerate after changing the
  source icon: `npx @vite-pwa/assets-generator --preset minimal-2023 public/pwa-icon.svg`,
  then `npm uninstall @vite-pwa/assets-generator` again.
- **Manifest** — full `name` / `short_name` / `description` / `display: standalone` /
  `start_url` / `scope` / theme+background `#0a0a0a` / the four icon entries.
- **Offline** — `workbox.globPatterns` precaches the built shell; one `runtimeCaching` rule
  (`CacheFirst`, 200 entries / 30 days) for `res.cloudinary.com` images. **`/api/` is never
  cached** (per-user, always-changing) — `navigateFallbackDenylist: [/^\/api\//]`.
- **Update prompt** — `registerType` switched `autoUpdate` → `prompt`; new
  `src/components/PWABadge/PWABadge.jsx` (+ `sass/components/_pwa-badge.scss`, `@use`d in
  `main.scss`) uses `virtual:pwa-register/react`'s `useRegisterSW` to show an offline-ready
  / update-available toast with Reload / Dismiss. Rendered once from `App.jsx`.
- **`devOptions.enabled` removed** — no service worker in `npm run dev` anymore (it only
  caused stale-asset confusion); `PWABadge` renders nothing when there's no SW.
- `index.html` gained `apple-touch-icon` and `theme-color`.

Verification: `npm run lint` (0 errors, 68 warnings — unchanged), `npm test` (55/55),
`npm run build` (clean; `dist/manifest.webmanifest` + `sw.js` correct, 61 precache entries).
Not exercised in a real install / offline session — no browser this session.

CLAUDE.local.md's "PWA is half-removed" quirk note is now stale (also: `src/serviceWorker.js`
was already deleted, and `main.jsx` no longer has a commented `register()` call).

### 8.9 a11y — the safe subset

The `jsx-a11y` warning count was 68. Cleared the 26 that carry no behavioural or visual
risk, leaving 42 (all one kind — see below):

- **`label-has-for` (15) — rule turned off in `eslint.config.js`.** The plugin deprecated
  it in favour of `label-has-associated-control` (kept on); it still ships in `recommended`
  and mis-fires on forms that pair `<label htmlFor>` with a control `id` correctly
  (`FormInput` does exactly this and passes `id` through to its `<input>`).
- **Empty spacer `<label></label>` (4, `label-has-associated-control`)** in
  `ChangePasswordForm` / `EditProfileForm` — these are grid-column spacers in
  `.settings-form__form-group` (which selects children positionally, not by tag), swapped to
  `<span aria-hidden="true" />`. No layout change.
- **`control-has-associated-label` (6)** — added `aria-label` to the hidden file inputs
  (`ChangeAvatarButton`, `NewPostButton`), the chat / comment / caption / search inputs.
  Purely additive.
- **`alt-text` (1)** — `alt=""` on the placeholder `<img>` in `ChatUsers` (that component
  has an unrelated `src={"S"}` bug left untouched — out of scope).

**Still open (42 warnings / 21 sites), deferred as its own follow-up:**
`click-events-have-key-events` + `no-noninteractive-element-interactions` +
`no-static-element-interactions` — all `<div>` / `<img>` / `<li>` with an `onClick` and no
keyboard path (`Comment`, `PostDialog`, `ProfileHeader` ×4, `NotificationFeed` ×2,
`FilterSelector` ×2, `UserCard`, `Avatar`, …). Fixing these means converting to `<button>`
or adding `role` + `tabIndex` + `onKeyDown`, which changes focus order and key handling on
core interaction paths — needs a browser QA pass that wasn't available this session. §8's
roadmap always split this ("non-keyboard `onClick`s … a real theme-toggle control") into a
dedicated follow-up.

Verification: `npm run lint` (0 errors, 42 warnings, down from 68), `npm test` (55/55),
`npm run build` (clean).

### Dependency / quality state after Phases 0–10

| Package | At clone | Now |
|---|---|---|
| React | 18.3 | **19.2** |
| Router | react-router-dom 6.30 | 7.18 |
| Build | Vite 5 | Vite 7.3 |
| Animation | `react-spring` umbrella | `@react-spring/web` **10.1** |
| State | classic Redux + thunk | RTK 2.12 (`createSlice` ×8) |
| HTTP | per-call `axios()` | one `apiClient` + interceptors |
| Tests | none | Vitest, 55, coverage wired |
| Lint | 357 problems | 0 errors, **42** `jsx-a11y` warnings |
| `npm audit` | 9 (7 high) | **0** |
| PWA | stub config, no icons | full manifest + icons + offline + update prompt |
| CI | none | GitHub Actions (frontend lint/test/build + backend parse) |

Still pending: Phase 4 (RTK Query), Phase 5 (incremental TS), Phase 9 (forms → RHF + zod),
and the a11y interactive-element follow-up (42 warnings).

### 8.10 Phase 5 — TypeScript migration

§8's original roadmap scoped Phase 5 as *incremental* typing (`jsconfig.json` + `checkJs` +
typed JSDoc, leaf-inward). This branch instead did a **full `.jsx`/`.js` → `.tsx`/`.ts`
conversion** of the entire `src/` tree in one pass — every component, page, redux slice,
service, hook, and util file was renamed and given real TypeScript syntax. That's a
deliberately larger scope than the roadmap called for; noted here as a divergence, not a
correction.

- **Tooling**: `typescript` + `typescript-eslint` added; `frontend/tsconfig.json` (bundler
  resolution, `strict: true`, `noUnusedLocals`/`noUnusedParameters`, `jsx: react-jsx`).
  `eslint.config.js` rewritten on `tseslint.config(...)`, `files` patterns extended to
  `ts,tsx`, `no-unused-vars` handed off to `@typescript-eslint/no-unused-vars`.
  `vite.config.js` → `vite.config.ts`. `package.json`: `build` is now
  `tsc --noEmit && vite build`; new `typecheck` script (`tsc --noEmit`).
- **New files**: `src/vite-env.d.ts` (Vite/plugin ambient types + the `ImportMetaEnv` shape +
  an `ion-icon` JSX intrinsic, since Ionicons is a web component used directly in JSX);
  `src/redux/hooks.ts` (typed `useAppDispatch`/`useAppSelector` + an `AppThunk` helper —
  the piece §8.4 deferred "meaningless without the TS layer"); `src/types/` (`api.ts`,
  `models.ts`, `components.ts`, `index.ts`) as the shared type-definition surface referenced
  across slices/services/components instead of inlining shapes per file.
- **`backend/scripts/dev-mongo.cjs`**: a local convenience script (in-memory MongoDB via
  `mongodb-memory-server`) used to run the backend without a system `mongod` while manually
  exercising the app during this migration. Committed later alongside `mongodb-memory-server`
  as a `backend` devDependency and a `dev:mongo` script (`node scripts/dev-mongo.cjs`) — it
  was backend tooling unrelated to the TS migration itself, so it went in as its own commit.

**Current state — build and lint are both red; this is a WIP push, not a finished phase:**

- `npm run typecheck` (`tsc --noEmit`): **333 errors.** Dominant patterns: components
  destructuring untyped props (`TS7031`/`TS7006` implicit `any`), thunk/selector return
  values coming back as `unknown` from Redux Toolkit's typed state (`TS2339`/`TS18046`),
  optional/nullable fields not narrowed before use (`TS18047`/`TS18048`/`TS2345` "possibly
  null/undefined"), and prop-types on connected components not yet matching real call sites
  (`TS2739`/`TS2741`/`TS2322`). Since `build` now runs `tsc --noEmit` first, **`npm run
  build` currently fails** — do not deploy off this branch until that's cleared.
- `npm run lint`: 27 errors + 42 warnings (was 0 errors / 42 warnings before this branch).
  The regression is `@typescript-eslint/no-unused-expressions` firing on the codebase's
  existing `cond && doThing()` short-circuit side-effect idiom, which the JS-only ruleset
  never flagged (`useScrollPositionThrottled.ts`, `ProfileHeader.tsx`, others). The 42
  warnings are the pre-existing §8.9 a11y backlog, unchanged.
- `npm test`: **55/55 pass, unchanged** — Vitest runs through `esbuild`/`babel` transforms
  that don't type-check, so the test suite being green doesn't mean the types are sound.

**Recommended before merging this branch**: work the 333 `tsc` errors down to zero (the
`ProfilePage`/`ProfileHeader`/`HomePage`/`PostPage`/`SettingsPage` files carry the bulk of
them — thunk-return typing and prop shapes for the `Card`/`Header` family look like the
highest-leverage fixes), decide whether `prop-types` (still imported at runtime in a few
files, now also missing type declarations — `TS7016`) is dropped in favor of the new TS
prop types or kept as a runtime check, then fix the 27 new lint errors (either allow the
short-circuit idiom via a scoped rule config, matching the §4.2 guardrail of not silently
rewriting working patterns, or convert those specific sites to `if` statements) before
flipping `build`/`typecheck`/lint back to green in CI.

#### 8.10.1 `HomePage`/`ProfileHeader`/`ProfilePage` cleared (333 → 219 `tsc` errors)

Fixed every `tsc --noEmit` error rooted in `HomePage.tsx`, `ProfileHeader.tsx`,
`ProfilePage.tsx`, and `EmptyProfile.tsx`, plus every leaf component those four import that
needed real prop types to make that possible: `MobileHeader`, `SuggestedUsers`,
`SuggestionCard`, `NewPostButton`, `ChangeAvatarButton`, `SettingsButton`, `LoginCard`. Left
everything else (`PostPage`, `SettingsPage`, `Header.tsx`, `NotificationButton`,
`SignUpCard`, `Feed`'s own internal `PostDialog` bug, …) for a follow-up pass — none of it
blocks a clean typecheck of the files above.

- **`types/models.ts` — `Profile` was the wrong shape.** It was authored flat
  (`{ username, avatar, … }`), but `retrieveUser` in
  `backend/controllers/userController.js` actually responds `{ user, followers, following,
  isFollowing, posts }` — a nested `user` sub-document. Every consumer (`ProfileHeader`,
  `ProfilePage`, `EmptyProfile`) already read `data.user.avatar` etc., so the *type* was
  wrong, not the components. Replaced `Profile` with the nested shape and added
  `ProfileUser`; `ProfileResponse`/`ProfilePageData` follow from it. `data.user` is
  non-null-asserted at each read site with a comment — `ProfileHeader`/`ProfilePage` only
  render once `fetchProfileAction` has resolved (gated by `ProfilePage`'s `renderProfile`),
  so the fetch-in-flight state where `user` is genuinely absent never reaches these reads.
- **`types/models.ts` — added `SuggestedUser` (`User & { posts?: Post[] }`)** for
  `GET /api/user/suggested/:max`, which embeds up to 3 preview posts per suggestion
  (confirmed against the aggregation in `retrieveSuggestedUsers`); threaded through
  `userService.getSuggestedUsers` and `SuggestedUsersResponse`.
- **Three real, pre-existing bugs surfaced by the stricter types** (same class as the ones
  fixed in §8.4, no test coverage available to pin them so documented here instead):
  - `ProfileHeader.tsx`'s `showUsersModal` passed the numeric `following` **count** as
    `UsersList`'s `following` prop, which is actually a boolean "show the following list
    (vs. followers)" flag — present verbatim in the original pre-TS `.jsx`, so it predates
    this migration. Fixed to `following={!followers}`, mirroring the `title: followers ?
    "Followers" : "Following"` logic one line above it.
  - `ProfilePage.tsx` passed `PreviewImage` the raw `postVotes`/`comments` **arrays** where
    it declares (and needs) `number` counts — same vintage bug, would have rendered
    `[object Object]`-style output instead of a count had the arrays ever been non-empty.
    Fixed to `.length` with a `?? 0` fallback.
  - `ProfilePage.tsx`'s `handleClick` (opens the post dialog) read `data.avatar`, a field
    that has never existed on the profile payload (the real value is nested at
    `data.user.avatar`) — dead code that always sent `undefined`. Fixed to `data.user?.avatar`.
- **Deleted `pages/ProfilePage/ProfilePageReducer.ts`** — a pre-RTK `useReducer` reducer
  superseded by `profilePageSlice.ts` (§8.4) but never removed; confirmed unimported
  anywhere before deleting.
- **`token`/`username` nullability**: `selectToken` is `string | null` and `useParams()`'s
  route params are `string | undefined`, but the thunks/services they feed
  (`fetchFeedPostsStart`, `followUserAction`, `getSuggestedUsers`, `changeAvatarStart`, …)
  require plain `string`. These routes/components only render for an authenticated viewer
  with the route param present, so resolved with `token ?? ""` / `username = ""` defaults
  at the call sites rather than loosening the thunk signatures — no observable behavior
  change (a missing token was already going to fail auth either way).
- **`connect()`-wrapped components** (`NewPostButton`, `SettingsButton`) had entirely
  untyped `mapDispatchToProps` and own-props. Typed both with explicit `connect<TStateProps,
  TDispatchProps, TOwnProps>(...)` generics rather than leaving them to infer (inference
  degrades badly on `connect()` once any argument is untyped).
- **`LoginCard.tsx`**: converted its runtime `PropTypes` to a native interface (matches the
  `react/prop-types` → TS-types direction already decided in §8's Phase 5 entry). Other
  files still importing `prop-types` (`PostDialogCommentForm`, `LoginPage`) are untouched —
  out of scope for this pass.

Verification: `npm run typecheck` — 333 → **219** errors, zero remaining in the touched
files or their direct dependencies. `npm test` — 55/55, unchanged. `npm run lint` — 27
errors + 42 warnings, unchanged (none of the 27 are in files touched this pass; the
pre-existing `no-unused-expressions` regression from §8.10 is untouched). `npm run build`
still fails overall (219 errors remain elsewhere) — the remaining files are listed in this
session's `tsc` output; `PostPage`/`SettingsPage`/`Header.tsx` are likely the next
highest-leverage targets since they're still widely imported.

#### 8.10.2 `PostPage`/`SettingsPage`/`Header.tsx` cleared (219 → 181 `tsc` errors)

Cleared every `tsc --noEmit` error rooted in `pages/PostPage/PostPage.tsx`,
`pages/SettingsPage/SettingsPage.tsx`, and `components/Header/Header.tsx` (the desktop nav
bar — distinct from `MobileHeader`, already fixed in §8.10.1), plus every leaf component
those three needed properly typed: `SearchBox`, `NotificationButton` (+ its
`NotificationPopup` child), `EditProfileForm`, `ChangePasswordForm`, `SettingsForm` /
`SettingsFormGroup`. Same scoping rule as before — fixed what's rooted in these files and
their direct dependencies, left the rest (`Feed.tsx`'s own internal `PostDialog` bug, the
Chat cluster, `NewPost*`, `SignUpCard`, …) alone.

- **`PostPage.tsx`**: `useParams()`'s `postId` is `string | undefined`, but `PostDialog`
  requires `postId: string`. Same fix as `ProfilePage`'s `:username` in §8.10.1 — default
  destructure (`const { postId = "" } = useParams()`) rather than loosening `PostDialog`'s
  prop type, since the route always supplies `:postId`.
- **`SettingsPage.tsx` — a real, pre-existing dead prop.** Both `<NavLink>`s passed
  `activeClassName="font-bold sidebar-link--active"`, which was react-router v5 API; v6
  removed it in favor of a `className` render-prop (`({isActive}) => ...}`), so this has
  been a silent no-op since the router v6 bump in §3. Confirmed it's genuinely dead, not
  just wrongly named: `sidebar-link--active` doesn't exist anywhere in `src/sass/`, so there
  was no working active-state styling to preserve or reimplement. Removed the invalid prop
  rather than inventing new active-link styling with no corresponding design — flagging here
  since restoring an active nav-link indicator is a legitimate small UX follow-up, just not
  one this pass should improvise.
- **`Header.tsx`'s two direct leaf deps**:
  - `SearchBox.tsx`: typed props (`style?`, `setResult?: (result: User[]) => void`,
    `onClick?`, `type?: string`) matching its two real call sites (`Header.tsx` bare,
    `SuggestedPosts.tsx` with all three). Also fixed `useSearchUsersDebounced`'s `result`
    state, which was typed `User[] | null` despite never actually being set to `null`
    anywhere (initial value and every `setResult` call use `[]`) — narrowed to `User[]`,
    which resolves `SearchBox`'s "possibly null" errors at the source instead of guarding
    every read.
  - `NotificationButton.tsx` (+ `NotificationPopup.tsx`): typed `mobile?`/`icon?` props
    (confirmed against both call sites — bare in `Header.tsx`, `mobile` + `icon` in
    `MobileNav.tsx`). Three real typing traps here, not bugs — documented since they're easy
    to get wrong:
    - `setShowNotificationPopupTimeout(setTimeout(...))` needs
      `useState<ReturnType<typeof setTimeout> | null>(null)`, not bare `useState(null)`.
    - A later `clearTimeout(notificationPopupTimeout)` call was missing the null-guard its
      sibling call three lines up already had — added `if (notificationPopupTimeout)`.
    - `@react-spring/web`'s `useTransition(cond ? {notifications} : false, config)` infers
      `Item` ambiguously from a two-argument call with a conditional first argument; giving
      the ternary result an explicit local type
      (`const transitionItem: { notifications: Notification[] } | false = …`) resolves it
      cleanly without touching the render callback.
    - The `const Wrapper = mobile ? "span" : "button"` dynamic-tag pattern (renders a
      `<span>` on mobile since it sits inside an already-interactive `<Link>`, a `<button>`
      otherwise) needs `Wrapper: ElementType` *and* `wrapperProps` typed as
      `ComponentPropsWithoutRef<"button">` — TS's JSX checker validates a spread against the
      narrowest branch of a string-literal-union tag type, so leaving `wrapperProps`
      untyped (or typing `Wrapper` alone) still fails.
- **`SettingsPage.tsx`'s form routes**: `EditProfileForm` and `ChangePasswordForm` both read
  `currentUser.*` unguarded (`CurrentUser | null`) and passed a nullable `token` into thunks
  requiring plain `string` — same `?? ""` / optional-chaining treatment as §8.10.1, since
  both forms are only reachable while authenticated. `EditProfileForm`'s Formik `validate`
  callback and `initialValues` got a real `EditProfileFormValues` interface (was
  implicit-`any` throughout, including `errors: {}` being assigned arbitrary keys).
  `SettingsForm`/`SettingsFormGroup` had no prop types at all (`onSubmit`/`children`); typed
  both minimally (`FormEventHandler`, `ReactNode`).

Verification: `npm run typecheck` — 219 → **181** errors, zero remaining in the touched
files or their direct dependencies. `npm test` — 55/55, unchanged. `npm run lint` — 27
errors + 42 warnings, unchanged. `npm run build` still fails overall (181 errors remain).
Remaining clusters, roughly by concentration: the Chat surface (`ChatSidebar`, `ChatUsers`,
`ChatWindow/*`, `MobileNav.tsx`), the `NewPost*` family + `Feed.tsx` (which also carries its
own pre-existing `PostDialog` prop bug, noted but untouched in §8.10.1), `NotificationFeed`,
`SearchSuggestion`, `SignUpCard`, and the auth/explore pages (`LoginPage`, `ConfirmationPage`,
`ExplorePage`, `ActivityPage`, `App.tsx`, `main.tsx`). The Chat cluster looks like the next
highest-leverage target — four files, one feature, likely shared prop-typing gaps.

#### 8.10.3 Chat cluster cleared (181 → 151 `tsc` errors)

Targeted the Chat surface flagged above: `ChatSidebar.tsx`, `ChatSidebar/ChatUsers.tsx`,
`ChatWindow.tsx`, `ChatWindow/Chat/{ChatContainer,ChatInput,Chats}.tsx`, `MobileNav.tsx`.

- **`types/models.ts`'s `Message` type was wrong, same class of bug as §8.10.1's `Profile`.**
  It declared `sender`/`receiver`/`conversation`/`date`, but
  `backend/models/Message.js`/`messageController.js` actually persist and return
  `senderId`/`receiverId` with no `conversation` field on the message document itself
  (that lives on the `Conversation` doc instead) and no `date` field (just Mongoose's
  `timestamps: true` → `createdAt`/`updatedAt`). `Chats.tsx`'s `message.senderId` was
  already correct runtime code that the wrong type was flagging as an error
  (`TS2551: ... did you mean 'sender'?`). Fixed the type; `createdAt` is now required
  since `timestamps: true` guarantees it's always present.
- **`ChatSidebar.tsx`**: `useRef()` → `useRef<HTMLElement>(null)` (matches the pattern
  already used for `UsersList`/`NewPostButton`/`ChangeAvatarButton`); `chat.data` is
  `ChatUser[] | null` per `chatSlice.ts`, guarded with `?? 0` before the length
  comparison; `currentUser`/`token` nullability resolved with `?.`/`?? ""` at the call
  sites (ChatSidebar only renders inside `ChatPage`, gated by `ProtectedRoute`, so these
  are never actually empty at runtime — verified via `App.tsx`'s route config).
- **`ChatUsers.tsx`**: typed `chattableUsers` (`ChatUser[] | null | undefined`) and a new
  local `ChatUserCardProps` interface for the `userCardProps` object spread into
  `UserCard`. Left the known `src={"S"}` placeholder-image bug untouched per directive.
  Also found (and left, documented inline) a second bug of the same vintage in the same
  component: `<UserCard>{ChatUserBody}</UserCard>` passes the `ChatUserBody` *component
  reference* as children instead of invoking it (`<ChatUserBody userCardProps={...} />`),
  present verbatim in the pre-TS `.jsx` — React silently drops a function child, so this
  has never actually rendered anything. Fixing it would newly render the `src={"S"}` bug,
  so left as-is with an explicit `as unknown as ReactNode` cast and a comment, rather than
  changing two behaviors under one "type fix."
- **`ChatWindow.tsx`**: `const { id } = useParams()` → `const { id = "" } = useParams()`,
  same pattern as `ProfilePage.tsx`'s `username` in §8.10.1 (the route always supplies
  `:id`).
- **`ChatContainer.tsx`/`Chats.tsx`/`ChatInput.tsx`**: added `userToChatId: string` prop
  types throughout. `Chats.tsx` also receives an unused `chatUser` prop from
  `ChatContainer` (it re-selects the same value from the store itself) — kept as an
  accepted-but-unused optional prop rather than removing the pass-through, since that's
  a `ChatContainer.tsx` call-site change outside a single component's type fix; confirmed
  identical in the pre-TS `.jsx`. `ChatInput.tsx`'s `useState()` (untyped, inferred
  `undefined`) → `useState("")`; its `<form>` has no `onSubmit` wired (Enter-to-send is
  already broken, send only works via the icon's `onClick`) — confirmed identical
  pre-TS, left untouched, just typed `handleSubmit`'s event as the `MouseEvent<HTMLDivElement>`
  `Icon.onClick` actually delivers.
- **`MobileNav.tsx`**: typed `currentUser: CurrentUser` (required, not nullable) — `App.tsx`
  only renders `<MobileNav>` inside a `{currentUser && ...}` guard, so the narrower type
  matches the real call site without adding a redundant guard inside the component.
- One lint regression surfaced and fixed during this pass: asserting `currentUser!._id`
  inside a `useEffect` whose deps array read `currentUser?._id` triggered a new
  `react-hooks/exhaustive-deps` warning (the assertion form doesn't match the dep-array
  expression pattern the rule looks for). Switched both to `currentUser?._id ?? ""` —
  same runtime behavior, no lint delta.

Verification: `npm run typecheck` — 181 → **151** errors, zero remaining in the touched
files or their direct dependencies. `npm test` — 55/55, unchanged. `npm run lint` — 27
errors + 42 warnings, unchanged (see the exhaustive-deps note above). `npm run build`
still fails overall (151 errors remain). Remaining clusters by concentration:
`SuggestedPosts.tsx` (24) + `HashtagPosts.tsx` (20) — both `ExplorePage` tab routes, 44
errors combined; the `NewPost*` family — `NewPostEdit` (14), `NewPostForm` (9), `NewPost`
(6), `NewPostFilter` (4) — 33 errors, one feature; `PostDialogCommentForm.tsx` (20,
still carries the `prop-types` runtime import noted as out-of-scope in §8.10.1);
`NotificationFeed.tsx` (17); `SearchSuggestion.tsx` (12); `SignUpCard.tsx` (8). The
`ExplorePage` pair or the `NewPost*` family look like the next highest-leverage targets.

#### 8.10.4 ExplorePage tabs + NewPost family cleared (151 → 68 `tsc` errors)

Covered both clusters flagged above in one pass: `SuggestedPosts.tsx`, `HashtagPosts.tsx`,
`ExplorePage.tsx` (and the two now-typed call sites of the same components inside
`App.tsx` — see below), plus `NewPost.tsx`, `NewPostFilter.tsx`, `NewPostForm.tsx`,
`NewPostPage.tsx` (already clean). `NewPostButton.tsx` (typed in §8.10.1) reverified clean.

- **A third type-authoring bug of the same class as `Profile`/`Message`: `Post` doesn't
  describe what `getSuggestedPosts`/`getHashtagPosts` actually return.** Both endpoints go
  through `populatePostsPipeline` (`backend/utils/controllerUtils.js`), which — unlike the
  feed pipeline the `Post` type was modeled on — reduces `comments`/`postVotes` to
  pre-aggregated **counts** (`$size`) rather than leaving them as arrays, and never
  produces the feed's `commentData` field. Rather than bend the shared `Post` type (used by
  Feed/ProfilePage, both out of scope and currently *relying* on the array-shaped
  interpretation — see the open question below), added a distinct `PostSummary` type plus
  `SuggestedPostsResponse`/`HashtagPostsResponse`/`PostFiltersResponse` in `types/api.ts`,
  and retyped `postService.ts`'s `getSuggestedPosts`/`getHashtagPosts`/`getPostFilters`
  accordingly. `getHashtagPosts` was also flatly wrong about its own return shape (typed as
  `Post[]`; the backend actually sends `{ posts, postCount }` via a `$facet`) — the
  component's existing `response.posts`/`response.postCount` reads were already correct.
- **`getPostFilters` had the same "type disagrees with a correct component" bug**: typed
  `Filter[]`, but `backend/routes/post.js` sends `{ filters }` (an object), matching
  `NewPost.tsx`'s pre-existing `response.filters` read. Added `PostFiltersResponse`.
- **Four more pre-existing bugs surfaced, confirmed against the pre-TS `.jsx`, fixed**
  (same low-risk class as §8.10.1's `UsersList`/`PreviewImage` fixes):
  - `SuggestedPosts.tsx`'s "already seen" dedup filter compared `post.id === newPost.id` —
    but these are raw aggregate results, never Mongoose documents, so neither side has an
    `.id` (only `._id`); `undefined === undefined` is always `true`, so once a first page
    loaded, **every subsequent suggested post was silently filtered out** — infinite scroll
    on the suggested-posts tab has never actually appended anything past page one. Fixed to
    `post._id === newPost._id`.
  - `HashtagPosts.tsx` computed `hasMore: response.length === 20` against
    `{ posts, postCount }` (no `.length` on that shape, always `undefined`) — pagination
    past the first page has never worked here either. Fixed to `response.posts.length === 20`.
  - Both `SuggestedPosts.tsx` and `HashtagPosts.tsx` called
    `handleClick(post._id, post.avatar)` — `avatar` has never been a top-level `Post`/
    `PostSummary` field (it's nested at `post.author.avatar`), so the post-dialog's avatar
    has always opened blank from these two entry points. Fixed to `post.author.avatar`.
  - `NewPost.tsx`'s effect cleanup called `window.URL.revokeObjectURL(previewImage)` —
    passing the whole state *object* where `revokeObjectURL` expects a blob-URL *string*;
    always a silent no-op (browsers ignore malformed arguments). Removed rather than
    "fixed forward" — the surviving code only ever calls `readAsDataURL` (not
    `createObjectURL`), so there's no actual object URL to revoke; the revoke call was
    inherited from a since-removed image-cropping flow (see `NewPostEdit` below). Removing
    it also made a stale `eslint-disable-next-line react-hooks/exhaustive-deps` comment
    reportable as unused (`previewImage` was the only thing the rule had been complaining
    about); removed that too — net lint delta zero.
- **Deleted `NewPostEdit.tsx`** — confirmed unimported anywhere (`grep -rn NewPostEdit
  src/` matches only a commented-out block in `NewPost.tsx`) and depends on
  `react-image-crop`, a package that isn't installed (`TS2307`, and absent from
  `package.json`/`node_modules`) — this is a legacy image-cropping step that was disabled
  before the TS migration and never cleaned up. Same treatment as `ProfilePageReducer.ts`
  in §8.10.1.
- **`Avatar`'s dead `size` prop**: `NewPostForm.tsx` passed `size="3rem"` to `<Avatar>`,
  but `Avatar.tsx`'s component body has never read a `size` prop (only its old
  `PropTypes` declaration mentioned one) — confirmed dead in the pre-TS `.jsx` too. Dropped
  the prop at the call site rather than adding a fake one to `Avatar`'s type.
- **`showModal`/`showAlert` prop typing**: `SuggestedPosts.tsx`/`HashtagPosts.tsx` receive
  these as plain dispatch-wrapping functions from their caller (unlike `ProfileHeader.tsx`
  in §8.10.1, which receives the raw `showModal` action creator itself forwarded as a
  prop) — typed as plain call signatures (`(props: Record<string, unknown>, component:
  string) => void`), not `typeof showModalAction`, which demands the full
  `ActionCreatorWithPreparedPayload` shape and doesn't match a wrapper function.
- **`App.tsx` fallout**: typing `SuggestedPosts`/`HashtagPosts` props as required broke two
  existing call sites there — `App.tsx` independently declares
  `<Route path="/explore">` with nested children rendering these same two components with
  *no* props, alongside `ExplorePage.tsx`'s own internal `<Routes>` for the identical two
  sub-paths. Since `ExplorePage.tsx` has no `<Outlet/>`, React Router never actually inserts
  the outer tree's child `element` anywhere — confirmed unreachable by the exact same
  "no Outlet → child element never rendered" mechanism that
  makes nested routes require an `<Outlet/>` at all (`ExplorePage`'s own JSX has no such
  outlet). The route *paths* still matter for URL matching (removing them would 404), so
  left the route structure alone; wired matching real props (mirroring
  `ExplorePage.tsx`'s own handlers) at the two `element={...}` call sites instead of
  deleting anything — safe either way, and strictly safer if this analysis is wrong.
- **Open item, not fixed (would touch out-of-scope files)**: `ProfilePage.tsx`'s
  `PreviewImage` usage (§8.10.1) treats `post.postVotes`/`post.comments` as arrays
  (`.length ?? 0`) because it trusted the (also wrong, but differently wrong) `Post` type.
  `ProfilePage`'s own posts come from `retrieveUser`'s `$facet` in
  `backend/controllers/userController.js`, which — like `populatePostsPipeline` — also
  reduces both to `$size` counts, not arrays. So `.length` on a number is `undefined`,
  and `§8.10.1`'s fix likely renders 0 likes/comments on every profile post. Flagged here
  rather than fixed, since correcting it means either changing the shared `Post` type
  (breaks `Feed.tsx`/anything else assuming the array shape) or introducing a
  `ProfilePostSummary`-style type split there too — a call best made deliberately, not as
  a side effect of this pass.

Verification: `npm run typecheck` — 151 → **68** errors, zero remaining in the touched
files (including `App.tsx`'s two now-fixed call sites; its other 2 pre-existing errors —
unrelated `document.querySelector("body")` null-checks — are untouched and out of scope).
`npm test` — 55/55, unchanged. `npm run lint` — 27 errors + 42 warnings, unchanged (see the
exhaustive-deps note above). `npm run build` still fails overall (68 errors remain).
Remaining, by concentration: `PostDialogCommentForm.tsx` (20, `prop-types` import noted
since §8.10.1), `NotificationFeed.tsx` (17), `SearchSuggestion.tsx` (12), `SignUpCard.tsx`
(8), `Feed.tsx` (3, its own pre-existing `PostDialog` prop bug from §8.10.1), plus single
digits in `App.tsx`/`ConfirmationPage.tsx`/`LoginPage.tsx`/`ActivityPage.tsx`/`main.tsx`/
`profilePageSlice.test.ts`. `PostDialogCommentForm.tsx` and `NotificationFeed.tsx` look
like the next highest-leverage targets; `SignUpCard.tsx`'s Formik generics are a different
flavor of fix (typed form values) than the prop-typing pattern used throughout §8.10.

#### 8.10.5 Fixed the open `ProfilePage`/`PreviewImage` display bug flagged in §8.10.4

§8.10.4 flagged (but deliberately left unfixed) that §8.10.1's `PreviewImage` fix in
`ProfilePage.tsx` — `post.postVotes?.length ?? 0` / `post.comments?.length ?? 0` — was
itself wrong: `ProfilePage`'s posts come from `retrieveUser`'s `$facet` and
`retrievePosts` in `backend/controllers/userController.js`, both of which reduce
`comments`/`postVotes` to `$size` counts (numbers), not arrays, the same pre-aggregated
shape as §8.10.4's new `PostSummary` type. `.length` on a number is `undefined`, so every
profile post was rendering **0 likes and 0 comments** since §8.10.1 — confirmed as a
regression introduced by this migration itself, not a pre-existing bug.

Fixed by adding a dedicated `ProfilePost` type (`_id`, `image`, `filter?`, `comments:
number`, `postVotes: number` — only the fields both `retrieveUser`'s initial page and
`retrievePosts`'s paginated page actually share and the UI uses; the two endpoints project
different extra fields — nested `author` vs `user`, presence of `date`/`hashtags` — so
unifying further wasn't worth it for what's rendered today) rather than bending the shared
`Post` type, which `Feed.tsx` still correctly relies on as arrays. Threaded through
`Profile.posts`/`ProfileResponse` (`types/models.ts`/`types/api.ts`), `postService.getPosts`,
and `profilePageSlice.ts`'s `ProfilePageData.posts`/`addPosts`. `ProfilePage.tsx` now passes
`post.postVotes`/`post.comments` straight through as the counts they are.

Verification: `npm run typecheck` — still **68** (the one test-fixture error in
`profilePageSlice.test.ts` shifted from complaining about a missing `Post` shape to a
missing `ProfilePost` shape — same pre-existing gap, not a new error). `npm test` — 55/55.
`npm run lint` — 27 errors + 42 warnings, unchanged.

#### 8.10.6 `PostDialogCommentForm`/`NotificationFeed` cleared (68 → 18 `tsc` errors)

Cleared every `tsc --noEmit` error rooted in `components/PostDialog/PostDialogCommentForm/
PostDialogCommentForm.tsx`, its direct dependency `components/SearchSuggestion/
SearchSuggestion.tsx`, and `components/Notification/NotificationFeed/NotificationFeed.tsx`.
Left everything else alone — `SignUpCard.tsx` (Formik generics, a different flavor of fix),
`Feed.tsx`'s own pre-existing `PostDialog` prop bug, `profilePageSlice.test.ts`'s fixture
gap, and the handful of single-digit errors in `App.tsx`/`ConfirmationPage.tsx`/
`LoginPage.tsx`/`main.tsx` — confirmed zero fallout in any of them.

- **`types/models.ts`'s `Notification` type was wrong, same class of bug as `Profile`/
  `Message`/`PostSummary`.** It declared `notificationData: { postId?, image?, thumbnail?,
  comment? }` and had no `isFollowing` field at all. Checked the actual aggregation in
  `backend/controllers/notificationController.js` (`retrieveNotifications`) and the three
  notification-creation sites (`postController.js`'s like notification,
  `controllerUtils.js`'s `sendCommentNotification`/`sendMentionNotification`): every
  notification carries a real, always-present `isFollowing: boolean` (whether the receiver
  follows the sender back — added via a `$lookup`+`$addFields` in the aggregation, unrelated
  to `FollowResponse`'s `operation` field of the same name elsewhere), and
  `notificationData` is `{ postId?, image?, filter?, message? }` — `thumbnail`/`comment`
  were never real fields; `filter` and `message` were the ones missing.
  `NotificationFeed.tsx`'s existing `notification.isFollowing`/`.notificationData.message`/
  `.filter` reads were already correct against the real API; the type was what needed
  fixing. `notificationData` fields accessed with `?.` since presence is only implied by
  `notificationType` (never `follow`), not encoded in the type as a discriminated union —
  matches the `?? ""` "can't happen with valid data, but not provable to the compiler"
  pattern used throughout §8.10.
- **`PostDialogCommentForm.tsx`**: added a `Replying` type (`false | { commentUser: string;
  commentId: string }`) mirroring `postDialogReducer.tsx`'s `SET_REPLYING` case exactly;
  `dialogDispatch: Dispatch<PostDialogAction>` (the reducer's own dispatch); `profileDispatch
  ?: Dispatch<any>`, matching the identical convention already established for this same
  prop name in `Comment.tsx`/`CommentReply.tsx`/`PostDialog.tsx`/`PostDialogStats.tsx`
  (which all predate this file in getting typed, apparently outside the §8.10 log — verified
  each still compiles clean before and after this pass). Converted the runtime `PropTypes`
  validation to the native interface, closing the item §8.10.1 explicitly deferred.
  `commentInputRef`/`commentsRef` null-guarded consistently with the `useRef<T>(null)`
  pattern used throughout §8.10 (`ChangeAvatarButton`, `NewPostButton`, …).
- **Found, not fixed (dead code, out of scope — would mean redesigning
  `profilePageSlice.ts`'s action set)**: `profileDispatch({ type:
  "INCREMENT_POST_COMMENTS_COUNT", payload: postId })` — this plain action object type-checks
  fine against `Dispatch<any>`, which is exactly why it hid as a silent bug rather than a
  compile error. Tracing where `profileDispatch` actually comes from
  (`ProfilePage.tsx`: `profileDispatch: dispatch` — the real Redux `AppDispatch`, not a local
  reducer dispatch) confirms this has dispatched an action type that
  `profilePageSlice.ts` has never had a case for since the RTK migration (§8.4) — a
  reducer silently ignores an unmatched action type and returns state unchanged. So the
  "increment the comment count shown on the profile grid overlay when you comment from the
  post dialog" feature has been a no-op since Phase 3, confirmed via the same call chain
  through `Comment.tsx`/`CommentReply.tsx`/`PostDialogStats.tsx` (all dispatch the same
  dead action types — `INCREMENT_POST_COMMENTS_COUNT`, presumably also `VOTE_POST` etc.).
  Flagged here since it's a real, currently-invisible feature gap, not fixed since it needs
  a deliberate decision about what `profilePageSlice.ts` should actually do with these
  events, not a type fix.
- **A genuine type-vs-consumer conflict, resolved by decoupling, not by loosening either
  side**: §8.10.2 narrowed `useSearchUsersDebounced`'s `result` state from `User[] | null` to
  `User[]` because the hook itself never calls `setResult(null)` — true for its only other
  consumer, `SearchBox.tsx`. But `PostDialogCommentForm.tsx` (not fixed until now) *does*
  rely on `setResult(null)` from outside the hook, as a sentinel for "hide the @mention
  dropdown." Re-widening the hook's type back to nullable would have broken `SearchBox.tsx`,
  which reads `result.length`/`result.map()` unguarded. Instead, added a local
  `showMentionSuggestions` boolean state to `PostDialogCommentForm.tsx` that tracks the
  dropdown's visibility independently of the hook's array data — `setResult(null)` calls
  became `setResult([]); setShowMentionSuggestions(false)` (and the reverse on a match).
  Same visible behavior, no shared-hook type change, no fallout in `SearchBox.tsx`.
- **`SearchSuggestion.tsx`** (pulled in as a direct dependency): typed `fetching: boolean`,
  `result: User[]`, `onClick: (user: User) => void`, `username: string` (matching its only
  call site, `PostDialogCommentForm.tsx`, which now passes `mention ?? ""`);
  `additionalUsers` state and `renderUserCard`'s params typed against `User`; `componentRef`
  → `useRef<HTMLUListElement>(null)` matching the actual `<ul ref={componentRef}>` element.
- **`NotificationFeed.tsx`**: `userCardProps` (built incrementally, `.subText` assigned
  later inside the `switch`) needed an explicit `NotificationUserCardProps` interface up
  front — TS infers an object literal's type from its initial shape and rejects later
  property assignment otherwise, the same class of issue as `EditProfileForm`'s Formik
  `errors: {}` in §8.10.2. `token`/`username()` nullability resolved with `?? ""` at the
  `fetchNotificationsStart`/`readNotificationsStart` call sites — this component only
  renders behind the authenticated notification bell.

Verification: `npm run typecheck` — 68 → **18** errors, zero remaining in the three touched
files. `npm test` — 55/55, unchanged. `npm run lint` — 27 errors + 42 warnings, unchanged.
`npm run build` still fails overall (18 errors remain). Remaining, in full:
`SignUpCard.tsx` (8, Formik generics — a different flavor of fix than the prop-typing
pattern used throughout §8.10), `Feed.tsx` (3, its own pre-existing `PostDialog` prop bug
from §8.10.1), `App.tsx` (2, `document.querySelector("body")` null-checks),
`ConfirmationPage.tsx` (2), `main.tsx` (1, `createRoot(document.getElementById("root"))`
possibly-null), `LoginPage.tsx` (1, the last remaining runtime `prop-types` import), and
`profilePageSlice.test.ts` (1, the pre-existing fixture gap from §8.10.5). None of these
share a common cluster the way prior passes did — each is a one-off, and `SignUpCard.tsx`
is the only one with double-digit effort remaining.

#### 8.10.7 Last 18 `tsc` errors cleared — `npm run build` passes for the first time

The remaining 18 errors (down from the original 333 across §8.10.1–§8.10.6) were all
single-file one-offs with no shared cluster left, so finished directly rather than via
another background pass:

- **`App.tsx` (2)**: `document.querySelector("body")` returns `Element | null` in DOM lib
  types; swapped for `document.body`, which is typed non-null (same element, more direct).
- **`main.tsx` (1 + a latent bug)**: `import App from "./App.jsx"` pointed at a file that no
  longer exists (`App.tsx` since §8.10) — this only kept working because nothing had
  type-checked the entry point until now; fixed to the extensionless specifier. Also
  non-null-asserted `document.getElementById("root")` — `index.html` always has the div.
- **`ConfirmationPage.tsx` (2)**: split `return navigate("/")` into `navigate("/"); return;`
  inside the effect (TS was inferring the effect callback's return type as
  `void | Promise<void>` through that expression-return, which isn't a valid
  `EffectCallback`); resolved the confirmation-link `token` param (`string | undefined` from
  `useParams()`) with `?? ""` at the call site, matching the established pattern.
- **`LoginPage.tsx` (1) — dead code removed**: deleted a `LoginPage.propTypes = { currentUser:
  PropTypes.object }` block. `LoginPage` takes no props at all; `currentUser` is a local
  `useAppSelector` result, not a prop — this was always meaningless. Also the last `import
  PropTypes` anywhere in `src/`, so **removed the now-fully-unused `prop-types` package**
  from `package.json`/lockfile (it had been promoted to an explicit dependency in §8 Phase 0
  when 16 files used it; §8.10.1 and §8.10.6 converted the rest to native TS prop types).
- **`SignUpCard.tsx` (8)**: same Formik-generics treatment as `EditProfileForm.tsx`
  (§8.10.2) — a `SignUpFormValues` interface, `useFormik<SignUpFormValues>`, and
  `Object.keys(formik.errors) as Array<keyof SignUpFormValues>` for the error-list `.map`
  (plain `Object.keys` returns `string[]`, which doesn't index `FormikTouched<T>`/
  `FormikErrors<T>`).
- **`Feed.tsx` (3) — the pre-existing bug flagged since §8.10.1, now actually fixed**:
  `PostDialogProps.postId` was `string` (required), but `Feed.tsx`'s three loading-skeleton
  placeholders (`<PostDialog simple loading />`) render with no post yet, so no `postId`.
  Traced every `postId` use inside `PostDialog.tsx` and confirmed each one sits behind a
  `!loading`/`!fetching` guard (the effect's fetch branch, delete/comment handlers, the full
  (non-skeleton) header JSX) — so `postId` is only ever read once it's genuinely present.
  Made it optional on the prop type and non-null-asserted it at those confirmed-guarded call
  sites, rather than threading a fake default through Feed.tsx.
- **`profilePageSlice.test.ts` (1)**: the long-standing fixture gap — `{ _id: "p1" }` test
  posts didn't satisfy `ProfilePost`'s required `image`/`comments`/`postVotes`. Added a small
  `post(id)` fixture helper with dummy values for the one assertion (`addPosts`) that's
  strictly typed through `st()`'s `ProfilePageState`; left the two looser `reducer(state,
  rawActionObject)` calls elsewhere in the file alone since they don't type-check the payload
  shape as strictly and already pass.

**Also while in the area**: `npm audit` on `frontend/` turned up 3 vulnerabilities (1 high,
1 moderate, 1 low — `brace-expansion`, `fast-uri`, `serialize-javascript`, all transitive dev
tooling pulled in since `typescript`-eslint was added in §8.10 and never audited) — cleared
to **0** with `npm audit fix` (no `--force` needed), same as backend's §9.

Verification: `npm run typecheck` — 18 → **0 errors**. `npm run lint` — 27 errors + 42
warnings, unchanged (the §8.10 `no-unused-expressions` regression and the §8.9 a11y backlog
remain their own tracked follow-ups). `npm test` — 55/55. **`npm run build` — passes clean
end-to-end for the first time since the TS migration began** (`tsc --noEmit && vite build`,
PWA `sw.js` still generated, 61 precache entries). `npm audit` — 0 vulnerabilities.

### TypeScript migration (§8.10) — final state

| | At §8.10's start | Now |
|---|---|---|
| `tsc --noEmit` errors | 333 | **0** |
| `npm run build` | fails | **passes** |
| `npm run lint` | 0 errors / 42 warnings | 27 errors / 42 warnings (tracked: §8.10's `no-unused-expressions` regression) |
| `npm test` | 55/55 | 55/55 |
| `npm audit` (frontend) | 0 | 0 |

Real bugs found and fixed along the way (type-authoring bugs in **bold** — a type didn't
match what the backend actually sends, surfaced only because `strict` mode forced every
field to be accounted for): **`Profile`** (§8.10.1, nested `user` vs. assumed-flat),
`UsersList`'s `following` prop receiving a count instead of a boolean (§8.10.1),
`ProfilePage`'s dead `data.avatar` read (§8.10.1 — then its own `.length`-on-a-number
regression caught and fixed in §8.10.5), **`Message`** (§8.10.3, `senderId`/`receiverId` vs.
assumed nested `User`s), `ChatUsers` rendering a component reference instead of invoking it
and `ChatInput` missing `onSubmit` entirely (§8.10.3, both flagged but left as-is — real UI
bugs needing a design call, not a type fix), **`PostSummary`/`ProfilePost`** (§8.10.4/5,
count-shaped vs. assumed-array post endpoints — four pagination/display bugs fixed as a
result), **`Notification`** (§8.10.6, wrong `notificationData` fields), and `Feed.tsx`'s
`PostDialog.postId` (§8.10.7, closing the loop on the one bug §8.10.1 flagged and deferred).

**Known, deliberately unfixed**: `profileDispatch({type: "INCREMENT_POST_COMMENTS_COUNT"})`
in `PostDialogCommentForm`/`Comment` has been a silent no-op since the RTK migration
(§8.4) — `profilePageSlice` has no matching reducer case, so the profile grid's
comment-count overlay has never actually incremented post-RTK. `tsc` can't catch this (it
type-checks fine); it's a real feature gap needing a deliberate design decision, not a type
fix, so it's recorded here rather than patched in passing.

## 9. Backend dependency vulnerability fixes, round 2 (8 → 0)

Dependabot/`npm audit` flagged 8 vulnerabilities in `backend/` (4 moderate, 3 high, 1
critical), all transitive:

- **`npm audit fix` (no `--force`)** cleared 6 of the 8 by re-resolving already-declared
  semver ranges — no `package.json` change needed: `express` (moderate), `morgan`
  (moderate), `body-parser`'s `qs` dependency (moderate), and the `brace-expansion` /
  `minimatch` transitives (high/low) pulled in by dev tooling.
- **`bcrypt` major-bumped `^5.1.1` → `^6.0.0`** for the remaining two — a critical `tar`
  vulnerability and a high one in `@mapbox/node-pre-gyp`, both pulled in only by bcrypt 5's
  native-build toolchain (`node-pre-gyp` downloads prebuilt binaries via `tar`). bcrypt 6
  moved to `node-gyp-build`, dropping that dependency chain entirely. No API change between
  the versions used here (`hash`/`compare`), so `authController.js` needed no edits.

Verification: `npm audit` → **0 vulnerabilities**; `node --check` over every backend `.js`
file; a live `bcrypt.hash`/`bcrypt.compare` round-trip confirming the new native binary
actually loads on this platform; and a full boot smoke test — `node scripts/dev-mongo.cjs`
(§8.10) for an in-memory Mongo, `node index.js` against it, confirmed `GET
/api/post/filters` → `200` over real HTTP before tearing both down.

## 10. Fixed the two chat UI bugs flagged (but left) in §8.10.3

- **`ChatUsers.tsx` — deleted the dead `ChatUserBody`/`ChatUser` wrapper.** Traced it back
  to the very first "Basic UI for chat" commit: hardcoded placeholder data
  (`username: "username"`, `linkTo: /direct/1`, `src={"S"}`) that was never wired up, and
  — because the wrapper passed `ChatUserBody` as a component *reference* instead of
  invoking it — never actually rendered anything in the first place (React silently drops
  a function child). `UserCard` (already rendered as the sibling wrapper) already provides
  the exact same avatar + username + click-to-navigate behavior via the `linkTo` prop it's
  already being passed, so there was nothing to "fix" — removed the dead wrapper and
  rendered `<UserCard {...userCardProps} />` directly. No behavior change for anyone who
  was actually using chat, since the broken code never rendered to begin with.
- **`ChatInput.tsx` — wired up `onSubmit`, so Enter-to-send now works.** `handleSubmit` was
  typed for the send icon's `onClick` only; retyped it to `SyntheticEvent` (covers both
  `MouseEvent` and `FormEvent`) and added `onSubmit={handleSubmit}` to the `<form>`. A lone
  `<input type="text">` inside a form already triggers submission on Enter by default, so
  no other markup changes were needed.

Verification: `npm run typecheck` — still **0** errors. `npm run lint` — **27 errors / 40
warnings** (2 fewer warnings than §8.10.7's end state — the deleted `ChatUsers` code carried
its own now-gone `jsx-a11y` hits). `npm test` — 55/55. `npm run build` — still passes clean.

## 11. Post-upload failures: Cloudinary credentials, error codes, temp cleanup

**Symptom**: `POST /api/post` failed — first with a generic "Error uploading image", then
`429 Too many requests` after a few retries, then `502 Bad Gateway`.

**Root cause (config, not code)**: Cloudinary rejected the credentials in `backend/.env` with
`401 unknown api_key`, confirmed directly with `cloudinary.api.ping()`. The `CLOUDINARY_API_KEY`
value was malformed (35 characters, not all digits; real keys are 15 digits) and the secret's
length was also off. Fixed by replacing the key/secret (and cloud name) in `backend/.env` with
the real ones from the Cloudinary Console and restarting (`npm run dev` has no watcher). No
code change could have made uploads succeed before that.

What made it hard to diagnose, and is now fixed:

- **Swallowed error.** `createPost` caught the Cloudinary failure with a bare `catch {}`, so
  the real reason never reached the log. It now logs `Cloudinary upload failed:` plus the
  Cloudinary error.
- **Leaked temp files.** The multer temp file was only deleted after a *successful* upload, so
  every failure left a file in `backend/temp/`. It is now unlinked on the failure path too.
- **Shared Cloudinary client.** New `backend/utils/cloudinary.js` configures the SDK once
  (`secure: true`, warns at startup if any of the three env vars is missing). `postController`
  and `userController.changeAvatar` use it instead of calling `cloudinary.config()` on every
  request.
- **Proper status codes.** A failed upload was always a bare 500. `cloudinaryUploadError()` in
  `postController.js` now maps the Cloudinary status to a `RequestError`:

  | Cloudinary | Response |
  |---|---|
  | 400 | 400 — image could not be processed |
  | 413 | 413 — file exceeds 10MB |
  | 420 / 429 | 503 — image service busy |
  | 401 / 403 / 5xx | 502 — image service unavailable (detail only in the server log) |
  | anything else | 500 — generic upload error |

- **Rate limiter (`routes/post.js`).** Post creation allows 5 per 15 min per IP, and failed
  attempts used to count — retries after the credential failure caused the 429. Added
  `skipFailedRequests: true` and a JSON `{ error }` message so the 429 matches every other
  error shape. The counter is in memory, so a backend restart also resets it.
- **Multer errors (`index.js`).** Only `File too large` returned 400; every other `MulterError`
  fell through to a 500. They now return 400 with `{ error }`.
- **Startup DNS fallback (`index.js`).** If Node's resolver only knows loopback servers, the
  `mongodb+srv://` lookup fails even though the OS resolves it; in that case `dns.setServers`
  falls back to `8.8.8.8`/`1.1.1.1`.

Verification, against the real Cloudinary account and dev database with the corrected credentials:

- `api.ping()` → `ok` (was `401 unknown api_key`).
- `POST /api/post` with a real image → **201**; image and thumbnail URLs stored, `backend/temp/`
  empty afterwards. The test post was deleted again (`DELETE` → 204).
- Error paths return `{ error }`: no image → 400, wrong field name → 400 `Unexpected field`
  (was a 500), no token → 401.

Not exercised: the 502/503 branches of `cloudinaryUploadError()` (they need Cloudinary to
fail, and the credentials now work), the rate limiter's 429, the browser upload form, and
`changeAvatar`, which shares the new client.

Deliberately not part of this change: the in-progress chat/SCSS edits and a stray
`imagekit_url_endpoint` line in `backend/.env.example` were already in the working tree and
are unrelated.

## 12. Chat UI redesign, conversation-state fixes, responsive new-post modal

**Chat layout (`_chatPage.scss`, `ChatPage`, `ChatSidebar`).** The page is now one rounded,
bordered panel (`height: calc(100vh - 9rem)`, sidebar 28–32rem + flexible thread) instead of
two loosely bordered boxes. Hard-coded greys/blues moved to the theme variables
(`--color-surface`, `--color-grey-2`, `--color-accent`, …) so dark mode applies. Inline styles
on the sidebar wrapper and the page's bordered `<div>` became a `.chat-sidebar` class.

**Input and thread (`ChatInput`, `Chats`).** The send control is a real
`<button type="submit" class="send-btn">` with an `aria-label`, disabled while the message is
blank (it replaces the clickable `Icon`); the thread auto-scrolls to the newest message via an
end-of-list ref. The active conversation is highlighted in the sidebar (`ChatUsers` reads the
route `:id`).

**State fixes (`chatSlice`).** Added `activeChatId`, which fixes three real issues:
- Switching conversations cleared nothing, so the previous thread could bleed into the new one;
  `setChatUser` now resets `messages` when the id changes.
- A slow `getMessages` response for a conversation the user already left is discarded
  (`fetchAllMessagesAction` checks `activeChatId` via `getState`).
- `pushMessageSuccess` ignores messages for a different conversation and de-duplicates by `_id`.
  `pushMessageAction` now appends from the HTTP response too, so a sent message shows even if
  the socket is down; the `newMessage` socket echo is de-duplicated. This supersedes the
  old doc comment about the sent message arriving only via the socket.

**New-post modal (`_new-post.scss`).** Width is `min(60rem, 92vw)` and height is capped at
`92vh`; the preview grid row is `minmax(0, 1fr)` so it absorbs whatever height the viewport can't
spare instead of overflowing short screens. The mobile variant opts out of the cap.

Verification: `npm run typecheck` — 0 errors; `npm test` — 55/55. Not verified in a browser
or with a second account, so the live socket de-duplication and the conversation-switch race
are untested beyond the types and the existing slice tests.

---

## 13. Backend horizontal scaling / load balancing

**Goal:** run many stateless backend instances behind a load balancer. No code change can by itself
guarantee "1 million concurrent users" — that is a capacity-planning result you verify with load tests
(see "What's still needed").

**Blocker removed:** the in-memory `userSocketMap` (userId → socketId) only worked on one instance.

| Change | File |
|---|---|
| Each socket joins a room named after its user id; handlers emit with `io.to(userId)` (works across instances and a user's multiple tabs) | `socket/index.js`, `handlers/socketHandler.js` |
| `getReceiverSocketId` export removed (it was only used by the handler) | `socket/index.js` |
| Global `getOnlineUsers` broadcast removed — it sent every connected user id to every client on each connect/disconnect (O(N²)), and the frontend never handled it | `socket/index.js` |
| Optional Redis: `@socket.io/redis-adapter` relays events between instances; set `REDIS_URL` to enable, unset = old single-instance behaviour | `utils/redis.js`, `socket/index.js` |
| Post-creation rate limiter uses `rate-limit-redis` when `REDIS_URL` is set, so the 5/15 min limit holds across instances (pinned `rate-limit-redis@^4`; v6 needs express-rate-limit 8) | `routes/post.js` |
| `GET /healthz` for LB health checks | `index.js` |
| `MONGO_POOL_SIZE` (default 20) per process | `index.js` |
| `npm run start:cluster` — one worker per core (`WEB_CONCURRENCY` to override) | `cluster.js` |
| nginx config (least_conn, WebSocket upgrade, long read timeout) + Dockerfile + compose | `deploy/nginx.conf`, `backend/Dockerfile`, `docker-compose.yml` |

No sticky sessions needed: the client connects with `transports: ['websocket']`.

**Run:** `docker compose up --build --scale backend=4` (nginx on :9000; MongoDB stays external via `MONGO_URI`).
Not run end to end here — only a local socket smoke test (room delivery) was verified; Redis path untested.

**What's still needed for ~1M concurrent connections**
- Load test (k6/Artillery) to find per-instance capacity; plan instance count from that (a Node process typically holds tens of thousands of sockets).
- Raise OS limits (file descriptors, ephemeral ports, `net.core.somaxconn`) on LB and app hosts.
- Managed Redis (cluster or sharded pub/sub), MongoDB Atlas sized for `instances × workers × MONGO_POOL_SIZE` connections plus read replicas/indexes, and a cloud LB (ALB/NLB) or several nginx nodes in front.
- Caching for hot feeds/profiles, and moving image upload off the request path (multer temp files are local to an instance).
- `trust proxy` is `1`; with a cloud LB *and* nginx (two hops) raise it so rate limiting sees client IPs.

---

## 14. Pentest findings: NoSQL injection in login, ReDoS in user search

**Goal:** fix the two highest-severity findings from a security review of `backend/` (auth, validation,
injection surface): a NoSQL-operator injection path in login and an unauthenticated ReDoS in the
username search endpoint.

| Finding | Fix | File |
|---|---|---|
| `loginAuthentication` passed `req.body.usernameOrEmail`/`password` straight into a Mongo `$or` query. A client sending an object (e.g. `{"$gt": ""}`) instead of a string could inject a Mongo operator into the query, risking auth bypass. | Reject the request with a generic 400 ("incorrect credentials") whenever either field isn't a plain string, before the query is built. | `backend/controllers/authController.js` |
| `searchUsers` built `new RegExp(username)` from the raw, unescaped `:username` route param. A crafted pattern (nested quantifiers) could hang the event loop for every request — and the endpoint is unauthenticated — while unbalanced parens throw synchronously. | Added `escapeRegExp()` and apply it to `username` before constructing the `RegExp`, so user input is matched literally instead of as a pattern. | `backend/utils/controllerUtils.js`, `backend/controllers/userController.js` |

Other findings from the same review, not yet fixed (tracked here for follow-up): no rate limiting
on `/api/auth/login` or `/api/auth/register` (brute force/credential stuffing); JWTs issued by
`jwt-simple` have no `exp` claim and never expire; leftover `console.log` of the raw error in
`changePassword`; wide-open CORS (`*`) on both Express and Socket.IO (likely intentional per
project notes, revisit before adding cookie-based auth).

Verification: code review only — reasoned through the injection/ReDoS paths and confirmed the fix
sites by reading the surrounding controllers. Not exercised against a running instance; no test
runner exists in this repo (see root notes). Restart the backend (`npm run dev` doesn't hot-reload)
before relying on these fixes.
