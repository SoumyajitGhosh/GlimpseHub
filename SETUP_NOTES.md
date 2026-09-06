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

## 5. Planned: react-router-dom v7 migration (not yet started)

Current version is `^6.30.6`; `App.jsx` uses the plain `<Routes>/<Route>` tree (not
`createBrowserRouter`/`RouterProvider`), so a straight v7 bump is low-risk — v7 retains the v6
`<Routes>` API for apps that don't opt into the data-router APIs, meaning no restructuring is needed
for the bump itself. Migration surface: 16 files use `<Link>`/`<NavLink>`, 5 use `useParams`, 6 use
`useLocation` (incl. `App.jsx`'s `matchPath`-driven chrome-visibility logic) — none of these APIs
change in v7 for non-data-router usage.

Adopting v7's *data-router* features (loaders/actions via `RouterProvider`) is a separate, larger
follow-up: it would require converting `App.jsx`'s inline route tree into a `createBrowserRouter`
config, reworking the `NO_CHROME_ROUTES`/`matchPath` visibility check, and moving
`ProtectedRoute`'s `<Outlet>` pattern into route `children`. Not implied by the version bump alone.

Recommended next step when this is picked up: bump the dependency, then do a manual pass through
every route (no test suite covers routing yet) watching for v7 deprecation warnings before removing
any legacy behavior flags.

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

## 8. Planned: full frontend modernization roadmap

Asked Claude Code (as a senior frontend architect) to survey the frontend and propose a
modernization plan. Unlike sections 3–5, this pass explicitly puts the previously-deferred
architectural changes on the table (**RTK, RTK Query, incremental TypeScript, forms**) and
commits to **finishing the PWA** rather than removing it. The roadmap is a sequence of
independently-shippable phases, one small PR each; nothing below is done yet except Phase 0.

Full plan file: `~/.claude/plans/think-like-a-senior-humming-lark.md`.

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
