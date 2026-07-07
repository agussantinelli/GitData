# Guía de Desarrollo Local

Esta guía detalla los pasos necesarios para configurar y ejecutar **GitData** en tu máquina local. Dado que el proyecto utiliza una arquitectura de **Monorepo**, la gestión de dependencias y la ejecución de servicios se realiza de forma centralizada.

## 📋 Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas antes de comenzar:
- **[Node.js](https://nodejs.org/)** (v20 o superior recomendado).
- **[pnpm](https://pnpm.io/)** (v8 o superior). Es el gestor de paquetes oficial del proyecto.
  ```bash
  npm install -g pnpm
  ```

## 🚀 Configuración Inicial

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/git-data.git
   cd git-data
   ```

2. **Instalar las dependencias del Monorepo:**
   Ejecuta este comando **siempre en la raíz del proyecto**. `pnpm` se encargará de instalar los paquetes tanto para la API como para la Web y los enlazará (symlinks) correctamente.
   ```bash
   pnpm install
   ```

3. **Configurar Variables de Entorno (Requisito Crítico):**
   Dado que GitData usa consultas híbridas (GraphQL + REST) para generar métricas inferidas, **necesitas un Token de GitHub**.
   - Ve a [GitHub Developer Settings](https://github.com/settings/tokens) y crea un "Personal Access Token" (clásico o fine-grained) con permisos básicos para leer perfiles y repositorios públicos.
   - Crea un archivo `.env` dentro de la carpeta del backend (`apps/api/`):
   ```bash
   # apps/api/.env
   GITHUB_TOKEN=ghp_tuTokenSecretoAqui...
   PORT=3000
   ```
   *(Nota: Sin este token, el backend fallará al intentar renderizar los widgets avanzados).*

## 🛠️ Ejecución en Modo Desarrollo

Levantar todo el ecosistema es sumamente sencillo. Desde la raíz del proyecto ejecuta:

```bash
pnpm dev
```

Este comando lanzará **ambas aplicaciones simultáneamente** con Hot Reloading:
- **Backend (Fastify):** Escuchando en `http://localhost:3000`
- **Frontend (React + Vite):** Escuchando en `http://localhost:5173`

> [!TIP]
> **Probar la integración:**
> Abre tu navegador en `http://localhost:5173`. Verás el Mini Layout renderizado, el cual estará consumiendo internamente los datos del endpoint de Fastify (`http://localhost:3000/api/profile`).

## 📦 Estructura de Trabajo

Cuando trabajes localmente, ten en cuenta la separación de responsabilidades:
- Si vas a modificar la lógica de extracción de datos, reglas de negocio o endpoints, trabaja dentro de `apps/api/src`.
- Si vas a crear o estilizar nuevos "Mini Layouts", trabaja dentro de `apps/web/src`.

## 🏗️ Compilación (Build)

Para probar cómo se construirán los binarios/bundles de producción, ejecuta:

```bash
pnpm build
```

Esto compilará el TypeScript de Fastify en `apps/api/dist` y empaquetará la web de Vite en `apps/web/dist`.

## 🧪 Pruebas Automatizadas (Testing)

El proyecto cuenta con un entorno de testing basado en **Vitest** con alta cobertura en ambas aplicaciones.

Para correr absolutamente todos los tests del backend y del frontend simultáneamente:
```bash
pnpm test
```

También puedes correrlos de manera individual entrando a los respectivos directorios (`cd apps/api` o `cd apps/web`) y ejecutando `pnpm test`.
