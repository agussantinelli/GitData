# 🧪 Estrategia de Testing en GitData

Para garantizar la estabilidad a largo plazo y evitar regresiones, GitData sigue una estrategia de **Testing Estricto** basada en **Vitest**. No aceptamos código sin pruebas.

## 1. Herramientas Principales
- **Motor de Pruebas**: `vitest` (reemplazando frameworks antiguos como Jest).
- **Frontend**: `@testing-library/react` y `@testing-library/jest-dom` para simulaciones en DOM (usando `happy-dom`).
- **Cobertura**: `@vitest/coverage-v8` para generar métricas precisas.
- **Auditoría CI**: SonarCloud para Quality Gates estrictos basados en el reporte `lcov.info`.

## 2. Regla de Oro del Directorio
Las pruebas **no deben agruparse** en una gigantesca carpeta `__tests__` en la raíz. Toda prueba debe vivir **al lado** del archivo que evalúa, dentro de un subdirectorio `tests/`.

*Correcto:*
`	ext
src/application/use-cases/
 ├── GetDeveloperProfileUseCase.ts
 └── tests/
      └── GetDeveloperProfileUseCase.test.ts
``n
## 3. Estrategia en el Backend (Fastify)
El backend requiere pruebas unitarias aisladas para asegurar la lógica de negocio pura (Clean Architecture).

- **Sin Contenedores Pesados**: Aléjate de NestJS Testing Modules. Instancia los Casos de Uso pasándoles *Mocks* puros en el constructor.
- **Mocking**: Usa `vi.fn()` para emular el comportamiento de Repositorios, Servicios Externos o la propia API de GitHub.

## 4. Estrategia en el Frontend (React)
Los Widgets son la cara visible de GitData. Cada Widget debe asegurar su robustez.

- **Prueba de Renderizado Básico**: Confirmar que el componente renderiza sin crashear.
- **Manejo de Casos Extremos (Edge Cases)**: Pasar arreglos vacíos `[]`, propiedades nulas o strings enormes y verificar que la UI no colapse (Fallbacks).
- **Internacionalización y Temas**: Validar que la interfaz cambie lógicamente cuando se inyectan propiedades como `lang="es"` o `theme="dark"`.

## 5. Cobertura de Código
Todo el monorepo corre con el comando `pnpm test:coverage`. Se requiere mantener un **100% (o cercano)** de cobertura en la lógica de negocio y en el renderizado de Widgets. SonarCloud rechazará automáticamente los Pull Requests que introduzcan código sin testear.
