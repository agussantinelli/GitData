import React, { useState } from 'react';
import './styles/MarkdownSnippet.css';

interface MarkdownSnippetProps {
  endpoint: string;
  username: string;
  theme: string;
  lang: string;
  altText?: string;
}

export const MarkdownSnippet: React.FC<MarkdownSnippetProps> = ({ endpoint, username, theme, lang, altText = 'GitData Widget' }) => {
  const [copied, setCopied] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'https://gitdata.tu-dominio.com';
  const url = `${apiUrl}/api/svg/${endpoint}?username=${username}&theme=${theme}&lang=${lang}`;
  const markdown = `![${altText}](${url})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="markdown-snippet-container">
      <code className="markdown-code">{markdown}</code>
      <button className={`copy-button ${copied ? 'copied' : ''}`} onClick={handleCopy}>
        {copied ? '¡Copiado!' : 'Copiar MD'}
      </button>
    </div>
  );
};
