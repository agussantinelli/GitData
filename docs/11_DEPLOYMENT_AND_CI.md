# 🚀 CI/CD y Despliegue en GitData

GitData utiliza un pipeline moderno para asegurar que el código en `main` siempre sea desplegable y de alta calidad.

## 1. Integración Continua (GitHub Actions)
Al hacer Push o crear un Pull Request, se disparan dos flujos principales:

- **Frontend CI (`frontend.yml`)**: Corre el linter, verifica los tipos de TypeScript, y ejecuta `vitest` para generar los reportes de cobertura en `apps/web`.
- **Backend CI (`backend.yml`)**: Valida la sintaxis estricta, tipos, y ejecuta los tests aislados del backend usando Fastify en `apps/api`.

Si cualquiera de estos flujos falla (por ejemplo, por un tipo de TypeScript roto o un test caído), el PR es bloqueado automáticamente.

## 2. Auditoría Estática (SonarCloud)
Una vez que se generan los reportes de cobertura (`lcov.info`), GitHub Actions los inyecta en el **SonarScanner**.
SonarCloud analiza la métrica de cobertura (Quality Gate > 80%) y la duplicación de código (< 3.0%). Si detecta vulnerabilidades, code smells, o falta de cobertura, bloquea la integración en GitHub, requiriendo que el desarrollador solucione la deuda técnica antes de hacer merge.

## 3. Despliegue Continuo (Frontend - Vercel)
El Frontend de GitData está desplegado sobre **Vercel**.
Cada vez que se hace merge a `main`, Vercel detecta los cambios, ejecuta `pnpm build` dentro de la carpeta `apps/web` y genera los assets estáticos de Vite.
El despliegue es inmediato y sin tiempos de inactividad (Zero Downtime).

## 4. Despliegue del Backend (Fastify API)
La API Node.js compilada en `apps/api/dist` es agnóstica.
Puede ser desplegada en plataformas PaaS modernas (como Render, Railway o DigitalOcean App Platform) o ejecutarse en un contenedor Docker.
Basta con inyectar las variables de entorno de `.env` (el token de GitHub y configuraciones de CORS) e iniciar el proceso Node.js.
