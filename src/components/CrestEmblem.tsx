import React from 'react';
import { OFFICIAL_REPUBLIC_HALL_LOGO } from '../utils/validation';

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
  const imgSrc = customImage || OFFICIAL_REPUBLIC_HALL_LOGO;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: '1px solid #0b6623',
      }}
      className={`relative rounded-full overflow-hidden shrink-0 mx-auto select-none bg-white ${className}`}
    >
      <img
        src={imgSrc}
        alt="Republic Hall - KNUST - Set The Pace Crest"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        className="block"
        crossOrigin="anonymous"
      />
    </div>
  );
};
