# Copilot Instructions for vortexa_2.0

## Project Overview
- This is a React + TypeScript web application using Vite and Tailwind CSS.
- Main features: authentication, dashboard, quiz generation, video summarization, and reporting.
- Key external service: Supabase (see `src/supabaseClient.ts`).

## Architecture & Key Components
- **src/components/**: UI components, organized by feature (e.g., `dashboard/`, `quiz-generator/`, `video-summarizer/`).
- **src/api/auth.ts**: Handles authentication logic and Supabase integration.
- **src/context/AppContext.tsx**: Global app state/context provider.
- **src/hooks/useEnsureUser.ts**: Custom hook for user session management.
- **src/App.tsx**: Main app entry, sets up routing and layout.

## Developer Workflows
- **Build**: `npm run build` (uses Vite)
- **Dev server**: `npm run dev`
- **Lint**: `npm run lint` (uses ESLint config in `eslint.config.js`)
- **Format**: `npx prettier --write .`
- **Test**: No test scripts found; add tests in `src/` and update `package.json` if needed.

## Patterns & Conventions
- **Component Structure**: Feature folders (e.g., `quiz-generator/`, `video-summarizer/`) contain all related UI and logic.
- **State Management**: Use React context (`AppContext.tsx`) for global state, hooks for local state.
- **Styling**: Tailwind CSS via `index.css` and `tailwind.config.js`.
- **API Integration**: Supabase client in `supabaseClient.ts` is the main backend interface.
- **Navigation**: Centralized in `components/Navigation.tsx`.

## Integration Points
- **Supabase**: All auth and data operations go through `supabaseClient.ts` and related API files.
- **Dashboard**: Data visualization and reporting in `dashboard/` components.
- **Quiz & Video**: Quiz logic in `quiz-generator/`, video summary in `video-summarizer/`.

## Examples
- To add a new feature, create a folder in `src/components/`, add UI and logic, and update routing in `App.tsx`.
- For new API calls, extend `src/api/` and use the Supabase client.

## Quick Reference
- Main entry: `src/App.tsx`
- Auth: `src/api/auth.ts`, `src/components/AuthForm.tsx`
- Context: `src/context/AppContext.tsx`
- Supabase: `src/supabaseClient.ts`
- Dashboard: `src/components/dashboard/`
- Quiz: `src/components/quiz-generator/`
- Video: `src/components/video-summarizer/`

---
_If any section is unclear or missing, please provide feedback to improve these instructions._
