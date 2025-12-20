import React, { useEffect } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  // モーダル表示中はメイン画面のスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // クリーンアップ関数
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">エゴサーチ サポート - 使い方</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 基本的な使い方 */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              基本的な使い方
            </h3>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>タレントを選択します。</li>
              <li>選択したタレントごとの検索ワードや、選択したタレントの投稿のみで検索クエリを作成することができます。</li>
              <li>必要に応じて高度な検索フィルタで検索条件を設定することもできます。</li>
              <li>「Xで検索」ボタンをクリックすることで、検索クエリを設定した状態でXの検索画面が開きます。</li>
            </ol>
          </section>

          {/* タレントの投稿のみで検索 */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              タレントの投稿のみで検索
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                特定のタレントのアカウントから投稿されたポストのみを検索することができます。
              </p>
              <ol className="space-y-1 list-decimal list-inside text-sm">
                <li>タレントを選択し、「タレントアカウントで絞り込み」のチェックボックスをオンにします。</li>
                <li>「Xで検索」ボタンをクリックすることで、選択したタレントのTwitterアカウントから投稿されたポストのみで検索できます。</li>
              </ol>
            </div>
          </section>

          {/* タレント別ワード検索 */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔖</span>
              タレント別ワード検索
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                タレントを選択すると、そのタレントに関連するエゴサワードが表示されます。表示内容から選択することでエゴサワードに追加することができます。
              </p>
              <ol className="space-y-1 list-decimal list-inside text-sm">
                <li>タレントを選択後、「タレント別検索ワード」セクションが表示されます。</li>
                <li>「開く」ボタンをクリックすると、カテゴリ別のキーワード一覧が表示されます。</li>
                <li>追加したいキーワードをクリックして選択します。</li>
                <li>選択したキーワードが自動的に検索キーワードに追加されます。</li>
              </ol>
              <span>※「検索プレビューを表示」ボタンをクリックすると、検索クエリのプレビューが表示されます。</span><br/>
              <span>※「タレント」と「ワード」ボタンをクリックすると、タレントとワードの組み合わせで検索クエリが作成されます。</span><br/>
              <span>例：タレントを「ときのそら」、ワードを「ライブ」「そらぱ」で選択すると、「"ときのそら" + "ライブ"」もしくは「"ときのそら" + "そらぱ"」で検索できる検索クエリが追加されます。</span>
            </div>
          </section>

          {/* 高度な検索フィルタ */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              高度な検索フィルタ
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">投稿期間</h4>
                <p className="text-sm text-gray-600">
                  すべて、今日、昨日、過去7日間、過去30日間から選択できます。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">表示設定</h4>
                <p className="text-sm text-gray-600">
                  「リプライを表示」のチェックを外すことで、リプライを除外して元のポストのみを検索できます。
                </p>
              </div>
            </div>
          </section>

          {/* 除外ワードフィルタ */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">🚫</span>
              除外ワードフィルタ
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                特定のワードを含むポストを検索結果から除外できます。
              </p>
              <ol className="space-y-1 list-decimal list-inside text-sm">
                <li>「除外ワードフィルタ」のチェックボックスをオンにします</li>
                <li>「+ 追加」をクリックして除外したいワードを入力します</li>
                <li>追加したワードのチェックボックスをオンにして有効化します</li>
                <li>荒らしや誹謗中傷対策、または、特定のワードを含むポストを除外したい場合に活用できます</li>
              </ol>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Tips
            </h3>
            <ul className="space-y-1 text-sm text-amber-900 list-disc list-inside">
              <li>検索クエリプレビューで実際の検索クエリ内容を確認できます</li>
              <li>「Xで検索」ボタンを押下すると、検索クエリを設定した状態でXの検索画面が開きます。</li>
            </ul>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
