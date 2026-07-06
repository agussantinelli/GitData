<div align="center">

<h1 align="center">🛡️ Git Data – API</h1>

<p align="center">
  <a href="https://github.com/agussantinelli" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/👤%20Agustín%20Santinelli-agussantinelli-000000?style=for-the-badge&logo=github&logoColor=white" alt="Agus"/>
  </a>
  <a href="https://github.com/martin-ratti" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/👤%20Martín%20Ratti-martin--ratti-000000?style=for-the-badge&logo=github&logoColor=white" alt="Martín"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-10.0.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS Badge"/>
  <img src="https://img.shields.io/badge/Node.js-20.0.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TS Badge"/>
  <img src="https://img.shields.io/badge/pnpm-10.0.0-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm Badge">
  <img src="https://img.shields.io/badge/Octokit-SDK-white?style=for-the-badge&logo=github&logoColor=black" alt="Octokit Badge"/>
  <img src="https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod Badge"/>
  <img src="https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest Badge"/>
  <img src="https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger Badge"/>
  <img src="https://img.shields.io/badge/Redis-Caching-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis Badge"/>
</p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge&logo=gnu&logoColor=white" alt="GPLv3 License"/>
</div>

<hr>
<h2>🎯 Objetivo y Propósito</h2>

<p align="justify">
  <b>GitData</b> no es solo un visualizador de repositorios; es el motor analítico detrás de la <b>"Ficha Técnica"</b> definitiva del desarrollador. En un mercado saturado de métricas superficiales, nuestro propósito es transformar el historial de GitHub en una narrativa técnica coherente, permitiendo que el talento real brille a través de datos precisos y curados.
</p>

<ul>
  <li><b>🧠 Motor de ADN Técnico:</b> Algoritmos avanzados para desglosar la verdadera esencia del stack tecnológico (Frontend vs Backend vs Polyglot).</li>
  <li><b>🔍 Curaduría de "Proyectos Joya":</b> Identificación inteligente de repositorios destacados mediante análisis de impacto y calidad arquitectónica.</li>
  <li><b>📈 Reconstrucción de Timeline:</b> Extracción de hitos productivos para visualizar la evolución tecnológica a lo largo de los años.</li>
  <li><b>📡 API de Inteligencia de Perfil:</b> Provee datos estructurados para el Modo Reclutador y Modo Developer del cliente.</li>
</ul>

<blockquote>
  <p>
    <i>"Nuestra misión es proveer la infraestructura de datos necesaria para que cada desarrollador pueda contar su historia técnica con la profundidad que merece."</i>
  </p>
</blockquote>

<hr>
<h2>🛠️ Stack Tecnológico</h2>

<table>
  <thead>
    <tr style="background-color: #1a1a1a;">
      <th>Categoría</th>
      <th>Tecnología</th>
      <th>Propósito</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Framework</b></td>
      <td>NestJS</td>
      <td>Arquitectura modular, mantenible y altamente testeable.</td>
    </tr>
    <tr>
      <td><b>Language</b></td>
      <td>TypeScript</td>
      <td>Contratos de interfaces robustos entre capas (Domain/Infra).</td>
    </tr>
    <tr>
      <td><b>External SDK</b></td>
      <td>Octokit (GitHub)</td>
      <td>Comunicación fluida y tipada con la API oficial de GitHub.</td>
    </tr>
    <tr>
      <td><b>Validation</b></td>
      <td>Zod</td>
      <td>Sanitización de DTOs y garantía de integridad de datos.</td>
    </tr>
    <tr>
      <td><b>Caching</b></td>
      <td>Redis / In-Memory</td>
      <td>Mitigación de Rate-Limits y optimización de latencia.</td>
    </tr>
    <tr>
      <td><b>Testing</b></td>
      <td>Vitest</td>
      <td>Pruebas unitarias de algoritmos y lógica de dominio.</td>
    </tr>
  </tbody>
</table>
<hr>

<h2>🏗️ Arquitectura y Diseño</h2>
<p>El servidor está diseñado para ser agnóstico a la infraestructura, centrando su valor en el <b>Dominio</b>.</p>

