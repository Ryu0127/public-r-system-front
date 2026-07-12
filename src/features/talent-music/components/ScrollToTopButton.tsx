import React, { useCallback, useEffect, useState } from 'react';

const SHOW_THRESHOLD_PX = 200;

interface ScrollToTopButtonProps {
  /** 表示位置（タレント選択モードバッジ等と重なる場合に上へずらす） */
  positionClass?: string;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  positionClass = 'bottom-6 right-6',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > SHOW_THRESHOLD_PX);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const handleClick = useCallback(() => {
    const startY = window.scrollY;
    if (startY <= 0) return;

    const durationMs = Math.min(450, Math.max(180, startY * 0.25));
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      window.scrollTo(0, startY * (1 - easeOutCubic(progress)));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="ページ上部へ戻る"
      title="ページ上部へ戻る"
      className={`fixed ${positionClass} z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 text-white shadow-lg hover:bg-gray-600 active:scale-95 transition-all duration-200`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};
