---
name: react-vite
description: Core architectural rules for React components, styling, and UI in GitData.
---

# ⚛️ React & Vite - Frontend Architecture

Guide for developing "Super Mini Layouts" and widgets in `apps/web`.

## 🎨 Design Philosophy
- **Mini Layouts**: Components must be self-contained, acting like widgets (e.g. 320px wide profile cards).
- **Aesthetics**: Use dark themes, subtle borders (glassmorphism/glow), and micro-animations on hover.
- **Vanilla CSS**: Rely on standard CSS variables and avoid heavy utility frameworks unless required, to keep bundles minimal.

## 🧩 Components
- Build functional components with Hooks.
- Keep components small and focused.
- Ensure loading and error states are always handled gracefully since this acts as a widget.

## 🔌 Data Fetching
- Fetch data from the `apps/api` Fastify backend.
- Define strict TypeScript interfaces for all payloads (e.g. `GitProfile`).
