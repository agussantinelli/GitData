---
name: css-structure
description: Mandatory rule to keep CSS files inside a styles/ folder relative to their component.
---

# 🎨 CSS Structure Rule

En este proyecto (especialmente en `apps/web`), **está terminantemente prohibido** dejar archivos `.css` sueltos en el mismo nivel que su componente (ej: `Card.tsx` y `Card.css` sueltos en la misma carpeta).

## Reglas de Implementación

1. **Ubicación Obligatoria**:
   Todo archivo de estilos debe residir dentro de un directorio llamado `styles/` que esté ubicado exactamente en el mismo nivel que el archivo que lo consume.

2. **Ejemplo Correcto**:
   ```
   components/ui/
   ├── Card.tsx
   └── styles/
       └── Card.css
   ```

3. **Ejemplo Incorrecto (Prohibido)**:
   ```
   components/ui/
   ├── Card.tsx
   └── Card.css
   ```

4. **Importación**:
   Dentro del componente de React, la importación debe reflejar esta estructura:
   ```tsx
   import './styles/Card.css';
   ```

Cualquier nuevo componente UI o Widget que se cree de ahora en adelante, **debe** acatar esta regla automáticamente.
