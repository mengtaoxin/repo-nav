# Copilot Instructions for repo-nav

## Project Overview
**repo-nav** is a Next.js 16 + TypeScript + shadcn/ui repository navigator and bookmarking application. It allows users to manage, organize, and browse repository links with metadata (tags, descriptions, icons) stored in browser localStorage.

## Key Architecture Patterns

### Data Management Layer
- **Single source of truth**: [src/lib/nav-data.ts](src/lib/nav-data.ts) exports `navDataManager` object with CRUD operations
- **Storage abstraction**: All persistent state uses browser `localStorage` with key `"repo_nav_data"`
- **Data model**: `NavItem` interface has required fields (name, url, icon) and optional fields (localRepoPath, tags, description)
- **Type safety**: `NavData` wraps array of `NavItem[]` plus optional global tags

### UI Component Architecture
- **Client-side rendering**: Main app is "use client" component ([src/app/page.tsx](src/app/page.tsx)) - data loads only in useEffect to prevent hydration mismatch
- **Modal-driven forms**: Uses shadcn/ui Dialog for add/edit, AlertDialog for deletions
- **Mode-based interactions**: Edit/delete modes toggled via UI buttons, click handler behavior changes based on active mode
- **Drag-and-drop reordering**: Native HTML drag events with custom drop logic

### Component Organization
- [src/components/nav-item.tsx](src/components/nav-item.tsx) - Renders individual repository card with conditional icon handling (local vs external URLs)
- [src/components/data-manager.tsx](src/components/data-manager.tsx) - Export/import JSON functionality with file validation
- [src/components/ui/](src/components/ui/) - shadcn/ui primitives (Button, Card, Dialog, Input, etc.)

## Development Workflows

### Core Commands
```bash
npm run dev          # Start Next.js dev server on http://localhost:3000
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint check (ESLint 9 + Next.js config)
npm run test         # Jest tests (jsdom environment)
```

### Testing Setup
- Jest configured with jsdom environment ([jest.config.ts](jest.config.ts))
- Module path alias: `@/` maps to `src/`
- Test file pattern: `*.test.tsx`
- Example: [src/app/page.test.tsx](src/app/page.test.tsx)

### Build Configuration
- TypeScript strict mode enabled
- Path alias: `@/*` → `./src/*` in [tsconfig.json](tsconfig.json)
- Next.js 16.1.6 with React 19.2.3
- Tailwind CSS v4 via `@tailwindcss/postcss`

## Project-Specific Conventions

### Form Data Handling
- Form state holds strings for all fields (e.g., `tags` as comma-separated string)
- `navDataManager.processItem()` converts tags string to array before storage
- Reset form after successful submission/modal close

### Icon Handling
- Icons stored as URLs (external: `https://`, local: `/path`, or data URIs)
- [src/components/nav-item.tsx](src/components/nav-item.tsx) uses conditional rendering: Next.js `Image` for local, `<img>` for external

### Data Import/Export
- Import validates structure: must have `version` and `navs: Array`
- Export filename includes ISO date: `repo-nav-data-YYYY-MM-DD.json`
- File input reset after import to allow re-importing same file

### Default Data
- Fallback data loaded from [src/resources/default-data.json](src/resources/default-data.json)
- Data model: `version` (string) + `navs` array + optional `tags` global array

## Dependencies & Integration Points
- **shadcn/ui**: Composable React components via Radix UI primitives
- **Lucide React**: Icon library (if needed for additional icons)
- **clsx + tailwind-merge**: Class composition for dynamic styling
- **class-variance-authority**: Component variant management for shadcn/ui

## Common Tasks

**Adding a new navigation item**:
1. Form validation in modal (name, url required)
2. Call `navDataManager.add(data, formData)` 
3. Update state with returned new data
4. Reset form and close modal

**Exporting user data**:
- DataManager component handles export (stringified NavData + download)

**Handling localStorage edge cases**:
- Always check `typeof window !== "undefined"` before accessing localStorage
- Load data in useEffect on client, initialize state as null server-side
