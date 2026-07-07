# 🔌 Guía de Integración de Widgets

GitData no es solo un dashboard monolítico, sino una colección de **Super Mini Layouts** diseñados para ser exportables, portables y fácilmente integrables en plataformas de terceros (Portafolios, Blogs, Firmas de Correo, Notion, etc.).

Esta guía detalla cómo consumir la API subyacente y cómo visualizar los widgets externamente.

---

## 1. Consumo Directo de la API (Headless JSON)

Si deseas construir tu propia interfaz gráfica o procesar los datos analíticos en otro backend, puedes consumir nuestra API Fastify directamente.

**Endpoint Principal:**
```http
GET /api/profile?username={github_username}
```

**Ejemplo de uso (cURL):**
```bash
curl "http://localhost:3000/api/profile?username=agussantinelli"
```

**Respuestas Exitosas (200 OK):**
Retorna el payload completo documentado en `03_JSON_STRUCTURE.md`. Al estar respaldado por una estrategia de caché y Rate-Limiting, las llamadas repetidas para el mismo usuario se sirven en escasos milisegundos.

---

## 2. Inyección Directa de SVGs (Modo Readme/Estático)

La API no solo devuelve JSON, sino que también incluye un motor renderizador nativo de SVGs. Esto es ideal para inyectar widgets directamente en archivos Markdown (`README.md` de GitHub) sin necesidad de iFrames.

Todos los endpoints bajo `/api/svg/*` devuelven una imagen vectorial pura en formato `image/svg+xml`. Todos ellos utilizan un potente sistema de caché optimizado y exigen **3 variables** clave para mantener la coherencia visual:

- `username` (Obligatorio): Nombre de usuario en GitHub.
- `theme` (Opcional, default `dark`): Modo visual (`dark` o `light`).
- `lang` (Opcional, default `es`): Idioma de los textos (`es`, `en`, `pt`, `it`, `fr`).

**Ejemplo de uso en un `README.md`:**
```markdown
<!-- Gráfico de Estadísticas Globales en Oscuro e Inglés -->
![Global Stats](https://gitdata.tu-dominio.com/api/svg/global-stats?username=agussantinelli&theme=dark&lang=en)

<!-- Frecuencia de Código en Claro y Portugués -->
![Code Frequency](https://gitdata.tu-dominio.com/api/svg/code-frequency?username=agussantinelli&theme=light&lang=pt)
```

**Rutas SVG Disponibles:**
`/global-stats`, `/top-languages`, `/popular-projects`, `/achievements`, `/profile`, `/hourly-frequency`, `/time-of-day`, `/code-life-balance`, `/categorized-projects`, `/code-frequency`, `/milestones`, `/tech-radar`, `/activity-stream`.

---

## 3. Embebido mediante iFrames (Modo Visual)

La forma más directa de aprovechar el trabajo de UI/UX (Glassmorphism) es integrar el Frontend compilado directamente mediante un `<iframe>`.

*Nota: Actualmente el frontend renderiza un Showcase (Catálogo), pero la arquitectura está preparada para aislar widgets individuales mediante enrutamiento.*

**Ejemplo de integración genérica:**
```html
<iframe 
  src="https://gitdata-showcase.tu-dominio.com/" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);"
></iframe>
```

### Parámetros de Personalización (Proyección Futura)

El Frontend está arquitecturado de forma tal que, mediante parámetros en la URL, se puedan forzar estados específicos de los widgets incrustados.

- `?theme=dark` o `?theme=light`: Obliga al widget a renderizarse con los colores específicos, ignorando la preferencia del sistema operativo del usuario. Ideal para fondos de portafolios que son estrictamente oscuros o claros.
- `?lang=es`: Obliga a cargar el diccionario en Español, sobrescribiendo el idioma del navegador.

```html
<!-- Ejemplo inyectando un widget puramente oscuro y en italiano -->
<iframe src="https://gitdata.tu-dominio.com/widget/achievements?username=agussantinelli&theme=dark&lang=it"></iframe>
```

---

## 4. Seguridad y CORS

El Backend Fastify está configurado con `@fastify/cors`. Por defecto en entornos de desarrollo acepta solicitudes cruzadas desde cualquier origen. 

Para **Producción**, es fundamental configurar la lista blanca de orígenes (Origins Whitelist) para evitar que terceros consuman tu cuota de peticiones de la API de GitHub:

```typescript
// En server.ts
app.register(cors, {
  origin: ['https://tu-portafolio.com', 'https://tu-blog.com'],
  methods: ['GET']
});
```
