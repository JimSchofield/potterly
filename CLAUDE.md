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
- **Styling**: CSS modules with BEM-like naming convention and global CSS systems
- **Linting**: ESLint with TypeScript support
- **UUID Generation**: uuid library for unique identifiers

### Project Structure
- `src/main.tsx` - Application entry point with React Router setup and global styles import
- `src/App.tsx` - Main app component with route definitions and sidebar layout
- `src/components/` - Reusable UI components (Sidebar, PotteryCard, KanbanBoard)
- `src/pages/` - Route-specific page components (Home, Pieces, Profile, CreatePiece)
- `src/pages/developer/` - Developer/admin pages not shown in sidebar navigation
- `src/stores/` - Nanostores state management (pieces store with CRUD actions)
- `src/types/` - TypeScript type definitions (PotteryPiece interface)
- `src/styles/` - Global CSS modules (button, badge, form, and card systems)
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
- **PotteryCard**: Reusable card component displaying pottery piece details with status tracking, archive status, and starred indicators
- **KanbanBoard**: Stage-based workflow visualization using PotteryCard components
- **Filters**: Advanced filtering by stage, type, priority, search, archived status, and starred pieces
- **HamburgerMenu**: Mobile navigation toggle with animated hamburger icon

**Pages:**
- **Home**: Dashboard with live statistics from piece store, time-based greetings, and navigation buttons to main app sections
- **Profile**: Basic page component
- **Pieces**: Tabbed interface with nested routing (Kanban/Table views)
- **PieceDetail**: Individual piece detail page with comprehensive view/edit mode for all piece data and stage-specific information
- **CreatePiece**: Form for adding new pottery pieces with status tracking, redirects to detail page after creation
- **Developer pages**: Isolated in `src/pages/developer/` (not in sidebar navigation)

**State Management:**
- Centralized pieces store using Nanostores with reactive filtering
- Filter state management with computed stores for real-time filtering
- CRUD operations: addPiece, updatePiece, removePiece, archivePiece, starPiece
- Advanced filtering: stage, type, priority, search, archived status, starred pieces
- Computed filteredPiecesStore for reactive UI updates

### Routes
**Main Application Routes:**
- `/` - Home dashboard with live statistics and quick navigation
- `/pieces` - Pottery pieces with nested routing:
  - `/pieces/kanban` - Kanban board view (default)
  - `/pieces/table` - Table view
- `/piece/:id` - Individual piece detail page with view/edit mode toggle
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
  status?: string;         // Optional status/notes field for display purposes
  priority: "high" | "medium" | "low";
  stage: "ideas" | "throw" | "trim" | "bisque" | "glaze" | "finished";
  archived: boolean;       // Whether piece is archived
  starred: boolean;        // Whether piece is starred/favorited
  createdAt: string;       // ISO date string
  lastUpdated: string;     // ISO date string  
  dueDate?: string;        // Optional ISO date string
  stageDetails: StageDetails; // Stage-specific information with notes, images, and specialized data
}

// Stage-specific data interfaces
interface StageData {
  notes: string;           // Stage-specific notes
  imageUrl: string;        // Image URL for this stage
}

interface ThrowStageData extends StageData {
  weight?: number;         // Clay weight in grams
}

interface GlazeStageData extends StageData {
  glazes: string;          // Glaze descriptions and techniques
}

