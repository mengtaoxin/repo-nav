# Copilot Instructions for repo-nav

## Overview
repo-nav is a Next.js 16 + TypeScript + shadcn/ui app for bookmarking repositories. All user data and settings persist in browser localStorage and are loaded client-side to avoid hydration mismatch.

## Architecture & Data Flow
- Single source of truth for navigation data is `navDataManager` in [src/lib/nav-data.ts](src/lib/nav-data.ts). It reads/writes localStorage key "repo_nav_data" and seeds from [src/resources/default-data.json](src/resources/default-data.json).
- App settings are managed by `configManager` in [src/lib/config-manager.ts](src/lib/config-manager.ts) with localStorage key "repo_nav_configs" and defaults in [src/resources/default-settings.json](src/resources/default-settings.json).
- All pages are client components and load data in `useEffect` (see [src/app/page.tsx](src/app/page.tsx), [src/app/tags/page.tsx](src/app/tags/page.tsx), [src/app/settings/page.tsx](src/app/settings/page.tsx)).

## Key UI Patterns
- Main list page groups nav items by `category` with default "uncategorized" from `navDataManager.processItem()` (see [src/lib/nav-data.ts](src/lib/nav-data.ts)).
- Mode-based interactions (edit/delete/move) change click behavior and disable certain buttons in [src/app/page.tsx](src/app/page.tsx).
- Drag-and-drop reorder uses native drag events and `navDataManager.reorder()`.
- `NavItem` renders icons with Next `Image` for local/data URLs and `<img>` for external URLs; includes an "Open in VS Code" action that navigates to `vscode://file/${localRepoPath}` (see [src/components/nav-item.tsx](src/components/nav-item.tsx)).

## Tag & Settings Conventions
- Tags are global `Tag` objects in `NavData.tags` and per-item `tags` are string arrays. Tag delete is blocked if in use via `navDataManager.deleteTag()` and `getTagUsageCount()` (see [src/app/tags/page.tsx](src/app/tags/page.tsx)).
- Tag icons are resolved via `tagConfig` in `NavItem` and rendered inline next to tag chips (see [src/components/nav-item.tsx](src/components/nav-item.tsx)).
- Theme is applied by `configManager.applyTheme()` using html classes "dark"/"light"/"default" (see [src/lib/config-manager.ts](src/lib/config-manager.ts)).

## Developer Workflows
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Tests (jsdom): `npm run test` with example in [src/app/page.test.tsx](src/app/page.test.tsx)
- Path alias: `@/*` maps to src via [tsconfig.json](tsconfig.json)

## Import/Export Data
- Import/export is handled by `DataManager` in [src/components/data-manager.tsx](src/components/data-manager.tsx); export filename uses date `repo-nav-data-YYYY-MM-DD.json`.
- Import validation expects `version` and `navs` fields before replacing localStorage.