<ul>
  <li><b>Entidades/Dominio:</b> Lógica pura para el cálculo del "Radar de ADN" y "The Hidden Gem".</li>
  <li><b>Casos de Uso:</b> Orquestación de servicios (ej. <code>AnalyzeUserProfile</code>).</li>
  <li><b>Infraestructura:</b> Adaptadores para Octokit (GitHub API), caché de datos y persistencia.</li>
  <li><b>Seguridad:</b> Implementación de Rate Limiting y validación estricta con Zod.</li>
</ul>

<hr />

<h2>🚀 Características Principales</h2>
<ul>
  <li><b>⚡ Algoritmos Big O:</b> Procesamiento de JSONs masivos de la API de GitHub optimizado para baja latencia.</li>
  <li><b>🛡️ Resiliencia de API:</b> Estrategia multi-capa de caché (Redis + In-Memory) para mitigar Rate Limits.</li>
  <li><b>📊 Engine de Análisis:</b> Categorización inteligente de perfiles y detección automática de especialización técnica.</li>
  <li><b>📝 Docs Proactivas:</b> Swagger/OpenAPI integrado para introspección y testing inmediato de endpoints.</li>
</ul>

<hr />

<h2>📦 Estructura del Proyecto</h2>

<pre>
src/
├── domain/          # Lógica de Negocio Pura (Entities, Value Objects)
├── use-cases/       # Servicios de Aplicación (Lógica de Orquestación)
├── infrastructure/  # Controladores, Módulos Externos, API GitHub
├── shared/          # DTOs, Decoradores, Excepciones Globales
└── main.ts          # Punto de entrada de la aplicación
</pre>

<hr />

<h2>🛠️ Skills Especializadas</h2>
<p>Ubicadas en <code>.agent/skills/</code>, son guías técnicas que definen cómo se deben construir las diferentes partes del sistema:</p>

<ul>
    <li><b>🏗️ nest:</b> Blueprint obligatorio para crear módulos, controladores y servicios siguiendo el estándar de GitData.</li>
    <li><b>🧹 code-quality:</b> Guías de Clean Code, SOLID y política de "No Comments" aplicada estrictamente al Engine.</li>
    <li><b>🏷️ naming-conventions:</b> Estándares semánticos para sufijos de archivos (<code>.service.ts</code>, <code>.controller.ts</code>) y clases.</li>
    <li><b>🧪 test-enforcement:</b> Regla mandatoria que exige un archivo <code>.spec.ts</code> por cada archivo de lógica de negocio.</li>
    <li><b>🔄 readme-auto-sync:</b> Automatización para mantener la estructura de capas y el estado de los tests siempre actualizados.</li>
    <li><b>🟢 node:</b> Mejores prácticas para el runtime de Node.js, manejo de asincronía y variables de entorno.</li>
    <li><b>🚫 no-browser:</b> Prohibición estricta del uso de herramientas de navegación para garantizar la seguridad del entorno.</li>
    <li><b>🌍 global-skills:</b> Directorio maestro que indexa todas las habilidades de arquitectura disponibles en el proyecto.</li>
</ul>

<hr />

<h2>💻 Comandos pnpm disponibles</h2>

<table>
  <thead>
    <tr>
      <th>Comando</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p><code>pnpm dev</code></p></td>
      <td>Inicia el servidor en modo desarrollo con <b>Hot Reload</b> activo.</td>
    </tr>
    <tr>
      <td><p><code>pnpm build</code></p></td>
      <td>Compila el proyecto generando los archivos de producción en la carpeta <code>dist/</code>.</td>
    </tr>
    <tr>
      <td><p><code>pnpm start</code></p></td>
      <td>Inicia la aplicación compilada en el entorno local.</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>👥 Equipo</h2>
    <a href="https://github.com/agussantinelli" target="_blank">
        <img src="https://img.shields.io/badge/👤%20Agustín%20Santinelli-agussantinelli-000000?style=for-the-badge&logo=github&logoColor=white" alt="Agus"/>
    </a>
    <a href="https://github.com/martin-ratti" target="_blank">
        <img src="https://img.shields.io/badge/👤%20Martín%20Ratti-martin--ratti-000000?style=for-the-badge&logo=github&logoColor=white" alt="Martin"/>
    </a>
    
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
