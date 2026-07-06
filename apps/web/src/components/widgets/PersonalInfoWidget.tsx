import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import './PersonalInfoWidget.css';

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

export const PersonalInfoWidget: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <Card><p>Cargando ADN Técnico...</p></Card>;
  if (error) return <Card><p>Error: {error}</p></Card>;
  if (!profile) return null;

  const yearsExp = new Date().getFullYear() - new Date(profile.createdAt).getFullYear();

  return (
    <Card className="widget-personal">
      <div className="widget-header">
        <Avatar src={`https://github.com/${profile.username}.png`} alt={profile.name} size={80} />
        <div className="widget-titles">
          <h2>{profile.name}</h2>
          <p>
            <span className="gradient-text">@{profile.username}</span> • {profile.location} • {yearsExp} años exp.
          </p>
        </div>
      </div>

      <p className="widget-bio">{profile.bio}</p>

      <div className="widget-languages">
        {profile.topLanguages.map((lang) => (
          <Badge key={lang} variant="secondary">{lang}</Badge>
        ))}
      </div>

      <div className="widget-stats">
        <div className="stat-item">
          <span className="stat-value gradient-text">{profile.stats.commits}</span>
          <span className="stat-label">Commits</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{profile.stats.stars}</span>
          <span className="stat-label">Estrellas</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{profile.stats.prs}</span>
          <span className="stat-label">PRs</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{profile.followers}</span>
          <span className="stat-label">Seguidores</span>
        </div>
      </div>
    </Card>
  );
};
