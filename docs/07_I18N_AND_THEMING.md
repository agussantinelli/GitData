# 🎨 Arquitectura de Temas y Multi-Idioma (i18n)

GitData Frontend toma una postura fuertemente purista respecto al diseño y la internacionalización. Para garantizar que los widgets sean ultraligeros y fáciles de mantener, **no utilizamos librerías externas** como TailwindCSS, MaterialUI o i18next.

Todo está construido con Vanilla CSS nativo y TypeScript.

---

## 1. Soporte Multitema (Light / Dark)

En lugar de utilizar complejas hojas de estilo condicionadas por JavaScript, utilizamos el poder de la **herencia de variables CSS** (`Custom Properties`).

### El Sistema de Clases Contenedoras
Cualquier widget debe estar envuelto en un contenedor principal que dicte el tema mediante la clase `.theme-dark` o `.theme-light`.

```tsx
<div className={`theme-${theme}`}>
  <Card className="widget-mio">
     <h2 style={{ color: 'var(--text-color)' }}>Hola</h2>
  </Card>
</div>
```

### Inyección de Variables (Glassmorphism)
En el archivo `styles/colors.css`, se definen los "Tokens" de color absolutos. Luego, dentro de las clases de tema, se mapean estos tokens a nombres funcionales:

```css
.theme-dark {
  --bg-glass: rgba(18, 18, 18, 0.6);
  --text-color: #FFFFFF;
  --glass-border: rgba(255, 255, 255, 0.08);
}

.theme-light {
  --bg-glass: rgba(245, 245, 245, 0.8);
  --text-color: #121212;
  --glass-border: rgba(0, 0, 0, 0.1);
}
```

Gracias a esto, el componente `<Card>` usa `background-color: var(--bg-glass)` y `backdrop-filter: blur(20px)`. Con solo cambiar la clase raíz del widget, los colores mutan instantáneamente sin re-renderizados costosos en React.

---

## 2. Internacionalización Nativa (i18n)

Para soportar 5 idiomas simultáneos, mantenemos un objeto plano fuertemente tipado en `locales/dictionaries.ts`.

```typescript
export type Language = 'es' | 'en' | 'pt' | 'it' | 'fr';

export const dictionaries = {
  es: { globalStats: 'Estadísticas Globales' },
  en: { globalStats: 'Global Stats' }
}
```

### Interpolación de Variables
Para traducciones complejas (como aquellas generadas por el Motor de Inferencia), el Backend envía identificadores (`id`) y metadata (ej. `{ repo: "GitData" }`). El Frontend busca el texto base en el diccionario y utiliza JavaScript nativo para reemplazar los marcadores.

```typescript
// Texto en el diccionario: "Has creado el proyecto {repo}."
let desc = msData.desc;
if (meta.repo) {
  desc = desc.replace('{repo}', meta.repo);
}
```

Este enfoque mantiene el *Bundle* (tamaño final de la aplicación) ínfimo, garantizando que los widgets puedan incrustarse en cualquier sitio externo casi sin impactar en el tiempo de carga del portafolio del usuario.
