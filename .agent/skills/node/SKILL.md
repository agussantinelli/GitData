---
name: node
description: Node.js best practices and runtime configuration for GitData-BackEnd.
---

# 🟢 GitData Node.js Standards

Guidelines for the Node.js runtime in the GitData Engine.

## 📏 Rules
1. **Async/Await**: Mandatory use of `async/await` for all asynchronous operations.
2. **Environment**: Use `process.env` (via `dotenv` if needed) for all external variables.
3. **Performance**: Avoid blocking the event loop with synchronous operations.
4. **Types**: Use strict TypeScript definitions for all built-ins.
