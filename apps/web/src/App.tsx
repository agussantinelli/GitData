import { useEffect, useState } from 'react';
import './styles/App.css';
import { PersonalInfoWidget } from './components/widgets/PersonalInfoWidget';
import { PopularProjectsWidget } from './components/widgets/PopularProjectsWidget';
import { CategorizedProjectsWidget } from './components/widgets/CategorizedProjectsWidget';
import { GlobalStatsWidget } from './components/widgets/GlobalStatsWidget';
import { TopLanguagesWidget } from './components/widgets/TopLanguagesWidget';
import { LoadingOverlay } from './components/ui/LoadingOverlay';
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
  topLanguages: { name: string; percentage: number }[];
  projects: {
    name: string;
    description: string | null;
    stars: number;
    forks: number;
    url: string;
    primaryLanguage: string | null;
    sizeKb: number;
    updatedAt: string;
    totalCommits: number;
  }[];
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

  useEffect(() => {
    let isMounted = true;
    
    const fetchWithRetry = async (url: string, maxWaitMs = 30000, intervalMs = 2000) => {
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWaitMs) {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error('Error de servidor al extraer datos');
          return await res.json();
        } catch (err: any) {
          // Si el tiempo límite se agotó, lanzamos el error
          if (Date.now() - startTime >= maxWaitMs) {
            throw new Error('Servidor inalcanzable (Timeout de 30s)');
          }
          // Si no, esperamos 2 segundos y reintentamos
          await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
      }
      throw new Error('Servidor inalcanzable (Timeout de 30s)');
    };

    fetchWithRetry('http://localhost:3000/api/profile?username=agussantinelli')
      .then((data) => {
        if (isMounted) {
          setProfile(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
      
    return () => { isMounted = false; };
  }, []);

  if (loading) return <LoadingOverlay message="Extrayendo tu ADN técnico..." />;
  if (error) return <LoadingOverlay error={error} />;
  
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

      {/* ========================================================
          WIDGET 2: POPULAR PROJECTS 
          ======================================================== */}
      <h2 className="section-title" style={{ marginTop: '4rem' }}>Popular Projects Widget</h2>

      {LANGUAGES.map((lang) => (
        <div key={`projects-${lang.code}`} className="language-section">
          <h3 className="language-title" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.label} style={{ width: 24, marginRight: 8 }} />
            {lang.label}
          </h3>
          
          <main className="widgets-grid">
            <PopularProjectsWidget projects={profile.projects} theme="dark" lang={lang.code} />
            <PopularProjectsWidget projects={profile.projects} theme="light" lang={lang.code} />
          </main>
        </div>
      ))}

      {/* ========================================================
          WIDGET 3: CATEGORIZED PROJECTS 
          ======================================================== */}
      <h2 className="section-title" style={{ marginTop: '4rem' }}>Categorized Projects Widget</h2>

      {LANGUAGES.map((lang) => (
        <div key={`categorized-${lang.code}`} className="language-section">
          <h3 className="language-title" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.label} style={{ width: 24, marginRight: 8 }} />
            {lang.label}
          </h3>
          
          <main className="widgets-grid">
            <CategorizedProjectsWidget projects={profile.projects} theme="dark" lang={lang.code} />
            <CategorizedProjectsWidget projects={profile.projects} theme="light" lang={lang.code} />
          </main>
        </div>
      ))}

      {/* ========================================================
          WIDGET 4: GLOBAL STATS 
          ======================================================== */}
      <h2 className="section-title" style={{ marginTop: '4rem' }}>Global Stats Widget</h2>

      {LANGUAGES.map((lang) => (
        <div key={`global-${lang.code}`} className="language-section">
          <h3 className="language-title" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.label} style={{ width: 24, marginRight: 8 }} />
            {lang.label}
          </h3>
          
          <main className="widgets-grid">
            <GlobalStatsWidget stats={profile.stats} followers={profile.followers} theme="dark" lang={lang.code} />
            <GlobalStatsWidget stats={profile.stats} followers={profile.followers} theme="light" lang={lang.code} />
          </main>
        </div>
      ))}

      {/* ========================================================
          WIDGET 5: TOP LANGUAGES 
          ======================================================== */}
      <h2 className="section-title" style={{ marginTop: '4rem' }}>Top Languages Widget</h2>

      {LANGUAGES.map((lang) => (
        <div key={`languages-${lang.code}`} className="language-section">
          <h3 className="language-title" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.label} style={{ width: 24, marginRight: 8 }} />
            {lang.label}
          </h3>
          
          <main className="widgets-grid">
            <TopLanguagesWidget languages={profile.topLanguages} theme="dark" lang={lang.code} />
            <TopLanguagesWidget languages={profile.topLanguages} theme="light" lang={lang.code} />
          </main>
        </div>
      ))}

    </div>
  );
}

export default App;
