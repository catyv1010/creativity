# Creativity — Cinematic Presentation Platform

## What is this?
A web app for creating cinematic presentations. Unlike traditional slide tools,
presentations exist in a continuous 2D/3D world space. A virtual camera flies
between scenes with cinematic transitions (dolly-zoom, whip-pan, iris, parallax).

## Tech Stack
- **Next.js 16** (App Router) + React 19 + TypeScript
- **GSAP** — animation engine (camera, transitions, element animations)
- **Zustand + Immer** — state management
- **Tailwind CSS 4** — styling
- **Tiptap** — rich text editing
- **framer-motion** — landing page only (NOT for editor/presenter)

## Architecture

### Core Engine (`src/core/`)
Framework-agnostic animation and data layer:
- `core/types/` — Presentation data model (scenes, elements, animations, camera)
- `core/animation/` — AnimationEngine, CameraSystem, ParallaxSystem, easing presets
- `core/scene/` — SceneFactory (create scenes, elements, default presentations)

### Stores (`src/store/`)
- `presentationStore.ts` — Presentation document state (scenes, elements, animations, camera)
- `cinemaEditorStore.ts` — Editor UI state (selection, tool, viewport, panels)
- `timelineStore.ts` — Timeline playback state (playhead, play/pause, rate)
- `editorStore.ts` — Legacy store (old slide-based editor, being migrated)

### Editor (`src/components/editor/`)
- Canvas with zoom/pan (world-space view of all scenes)
- Properties panel, slide/scene panel, toolbar
- Timeline panel (bottom) for animation authoring

### Key Patterns
- **World Space Camera**: Camera transforms world container inversely.
  Camera at (1000,500) → world translated to (-1000,-500).
- **AnimationDescriptor**: Serializable JSON that AnimationEngine converts to GSAP timelines.
- **Scene layouts**: Pre-defined world positions (horizontal, spiral, vertical, fractal, freeform).
- Elements use `data-element-id` attributes for GSAP targeting.

## Conventions
- Spanish UI text (user-facing), English code/comments
- `createId()` from `@/lib/id` for all IDs (nanoid)
- GSAP plugins registered once in `@/lib/gsap-register.ts`
- Landing page uses framer-motion; editor/presenter use GSAP exclusively

@AGENTS.md
