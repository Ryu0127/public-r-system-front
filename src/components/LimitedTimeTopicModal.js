import React, { useState, useEffect } from 'react';

const LimitedTimeTopicModal = ({ topic, isOpen: initialIsOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // トピックが存在しない場合は何もしない
    if (!topic) return;

    // 期間チェック
    const now = new Date();
    const startDate = new Date(topic.startDate);
    const endDate = new Date(topic.endDate);
    if (now < startDate || now > endDate) return;

    // LocalStorageチェック
    const dismissedUntil = localStorage.getItem(`topic_dismissed_until_${topic.id}`);
    if (dismissedUntil) {
      const dismissedDate = new Date(parseInt(dismissedUntil));
      if (now < dismissedDate) return;
    }

    // 1秒後に表示
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, [topic]);

  const handleClose = () => {
    if (dontShowAgain && topic) {
      const dismissUntil = new Date();
      dismissUntil.setDate(dismissUntil.getDate() + 7);
      localStorage.setItem(
        `topic_dismissed_until_${topic.id}`,
        dismissUntil.getTime().toString()
      );
    }
    setIsOpen(false);
  };

  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 p-8 animate-scale-in">
        {/* 閉じるボタン */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* タイトル */}
        <h2
          className="text-3xl font-bold text-gray-800 mb-6 pr-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {topic.title}
        </h2>

        {/* 本文 */}
        <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
          {topic.content}
        </p>

        {/* チェックボックス */}
        <div className="flex items-center gap-3 py-4 border-t border-gray-200 mb-6">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
          />
          <label htmlFor="dontShowAgain" className="text-sm text-gray-600 cursor-pointer">
            Don't show for 7 days
          </label>
        </div>

        {/* Closeボタン */}
        <button
          onClick={handleClose}
          className="w-full bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500 hover:from-amber-600 hover:via-sky-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LimitedTimeTopicModal;
