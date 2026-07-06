import { useEffect, useState } from 'react'
import './App.css'

interface GitProfile {
  username: string
  stats: {
    commits: number
    prs: number
    stars: number
  }
  topLanguages: string[]
  projects: { name: string; description: string }[]
}

function App() {
  const [profile, setProfile] = useState<GitProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3000/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="mini-layout loading">Cargando GitData...</div>
  if (!profile) return <div className="mini-layout error">Error al cargar datos</div>

  return (
    <div className="mini-layout">
      <header className="profile-header">
        <img src={`https://github.com/${profile.username}.png`} alt={profile.username} className="avatar" />
        <div className="profile-info">
          <h2>@{profile.username}</h2>
          <p className="badge">GitData Pro</p>
        </div>
      </header>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="value">{profile.stats.commits}</span>
          <span className="label">Commits</span>
        </div>
        <div className="stat-card">
          <span className="value">{profile.stats.prs}</span>
          <span className="label">PRs</span>
        </div>
        <div className="stat-card">
          <span className="value">{profile.stats.stars}</span>
          <span className="label">Stars</span>
        </div>
      </div>

      <div className="languages">
        {profile.topLanguages.map(lang => (
          <span key={lang} className="lang-tag">{lang}</span>
        ))}
      </div>
    </div>
  )
}

export default App
