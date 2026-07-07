# 🔌 Guía de Integración de Widgets

GitData no es solo un dashboard monolítico, sino una colección de **Super Mini Layouts** diseñados para ser exportables, portables y fácilmente integrables en plataformas de terceros (Portafolios, Blogs, Firmas de Correo, Notion, etc.).

Esta guía detalla cómo consumir la API subyacente y cómo visualizar los widgets externamente.

---

## 1. Consumo Directo de la API (Headless)

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

## 2. Embebido mediante iFrames (Modo Visual)

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

## 3. Seguridad y CORS

El Backend Fastify está configurado con `@fastify/cors`. Por defecto en entornos de desarrollo acepta solicitudes cruzadas desde cualquier origen. 

Para **Producción**, es fundamental configurar la lista blanca de orígenes (Origins Whitelist) para evitar que terceros consuman tu cuota de peticiones de la API de GitHub:

```typescript
// En server.ts
app.register(cors, {
  origin: ['https://tu-portafolio.com', 'https://tu-blog.com'],
  methods: ['GET']
});
```
