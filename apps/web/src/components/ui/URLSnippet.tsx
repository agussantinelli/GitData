import React, { useState } from 'react';
import './styles/URLSnippet.css';

interface URLSnippetProps {
  endpoint: string;
  username: string;
  theme: string;
  lang: string;
}

export const URLSnippet: React.FC<URLSnippetProps> = ({ endpoint, username, theme, lang }) => {
  const [copied, setCopied] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'https://git-data-web.vercel.app';
  const url = `${apiUrl}/api/svg/${endpoint}?username=<tu-nombre-usuario>&theme=${theme}&lang=${lang}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="url-snippet-container">
      <code className="url-code">{url}</code>
      <button className={`copy-button ${copied ? 'copied' : ''}`} onClick={handleCopy}>
        {copied ? '¡Copiado!' : 'Copiar URL'}
      </button>
    </div>
  );
};
