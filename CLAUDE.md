# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `netlify dev` - Starts Netlify dev server with functions and Vite hot reload
- **Start Vite only**: `pnpm dev` - Starts Vite development server without functions
- **Build for production**: `pnpm build` - Runs TypeScript compilation then Vite build
- **Lint code**: `pnpm lint` - Runs ESLint with TypeScript extensions, treats warnings as errors
- **Type checking**: `pnpm typecheck` - Runs TypeScript compiler without emitting files
- **Preview production build**: `pnpm preview` - Serves the production build locally
- **Install dependencies**: `pnpm install` - Installs all dependencies using pnpm
- **Database commands**:
  - `pnpm drizzle-kit push` - Push schema changes to database
  - `pnpm drizzle-kit studio` - Open Drizzle Studio for database management
  - `pnpm db:generate` - Generate migrations
  - `pnpm db:migrate` - Run migrations

## Architecture Overview

This is a React 18 + TypeScript + Vite application for pottery management called "Potterly".

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4.x
- **Routing**: React Router DOM v6 (using BrowserRouter)
- **State Management**: Nanostores with React integration
- **Backend**: Netlify Functions (serverless)
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Styling**: CSS modules with BEM-like naming convention and global CSS systems
- **Linting**: ESLint with TypeScript support
- **UUID Generation**: uuid library for unique identifiers

### Project Structure
- `src/main.tsx` - Application entry point with React Router setup and global styles import
- `src/App.tsx` - Main app component with route definitions and sidebar layout
- `src/components/` - Reusable UI components (Sidebar, PotteryCard, KanbanBoard, ProfilePicture)
- `src/pages/` - Route-specific page components (Home, Pieces, Profile, CreatePiece)
- `src/pages/developer/` - Developer/admin pages not shown in sidebar navigation
- `src/stores/` - Nanostores state management (pieces and user stores with CRUD actions)
- `src/network/` - API layer for database communication (pieces.ts, users.ts)
- `src/types/` - TypeScript type definitions (PotteryPiece, User interfaces)
- `src/styles/` - Global CSS modules (button, badge, form, and card systems)
- `src/utils/` - Utility functions (profile-picture.ts for Google SSO image handling, storage.ts for localStorage persistence)
- `src/variables.css` - Global CSS variables for pottery color design system
- `netlify/functions/` - Serverless API endpoints for database operations
- `db/schema.ts` - Drizzle ORM database schema definitions
- `examples/` - Sample JSON data (dogfood.json, user.json)
- `.env` - Environment variables (DATABASE_URL)
- `netlify.toml` - Netlify configuration for functions, dev server, and SPA routing
- `drizzle.config.ts` - Drizzle ORM configuration
- CSS files are co-located with their respective components

### Key Patterns
- **Routing**: Uses declarative routing with Routes/Route components in App.tsx
- **State Management**: Nanostores atoms with reactive React hooks (useStore)
- **Network Layer**: Dedicated API functions in `src/network/` for all HTTP communication
- **Navigation**: Sidebar component uses NavLink with active state styling
- **Styling**: BEM-style CSS class naming (e.g., `sidebar__title`, `sidebar__link--active`)
- **Component Structure**: Functional components with TypeScript, default exports
- **Layout**: Fixed sidebar + main content area layout pattern
- **Data Flow**: Store → Component via useStore hook for reactive updates
- **API Architecture**: Separation of concerns between state management and network calls

### Component Architecture
The application follows a component-based architecture with centralized state:

**Core Components:**
- **Sidebar**: Navigation with animated icons and pottery-themed styling, mobile hamburger menu
- **PotteryCard**: Reusable card component displaying pottery piece details with status tracking, archive status, and starred indicators
- **KanbanBoard**: Stage-based workflow visualization using PotteryCard components
- **Filters**: Advanced filtering by stage, type, priority, search, archived status, and starred pieces
- **HamburgerMenu**: Mobile navigation toggle with animated hamburger icon
- **ProfilePicture**: Reusable component for Google SSO profile pictures with flexible sizing, fallback to pottery emoji, and responsive design

**Pages:**
- **Home**: Dashboard with live statistics from piece store, time-based greetings, and navigation buttons to main app sections
- **Profile**: Basic page component
- **Pieces**: Tabbed interface with nested routing (Kanban/Table views)
- **PieceDetail**: Individual piece detail page with comprehensive view/edit mode for all piece data and stage-specific information
- **CreatePiece**: Form for adding new pottery pieces with status tracking, redirects to detail page after creation
- **Developer pages**: Isolated in `src/pages/developer/` (not in sidebar navigation)

**State Management:**
- **Pieces Store**: Centralized pottery piece management with reactive filtering and database persistence
  - Hybrid data approach: memory store for performance, database for persistence
  - CRUD operations: addPiece, updatePiece, removePiece, archivePiece, starPiece (with database sync)
  - Advanced filtering: stage, type, priority, search, archived status, starred pieces
  - Computed filteredPiecesStore for reactive UI updates
  - `getPieceById` function with fallback to database when not in memory store
