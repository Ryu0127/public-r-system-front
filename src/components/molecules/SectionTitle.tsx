import React from 'react';

interface SectionTitleProps {
  /** 英語タイトル（✦ 付きで表示） */
  en: string;
  /** 日本語サブタイトル */
  ja: string;
}

/**
 * セクション見出し（✦英語タイトル + 日本語サブタイトル）
 */
const SectionTitle: React.FC<SectionTitleProps> = ({ en, ja }) => (
  <div className="text-center space-y-4">
    <h2
      className="text-4xl md:text-5xl font-bold text-gray-800"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      ✦{en}
    </h2>
    <span className="text-gray-600 text-lg font-light">{ja}</span>
  </div>
);

export default SectionTitle;
