---
name: clean-architecture
description: Mandatory rules for enforcing Clean Architecture separation of concerns in the GitData API.
---

# 🏗️ Clean Architecture Rules for GitData

This skill enforces strict separation of concerns within the `apps/api/src` backend. Whenever creating or modifying backend logic, you **MUST** adhere to the following layer rules:

## 1. Domain Layer (`domain/`)
- **Entities**: Pure TypeScript interfaces (e.g. `DeveloperProfile.ts`). No behavior, no external dependencies.
- **Repositories**: Interfaces (`IGithubRepository.ts`) that define contracts for data access.
- **Rule**: This layer cannot import from ANY other layer. It is completely isolated.

## 2. Application Layer (`application/`)
- **Use Cases**: The orchestrators of business logic (e.g. `GetDeveloperProfileUseCase.ts`).
- **Rule**: Use Cases can only import from the `domain/` layer. They must NOT import Fastify, Octokit, or any HTTP/Database specific library. Dependencies must be injected through constructors.

## 3. Infrastructure Layer (`infrastructure/`)
- **Repositories**: Real implementations of domain interfaces (e.g. `OctokitGithubRepository.ts`).
- **Plugins**: Fastify plugins (`fastify-plugins/`) to inject Use Cases globally.
- **Rule**: This is the ONLY layer allowed to know about external services (GitHub API, databases, ORMs).

## 4. Interfaces Layer (`interfaces/`)
- **HTTP Routes**: Fastify controllers (`http/routes/`).
- **Rule**: Controllers are exclusively for HTTP parsing (Extracting query params, body) and HTTP responses (Status codes).
- **Rule**: NEVER write business logic (if/else rules about the domain) or data-fetching logic inside a route. A route must simply call `fastify.useCases.useCaseName.execute()` and return the result.
