---
name: global-context
description: Directriz maestra del proyecto GitData. Provee el contexto arquitectónico global (Monorepo) y OBLIGA al cumplimiento estricto del resto de las skills.
---

# 🌍 GitData Monorepo - Contexto Global

Esta es la **regla maestra** del proyecto. Todas las interacciones en GitData deben someterse a los lineamientos del **Monorepo (pnpm workspaces)**, dividiendo responsabilidades entre Backend (Fastify) y Frontend (React).

## 🏛️ Contexto Arquitectónico (Fastify + Vite)

El proyecto emplea una arquitectura de monorepo:
- **`apps/api` (Backend)**: Fastify puro con TypeScript. Lógica ultrarrápida, validación con Zod y endpoints REST.
- **`apps/web` (Frontend)**: React + Vite. Interfaces ligeras (Mini Layouts/Widgets) para consumir la API.
- **Gestión**: `pnpm workspaces` centraliza comandos (ej. `pnpm dev` levanta ambos).

## ⚖️ Ley de Cumplimiento de Skills

Es OBLIGATORIO respetar las skills especializadas:
1. **`fastify`**: Lineamientos para crear rutas y plugins en el backend.
2. **`react-vite`**: Reglas para componentes, layouts y estilos en el frontend.
3. **`code-quality`**: Política de "No Comments" y SOLID aplicable a ambos entornos.
4. **`no-browser`**: PROHIBICIÓN TOTAL del subagente del navegador.

## 🛡️ Flujo de Implementación
1. **API**: Definir endpoints en `apps/api` usando Fastify y Zod.
2. **Web**: Crear el componente UI en `apps/web` que consuma el endpoint.
3. **Tests**: Mantener la cobertura en lógica de negocio clave.
