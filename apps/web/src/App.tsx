import React from 'react';
import './styles/App.css';
import { PersonalInfoWidget } from './components/widgets/PersonalInfoWidget';

function App() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>GitData <span className="gradient-text">Showcase</span></h1>
        <p>Explora el ADN Técnico a través de nuestros Super Mini Layouts impulsados por React y Fastify.</p>
      </header>

      <main className="widgets-grid">
        <PersonalInfoWidget />
        
        {/* Placeholder para futuros widgets */}
        <div style={{ opacity: 0.5, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: '300px' }}>
          <p style={{ color: '#a0a0a0' }}>+ Próximo Widget (Proyectos)</p>
        </div>
      </main>
    </div>
  );
}

export default App;
