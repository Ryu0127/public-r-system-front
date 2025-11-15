import { useState, useRef, useEffect } from 'react';

const APP_TITLE = 'タレント別ハッシュタグ投稿/検索';

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

// ハッシュタグ種類に応じたアイコンを返す関数
const getHashtagIcon = (description) => {
  const iconClass = "w-4 h-4";

  if (description.includes('ファンアート') || description.includes('Art')) {
    // パレットアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    );
  } else if (description.includes('生放送')) {
    // ビデオカメラアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  } else if (description.includes('楽曲') || description.includes('音楽')) {
    // 音楽アイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    );
  } else if (description.includes('書籍') || description.includes('読んだ')) {
    // 本アイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  } else if (description.includes('ボイス') || description.includes('聞いた') || description.includes('聴いた')) {
    // マイクアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
  } else if (description.includes('ホロリー') || description.includes('撮った') || description.includes('ぬいぐるみ')) {
    // カメラアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  } else if (description.includes('MMD')) {
    // 3Dキューブアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    );
  } else if (description.includes('実況') || description.includes('動画')) {
    // 再生アイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (description.includes('スペース')) {
    // マイク/放送アイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
  } else if (description.includes('マインクラフト') || description.includes('クラフト')) {
    // キューブアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    );
  } else if (description.includes('ファンクラブ') || description.includes('FC')) {
    // スターアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    );
  } else if (description.includes('スケジュール')) {
    // カレンダーアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  } else if (description.includes('トーク') || description.includes('ファントーク')) {
    // チャットアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    );
  } else if (description.includes('切り抜き')) {
    // ハサミアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    );
  } else if (description.includes('素材') || description.includes('サムネ')) {
    // 画像アイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  } else if (description.includes('見る')) {
    // 目アイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );
  } else if (description.includes('公式') || description.includes('一般')) {
    // タグアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    );
  } else {
    // デフォルト: ハッシュタグアイコン
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    );
  }
};

