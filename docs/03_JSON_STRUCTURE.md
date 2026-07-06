# 📄 Estructura del JSON (API GitData)

El endpoint principal de la API (`/api/profile?username={github_user}`) retorna el "ADN Técnico" de un desarrollador. Este documento detalla la estructura exacta de ese payload JSON para que pueda ser consumido fácilmente por el Frontend u otros servicios.

> **💡 Nota:** Todos los campos marcados como `| null` indican que el usuario no tiene configurado ese dato en su cuenta de GitHub o el repositorio carece del mismo.

---

## 🧬 Estructura Base (`DeveloperProfile`)

El objeto raíz contiene la identidad, métricas globales y la colección de proyectos del desarrollador.

```json
{
  "username": "agussantinelli",
  "name": "Agustín Santinelli", // string | null
  "bio": "Developer...", // string | null
  "company": null, // string | null
  "location": "Rosario", // string | null
  "websiteUrl": null, // string | null
  "twitterUsername": null, // string | null
  "createdAt": "2025-03-20T02:03:16Z", // Fecha ISO de creación de cuenta
  "followers": 4, // number
  "stats": { ... }, // Objeto ProfileStats
  "topLanguages": ["TypeScript", "Java", "C#", "HTML", "CSS"], // Array de lenguajes ordenados por uso (máx 5)
  "projects": [ ... ] // Arreglo de objetos Project (máx 50)
}
```

---

## 📈 Métricas Globales (`stats`)

Agrupa la actividad histórica del usuario.

```json
"stats": {
  "commits": 9970, // Total de commits del último año (Incluye PÚBLICOS + PRIVADOS)
  "prs": 59,       // Total de Pull Requests abiertas
  "issues": 0,     // Total de Issues creados
  "stars": 18      // Suma total de estrellas de TODOS sus repositorios
}
```

---

## 📂 Metadatos de Proyecto (`projects`)

El arreglo `projects` contiene los repositorios más importantes del usuario (ordenados por mayor cantidad de estrellas). Se extrae la "Metadata Extrema" de cada uno:

```json
{
  // 🔹 Información Básica
  "name": "GitData",
  "description": "Motor analítico de GitHub", // string | null
  "url": "https://github.com/agussantinelli/GitData",
  "homepageUrl": null, // string | null (URL del deploy, ej. Vercel/Netlify)
  
  // 🔹 Código y Tecnología
  "primaryLanguage": "TypeScript", // string | null
  "sizeKb": 250, // Tamaño físico del código en Kilobytes
  "license": "GNU General Public License v3.0", // string | null
  
  // 🔹 Fechas Clave
  "createdAt": "2026-03-26T12:28:27Z", // Cuándo nació el proyecto
  "updatedAt": "2026-07-06T20:50:34Z", // Cuándo fue la última vez que tuvo actividad
  
  // 🔹 Banderas de Estado (Ideales para filtros en UI)
  "isArchived": false, // Si es true, el repo está "abandonado" o en Read-Only
  "isPrivate": false,
  "isFork": false, // Si es true, NO es código original suyo (clonó a otro dev)
  
  // 🔹 Métricas Sociales y Colaboración
  "stars": 1,
  "forks": 0, // Cuánta gente bifurcó su proyecto
  "watchers": 0, // Gente suscrita a las notificaciones del repo
  "collaborators": 1, // Cuántas personas tienen acceso push
  
  // 🔹 Actividad y Mantenimiento
  "totalCommits": 73, // Total histórico de commits en la rama principal
  "openIssues": 0, // Issues sin resolver
  "openPullRequests": 0 // PRs pendientes de revisión
}
```

---

## 🚀 Uso en Frontend

Gracias a este nivel de detalle, un Frontend en React puede crear interfaces muy ricas, por ejemplo:
- Filtrar los proyectos: `projects.filter(p => !p.isFork && !p.isArchived)` (Mostrar solo código propio activo).
- Calcular años de experiencia: `new Date().getFullYear() - new Date(createdAt).getFullYear()`.
- Destacar proyectos pesados: Ordenar por `sizeKb`.
- Etiquetar mantenibilidad: Si `openIssues > 10`, mostrar un badge de "Necesita ayuda".
