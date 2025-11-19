import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ className, theme = 'light' }) => {
  const beatColor = theme === 'light' ? '#1F2937' : '#FFFFFF'; // Black or White
  const subColor = '#D92626'; // Primary Red

  return (
    <svg 
      viewBox="0 0 190 50" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Beat Audio & Lights Logo"
    >
      <style>
        {`
          .logo-beat { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 800; }
          .logo-sub { font-family: 'Poppins', sans-serif; font-size: 9px; font-weight: 600; letter-spacing: 0.1em; }
        `}
      </style>
      <text x="0" y="35" className="logo-beat" style={{ fill: beatColor }}>Beat</text>
      <g className="logo-sub" style={{ fill: subColor }}>
          <text x="95" y="25">AUDIO</text>
          <rect x="95" y="28.5" width="50" height="1.5" fill={subColor} />
          <text x="95" y="38">& LIGHTS</text>
      </g>
    </svg>
  );
};