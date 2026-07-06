---
name: widget-i18n-architecture
description: Architecture rules for building UI widgets, supporting i18n locales, and multi-theme logic.
---

# 🧩 Widget & i18n Architecture

Todo nuevo Widget que se construya en el Frontend (React/Vite) **DEBE** cumplir estrictamente con esta arquitectura de Componentes, Temas e Idiomas, para mantener la estandarización y escalabilidad del Showcase.

## 1. Reglas Estructurales de Widgets
- **Componentes "Dumb" (UI)**: Los Widgets NUNCA deben hacer solicitudes `fetch` directamente a la API por su cuenta. Toda la data se obtiene de manera global en el componente padre (ej: `App.tsx`) y se inyecta en el Widget a través de *props* (ej: `data={profileData}`). Esto evita colapsar el backend con peticiones repetidas.
- **Ubicación**: Todo widget debe crearse dentro de `apps/web/src/components/widgets/`.
- **Estructura CSS**: Siguiendo la regla global `css-structure`, cada Widget debe alojar su archivo de estilos dentro de una subcarpeta local `styles/`.

## 2. Soporte Multilingüe (i18n)
- **Cero Textos Hardcodeados**: Los textos fijos de la interfaz (etiquetas, títulos, descripciones genéricas) NUNCA deben escribirse de forma estática en el código del componente.
- **Diccionarios**: Los textos deben provenir exclusivamente de `apps/web/src/locales/dictionaries.ts`. Si se necesita un nuevo texto, debe agregarse allí.
- **Prop `lang`**: Cada Widget debe recibir obligatoriamente la prop `lang?: Language` (con default `'es'`). El componente debe extraer las traducciones locales usando `const t = dictionaries[lang];`.
- **Idiomas Requeridos**: Todo nuevo elemento del diccionario debe traducirse inmediatamente a los 5 idiomas soportados: Español (`es`), Inglés (`en`), Portugués (`pt`), Italiano (`it`) y Francés (`fr`).

## 3. Soporte Multitema (Light / Dark)
- **Prop `theme`**: Cada Widget debe recibir la prop `theme?: 'light' | 'dark'` (con default `'dark'`).
- **Inyección de Clase**: El contenedor raíz de cada Widget debe estar envuelto con la clase dinámica para forzar las variables: `<div className={\`theme-${theme}\`}>...</div>`.
- **Variables Globales CSS**: En el archivo de estilos del Widget, NUNCA deben usarse colores hexadecimales o RGBA quemados para fondos o textos. Se DEBEN usar las variables temáticas inyectadas por el sistema (ej. `var(--text-color)`, `var(--text-muted)`), permitiendo así que el widget se conmute impecablemente entre claro y oscuro dependiendo del padre.
