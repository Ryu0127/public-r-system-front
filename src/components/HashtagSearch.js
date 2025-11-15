import { useState } from 'react';

const APP_TITLE = 'X(Twitter)ハッシュタグヘルパー';

// タレントごとのハッシュタグデータ
const talentHashtags = {
  tokinosora: {
    name: 'ときのそら',
    hashtags: [
      { id: 1, tag: 'ときのそら', description: '一般' },
      { id: 2, tag: 'soraArt', description: 'ファンアート' },
      { id: 3, tag: 'そらArt', description: 'ファンアート' },
      { id: 4, tag: 'ときのそら生放送', description: '生放送' },
      { id: 5, tag: 'ときのそら聴いたよ', description: '楽曲感想' },
      { id: 6, tag: 'ときのそら読んだよ', description: '書籍感想' },
      { id: 7, tag: 'ときのそら聞いたよ', description: 'ボイス感想' },
      { id: 8, tag: 'ときのそら撮ったよ', description: 'ホロリー' },
      { id: 9, tag: 'ときのそらMMD', description: 'MMD' },
      { id: 10, tag: 'ときのそら実況するってよ', description: '実況動画' },
      { id: 11, tag: 'ときのそらスペース', description: 'Twitterスペース' },
      { id: 12, tag: 'ときのそらクラフト', description: 'マインクラフト関係' },
      { id: 13, tag: 'ときのそらFC', description: 'ファンクラブ限定放送' },
      { id: 14, tag: 'ときのそらと一緒', description: 'ぬいぐるみ・ホロリー写真投稿用' },
    ],
  },
  roboco: {
    name: 'ロボ子さん',
    hashtags: [
      { id: 1, tag: 'robo_co', description: '公式' },
      { id: 2, tag: 'ロボ子Art', description: 'ファンアート' },
      { id: 3, tag: 'ロボ子生放送', description: '生放送' },
      { id: 4, tag: 'ろぼじゅーる', description: 'スケジュール' },
      { id: 5, tag: 'ろぼさー', description: 'ファントーク' },
      { id: 6, tag: '聴いたよロボ子さん', description: 'ボイス感想' },
      { id: 7, tag: 'RBCSPACE', description: 'Twitterスペース' },
      { id: 8, tag: 'ロボ子レクション', description: '切り抜き' },
      { id: 9, tag: 'カスタムロボ子さん', description: '配信で使用できる提供素材' },
      { id: 10, tag: 'みてみてろぼろぼ', description: 'ロボ子さんが見る見るタグ' },
      { id: 11, tag: 'RBNAIL', description: 'ろぼさー作サムネ' },
    ],
  },
};

// Twitterアイコンコンポーネント
const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

// ハッシュタグアイコンコンポーネント
const HashIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

