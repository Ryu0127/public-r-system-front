import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-[#1DA1F2] text-3xl">ℹ</span>
            使い方
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* モーダルコンテンツ */}
        <div className="px-8 py-6 space-y-6">
          {/* ハッシュタグ投稿モード */}
          <div className="text-gray-700">
            <h3 className="text-xl font-bold text-[#1DA1F2] mb-4">【ハッシュタグ投稿モード】</h3>
            <ol className="list-decimal list-inside space-y-3 text-base">
              <li>投稿したいハッシュタグを選択</li>
              <li>「Xで投稿する」ボタンをクリック</li>
              <li>新しいタブでXの投稿画面が開きます</li>
            </ol>
          </div>

          {/* タグ検索モード */}
          <div className="text-gray-700">
            <h3 className="text-xl font-bold text-[#1DA1F2] mb-4">【タグ検索モード】</h3>
            <ol className="list-decimal list-inside space-y-3 text-base">
              <li>検索したいハッシュタグを入力</li>
              <li>「Xで検索する」ボタンをクリック、またはEnterキー</li>
              <li>新しいタブでXの検索結果が表示されます</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
