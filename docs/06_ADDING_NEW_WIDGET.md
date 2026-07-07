# 🛠️ Guía para Crear un Nuevo Widget

La arquitectura de GitData está diseñada (mediante React y Fastify) para que agregar un nuevo widget analítico sea un proceso estructurado, limpio y libre de deudas técnicas.

Sigue estos 6 pasos estrictos para contribuir o agregar nuevas métricas:

---

## Paso 1: Extraer el dato en el Backend
Todo comienza en el motor. Ve a `apps/api/src/infrastructure/repositories/OctokitGithubRepository.ts`. 
Utiliza los datos provistos por la query de GraphQL (o la API REST) para calcular tu nueva métrica. 

*Ejemplo: Quieres crear un "Widget de Repositorios Archivados". Cuentas los repositorios que tienen `isArchived: true`.*

## Paso 2: Tipar y Actualizar el JSON
Debes mantener el contrato de datos intacto y predecible.
1. Edita `apps/api/src/domain/entities/Profile.ts` agregando tu nueva propiedad a la interfaz `DeveloperProfile` (ej. `archivedCount: number;`).
2. Documenta inmediatamente la nueva propiedad en `docs/03_JSON_STRUCTURE.md`.

## Paso 3: Crear el Componente (Frontend)
Ve a `apps/web/src/components/widgets/` y crea el archivo TSX para tu widget (ej. `ArchivedReposWidget.tsx`).

**Regla de Oro:** 
- El widget solo debe recibir la porción de datos exacta (ej. `archivedCount`), el idioma (`lang`) y el tema (`theme`).
- Debe estar envuelto en el componente base `<Card>` para heredar el diseño Glassmorphism.
- Los íconos deben venir exclusivamente de `react-icons`.

## Paso 4: Estilos Confinados (Vanilla CSS)
Crea un archivo CSS en la subcarpeta `styles/` relativa al componente (ej. `styles/ArchivedReposWidget.css`).

**Regla de Oro:**
- No uses colores en duro (`#FFF`, `red`). 
- Utiliza **exclusivamente** las variables CSS globales inyectadas por el sistema de temas (ej. `var(--text-color)`, `var(--glass-border)`, `var(--bg-glass)`). Esto garantiza que el widget cambie de modo Oscuro a Claro mágicamente.

## Paso 5: Diccionarios de Traducción (i18n)
Abre `apps/web/src/locales/dictionaries.ts`.
Agrega los textos requeridos por tu widget en los **5 idiomas soportados** (Español, Inglés, Portugués, Italiano y Francés). Si tu texto tiene información dinámica (como el nombre de un repo), usa llaves como `{repo}` para reemplazarlos luego en el componente React.

## Paso 6: Renderizar en el Showcase
Finalmente, expón tu obra de arte. Ve a `apps/web/src/App.tsx`.
Crea una nueva sección `<h2 className="section-title">` y mapéalo dentro del iterador de idiomas (`LANGUAGES.map`), instanciando tu widget dos veces: una con `theme="dark"` y otra con `theme="light"`.

¡Listo! Has agregado un nuevo módulo analítico al ecosistema GitData respetando la Arquitectura Limpia.
