<div align="center">

<h1 align="center">🛡️ Git Data – Monorepo</h1>

<p align="center">
  <a href="https://github.com/agussantinelli" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/👤%20Agustín%20Santinelli-agussantinelli-000000?style=for-the-badge&logo=github&logoColor=white" alt="Agus"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Fastify-5.2.1-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify Badge"/>
  <img src="https://img.shields.io/badge/React-18.3.1-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
  <img src="https://img.shields.io/badge/Vite-6.0.5-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite Badge"/>
  <img src="https://img.shields.io/badge/Node.js-22.10.7-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TS Badge"/>
  <img src="https://img.shields.io/badge/pnpm-10.30.3-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm Badge">
</p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge&logo=gnu&logoColor=white" alt="GPLv3 License"/>
</div>

<hr>
<h2>🎯 Objetivo y Propósito</h2>

<p align="justify">
  <b>GitData</b> nace con la misión de ir más allá de las simples estadísticas, convirtiéndose en el motor analítico definitivo para extraer y exponer el verdadero <b>"ADN Técnico"</b> de un desarrollador. En lugar de limitarse a contar estrellas o commits, el objetivo es procesar en profundidad el historial de contribuciones en GitHub para destacar los verdaderos patrones de especialización, la calidad del código y aquellos proyectos o "joyas ocultas" que realmente demuestran el talento y la experiencia detrás de cada perfil.
</p>

<p align="justify">
  Para lograr este nivel de análisis sin sacrificar el rendimiento, el proyecto está estructurado como un ecosistema de <b>Monorepo</b> altamente optimizado. Por un lado, emplea un robusto backend orquestado con <b>Fastify</b>, diseñado para manejar cálculos pesados, gestionar el Rate-Limiting de la API de GitHub y mantener una caché eficiente. Por el otro, ofrece un frontend desarrollado en <b>React y Vite</b> que consume esta inteligencia y la renderiza en <b>"Super Mini Layouts"</b> —widgets e interfaces UI ultraligeras, elegantes y dinámicas— permitiendo integrar estas métricas de forma perfecta en portfolios, dashboards o cualquier plataforma externa que necesite validar el talento real de un programador.
</p>

<hr>
<h2>🐙 ¿Qué es Octokit?</h2>

<p align="justify">
  <b><a href="https://github.com/octokit" target="_blank">Octokit</a></b> es el SDK (Kit de Desarrollo de Software) oficial proporcionado por GitHub. En <b>GitData</b>, utilizamos Octokit en combinación con la <b>API GraphQL de GitHub</b> para realizar consultas masivas y altamente eficientes. Esto nos permite extraer en un solo viaje de red docenas de repositorios, estadísticas de lenguajes y métricas de contribución, superando las limitaciones tradicionales de la API REST y garantizando respuestas ultrarrápidas para nuestros layouts.
</p>

<hr>
<h2>📊 Datos Extraídos (ADN Técnico)</h2>

<p align="justify">
  Gracias a la potencia de GraphQL, <b>GitData</b> es capaz de extraer en tiempo real una cantidad masiva de metadata altamente detallada por cada perfil. Toda esta información se procesa mediante <b>Clean Architecture</b> y se expone de forma estructurada:
</p>

<ul>
  <li><b>Identidad y Trayectoria:</b> Nombre, bio, empresa, ubicación, website, Twitter y <b>fecha exacta de creación de la cuenta</b> (ideal para calcular antigüedad).</li>
  <li><b>Actividad Real (Último Año):</b> Total de commits (incluyendo contribuciones en <b>repositorios privados</b>), pull requests e issues abiertos.</li>
  <li><b>Dominio Tecnológico:</b> Top 5 de lenguajes más utilizados (calculado en base al tamaño en bytes de cada repositorio).</li>
  <li><b>Análisis de Proyectos (Sin Límites):</b> Procesamos hasta 50 repositorios principales ordenados por estrellas, extrayendo de cada uno:
    <ul>
      <li>Estadísticas sociales: Estrellas, Forks, Watchers.</li>
      <li>Métricas de código: Tamaño exacto en KB, Lenguaje principal, Total de Commits Históricos.</li>
      <li>Estado de mantenimiento: Issues abiertos, Pull Requests pendientes.</li>
      <li>Metadatos: Fechas de creación/actualización, Licencia oficial, URL del Deploy (Homepage).</li>
      <li>Tipología: Banderas booleanas (<code>isArchived</code>, <code>isPrivate</code>, <code>isFork</code>) para filtrado avanzado.</li>
      <li>Colaboración: Cantidad de colaboradores activos en el repositorio.</li>
    </ul>
  </li>
</ul>

<hr>
<h2>🛠️ Stack Tecnológico (Monorepo)</h2>

