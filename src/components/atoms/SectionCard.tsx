import React from 'react';

interface SectionCardProps {
  /** パディングや追加レイアウト（例: 'p-6'） */
  className?: string;
  children: React.ReactNode;
}

/**
 * 半透明の白カード（サイト共通のセクション背景）
 */
const SectionCard: React.FC<SectionCardProps> = ({ className = '', children }) => (
  <div
    className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg ${className}`.trim()}
  >
    {children}
  </div>
);

export default SectionCard;
