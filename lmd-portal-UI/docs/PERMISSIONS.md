# LMD Portal — Role-Based Access Control (RBAC)

## Overview

Access control in the portal is enforced at three layers, in order:

1. **Middleware** (`src/middleware.ts`) — Edge runtime, runs before any page renders. Redirects to `/unauthorized` immediately if the route requires a role the user doesn't have.
2. **Layout server guard** (`layout.tsx` files) — Server components that call `auth()` directly. A second check in case middleware is bypassed or route groups shift.
3. **UI visibility** — Client components (e.g. the country sidebar) hide links the user can't access. This is cosmetic only; the layers above enforce the actual restriction.

Permissions are stored in the JWT as `user.groups`, populated from **Cognito group membership** at login. They are refreshed from Cognito on every access token renewal (~1 hour by default).

---

## Roles

| Role | Scope | Description |
|---|---|---|
| `super_administrator` | Global | Full access to everything — all settings, all country admin tools |
| `administrator` | Global | Same access as `super_administrator` |
| `global_publisher` | Global | Access to publisher-level settings and **all** country admin tools |
| `[country]_administrator` | Country | Admin tools for that specific country only (e.g. `liberia_administrator`) |
| `[country]_publisher` | Country | Same as `[country]_administrator` for country admin access |

> **Note:** `[country]` is the lowercase, underscore-separated country key: `liberia`, `malawi`, `ethiopia`, `sierra_leone`.

---

## Route Protection Matrix

### `/settings/*`

| Route prefix | Required role |
|---|---|
| `/settings/user-management` | `super_administrator`, `administrator` |
| `/settings/portal-management` | `super_administrator`, `administrator` |
| `/settings/portal-analytics` | `super_administrator`, `administrator` |
| `/settings/dashboards` | `super_administrator`, `administrator`, `global_publisher`, any `*_publisher` |
| `/settings/reports` | `super_administrator`, `administrator`, `global_publisher`, any `*_publisher` |
| `/settings/integrations` | `super_administrator`, `administrator`, `global_publisher`, any `*_publisher` |

The `/settings/(admin)` route group also has a server-side layout guard at `src/app/(protected)/settings/(admin)/layout.tsx` as a second layer.

### `/country-programs/[country]/admin/*`

| Allowed roles |
|---|
| `super_administrator` |
| `administrator` |
| `global_publisher` |
| `[country]_administrator` (e.g. `liberia_administrator`) |
| `[country]_publisher` (e.g. `liberia_publisher`) |

The Admin Tools button in the country sidebar is hidden from users who don't meet the above criteria.

---

## Where to add a new role

If you add a new Cognito group and want to grant it access to specific routes:

1. **Middleware** (`src/middleware.ts`) — add the role to the relevant constant (`ADMIN_GROUPS`, `PUBLISHER_GROUPS`, or `COUNTRY_ADMIN_ROLES`).
2. **Layout guard** — update the `ALLOWED_GROUPS` array in the corresponding `layout.tsx`.
3. **UI** — update the `isUserAllowed(...)` call in the relevant client component (e.g. `SideBar.tsx`).

All three should always be kept in sync.

---

## How permissions propagate after a Cognito group change

When an administrator adds or removes a user from a Cognito group:

- The change is **not immediate** for the affected user's active session.
- Permissions update automatically when the user's Cognito access token is next refreshed (default: **within 1 hour**).
- To make changes take effect faster, reduce the **Access token expiration** on the Cognito app client in the AWS console (minimum: 5 minutes).
- The user does **not** need to log out and back in.

If an immediate effect is required (e.g. revoking access urgently), use **Cognito → User Pool → [user] → Invalidate tokens** in the AWS console to force re-authentication.

---

## Cognito group naming convention

```
[scope]_[role]

Examples:
  liberia_administrator
  liberia_publisher
  malawi_administrator
  global_publisher
  super_administrator
  administrator
```

Country keys used in group names must match the URL segment exactly:
`liberia`, `malawi`, `ethiopia`, `sierra_leone`
