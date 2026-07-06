# GitData Frontend Rules

## 1. Iconography and Emojis
- **Prohibición de Emojis Nativos:** Está terminantemente prohibido utilizar emojis del sistema operativo (`🔥`, `⭐`, `🇪🇸`, etc.) como elementos de interfaz gráfica o iconos en React. Esto se debe a que sistemas como Windows fallan al renderizar banderas (mostrando letras como "ES") o muestran estilos inconsistentes y poco profesionales.
- **Librería de Iconos Estándar:** Para cualquier necesidad iconográfica dentro de los Widgets o la UI, **DEBE** utilizarse la librería `react-icons` (por ejemplo, importando `FaStar` o `FaFire` desde `react-icons/fa`). Estos iconos son SVGs reales que heredan propiedades CSS (`color: var(--text-muted)`) y respetan el modo Oscuro/Claro automáticamente.
- **Renderizado de Banderas:** Las banderas internacionales deben resolverse utilizando recursos gráficos verdaderos (como SVGs o PNGs estandarizados), por ejemplo, a través de la API gratuita `flagcdn.com` (`<img src="https://flagcdn.com/w40/es.png" />`).
