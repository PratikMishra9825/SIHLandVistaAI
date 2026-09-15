import React from 'react';
import { ShieldCheck, User, Satellite, Sparkles, Sliders, AlertCircle, HelpCircle } from 'lucide-react';
import type { DataConfidenceType } from '../types/land';

interface DataConfidenceBadgeProps {
  type: DataConfidenceType | string;
  label?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const DataConfidenceBadge: React.FC<DataConfidenceBadgeProps> = ({
  type,
  label,
  size = 'sm',
  showIcon = true
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'GROUND_VERIFIED':
        return {
          icon: ShieldCheck,
          text: label || '🌱 GROUND-VERIFIED',
          bg: 'bg-[#E8F5EC]',
          border: 'border-[#15803D]',
          textCol: 'text-[#15803D]',
          dotCol: 'bg-[#15803D]'
        };
      case 'VERIFIED':
      case 'official':
        return {
          icon: ShieldCheck,
          text: label || 'VERIFIED / OFFICIAL',
          bg: 'bg-[#EAF7EF]',
          border: 'border-[#A3D9B8]',
          textCol: 'text-[#166534]',
          dotCol: 'bg-[#15803D]'
        };
      case 'USER_PROVIDED':
      case 'user':
        return {
          icon: User,
          text: label || 'USER PROVIDED',
          bg: 'bg-[#EFF6FF]',
          border: 'border-[#BFDBFE]',
          textCol: 'text-[#1E40AF]',
          dotCol: 'bg-[#2563EB]'
        };
      case 'REMOTE_SENSING':
      case 'bhuvan':
      case 'satellite':
        return {
          icon: Satellite,
          text: label || 'REMOTE SENSING / ISRO',
          bg: 'bg-[#F3E8FF]',
          border: 'border-[#DDD6FE]',
          textCol: 'text-[#6B21A8]',
          dotCol: 'bg-[#7C3AED]'
        };
      case 'AI_ESTIMATE':
      case 'ai':
        return {
          icon: Sparkles,
          text: label || 'AI ESTIMATE',
          bg: 'bg-[#FEF3C7]',
          border: 'border-[#FDE68A]',
          textCol: 'text-[#92400E]',
          dotCol: 'bg-[#D97706]'
        };
      case 'SIMULATION':
        return {
          icon: Sliders,
          text: label || 'WHAT-IF SIMULATION',
          bg: 'bg-[#E0F2FE]',
          border: 'border-[#BAE6FD]',
          textCol: 'text-[#075985]',
          dotCol: 'bg-[#0284C7]'
        };
      case 'DEMO':
      case 'demo':
        return {
          icon: AlertCircle,
          text: label || 'DEMO / SEEDED DATA',
          bg: 'bg-[#FFE4E6]',
          border: 'border-[#FECDD3]',
          textCol: 'text-[#9F1239]',
          dotCol: 'bg-[#E11D48]'
        };
      case 'UNAVAILABLE':
      default:
        return {
          icon: HelpCircle,
          text: label || 'DATA UNAVAILABLE',
          bg: 'bg-[#F1F5F9]',
          border: 'border-[#CBD5E1]',
          textCol: 'text-[#475569]',
          dotCol: 'bg-[#64748B]'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-bold uppercase tracking-wider border transition-all ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      } ${config.bg} ${config.border} ${config.textCol}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotCol}`} />
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.text}</span>
    </span>
  );
};
