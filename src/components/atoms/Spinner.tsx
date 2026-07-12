import React from 'react';

interface SpinnerProps {
  /** サイズ（Tailwind の h-/w- クラス） */
  sizeClass?: string;
  /** 線のスタイル（太さ・色） */
  borderClass?: string;
  className?: string;
}

/**
 * ローディングスピナー
 */
const Spinner: React.FC<SpinnerProps> = ({
  sizeClass = 'h-10 w-10',
  borderClass = 'border-4 border-gray-400 border-t-transparent',
  className = '',
}) => (
  <div className={`animate-spin rounded-full ${sizeClass} ${borderClass} ${className}`.trim()} />
);

export default Spinner;
