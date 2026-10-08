import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSymbol?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSymbol = true,
  className = '',
  onClick,
}) => {
  const symbolSizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-bold',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {showSymbol && (
        <div
          className={`${symbolSizes[size]} relative flex items-center justify-center shrink-0 text-[#18181B] group-hover:text-stone-700 transition-colors`}
          aria-hidden="true"
        >
          {/* Original geometric architectural mark: two synchronizing workspace frames with hairline alignment */}
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Primary architectural plane */}
            <rect
              x="2.5"
              y="3"
              width="6.5"
              height="14"
              rx="1.75"
              className="fill-[#18181B]"
            />
            {/* Collaborative interlocking plane with subtle offset */}
            <rect
              x="11"
              y="7.5"
              width="6.5"
              height="9.5"
              rx="1.75"
              className="fill-[#71717A]"
            />
            {/* Spatial connecting node */}
            <rect
              x="11"
              y="3"
              width="6.5"
              height="3"
              rx="1"
              className="fill-[#18181B] opacity-30"
            />
          </svg>
        </div>
      )}

      {/* Pristine typographic wordmark */}
      <div className={`tracking-[-0.03em] ${textSizes[size]} text-[#18181B] flex items-center leading-none`}>
        <span className="font-bold">Collab</span>
        <span className="font-medium text-[#52525B]">Space</span>
      </div>
    </div>
  );
};
