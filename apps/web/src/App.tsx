import { useEffect, useState } from 'react';
import './styles/App.css';
import { PersonalInfoWidget } from './components/widgets/PersonalInfoWidget';
import type { Language } from './locales/dictionaries';

// Tipo base extraído (en un proyecto real estaría compartido en un workspace de shared types)
interface ProfileData {
  name: string;
  username: string;
  bio: string;
  location: string;
  followers: number;
  createdAt: string;
  stats: {
    commits: number;
    prs: number;
    issues: number;
    stars: number;
  };
  topLanguages: string[];
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: 'es' },
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'pt', label: 'Português', flag: 'br' },
  { code: 'it', label: 'Italiano', flag: 'it' },
  { code: 'fr', label: 'Français', flag: 'fr' },
];

function App() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Global ÚNICO para optimizar la carga
  useEffect(() => {
    fetch('http://localhost:3000/api/profile?username=agussantinelli')
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching data');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-container">Cargando datos del servidor...</div>;
  if (error) return <div className="loading-container" style={{ color: 'red' }}>Error: {error}</div>;
  if (!profile) return null;

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>GitData <span className="gradient-text">Showcase</span></h1>
        <p>Explora el ADN Técnico a través de nuestros Super Mini Layouts impulsados por React y Fastify.</p>
      </header>

      <h2 className="section-title">Profile Card Widget</h2>

      {LANGUAGES.map((lang) => (
        <div key={lang.code} className="language-section">
          <h3 className="language-title" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.label} style={{ width: 24, marginRight: 8 }} />
            {lang.label}
          </h3>

          <main className="widgets-grid">
            {/* Widget en Modo Oscuro */}
            <PersonalInfoWidget data={profile} theme="dark" lang={lang.code} />

            {/* Widget en Modo Claro */}
            <PersonalInfoWidget data={profile} theme="light" lang={lang.code} />
          </main>
        </div>
      ))}

    </div>
  );
}

export default App;
