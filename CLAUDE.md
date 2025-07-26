# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev` - Starts Vite development server with hot reload
- **Build for production**: `pnpm build` - Runs TypeScript compilation then Vite build
- **Lint code**: `pnpm lint` - Runs ESLint with TypeScript extensions, treats warnings as errors
- **Type checking**: `pnpm typecheck` - Runs TypeScript compiler without emitting files
- **Preview production build**: `pnpm preview` - Serves the production build locally
- **Install dependencies**: `pnpm install` - Installs all dependencies using pnpm

## Architecture Overview

This is a React 18 + TypeScript + Vite application for pottery management called "Potterly".

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4.x
- **Routing**: React Router DOM v6 (using BrowserRouter)
- **Styling**: CSS modules with BEM-like naming convention
- **Linting**: ESLint with TypeScript support

### Project Structure
- `src/main.tsx` - Application entry point with React Router setup
- `src/App.tsx` - Main app component with route definitions and sidebar layout
- `src/components/` - Reusable UI components (currently contains Sidebar)
- `src/pages/` - Route-specific page components (Home, Pieces, Profile)
- `src/pages/developer/` - Developer/admin pages not shown in sidebar navigation
- `src/variables.css` - Global CSS variables for pottery color design system
- CSS files are co-located with their respective components

### Key Patterns
- **Routing**: Uses declarative routing with Routes/Route components in App.tsx
- **Navigation**: Sidebar component uses NavLink with active state styling
- **Styling**: BEM-style CSS class naming (e.g., `sidebar__title`, `sidebar__link--active`)
- **Component Structure**: Functional components with TypeScript, default exports
- **Layout**: Fixed sidebar + main content area layout pattern

### Component Architecture
The application follows a simple page-based architecture:
- Sidebar provides navigation between three main sections (Home, Pieces, Profile)
- Each page is a separate component in the pages directory
- Developer pages are isolated in `src/pages/developer/` and not included in sidebar navigation
- Shared styling through Page.css for consistent page layouts
- Component-specific styling co-located with components

### Developer Pages
- **Developer Folder**: Contains pages for development/admin purposes not shown in main navigation
- **Routes Available**:
  - `/developer` - Color palette design guide showcasing pottery-themed colors
  - `/design` - Kanban board interface for pottery studio workflow management
- **Access**: These pages are accessible by direct URL but intentionally hidden from sidebar navigation