import React from 'react';

interface CrestEmblemProps {
  customImage?: string;
  className?: string;
  size?: number; // default height in px
}

export const CrestEmblem: React.FC<CrestEmblemProps> = ({
  customImage,
  className = '',
  size = 75,
}) => {
  if (customImage) {
    return (
      <img
        src={customImage}
        alt="Republic Hall Crest"
        style={{ height: `${size}px`, maxHeight: `${size}px` }}
        className={`object-contain mx-auto transition-transform ${className}`}
      />
    );
  }

  // Authentic Republic Hall - KNUST Emblem SVG
  // Official colors: Deep Green (#0b6623), Gold (#d4af37), Slate (#0f172a), Red (#d32f2f)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={{ height: `${size}px`, width: `${size}px` }}
      className={`mx-auto block select-none ${className}`}
      role="img"
      aria-label="Republic Hall - KNUST - Set The Pace Crest"
    >
      <defs>
        {/* Outer Circular Path for Top Text */}
        <path
          id="textPathTop"
          d="M 14 50 A 36 36 0 0 1 86 50"
          fill="none"
        />
        {/* Lower Circular Path for Bottom Text */}
        <path
          id="textPathBottom"
          d="M 86 50 A 36 36 0 0 1 14 50"
          fill="none"
        />
        {/* Gold Gradient */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        {/* Green Gradient */}
        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b6623" />
          <stop offset="100%" stopColor="#064e18" />
        </linearGradient>
      </defs>

      {/* Outer Ring Gold */}
      <circle cx="50" cy="50" r="48" fill="url(#goldGrad)" stroke="#0b6623" strokeWidth="1.5" />

      {/* Main Green Ring */}
      <circle cx="50" cy="50" r="44" fill="url(#greenGrad)" stroke="#fef08a" strokeWidth="0.8" />

      {/* Text in Circular Ring */}
      <text
        fill="#fef9c3"
        fontSize="6.2"
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="0.4"
      >
        <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
          REPUBLIC HALL • KNUST
        </textPath>
      </text>

      <text
        fill="#fde047"
        fontSize="5.8"
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="0.8"
      >
        <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
          SET THE PACE
        </textPath>
      </text>

      {/* Inner White/Cream Shield Field */}
      <circle cx="50" cy="50" r="28" fill="#ffffff" stroke="#d4af37" strokeWidth="1.2" />

      {/* Shield Outline */}
      <path
        d="M 50 28 L 65 33 C 65 48 57 58 50 64 C 43 58 35 48 35 33 Z"
        fill="#f8fafc"
        stroke="#0b6623"
        strokeWidth="1.2"
      />

      {/* Shield Division - Left Green, Right Gold */}
      <path
        d="M 50 28 L 35 33 C 35 48 43 58 50 64 Z"
        fill="#0b6623"
        opacity="0.9"
      />
      <path
        d="M 50 28 L 65 33 C 65 48 57 58 50 64 Z"
        fill="#d4af37"
        opacity="0.95"
      />

      {/* Torch of Knowledge / Academic Flame in Center */}
      <g transform="translate(42, 33) scale(0.16)">
        {/* Flame */}
        <path
          d="M 50 5 C 60 25, 75 35, 65 55 C 60 48, 55 45, 50 48 C 45 42, 35 50, 40 35 C 30 20, 45 15, 50 5 Z"
          fill="#ef4444"
          stroke="#fef08a"
          strokeWidth="2"
        />
        <path
          d="M 50 15 C 55 25, 60 30, 55 40 C 50 35, 45 35, 47 28 Z"
          fill="#facc15"
        />
        {/* Torch Handle */}
        <polygon points="40,55 60,55 54,85 46,85" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
        <rect x="36" y="52" width="28" height="6" rx="2" fill="#d4af37" />
      </g>

      {/* Open Book of Learning at Shield Bottom */}
      <path
        d="M 44 56 Q 47 54, 50 55 Q 53 54, 56 56 L 56 61 Q 53 59, 50 60 Q 47 59, 44 61 Z"
        fill="#ffffff"
        stroke="#0f172a"
        strokeWidth="0.8"
      />

      {/* Laurels / Decorative Wreath branches under shield */}
      <path
        d="M 33 63 Q 39 70 50 72 Q 61 70 67 63"
        fill="none"
        stroke="#d4af37"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="72" r="1.5" fill="#ef4444" />
      <circle cx="43" cy="69" r="1.2" fill="#0b6623" />
      <circle cx="57" cy="69" r="1.2" fill="#0b6623" />
    </svg>
  );
};