const HashtagSearch = () => {
  // タレント選択の状態
  const [selectedTalent, setSelectedTalent] = useState('tokinosora');

  // モード切り替えの状態 ('post' または 'search')
  const [mode, setMode] = useState('post');

  // ハッシュタグ投稿機能の状態
  const [selectedTags, setSelectedTags] = useState([]);

  // タグ検索機能の状態
  const [searchQuery, setSearchQuery] = useState('');

  // コンボボックスの状態
  const [talentSearchQuery, setTalentSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const comboboxRef = useRef(null);

  // 使い方モーダルの状態
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // タレントリストを取得
  const talentList = Object.entries(talentHashtags).map(([key, value]) => ({
    key,
    name: value.name,
  }));

  // フィルタリングされたタレントリスト
  const filteredTalentList = talentList.filter((talent) =>
    talent.name.toLowerCase().includes(talentSearchQuery.toLowerCase())
  );

  // 選択中のタレントのハッシュタグデータを取得
  const currentTalent = talentHashtags[selectedTalent];
  const predefinedHashtags = currentTalent.hashtags;
  const quickSearchTags = predefinedHashtags.slice(0, 6);

  // タレント選択ハンドラ
  const handleTalentSelect = (talentKey) => {
    setSelectedTalent(talentKey);
    setSelectedTags([]);
    setTalentSearchQuery('');
    setIsDropdownOpen(false);
  };

  // 外側クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 relative">
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
          {/* ホームに戻るボタンと使い方ボタン */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
            >
              <HomeIcon />
              <span className="text-sm font-medium">ホームに戻る</span>
            </button>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">使い方</span>
            </button>
          </div>

          {/* タイトル */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {APP_TITLE}
            </h1>
          </div>

          {/* サブタイトル */}
          <p className="text-lg text-gray-600 font-light">
            ハッシュタグを選択して投稿、または検索のサポートができます
          </p>
        </header>

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

        {/* タレント選択コンボボックス */}
        <section className="max-w-2xl mx-auto mb-8 animate-fade-in overflow-visible relative z-[10000]" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg overflow-visible">
            <label htmlFor="talent-combobox" className="block text-sm font-semibold text-gray-700 mb-3">
              タレントを選択
            </label>
            <div className="relative" ref={comboboxRef}>
              <input
                id="talent-combobox"
                type="text"
                value={isDropdownOpen ? talentSearchQuery : currentTalent.name}
                onChange={(e) => {
                  setTalentSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="タレント名を入力して検索..."
                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 focus:border-[#1DA1F2] focus:outline-none rounded-xl text-gray-800 transition-all duration-200"
              />
              {/* 検索アイコン */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* ドロップダウンリスト */}
              {isDropdownOpen && filteredTalentList.length > 0 && (
                <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredTalentList.slice(0, 10).map((talent) => (
                    <div
                      key={talent.key}
                      onClick={() => handleTalentSelect(talent.key)}
                      className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                        talent.key === selectedTalent
                          ? 'bg-[#1DA1F2] text-white'
                          : 'hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      {talent.name}
                    </div>
                  ))}
                </div>
              )}

              {/* 結果が見つからない場合 */}
              {isDropdownOpen && talentSearchQuery && filteredTalentList.length === 0 && (
                <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 text-center text-gray-500">
                  該当するタレントが見つかりません
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              選択中: <span className="font-semibold text-[#1DA1F2]">{currentTalent.name}</span>
            </p>
          </div>
        </section>

        {/* メイン機能エリア */}
        <div className="max-w-2xl mx-auto">
          {/* ハッシュタグ選択・投稿機能 */}
          {mode === 'post' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.25s' }}>
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
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`flex-shrink-0 ${selectedTags.includes(hashtag.tag) ? 'text-white' : 'text-gray-500'}`}>
                        {getHashtagIcon(hashtag.description)}
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">#{hashtag.tag}</span>
                        <span className={`text-xs ${selectedTags.includes(hashtag.tag) ? 'text-blue-100' : 'text-gray-500'}`}>
                          {hashtag.description}
                        </span>
                      </div>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTags([])}
                    disabled={selectedTags.length === 0}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 border ${
                      selectedTags.length > 0
                        ? 'text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 border-gray-200 hover:border-red-300 cursor-pointer'
                        : 'text-gray-400 bg-gray-50 border-gray-100 cursor-not-allowed'
                    }`}
                  >
                    クリア
                  </button>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1DA1F2] text-white text-sm font-bold shadow-md">
                    {selectedTags.length}
                  </span>
                </div>
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
                <HashIcon />
                Xで投稿する
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                ※ ボタンを押下すると、新しいタブでXの投稿画面が開きます
              </p>
            </div>
          </div>
          )}

          {/* タグ検索機能 */}
          {mode === 'search' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.25s' }}>
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
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 text-gray-500 group-hover:text-white">
                        {getHashtagIcon(hashtag.description)}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-white">#{hashtag.tag}</span>
                        <span className="text-xs text-gray-500 group-hover:text-blue-100">
                          {hashtag.description}
                        </span>
                      </div>
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  検索プレビュー
                </h3>
                <button
                  onClick={() => setSearchQuery('')}
                  disabled={!searchQuery.trim()}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 border ${
                    searchQuery.trim()
                      ? 'text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 border-gray-200 hover:border-red-300 cursor-pointer'
                      : 'text-gray-400 bg-gray-50 border-gray-100 cursor-not-allowed'
                  }`}
                >
                  クリア
                </button>
              </div>
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
                ※ ボタンを押下すると、新しいタブでXの検索結果画面が開きます
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

      {/* 使い方モーダル */}
      {isHelpModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsHelpModalOpen(false)}
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
                onClick={() => setIsHelpModalOpen(false)}
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
      )}
    </div>
  );
};

export default HashtagSearch;