// 検索アイコンコンポーネント
const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// ホームアイコンコンポーネント
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const HashtagSearch = () => {
  // タレント選択の状態
  const [selectedTalent, setSelectedTalent] = useState('tokinosora');

  // モード切り替えの状態 ('post' または 'search')
  const [mode, setMode] = useState('post');

  // ハッシュタグ投稿機能の状態
  const [selectedTags, setSelectedTags] = useState([]);

  // タグ検索機能の状態
  const [searchQuery, setSearchQuery] = useState('');

  // タレントリストを取得
  const talentList = Object.entries(talentHashtags).map(([key, value]) => ({
    key,
    name: value.name,
  }));

  // 選択中のタレントのハッシュタグデータを取得
  const currentTalent = talentHashtags[selectedTalent];
  const predefinedHashtags = currentTalent.hashtags;
  const quickSearchTags = predefinedHashtags.slice(0, 6);

  // タレント変更ハンドラ
  const handleTalentChange = (e) => {
    setSelectedTalent(e.target.value);
    setSelectedTags([]);
  };

  // ハッシュタグの選択/解除
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Xで投稿する
  const handlePostToTwitter = () => {
    if (selectedTags.length === 0) {
      alert('ハッシュタグを1つ以上選択してください');
      return;
    }

    const hashtags = selectedTags.map((tag) => `#${tag}`).join('\n');
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(hashtags)}`;
    window.open(tweetUrl, '_blank');
  };

  // Xで検索する
  const handleSearchOnTwitter = () => {
    if (!searchQuery.trim()) {
      alert('検索したいハッシュタグを入力してください');
      return;
    }

    const searchUrl = `https://twitter.com/search?q=${encodeURIComponent('#' + searchQuery.trim())}`;
    window.open(searchUrl, '_blank');
  };

  // クイック検索ボタンをクリック
  const handleQuickSearch = (tag) => {
    setSearchQuery(tag);
  };

  // Enterキーで検索
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchOnTwitter();
    }
  };

  // ホームに戻る
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-blue-200 rounded-full opacity-20 animate-spin-slow" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 border-4 border-sky-200 rounded-full opacity-20 animate-spin"
        style={{ animationDuration: '15s' }}
      />

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* ヘッダー */}
        <header className="text-center mb-12 animate-fade-in">
          {/* ホームに戻るボタン */}
          <div className="flex justify-start mb-6">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
            >
              <HomeIcon />
              <span className="text-sm font-medium">ホームに戻る</span>
            </button>
          </div>

          {/* タイトル */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="text-[#1DA1F2]">
              <TwitterIcon />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {APP_TITLE}
            </h1>
            <div className="text-[#1DA1F2]">
              <HashIcon />
            </div>
          </div>

          {/* サブタイトル */}
          <p className="text-lg text-gray-600 font-light">
            ハッシュタグを選択して投稿、または検索できます
          </p>
        </header>

        {/* タレント選択セクション */}
        <section className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <label htmlFor="talent-select" className="block text-sm font-semibold text-gray-700 mb-3">
              タレントを選択
            </label>
            <div className="relative">
              <select
                id="talent-select"
                value={selectedTalent}
                onChange={handleTalentChange}
                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 focus:border-[#1DA1F2] focus:outline-none rounded-xl text-gray-800 font-medium transition-all duration-200 cursor-pointer appearance-none"
              >
                {talentList.map((talent) => (
                  <option key={talent.key} value={talent.key}>
                    {talent.name}
                  </option>
                ))}
              </select>
              {/* カスタム矢印 */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              選択中: <span className="font-semibold text-[#1DA1F2]">{currentTalent.name}</span>
            </p>
          </div>
        </section>

        {/* 使い方セクション */}
        <section className="max-w-2xl mx-auto mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-[#1DA1F2]">ℹ</span>
            使い方
          </h2>
          {mode === 'post' ? (
            <div className="text-sm text-gray-700">
              <h3 className="font-semibold text-[#1DA1F2] mb-2">【ハッシュタグ投稿モード】</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>投稿したいハッシュタグを選択</li>
                <li>「Xで投稿する」ボタンをクリック</li>
                <li>新しいタブでXの投稿画面が開きます</li>
              </ol>
            </div>
          ) : (
            <div className="text-sm text-gray-700">
              <h3 className="font-semibold text-[#1DA1F2] mb-2">【タグ検索モード】</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>検索したいハッシュタグを入力</li>
                <li>「Xで検索する」ボタンをクリック、またはEnterキー</li>
                <li>新しいタブでXの検索結果が表示されます</li>
              </ol>
            </div>
          )}
        </section>

        {/* モード切り替えタブ */}
        <section className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-lg inline-flex gap-2 w-full">
            <button
              onClick={() => setMode('post')}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                mode === 'post'
                  ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] text-white shadow-lg shadow-blue-500/30'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <HashIcon />
              ハッシュタグ投稿
            </button>
            <button
              onClick={() => setMode('search')}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                mode === 'search'
                  ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] text-white shadow-lg shadow-blue-500/30'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <SearchIcon />
              タグ検索
            </button>
          </div>
        </section>

        {/* メイン機能エリア */}
        <div className="max-w-2xl mx-auto">
          {/* ハッシュタグ選択・投稿機能 */}
          {mode === 'post' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* カードヘッダー */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9] text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <HashIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ハッシュタグ投稿
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentTalent.name}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                複数のハッシュタグを選択してXに投稿できます
              </p>
            </div>

            {/* ハッシュタグ選択エリア */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                投稿するハッシュタグを選択
              </h3>
              <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {predefinedHashtags.map((hashtag) => (
                  <label
                    key={hashtag.id}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedTags.includes(hashtag.tag)
                        ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white border-gray-200 hover:border-[#1DA1F2] text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(hashtag.tag)}
                      onChange={() => toggleTag(hashtag.tag)}
                      className="hidden"
                    />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">#{hashtag.tag}</span>
                      <span className={`text-xs ${selectedTags.includes(hashtag.tag) ? 'text-blue-100' : 'text-gray-500'}`}>
                        {hashtag.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 選択中のハッシュタグ表示 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  選択中のハッシュタグ
                </h3>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1DA1F2] text-white text-sm font-bold shadow-md">
                  {selectedTags.length}
                </span>
              </div>
              <div className="min-h-[80px] p-4 bg-gray-50 rounded-xl border border-gray-200">
                {selectedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#1DA1F2] text-white text-sm rounded-full shadow-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">
                    ハッシュタグを選択してください
                  </p>
                )}
              </div>
            </div>

            {/* 投稿ボタン */}
            <div>
              <button
                onClick={handlePostToTwitter}
                disabled={selectedTags.length === 0}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedTags.length > 0
                    ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <TwitterIcon />
                Xで投稿する
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                ※ ボタンを押下すると、新しいタブでX(Twitter)の投稿画面が開きます
              </p>
            </div>
          </div>
          )}

          {/* タグ検索機能 */}
          {mode === 'search' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* カードヘッダー */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9] text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <SearchIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    タグ検索
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentTalent.name}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                ハッシュタグを入力してXで検索できます
              </p>
            </div>

            {/* クイック検索ボタン */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                クイック検索
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {quickSearchTags.map((hashtag) => (
                  <button
                    key={hashtag.id}
                    onClick={() => handleQuickSearch(hashtag.tag)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 hover:border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white rounded-xl text-left transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 group"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-white">#{hashtag.tag}</span>
                      <span className="text-xs text-gray-500 group-hover:text-blue-100">
                        {hashtag.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 検索入力エリア */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                検索するハッシュタグを入力
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="例: ときのそら"
                  className="w-full px-4 py-4 pr-12 bg-white border-2 border-gray-200 focus:border-[#1DA1F2] focus:outline-none rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ※ #記号は自動で追加されます
              </p>
            </div>

            {/* プレビュー */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                検索プレビュー
              </h3>
              <div className="min-h-[80px] p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
                {searchQuery.trim() ? (
                  <span className="inline-flex items-center gap-1 px-4 py-2 bg-[#1DA1F2] text-white text-lg rounded-full shadow-md">
                    #{searchQuery.trim()}
                  </span>
                ) : (
                  <p className="text-gray-400 text-sm text-center">
                    検索するハッシュタグを入力してください
                  </p>
                )}
              </div>
            </div>

            {/* 検索ボタン */}
            <div>
              <button
                onClick={handleSearchOnTwitter}
                disabled={!searchQuery.trim()}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  searchQuery.trim()
                    ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <SearchIcon />
                Xで検索する
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                ※ ボタンを押下すると、新しいタブでX(Twitter)の検索結果画面が開きます
              </p>
            </div>
          </div>
          )}
        </div>

        {/* フッター */}
        <footer className="text-center pt-16 mt-16 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-gray-500 text-sm font-light tracking-wide">
            © 2025 {APP_TITLE}. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2 italic">
            Built with React + Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HashtagSearch;
