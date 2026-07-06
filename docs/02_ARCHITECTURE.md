# 🏗️ Arquitectura Limpia (Clean Architecture) en GitData

Para garantizar que **GitData** sea escalable, fácil de testear y agnóstico a las herramientas de terceros, el backend (`apps/api/src/`) está rigurosamente estructurado bajo el patrón de **Clean Architecture**.

Esta guía detalla el flujo de información y las responsabilidades de cada capa.

## 🧭 Flujo de la Información (De Afuera hacia Adentro)

La regla de oro de Clean Architecture es la **Regla de Dependencia**: el código en las capas internas no puede saber *nada* sobre el código de las capas externas.

### 1. Interfaces (Capa Externa - Amarilla)
*Ubicación: `apps/api/src/interfaces/http/`*

Aquí viven las rutas de Fastify y los Controladores.
Su única responsabilidad es recibir el Request HTTP, extraer los parámetros, validar el payload de entrada (con Zod) y llamar a un Caso de Uso. **Jamás contienen lógica de negocio**.
Si Fastify se cambia por Express mañana, solo esta capa se ve afectada.

### 2. Infraestructura (Capa Externa - Roja)
*Ubicación: `apps/api/src/infrastructure/`*

Aquí vive la conexión con el "mundo real".
- **Repositories**: Contienen la implementación real (ej. `OctokitGithubRepository`) que sabe que existe GraphQL, tokens y Octokit.
- **Fastify Plugins**: Inyectan estas dependencias reales dentro de Fastify para que estén disponibles globalmente (`fastify.useCases`).

### 3. Aplicación (Capa Media - Azul)
*Ubicación: `apps/api/src/application/use-cases/`*

Aquí vive la **Lógica de la Aplicación** (Casos de Uso).
El `GetDeveloperProfileUseCase` recibe el `username`, llama al repositorio inyectado (`IGithubRepository`) y ejecuta el algoritmo principal de GitData (calcular el ADN Técnico, sumar estadísticas, etc).
**No sabe qué es HTTP, ni sabe qué es Octokit.**

### 4. Dominio (El Núcleo - Verde)
*Ubicación: `apps/api/src/domain/`*

Aquí viven las **Entidades y Contratos**.
- `entities/`: Tipos puros de TypeScript (ej. `DeveloperProfile`) que representan qué es un perfil para nuestro negocio.
- `repositories/`: Interfaces abstractas (`IGithubRepository`) que obligan a la capa de Infraestructura a cumplir con un contrato específico, sin importar si usan REST, GraphQL o una DB falsa.

---

## 🧠 Motor de Inferencia y Deducción Matemática

Para mantener la aplicación rápida y evitar bases de datos pesadas, el Backend implementa un concepto de **Motor de Inferencia**.
Dado que GitHub no expone ciertos datos de valor (como los trofeos, los horarios exactos de trabajo o la rama tecnológica de un desarrollador), la capa de Infraestructura (`OctokitGithubRepository.ts`) los deduce en tiempo real:
- **Tech Radar:** Clasifica los lenguajes dinámicamente en pilares (`Frontend`, `Backend`, `DevOps/Data`).
- **Achievements:** Otorga medallas matemáticas (ej. "Pull Shark" si `PRs > 5`).
- **Time of Day:** Deduce las horas laborales procesando los `created_at` del Activity Stream.

**Regla de Oro:** Toda esta inferencia se hace estrictamente en el Backend. El Frontend solo recibe los datos computados, limpios y listos para dibujar.

---

## 🔗 Consultas Híbridas (GraphQL + REST)

GitData utiliza una estrategia de red **Híbrida**:
1. **GraphQL:** Es la fuente de la verdad para datos relacionales profundos (Repositorios, Contribuciones de 365 días, Lenguajes).
2. **REST API (`/users/{username}/events/public`):** Es la fuente de la verdad para datos cronológicos y sensibles al tiempo.
3. **Degradación Elegante:** Si la API REST falla por límites de tarifa (rate-limits más estrictos que GraphQL), la aplicación captura el error silenciosamente, entrega arreglos vacíos y permite que la data primaria (GraphQL) siga mostrándose sin interrumpir al usuario.

---

## 🚀 Cómo agregar una nueva funcionalidad

Si quieres agregar, por ejemplo, un endpoint para obtener los commits de un usuario:
1. **Domain**: Agregas el método `getCommits()` a `IGithubRepository.ts`.
2. **Infrastructure**: Implementas `getCommits()` en `OctokitGithubRepository.ts`.
3. **Application**: Creas un nuevo caso de uso `GetCommitsUseCase.ts`.
4. **Interfaces**: Creas la nueva ruta en `interfaces/http/routes/commits/index.ts` que llame al caso de uso.