- **User Store**: User authentication and profile management with persistent sessions
  - User state management with authentication status, loading, and error states
  - Actions: createUser, loginUser, getUserProfile, updateUserProfile, logoutUser
  - Helper functions: getCurrentUser, isUserAuthenticated, getCurrentUserId
  - Integration with pieces store for ownership tracking
  - Persistent login state using localStorage with 30-day session expiry
  - Automatic session restoration on app startup with data validation
  - Seamless user experience across browser sessions and page refreshes

### Routes
**Main Application Routes:**
- `/` - Home dashboard with live statistics and quick navigation (backwards compatibility)
- `/home` - Home dashboard (canonical path)
- `/pieces` - Pottery pieces with nested routing:
  - `/pieces/kanban` - Kanban board view (default)
  - `/pieces/table` - Table view
- `/piece/:id` - Individual piece detail page with view/edit mode toggle
- `/profile` - Current user's profile page with edit capabilities
- `/profile/:username` - View other user profiles by username (read-only, public view)
- `/create-piece` - Form to create new pottery pieces with stage query parameter support

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
  ownerId: string;         // UUID of the user who owns this piece
  createdAt: string;       // ISO date string
  lastUpdated: string;     // ISO date string  
  dueDate?: string;        // Optional ISO date string
  stageDetails: StageDetails; // Stage-specific information with notes, images, and specialized data
}

