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
- **Sidebar**: Navigation with animated icons and pottery-themed styling, mobile hamburger menu
- **PotteryCard**: Reusable card component displaying pottery piece details with date tracking, archive status, and starred indicators
- **KanbanBoard**: Stage-based workflow visualization using PotteryCard components
- **Filters**: Advanced filtering by stage, type, priority, search, archived status, and starred pieces
- **HamburgerMenu**: Mobile navigation toggle with animated hamburger icon

**Pages:**
- **Home, Profile**: Basic page components
- **Pieces**: Tabbed interface with nested routing (Kanban/Table views)
- **CreatePiece**: Form for adding new pottery pieces with date tracking
- **Developer pages**: Isolated in `src/pages/developer/` (not in sidebar navigation)

**State Management:**
- Centralized pieces store using Nanostores with reactive filtering
- Filter state management with computed stores for real-time filtering
- CRUD operations: addPiece, updatePiece, removePiece, archivePiece, starPiece
- Advanced filtering: stage, type, priority, search, archived status, starred pieces
- Computed filteredPiecesStore for reactive UI updates

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
  type: Types;             // Uses Types enum: FUNCTIONAL, DECORATIVE, ART_PIECE, SERVICE_SET, SCULPTURE
  details: string;         // Description and notes
  date: string;            // Legacy display field
  priority: "high" | "medium" | "low";
  stage: "ideas" | "throw" | "trim" | "bisque" | "glaze" | "finished";
  archived: boolean;       // Whether piece is archived
  starred: boolean;        // Whether piece is starred/favorited
  createdAt: string;       // ISO date string
  lastUpdated: string;     // ISO date string  
  dueDate?: string;        // Optional ISO date string
}
```

### Design System
- **CSS Variables**: Comprehensive pottery-themed color palette in `variables.css`
- **Animations**: Smooth transitions, hover effects, and micro-interactions
- **Responsive Design**: Mobile-first approach with grid layouts and hamburger menu
- **Icons**: Emoji-based iconography for pottery workflow stages
- **Mobile Features**: Hamburger menu with slide-in sidebar, optimized touch targets
- **Visual Indicators**: Star icons for favorited pieces, archive badges, priority dots

### Recent Features Added
- **Mobile Hamburger Menu**: Slide-in navigation for mobile devices with animated hamburger icon
- **Archive System**: Complete archive functionality with filtering and visual indicators
- **Starred System**: Star/favorite pieces with filtering and visual indicators across table and kanban views
- **Enhanced Filtering**: Comprehensive filter system with search, archived status, and starred-only views
- **Mobile Optimizations**: Improved mobile layout with wider content area and better spacing