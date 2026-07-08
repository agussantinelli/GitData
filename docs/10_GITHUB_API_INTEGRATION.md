# 🐙 Integración con GitHub API

GitData depende enteramente de la información pública extraída de GitHub. Para garantizar rendimiento y evitar bloqueos, implementamos un **enfoque híbrido**.

## 1. Enfoque Híbrido (GraphQL + REST)
GitHub expone dos APIs. Nosotros usamos ambas según la necesidad:

- **GraphQL (Primaria)**: Se utiliza para el 90% de las consultas (Profile, Repositorios, Lenguajes, Commits). Permite traer grafos de datos inmensos en una sola llamada HTTP, reduciendo la latencia brutalmente.
- **REST (Secundaria/Fallback)**: Se utiliza para endpoints que aún no existen en GraphQL o para metadatos específicos (ej. consultar repositorios extremadamente viejos o límites de rate-limit).

## 2. Instancia de Octokit
Todo el contacto con GitHub está abstraído en `apps/api/src/infrastructure/repositories/OctokitGithubRepository.ts`. Las rutas NUNCA hacen peticiones directamente.

La autenticación se realiza inyectando el `GITHUB_TOKEN` desde las variables de entorno en la instancia de Octokit.

## 3. Rate Limits (Errores 429)
GitHub impone un límite de peticiones por hora (5,000 para usuarios autenticados).

Si GitData alcanza el límite, Octokit arrojará un error `429 Too Many Requests`. La API de GitData interceptará este error y devolverá un objeto JSON estructurado al Frontend. El Frontend está programado para renderizar un aviso visual amigable (con un contador regresivo de cuándo se reinicia el límite) en lugar de crashear la UI.

## 4. Caché de Servidor
Para no agotar el Rate Limit, GitData implementa una capa de caché en memoria (u opcionalmente Redis). Si se consulta el perfil de un mismo usuario dos veces en un periodo de 5 minutos, la API devolverá la respuesta desde la memoria RAM instantáneamente sin tocar la red.
