# 🧠 Motor de Inferencia (Inference Engine)

El gran diferenciador de **GitData** no es simplemente mostrar lo que la API de GitHub provee, sino **deducir métricas complejas** mediante análisis algorítmico en el backend. 

A este módulo lógico lo llamamos el **Motor de Inferencia**. Ubicado principalmente en `OctokitGithubRepository.ts`, se encarga de cruzar variables para extraer el verdadero ADN Técnico.

---

## 1. Reloj del Dev (Time of Day & Hourly Frequency)

GitHub no expone un gráfico de a qué hora programas. Para deducir esto, el motor intercepta los **últimos eventos REST** (hasta 50 interacciones públicas como Pushes, Issues, PRs) y analiza la marca de tiempo (timestamp) de cada uno.

### Distribución por Hora Exacta (`hourlyFrequency`)
Genera un arreglo de 24 posiciones. El índice `0` representa las 00:00 y el `23` las 23:00. Si hiciste 5 commits a las 14:00, el arreglo en el índice `14` se incrementará en 5. 
*Impacto visual:* Permite dibujar gráficos de barras de 24 columnas exactas.

### Franjas Horarias Gruesas (`timeOfDay`)
Resume el esfuerzo en grandes bloques de tiempo para perfilar al desarrollador:
- **Morning (Mañana):** 06:00 a 11:59.
- **Afternoon (Tarde):** 12:00 a 19:59.
- **Night (Noche):** 20:00 a 05:59.

---

## 2. Radar Tecnológico (Tech Radar)

GitHub te dice qué lenguajes usas, pero no qué perfil arquitectónico tienes. GitData agrupa matemáticamente el peso (en Bytes) de tu código fuente en tres grandes pilares:

- **Frontend:** `HTML`, `CSS`, `SCSS`, `JavaScript`, `TypeScript`, `Vue`, `React`, `Svelte`.
- **Backend:** `Java`, `C#`, `Python`, `PHP`, `Ruby`, `Go`, `Rust`, `C++`, `C`.
- **DevOps/Otros:** Cualquier otro lenguaje (Shell, Dockerfile, etc.) no capturado en las dos listas anteriores.

El porcentaje de bytes en cada pilar define si eres un desarrollador puramente Frontend, Backend, o un Full-Stack balanceado.

---

## 3. Logros y Trofeos (Achievements)

Un sistema de "Gamificación" que desbloquea medallas si el perfil supera ciertos umbrales estrictos.

| ID del Trofeo | Nombre | Umbral de Desbloqueo |
| :--- | :--- | :--- |
| `pull-shark` | Pull Shark | Has abierto **5 o más** Pull Requests en el último año. |
| `bug-hunter` | Bug Hunter | Has abierto **5 o más** Issues en el último año. |
| `influencer` | Influencer | Tienes **10 o más** seguidores en tu cuenta. |
| `night-owl` | Night Owl | Tienes más commits en la franja **Night** que en Morning y Afternoon. |
| `early-bird`| Early Bird | Tienes más commits en la franja **Morning** que en Afternoon y Night. |

---

## 4. Línea de Tiempo Histórica (Milestones)

Deduce una narrativa cronológica basada en las fechas de los repositorios extraídos:

1. **Account Created:** Extraído del `createdAt` puro del usuario.
2. **First Public Repo:** Ordena todos los repositorios por fecha de creación, tomando el más antiguo (independientemente de sus estrellas).
3. **First Fork:** Filtra los proyectos con la bandera `isFork === true` y toma el más antiguo. Determina el primer intento del desarrollador por colaborar en código ajeno.
4. **Community Recognition:** Busca el repositorio con la mayor cantidad de `stargazerCount` (estrellas) superior a 0, asumiendo ese como el momento de mayor reconocimiento público.
5. **Major Codebase:** Ordena los proyectos por tamaño físico (`diskUsage`) y si el más grande supera los 1000 KB (1 MB de código neto), lo declara como un proyecto de gran envergadura.