<table>
  <thead>
    <tr style="background-color: #1a1a1a;">
      <th>Capa</th>
      <th>Tecnología</th>
      <th>Propósito</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Backend (API)</b></td>
      <td>Fastify + TypeScript</td>
      <td>Servidor ultrarrápido con arquitectura de rutas modulares para procesar datos de GitHub.</td>
    </tr>
    <tr>
      <td><b>Integración GitHub</b></td>
      <td>Octokit + GraphQL</td>
      <td>Uso de la API GraphQL de GitHub para obtener datos masivos sin impactar los Rate Limits.</td>
    </tr>
    <tr>
      <td><b>Frontend (Web)</b></td>
      <td>React + Vite</td>
      <td>Vistas ligeras (Mini Layouts) con un diseño visual moderno y animaciones sutiles.</td>
    </tr>
    <tr>
      <td><b>Gestión</b></td>
      <td>pnpm Workspaces</td>
      <td>Administración centralizada de dependencias y scripts de orquestación.</td>
    </tr>
    <tr>
      <td><b>Configuración</b></td>
      <td>Dotenv</td>
      <td>Gestión segura del Personal Access Token para las llamadas a la API.</td>
    </tr>
  </tbody>
</table>

<hr>
<h2>📦 Estructura del Proyecto</h2>

<pre>
GitData/
├── apps/
│   ├── api/        # 🚀 Backend Fastify (Endpoints y lógica pura)
│   └── web/        # 🎨 Frontend React+Vite (Mini layouts y Widgets)
├── pnpm-workspace.yaml
└── package.json    # Scripts de orquestación global
</pre>

<hr />

<h2>🛠️ Skills Especializadas</h2>
<p>Ubicadas en <code>.agent/skills/</code>, son guías técnicas que definen cómo se deben construir las diferentes partes del sistema:</p>

<ul>
    <li><b>🚀 fastify:</b> Reglas para definir endpoints, plugins y lógica de negocio pura en el backend (apps/api).</li>
    <li><b>⚛️ react-vite:</b> Lineamientos para desarrollar los "Mini Layouts" en el frontend (apps/web) usando componentes puros y estilos modernos.</li>
    <li><b>🌍 global-context:</b> Directriz maestra que obliga al cumplimiento de la arquitectura de Monorepo.</li>
    <li><b>📚 global-skills:</b> Directorio maestro que indexa todas las habilidades de arquitectura disponibles en el proyecto.</li>
    <li><b>🧹 code-quality:</b> Guías de Clean Code, SOLID y política de "No Comments".</li>
    <li><b>🧪 test-enforcement:</b> Regla mandatoria que exige tests para la lógica de negocio.</li>
    <li><b>🔄 readme-auto-sync:</b> Automatización para mantener la documentación sincronizada.</li>
    <li><b>🟢 node:</b> Mejores prácticas para el runtime de Node.js.</li>
    <li><b>🚫 no-browser:</b> Prohibición estricta del uso de herramientas de navegación.</li>
</ul>

<hr />

<h2>💻 Comandos pnpm disponibles</h2>

<table>
  <thead>
    <tr>
      <th>Comando (desde la raíz)</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p><code>pnpm install</code></p></td>
      <td>Instala y enlaza todas las dependencias del Monorepo.</td>
    </tr>
    <tr>
      <td><p><code>pnpm dev</code></p></td>
      <td>Inicia simultáneamente el servidor <b>Fastify</b> y la app <b>React</b> en modo desarrollo.</td>
    </tr>
    <tr>
      <td><p><code>pnpm build</code></p></td>
      <td>Compila ambos proyectos preparándolos para producción.</td>
    </tr>
  </tbody>
</table>

<hr>

<hr/>
<h2 align="left">⚖️ Licencia</h2>

<p align="left">
  Este proyecto está bajo la <b>Licencia GNU General Public License v3.0 (GPLv3)</b>. Puedes consultar los términos legales completos en el archivo 
  <a href="LICENSE"><code>LICENSE</code></a> incluido en la raíz de este repositorio.
</p>

<p align="left">
  <i>
    🤝 <b>Compromiso Copyleft:</b> La GPLv3 permite el uso, estudio, modificación y distribución de este software. Sin embargo, cualquier obra derivada o modificación distribuida debe ser publicada bajo esta misma licencia, garantizando que el software permanezca libre y accesible para todos.
  </i>
</p>
<hr />

<h2 align="left">🤝 Contribución</h2>

<p align="left">
  ¡Agradecemos enormemente tu interés en contribuir a este proyecto! Dado que este software se distribuye bajo la <b>Licencia GNU General Public License v3.0 (GPLv3)</b>, cualquier contribución que realices debe ser compatible con esta misma licencia.
</p>

<p align="left">
  Para contribuir:
  <ul>
    <li>Haz un <a href="https://docs.github.com/es/pull-requests/collaborating-with-pull-requests/proposing-changes-with-pull-requests/creating-a-pull-request-from-a-fork" target="_blank">fork de este repositorio</a>.</li>
    <li>Crea una nueva rama para tu funcionalidad (<code>git checkout -b feature/nueva-funcionalidad</code>).</li>
    <li>Realiza tus cambios.</li>
    <li>Envía un <a href="https://docs.github.com/es/pull-requests/collaborating-with-pull-requests/proposing-changes-with-pull-requests/creating-a-pull-request" target="_blank">Pull Request</a> detallando tus modificaciones.</li>
  </ul>
</p>

<p align="left">
  ¡Gracias por ser parte! 🙌✨
</p>

<hr>
<p align="center">Desarrollado con ❤️ y mucho 🧉 para la comunidad de GitHub</p>
