---
name: fastify
description: Core architectural rules for Fastify routes, plugins, and logic in GitData.
---

# 🚀 Fastify - Backend Architecture

Guide for maintaining the performance and structure of the `apps/api` backend.

## 🏗 Structure
- **Routes**: Define endpoints logically in `src/routes/`. Keep handlers slim.
- **Plugins**: Use Fastify plugins (`fp`) to encapsulate reusable logic (e.g. database connections, external APIs like Octokit).
- **Services/Core**: Place heavy business logic (e.g. Profile Analysis) in isolated functions/classes outside of route handlers.

## 🛡 Validation (Zod)
- Always use `zod` alongside Fastify's native schema validation for incoming requests and outgoing responses.
- Enforce strict typing.

## ⚡ Performance
- Avoid blocking the Event Loop.
- Rely on Fastify's native logging (`logger: true`).
