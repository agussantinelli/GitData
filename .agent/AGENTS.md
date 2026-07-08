# GitData AI Agent Directives

Estas reglas son la LEY. Como agente de IA operando en este repositorio, DEBES acatarlas estrictamente sin excepciones bajo ninguna circunstancia. Tu código y comportamiento serán evaluados con base en ellas.

## 1. Reglas Maestras de Arquitectura (Backend)
- **Fastify Only**: El backend (`apps/api`) está construido sobre **Fastify**. ESTÁ ESTRICTAMENTE PROHIBIDO importar, sugerir o generar código con Express, NestJS o Koa.
- **Clean Architecture**: Debes respetar estrictamente la separación de responsabilidades:
  - `src/domain`: Entidades puras y contratos (interfaces) de repositorios. Sin dependencias externas.
  - `src/application/use-cases`: Lógica de negocio. Toman interfaces, devuelven datos.
  - `src/infrastructure`: Implementaciones de repositorios (Octokit), integraciones externas (Redis/Cache).
  - `src/interfaces/http`: Rutas, Controladores y Plugins de Fastify.

## 2. Reglas de Testing
- **Código Sin Test = Código Inválido**: Toda creación o modificación en el Backend o Frontend (Widgets, Utils, UseCases) DEBE ser acompañada por la creación o modificación simultánea de su archivo de prueba correspondiente.
- **Vitest sobre todo**: Utilizamos exclusivamente **Vitest** como motor de pruebas en todo el monorepo.
- **Estructura de Directorio de Tests**: Los tests NO deben ir en una carpeta raíz `__tests__` gigante. Deben ir en una carpeta interna llamada `tests/` situada junto al archivo a probar (Ejemplo: `apps/web/src/components/widgets/tests/MyWidget.test.tsx`).
- **Mocks y Dependencias**: En el backend, usa `vi.fn()` y dependencias pasadas por constructor. Evita pesados contenedores de inyección.

## 3. Reglas de UI/UX y Frontend
- **Iconos (Prohibición de Emojis Nativos)**: Está TERMINANTEMENTE PROHIBIDO utilizar emojis del SO (fuego, estrella, etc) en el UI debido a incompatibilidades de renderizado multiplataforma. Usa obligatoriamente componentes de `react-icons`.
- **Banderas**: Usa servicios de SVGs reales como `flagcdn.com`.
- **Aesthetic**: Todos los componentes web deben mantener un diseño premium, "pixel-perfect" con variables CSS nativas para el Dark/Light mode, sin recurrir a TailwindCSS a menos que se especifique estrictamente.

## 4. Control de Versiones e Integración Continua (CI)
- **Cobertura de Código (SonarCloud)**: Antes de validar tus cambios, ten en cuenta que el CI corre `pnpm test:coverage` para auditar tu código y enviarlo a SonarCloud. Escribe tests robustos que soporten métricas estrictas (Quality Gates).
