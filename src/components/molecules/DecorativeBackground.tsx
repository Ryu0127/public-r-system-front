import React from 'react';

interface DecorativeBackgroundProps {
  /** 右上の円のボーダー色（例: 'border-amber-200'） */
  topBorderClass?: string;
  /** 左下の円のボーダー色（例: 'border-sky-200'） */
  bottomBorderClass?: string;
}

/**
 * ページ共通の背景装飾（ゆっくり回転する2つの円）
 * 親要素に relative を指定して使用する
 */
const DecorativeBackground: React.FC<DecorativeBackgroundProps> = ({
  topBorderClass = 'border-amber-200',
  bottomBorderClass = 'border-sky-200',
}) => (
  <>
    <div
      className={`absolute top-20 right-20 w-32 h-32 border-4 ${topBorderClass} rounded-full opacity-20 animate-spin-slow`}
    />
    <div
      className={`absolute bottom-20 left-20 w-40 h-40 border-4 ${bottomBorderClass} rounded-full opacity-20 animate-spin`}
      style={{ animationDuration: '15s' }}
    />
  </>
);

export default DecorativeBackground;
