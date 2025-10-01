# COYA Mayan Snake Game

## Overview

This is a Mayan-themed Snake game built for COYA Restaurant. The application is a full-stack web game featuring a classic snake gameplay mechanic with custom theming, audio, and responsive controls for both desktop and mobile devices. Players navigate through a Mayan-inspired environment collecting Peruvian culinary items (Ceviche, Guacamole, Empanadas, and Pisco Cocktails) while avoiding collisions with walls and themselves.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, configured with GLSL shader support for potential 3D graphics
- TailwindCSS for utility-first styling with a custom color scheme matching the Mayan/COYA branding

**UI Component Library:**
- Radix UI primitives provide accessible, unstyled component foundations
- Custom-styled components in `client/src/components/ui/` directory follow the shadcn/ui pattern
- Framer Motion for smooth animations and transitions (GameStart, GameOver screens)

**State Management:**
- Zustand for lightweight, hook-based state management
- Two primary stores:
  - `useGame`: Manages game phases (ready, playing, ended) with phase transitions
  - `useAudio`: Handles audio state including mute status and sound playback

**Game Logic:**
- Custom `useSnakeGame` hook encapsulates all game mechanics (snake movement, food collection, collision detection)
- Canvas-based rendering for performance with grid-based snake movement
- Responsive canvas sizing that adapts to viewport dimensions

**Input Handling:**
- Keyboard controls (Arrow keys and WASD) for desktop users
- Touch swipe gestures for mobile devices
- On-screen directional buttons as fallback mobile controls

**Audio System:**
- Howler.js library for cross-browser audio playback
- Three audio tracks: background music, hit sound (game over), success sound (food collected)
- Global mute/unmute functionality with default muted state

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Development mode uses Vite middleware for HMR (Hot Module Replacement)
- Production mode serves pre-built static assets

**API Structure:**
- RESTful API design with `/api` prefix for all endpoints
- Currently minimal routes (game is primarily client-side)
- Request/response logging middleware for debugging

**Data Layer:**
- In-memory storage implementation (`MemStorage` class) for development
- Designed to be swappable with database-backed storage via `IStorage` interface
- User schema defined with Drizzle ORM for future PostgreSQL integration

### External Dependencies

**Database:**
- Drizzle ORM configured for PostgreSQL dialect
- Neon Database serverless driver (`@neondatabase/serverless`)
- Schema location: `shared/schema.ts`
- Migration output directory: `./migrations`
- Environment variable: `DATABASE_URL` (required but not yet actively used)

**Audio Assets:**
- Local audio files served from `client/public/sounds/`:
  - `background.mp3` - Looping background music
  - `hit.mp3` - Game over sound effect
  - `success.mp3` - Food collection sound effect

**Font Resources:**
- Inter font family via `@fontsource/inter` for consistent typography

**3D Graphics (Currently Unused):**
- React Three Fiber and Drei utilities included in dependencies
- GLSL shader support configured in Vite
- Suggests potential future 3D visual enhancements

### Design Patterns

**Component Composition:**
- Game screens separated into distinct components (GameStart, CanvasGame, GameOver)
- UI components are highly composable and reusable across the application

**Custom Hooks:**
- Game logic isolated in `useSnakeGame` for testability and reusability
- Mobile detection hook (`useIsMobile`) for responsive behavior

**Separation of Concerns:**
- Shared types and schemas in `shared/` directory for frontend/backend consistency
- Game constants centralized in `lib/constants.ts`
- Utility functions separated by domain (audio, game logic)

**Path Aliases:**
- `@/*` maps to `client/src/*`
- `@shared/*` maps to `shared/*`
- Improves import readability and refactoring

### Development vs Production

**Development:**
- Vite dev server with HMR for instant feedback
- Runtime error overlay via `@replit/vite-plugin-runtime-error-modal`
- TypeScript type checking without emit

**Production:**
- Client built with Vite to `dist/public`
- Server bundled with esbuild to `dist/index.js` as ESM module
- Static asset serving from built client directory