import React from 'react';

export type SourceType = 'official' | 'user' | 'ai' | 'demo';

interface SourceBadgeProps {
  type: SourceType;
  label?: string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ type, label, className = '' }) => {
  switch (type) {
    case 'official':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide bg-[#E8F5EC] text-[#166534] border border-[#BDE3CC] ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
          <span>{label || 'OFFICIAL SOURCE'}</span>
        </span>
      );
    case 'user':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          <span>{label || 'USER PROVIDED'}</span>
        </span>
      );
    case 'ai':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          <span>{label || 'AI ESTIMATE'}</span>
        </span>
      );
    case 'demo':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
          <span>{label || 'DEMO DATA'}</span>
        </span>
      );
  }
};
