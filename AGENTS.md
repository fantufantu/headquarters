# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start dev server (wasp dev → Vite)
pnpm build     # Production build (wasp build)
```

No test runner or lint scripts are configured. ESLint (with `react-app` preset) and Prettier are installed but not wired to package.json scripts.

## Architecture

This is **headquarters** (驾驶舱), a management-backend SPA for the "水番二土" ecosystem. It manages articles, categories, issues, resume templates, users, roles, and permissions across multiple tenant sites.

### Tech stack

- **React 19** + **TypeScript 5.9** + **Vite 6** (via `@aiszlab/wasp`)
- **Apollo Client v4** for GraphQL (production endpoint: `https://api.fantufantu.com/graphql`)
- **Tailwind CSS v4** + **musae** (custom UI component library)
- **pnpm** with a single-package workspace

### Custom framework layer (`@aiszlab` namespace)

All authored by the same developer. Understanding these is critical:

| Package | Purpose |
|---------|---------|
| `@aiszlab/wasp` | Vite wrapper — provides `wasp dev` / `wasp build` with built-in Tailwind v4 and React plugin |
| `@aiszlab/bee` | CSR micro-framework — `bootstrap()` mounts the SPA with route config, wraps react-router v7 |
| `@aiszlab/relax` | React utilities — `using()` for global state (RxJS-based, like a lightweight Zustand), `useEvent()`, `useMounted()` |
| `musae` | UI component library — Bench (app shell with sidebar), Table, Form, Modal, ThemeProvider, Notification, etc. |

### Routing (`src/main.tsx`)

Routes are defined declaratively in `bootstrap()` with two root route groups:

1. **Authenticated routes** (`/`) — loader checks `useAuthentication.state.me`; redirects to `/sign-in?redirect=...` if not signed in.
2. **Auth pages** (`/sign-in`, `/sign-up`, `/forgot-password`) — loader checks if already authenticated; handles SSO redirects by appending the auth token to a `redirect` query param and redirecting back to the third-party site.

All page components are lazy-loaded via `React.lazy()`. The Layout component (Bench sidebar + nav + user menu + theme toggle) wraps most authenticated routes via nested route configuration.

### Authentication flow

1. On app mount (`application.tsx`), `useMounted` reads `authentication` token from `localStorage` or `sessionStorage`.
2. If a token exists, `whoAmI()` queries the GraphQL `WHO_AM_I` query to validate it and populate `useAuthentication.state.me`.
3. During loading, a skeleton placeholder (`Placeholder`) is shown.
4. The Apollo Client `HttpLink` attaches the token as `Authorization: Bearer <token>` on every request via a custom `fetch`.
5. Logout calls the `LOGOUT` mutation then reloads the page.

Token storage keys are defined in `src/constants/authentication.ts` (`AuthenticationToken` enum).

### Authorization model (RBAC)

Permissions are `resourceCode` + `actionCode` pairs:

- **Resources** (`src/constants/authorization.ts`): `article`, `category`, `resume_template`, `issue`, `authorization`, `role`, `user`, `all`
- **Actions**: `Create`, `Read`, `Update`, `Delete`, `All`

The current user's authorizations come from `me.authorizations` (fetched via `WHO_AM_I`). `AuthorizationContextProvider` (`src/contexts/authorization.tsx`) builds a `Map<resourceCode, Set<actionCode>>` tree. `isAuthorized()` (`src/utils/authorization.ts`) checks membership, with wildcard support (`All` action on a resource, or `all` resource with a specific action grants access).

Navigation items are filtered by authorization in `use-navigations.ts` — menu items without the required `Read` permission are hidden.

### GraphQL API layer (`src/api/`)

- `src/api/index.ts` — Apollo Client setup with `InMemoryCache`, `ErrorLink` (shows Notification on errors), and `HttpLink` with auth header injection. Default `fetchPolicy` is `network-only`.
- Each domain file (e.g., `article.ts`, `user.ts`) exports GraphQL queries/mutations as `DocumentNode` objects and corresponding TypeScript types from companion `.types.ts` files.

### State management

Global state uses `@aiszlab/relax`'s `using()` pattern. Example at `src/store/authentication.ts` — `using()` returns a hook that reads/writes reactive state. State can be accessed both inside components (via the hook) and outside components (via `.state`). Seed data (like the auth token) is read from `localStorage` at store initialization.

### File upload

Files are uploaded directly to Tencent Cloud COS from the browser. The flow: fetch temporary credentials from the GraphQL backend, then use `cos-js-sdk-v5` to upload. See `src/utils/upload.ts` and `src/api/cloud.ts`.

### Multi-tenant

Three tenants are defined in `src/constants/app-config.ts`: `knowthy` (简历站点), `fantu` (个人站点), `headquarters` (管理站点). Operations like article/user creation may scope to a tenant.

### Path aliases

`@/` maps to `src/` (configured in both `tsconfig.json` paths and `vite.config.mts` resolve alias).
