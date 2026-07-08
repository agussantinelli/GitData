---
name: test-enforcement
description: Mandatory rule requiring a corresponding Vitest test file for every business logic file in the GitData API Backend.
---

# 🚔 GitData Backend Test Enforcement

To ensure reliability, every logic file in the backend (`apps/api`) must have a corresponding test file.

## 📏 Rules
1. **Rule of One**: Every `.ts` file in `src/domain`, `src/use-cases`, `src/infrastructure`, or `src/interfaces` MUST have a matching `.test.ts` file.
2. **Naming and Location**: The test file MUST be placed inside an internal `tests/` directory located exactly where the original component is. For example, the test for `src/application/use-cases/MyUseCase.ts` must be `src/application/use-cases/tests/MyUseCase.test.ts`.
3. **Tools**: Use **Vitest** for testing and `vi.fn()` for mocks. **DO NOT USE JEST.**
4. **Mocks and Dependencies**: Avoid deep mocking libraries or NestJS-like dependency injection containers. Instantiate classes directly and pass mocked dependencies (e.g., `new GetDeveloperProfileUseCase(mockRepo)`).
5. **Simultaneous Creation**: If a logic file is created or modified, its test MUST be created or updated in the same step.
6. **Coverage**: Ensure business logic, errors, and edge cases (like empty strings or nulls) are strictly covered.
