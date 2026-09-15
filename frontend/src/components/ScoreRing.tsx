import React from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 80,
  strokeWidth = 6,
  label,
  sublabel,
  color = '#15803D'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#D6E2DA"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="font-mono font-black text-lg leading-none text-[#17211B] tracking-tight">{score}</span>
          <span className="text-[10px] font-mono font-bold text-[#66756C] leading-none mt-0.5">/100</span>
        </div>
      </div>

      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && <span className="font-bold text-xs text-[#17211B] uppercase tracking-wider">{label}</span>}
          {sublabel && <span className="text-[11px] font-mono text-[#4B5D52] font-semibold">{sublabel}</span>}
        </div>
      )}
    </div>
  );
};
