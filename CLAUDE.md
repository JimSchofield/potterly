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
- **State Management**: Nanostores with React integration
- **Styling**: CSS modules with BEM-like naming convention
- **Linting**: ESLint with TypeScript support
- **UUID Generation**: uuid library for unique identifiers

### Project Structure
- `src/main.tsx` - Application entry point with React Router setup
- `src/App.tsx` - Main app component with route definitions and sidebar layout
- `src/components/` - Reusable UI components (Sidebar, PotteryCard, KanbanBoard)
- `src/pages/` - Route-specific page components (Home, Pieces, Profile, CreatePiece)
- `src/pages/developer/` - Developer/admin pages not shown in sidebar navigation
- `src/stores/` - Nanostores state management (pieces store with CRUD actions)
- `src/types/` - TypeScript type definitions (PotteryPiece interface)
- `src/variables.css` - Global CSS variables for pottery color design system
- `dogfood.json` - Sample pottery data with realistic examples
- CSS files are co-located with their respective components

### Key Patterns
- **Routing**: Uses declarative routing with Routes/Route components in App.tsx
- **State Management**: Nanostores atoms with reactive React hooks (useStore)
- **Navigation**: Sidebar component uses NavLink with active state styling
- **Styling**: BEM-style CSS class naming (e.g., `sidebar__title`, `sidebar__link--active`)
- **Component Structure**: Functional components with TypeScript, default exports
- **Layout**: Fixed sidebar + main content area layout pattern
- **Data Flow**: Store → Component via useStore hook for reactive updates

### Component Architecture
The application follows a component-based architecture with centralized state:

**Core Components:**
- **Sidebar**: Navigation with animated icons and pottery-themed styling
- **PotteryCard**: Reusable card component displaying pottery piece details with date tracking
- **KanbanBoard**: Stage-based workflow visualization using PotteryCard components

**Pages:**
- **Home, Profile**: Basic page components
- **Pieces**: Tabbed interface with nested routing (Kanban/Table views)
- **CreatePiece**: Form for adding new pottery pieces with date tracking
- **Developer pages**: Isolated in `src/pages/developer/` (not in sidebar navigation)

**State Management:**
- Centralized pieces store using Nanostores
- Reactive updates across all components
- CRUD operations: addPiece, updatePiece, removePiece, getPiecesByStage

### Routes
**Main Application Routes:**
- `/` - Home page
- `/pieces` - Pottery pieces with nested routing:
  - `/pieces/kanban` - Kanban board view (default)
  - `/pieces/table` - Table view
- `/profile` - User profile
- `/create-piece` - Form to create new pottery pieces

**Developer/Admin Routes:**
- `/developer` - Color palette design guide showcasing pottery-themed colors
- `/design` - Kanban board interface for pottery studio workflow management  
- `/table-design` - Table view design showcase
- **Access**: These pages are accessible by direct URL but not shown in sidebar navigation

### Data Model
**PotteryPiece Interface:**
```typescript
interface PotteryPiece {
  id: string;              // UUID
  title: string;           // Piece name
  type: string;            // Functional, Decorative, Art Piece, etc.
  details: string;         // Description and notes
  date: string;            // Legacy display field
  priority: "high" | "medium" | "low";
  stage: "ideas" | "throw" | "trim" | "bisque" | "glaze" | "finished";
  createdAt: string;       // ISO date string
  lastUpdated: string;     // ISO date string  
  dueDate?: string;        // Optional ISO date string
}
```

### Design System
- **CSS Variables**: Comprehensive pottery-themed color palette in `variables.css`
- **Animations**: Smooth transitions, hover effects, and micro-interactions
- **Responsive Design**: Mobile-first approach with grid layouts
- **Icons**: Emoji-based iconography for pottery workflow stages