interface StageDetails {
  ideas: StageData;        // Initial concepts and design sketches
  throw: ThrowStageData;   // Throwing process with clay weight
  trim: StageData;         // Trimming and refining details
  bisque: StageData;       // First firing process notes
  glaze: GlazeStageData;   // Glazing with specific glaze information
  finished: StageData;     // Final results and completion notes
}
```

### Design System
- **CSS Variables**: Comprehensive pottery-themed color palette in `variables.css`
- **Modular CSS Architecture**: Global CSS modules in `src/styles/` directory imported via `main.tsx`
  - `styles/button.css`: Comprehensive button system with variants (primary, secondary, danger, success, outline), sizes (sm, lg, xl), and layout utilities (block, group)
  - `styles/badge.css`: Badge system with stage badges, priority badges, status indicators, and archive badges
  - `styles/form.css`: Unified form system with consolidated selectors (form-input, form-textarea, form-select) and modifier classes (edit-mode, title-input, weight-input, search-box)
  - `styles/card.css`: Global card system with base card styles, modifier classes (card-accent, card-hover, card-interactive, card-draggable), accent colors, and content elements
  - `styles/index.css`: Central import hub for all global styles
- **Form System**: Consolidated form elements using single selectors with modifier classes for consistent styling across all inputs, textareas, and selects
- **Badge System**: Comprehensive badge variants for stages, priorities, and status indicators with consistent styling and no-wrap text
- **Card System**: Unified card components with shared base styles, hover effects, accent borders, and flexible content layouts for stat cards and pottery cards
- **Animations**: Smooth transitions, hover effects, and micro-interactions
- **Responsive Design**: Mobile-first approach with grid layouts, hamburger menu, and proper mobile spacing to avoid menu overlap
- **Icons**: Emoji-based iconography for pottery workflow stages
- **Mobile Features**: Hamburger menu with slide-in sidebar, optimized touch targets, mobile-specific padding adjustments
- **Visual Indicators**: Star icons for favorited pieces, archive badges, priority dots with no-wrap text

### Recent Features Added
- **Piece Detail Page with Edit Mode**: Complete detail view for individual pottery pieces with toggleable edit mode. Users can view all piece information and stage details, then switch to edit mode to modify any field including stage-specific notes, images, weights, and glazes. Features responsive design and pottery-themed styling
- **Enhanced Navigation**: Pottery cards in Kanban view and piece titles in table view are now clickable links to piece detail pages. Create form redirects to new piece detail page for immediate editing workflow
- **Stage-Specific Data Model**: Added comprehensive stageDetails system with stage-specific information including notes, images, clay weights for throwing, and glaze descriptions. All pottery pieces now track detailed information for each stage of the pottery workflow
- **Enhanced Data Structure**: Expanded PotteryPiece interface with StageDetails containing specialized data for ideas, throw, trim, bisque, glaze, and finished stages. Includes realistic example data in dogfood.json following sequential pottery workflow. New pieces automatically get default empty stage details
- **Dynamic Home Dashboard**: Interactive home page with live statistics calculated from piece store, time-based greetings, and navigation buttons to main app sections
- **Updated Home Statistics**: Home page now shows total pieces (including archived), bisque stage count, starred pieces, and ideas stage count - removed duplicate "total pieces created" card
- **CSS Variables Cleanup**: Removed duplicate CSS variables and consolidated similar colors/styles for better maintainability
- **Optional Status Field**: Status field on pottery pieces is now optional with graceful UI handling
- **Mobile Hamburger Menu**: Slide-in navigation for mobile devices with animated hamburger icon
- **Archive System**: Complete archive functionality with filtering and visual indicators
- **Starred System**: Star/favorite pieces with filtering and visual indicators across table and kanban views
- **Enhanced Filtering**: Comprehensive filter system with search, archived status, and starred-only views
- **Mobile Optimizations**: Improved mobile layout with wider content area and better spacing
- **Modular CSS Architecture**: Complete CSS system extraction eliminating 300+ lines of duplicate code:
  - Button system (`styles/button.css`): Comprehensive variants (primary, secondary, danger, success, outline), sizes (sm, lg, xl), and layout utilities (block, group) with CSS nesting
  - Badge system (`styles/badge.css`): Unified stage badges, priority badges, status indicators, archive badges with consistent styling and white-space: nowrap
  - Form system (`styles/form.css`): Consolidated form elements under single selectors (form-input, form-textarea, form-select) with modifier classes (edit-mode, title-input, weight-input, search-box)
  - Card system (`styles/card.css`): Global card base class with modifier classes for behavior (hover, interactive, draggable), accent colors for stage-based borders, and flexible content layouts
  - Central import hub (`styles/index.css`): Manages all global style imports through main.tsx
- **Mobile Spacing Improvements**: Added proper top padding on mobile pages to avoid hamburger menu overlap
- **Modal System**: Native HTML dialog-based modal system with context provider for confirmation dialogs and forms, fixed TypeScript interface issues
- **Stage Update Dialog**: Modal interface for updating pottery piece stages from table view with confirmation workflow
- **Archive Functionality**: Complete archive system with confirmation dialogs and proper UI state management