interface User {
  id: string;              // UUID
  googleId?: string;       // Google OAuth ID
  firstName: string;       // User's first name
  lastName: string;        // User's last name
  email: string;           // User's email address
  location: string;        // User's location
  title: string;           // User's professional title
  bio: string;             // User's biography
  website: string;         // User's website URL
  socials: UserSocials;    // Social media links
  username: string;        // Unique username
  profilePicture?: string; // Profile picture URL from Google OAuth (base URL without size)
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

### Utilities
- **Profile Picture Utils** (`src/utils/profile-picture.ts`): Flexible Google profile picture handling
  - `getProfilePictureUrl(baseUrl, size)` - Dynamically creates URLs with different sizes
  - `getBaseProfilePictureUrl(fullUrl)` - Strips size parameters from Google URLs  
  - `PROFILE_PICTURE_SIZES` - Predefined size constants for consistent sizing across app
  - Supports both predefined sizes ("LARGE", "MEDIUM") and custom pixel values
- **Storage Utils** (`src/utils/storage.ts`): Persistent data storage with localStorage
  - `saveToStorage()`, `loadFromStorage()`, `removeFromStorage()` - Safe localStorage operations with error handling
  - `saveUserState()`, `loadUserState()`, `clearUserState()` - User session persistence functions
  - `isStorageAvailable()` - Storage capability detection
  - Session expiry mechanism (30-day automatic logout)
  - Data validation and corruption recovery

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
- **Database Integration**: Added PostgreSQL database with Drizzle ORM for data persistence
- **Netlify Functions**: Created serverless API endpoints for CRUD operations on pieces, users, and stage details
- **Hybrid Data Architecture**: Combined in-memory store for performance with database persistence
- **Database Schema**: Normalized relational schema with separate tables for pieces, users, and stage_details
- **Enhanced PieceDetail**: Refactored to fetch pieces from database when not available in memory store
- **Development Setup**: Added Netlify CLI integration, environment configuration, and database migration tools
- **SPA Configuration**: Added Netlify redirect rules for proper single-page application routing support
- **Network Layer Architecture**: Extracted all HTTP calls into dedicated API functions in `src/network/`
- **User Management System**: Complete user store with authentication, profile management, and database integration
- **Routing Updates**: Added `/home` as canonical home path while maintaining `/` for backwards compatibility
- **Google OAuth Authentication**: Complete Google SSO integration using @react-oauth/google with JWT token decoding to extract real user information. Users can sign in with Google accounts and their profile data is automatically populated from Google's user info
- **HTTPS Local Development**: Configured mkcert for SSL certificates enabling HTTPS on localhost:8888 for proper Google OAuth testing
- **Profile Management**: Comprehensive profile page with editing functionality, real user data integration, and pottery-themed styling. Users can edit all profile fields including social links with proper form validation
- **Real User Data Integration**: Replaced dogfood/sample data with real database-backed user pieces. All user pieces are loaded automatically at login time and stored in the reactive pieces store
- **Database Persistence**: Complete CRUD operations now persist to PostgreSQL database:
  - Piece creation with automatic stage details generation
  - Piece editing (title, type, details, priority, stage, etc.) with proper field filtering
  - Stage detail editing (notes, images, weight, glazes) with individual stage persistence
  - Archive/unarchive operations with database sync
  - User profile updates with database storage
- **Submitting States**: Added proper loading states and UI disabling during network operations:
  - CreatePiece form shows "Creating..." state and prevents multiple submissions
  - PieceDetail edit mode shows "Saving..." state and disables all form fields during submission
  - Archive operations show proper loading feedback
- **Logout Functionality**: Added logout button to sidebar with proper session cleanup and navigation
- **Error Handling**: Comprehensive error handling for all database operations with proper user feedback and graceful degradation
- **Ownership Protection**: Added security feature to PieceDetail page - only piece owners can see and use edit buttons, preventing unauthorized editing of other users' pieces
- **Database-Optimized Recent Work**: Created dedicated API endpoint for fetching 6 most recently edited pieces for profile page, replacing client-side filtering with efficient database queries
- **Google Profile Pictures**: Complete profile picture integration from Google SSO:
  - Stores base Google profile picture URLs without size parameters for flexibility
  - Created utility functions for dynamic sizing (getProfilePictureUrl, getBaseProfilePictureUrl)
  - Added PROFILE_PICTURE_SIZES constants (THUMBNAIL=48px, SMALL=96px, MEDIUM=120px, LARGE=200px, etc.)
  - Built reusable ProfilePicture component with size variants, fallback to pottery emoji, and responsive design
  - Updated Profile page to display Google profile pictures at 200px with proper mobile responsiveness
  - Added profilePicture field to User interface and database schema with automatic population during Google login
- **Persistent Login State**: Complete session persistence using localStorage for seamless user experience:
  - Automatic session restoration on app startup with user data validation
  - Persistent user state across browser sessions, page refreshes, and browser restarts
  - 30-day session expiry with automatic cleanup of expired sessions
  - Robust error handling for corrupted localStorage data with graceful fallback
  - Safe localStorage operations with storage availability detection
  - Automatic loading of user pieces when session is restored from localStorage
  - Type-safe persistence with data validation to ensure session integrity
  - Seamless user experience - login once every 30 days, stay logged in otherwise
- **Stage Query Parameter Support**: Enhanced CreatePiece form to accept stage query parameters for pre-filling the stage field. Kanban board "Add" buttons now link directly to `/create-piece?stage={stageName}` for streamlined piece creation workflow
- **Username-Based Profile Routes**: Changed profile routes from UUID-based to username-based for user-friendly URLs:
  - Enhanced Netlify users function to support username lookup with `/api/users?username={username}`
  - Added `getUserByUsernameAPI()` function for fetching users by username
  - Updated route from `/profile/:userId` to `/profile/:username` for readable URLs like `/profile/johndoe`
  - Automatic redirect to `/profile` when users visit their own username-based profile
  - Proper URL encoding and error handling for usernames containing periods and special characters
- **Enhanced Pieces Store Architecture**: Fixed `getPieceById` function to prevent automatic addition of pieces to user store when viewing piece detail pages. Pieces are only added to store when explicitly loaded as part of user's pieces or through normal CRUD operations
- **Creator Links on Piece Detail Pages**: Added comprehensive creator identification and linking on piece detail pages:
  - Fetches and displays piece creator information with automatic user data loading
  - Smart linking: own pieces link to `/profile` (editable), others' pieces link to `/profile/{username}` (public view)
  - Context-aware display: shows "You (Full Name)" for own pieces, "Creator Name" for others
  - Professional styling integrated with pottery theme, subtle backgrounds with hover effects
- **Interactive Username Links**: Made usernames clickable links in profile contact info sections:
  - Own profile: username links to public profile view (`/profile/{username}`) to see how profile appears to others
  - Other profiles: username links refresh current profile page for consistency
  - Added dedicated `.username-link` styling with pottery theme colors and hover effects
  - Enhanced user discoverability and navigation throughout the platform
- **User Image Blob Storage**: Implemented comprehensive image storage system using Netlify Blobs:
  - Created `/api/user-images/*` endpoint supporting POST (upload), GET (retrieve/list), and DELETE operations
  - Secure user-scoped storage with automatic permission validation based on userId
  - Image validation: content-type checking, 5MB size limit, and proper file extension handling
  - Metadata storage including userId, contentType, size, and upload timestamp
  - Organized storage structure: `{userId}/{imageId}.{extension}` for efficient retrieval
  - RESTful API with proper HTTP status codes and comprehensive error handling
  - Frontend API layer (`src/network/user-images.ts`) with TypeScript interfaces and error handling
  - Support for image listing (sorted by upload date), individual image retrieval, and deletion
  - Built-in caching headers for optimal performance and CDN integration
- **Stage Image Upload System**: Complete image upload functionality for pottery workflow stages:
  - Dual upload interface: file input for local images and URL input for external images
  - Stage-specific image storage integrated with user blob storage system
  - Real-time upload progress indicators with disabled states during uploads
  - Image preview in edit mode and display in view mode with proper styling
  - Automatic database persistence of image URLs with stage detail updates
  - Mobile-responsive image display with consistent aspect ratios and shadows
  - Error handling for upload failures with graceful user feedback
  - File input clearing after successful uploads to allow re-uploading same files
  - Integration with existing pottery piece edit/save workflow for seamless user experience
  - Production-ready blob storage system (note: local development uses Netlify Blobs sandbox mode)