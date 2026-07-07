---
name: frontend-test-enforcement
description: Mandatory rule requiring a corresponding Vitest/React Testing Library test file for every React component (.tsx) in GitData frontend.
---

# 🚔 GitData Frontend Test Enforcement

To ensure reliability in the user interface, every UI component file must have a corresponding test file.

## 📏 Rules
1. **Rule of One**: Every `.tsx` file (React component) MUST have a matching `.test.tsx` file.
2. **Naming and Location**: The test file MUST be placed inside an internal `tests/` directory located exactly where the original component is. For example, the test for `src/components/widgets/MyWidget.tsx` must be `src/components/widgets/tests/MyWidget.test.tsx`.
3. **Tools**: Use **Vitest** and **React Testing Library**.
4. **Simultaneous Creation**: If a logic or UI component file is created, its test MUST be created in the same step.
5. **Coverage**: Tests should at least cover the default rendering, theming (`theme-dark`/`light`), and localization (`lang` props) if applicable.
