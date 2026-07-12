import React from 'react';
import { markSkipHomeLoading } from 'utils/homeTransition';

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const HelpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const pillButtonClass =
  'inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-gray-900';

export interface PageHeaderProps {
  /** 画面タイトル */
  title: string;
  /** 機能の説明文 */
  subtitle: string;
  /** 機能アイコン（w-8 h-8 程度のSVG） */
  icon: React.ReactNode;
  /** アイコンバッジ・ステップ番号のグラデーション（例: 'from-red-500 to-pink-600'） */
  iconGradientClass: string;
  /** 使い方3ステップ（省略時は非表示） */
  steps?: string[];
  onBackToHome: () => void;
  /** 指定時のみ「使い方」ボタンを表示 */
  onHelpClick?: () => void;
}

/**
 * 機能画面共通ヘッダー
 * 「戻る/使い方ボタン + 機能アイコン + タイトル + 説明 + 使い方ステップ」の統一レイアウト
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  iconGradientClass,
  steps,
  onBackToHome,
  onHelpClick,
}) => {
  // サイト内からの復帰ではホームのロード画面をスキップする
  const handleBackToHome = () => {
    markSkipHomeLoading();
    onBackToHome();
  };

  return (
    <header className="text-center mb-10 animate-fade-in">
      {/* ホームに戻るボタンと使い方ボタン */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={handleBackToHome} className={pillButtonClass}>
          <HomeIcon />
          <span className="text-sm font-medium">ホームに戻る</span>
        </button>
        {onHelpClick && (
          <button onClick={onHelpClick} className={pillButtonClass}>
            <HelpIcon />
            <span className="text-sm font-medium">使い方</span>
          </button>
        )}
      </div>

      {/* 機能アイコンバッジ */}
      <div
        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${iconGradientClass} rounded-2xl mb-4 shadow-lg text-white`}
      >
        {icon}
      </div>

      {/* タイトル */}
      <h1
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h1>

      {/* サブタイトル */}
      <p className="text-base md:text-lg text-gray-600 font-light">
        {subtitle}
      </p>

      {/* 使い方ステップ */}
      {steps && steps.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              {index > 0 && (
                <span className="text-gray-300 text-lg rotate-90 sm:rotate-0" aria-hidden>
                  →
                </span>
              )}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br ${iconGradientClass} text-white text-[11px] font-bold flex-shrink-0`}
                >
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );
};

export default PageHeader;
