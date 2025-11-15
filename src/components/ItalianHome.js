import { useState } from 'react';
import LoadingScreen from './LoadingScreen';
import LimitedTimeTopicModal from './LimitedTimeTopicModal';

const APP_TITLE = '推し活サポート';

// 機能データ
const features = [
  {
    id: 'talent-hashtag',
    title: 'タレント別ハッシュタグ投稿/検索',
    description: '各タレントごとの応援ハッシュタグを投稿/検索ができます',
    icon: 'Hash',
    link: '/talent-hashtag',
    color: 'amber',
  },
  // {
  //   id: 'trending-tags',
  //   title: 'Trending Tag Analysis',
  //   description: 'Analyze and visualize popular hashtags in real-time',
  //   icon: 'TrendingUp',
  //   link: '/trending-tags',
  //   color: 'sky',
  // },
  // {
  //   id: 'tag-analytics',
  //   title: 'Tag Performance',
  //   description: 'Detailed analysis of engagement for posted hashtags',
  //   icon: 'BarChart3',
  //   link: '/tag-analytics',
  //   color: 'emerald',
  // },
];

// 更新履歴データ
const changeLogs = [
  {
    id: '1',
    version: 'v2.5.0',
    date: '2025-11-15',
    changes: [
      'Added AI-powered smart tag suggestions',
      'Improved real-time trend analysis performance',
      'Enhanced mobile responsive design',
    ],
  },
  {
    id: '2',
    version: 'v2.4.0',
    date: '2025-10-28',
    changes: [
      'Added hashtag analytics dashboard',
      'Implemented tag history tracking',
      'Fixed minor UI bugs',
    ],
  },
  {
    id: '3',
    version: 'v2.3.0',
    date: '2025-10-15',
    changes: [
      'Improved search performance',
      'Added export functionality for tag data',
      'Updated UI with Italian-inspired design',
    ],
  },
  {
    id: '4',
    version: 'v2.2.0',
    date: '2025-09-30',
    changes: [
      'Added multi-language support',
      'Enhanced tag recommendation algorithm',
      'Improved accessibility features',
    ],
  },
  {
    id: '5',
    version: 'v2.1.0',
    date: '2025-09-15',
    changes: [
      'Initial release of trending analysis',
      'Added user preference settings',
      'Performance optimizations',
    ],
  },
];

// 期間限定トピック
const limitedTimeTopic = {
  id: 'campaign-2025-winter',
  title: "ときのそら　New Year's Party 2026「Dreams in Motion」",
  content:
    "ときのそら　がおくる新年最初のライブイベント",
  startDate: '2025-11-15',
  endDate: '2025-12-31',
};

// アイコンコンポーネント
const HashIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const BarChart3Icon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// アイコンマッピング
const iconComponents = {
  Hash: HashIcon,
  TrendingUp: TrendingUpIcon,
  BarChart3: BarChart3Icon,
};

// 日付フォーマット
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// カラーマッピング
const colorClasses = {
  amber: {
    gradient: 'from-amber-400 to-amber-600',
    shadow: 'shadow-amber-500/30',
    hover: 'hover:border-amber-300',
  },
  sky: {
    gradient: 'from-sky-400 to-sky-600',
    shadow: 'shadow-sky-500/30',
    hover: 'hover:border-sky-300',
  },
  emerald: {
    gradient: 'from-emerald-400 to-emerald-600',
    shadow: 'shadow-emerald-500/30',
    hover: 'hover:border-emerald-300',
  },
};

const ItalianHome = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen duration={3000} onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-amber-200 rounded-full opacity-20 animate-spin-slow" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 border-4 border-sky-200 rounded-full opacity-20 animate-spin"
        style={{ animationDuration: '15s' }}
      />

      {/* 期間限定トピックモーダル */}
      <LimitedTimeTopicModal topic={limitedTimeTopic} />

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-32">
        {/* ヒーローセクション */}
        <section className="text-center space-y-8 animate-fade-in">
          {/* バッジ */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-lg">
              <span className="text-amber-600 text-2xl">✦</span>
              <span className="text-amber-700 text-sm font-medium uppercase tracking-wider">
                R-SYSTEM
              </span>
              <span className="text-sky-600 text-2xl">✦</span>
            </div>
          </div>

          {/* タイトル */}
          <h1
            className="text-5xl md:text-7xl font-bold text-gray-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {APP_TITLE}
          </h1>

          {/* サブタイトル */}
          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto">
            こちらのサイトは、推し活をサポートするファン作成サイトです。
          </p>

          {/* CTAボタン */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button className="bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500 hover:from-amber-600 hover:via-sky-600 hover:to-emerald-600 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-2xl shadow-sky-500/40 hover:shadow-3xl hover:shadow-sky-500/50 transition-all duration-500 hover:scale-110 border-2 border-white/30">
              <span className="mr-2">✦</span>
              Get Started
              <span className="ml-2">✦</span>
            </button>

            <button className="bg-white/60 backdrop-blur-sm border-2 border-gray-300 hover:bg-white/80 hover:border-amber-400 text-gray-700 font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Learn More
            </button>
          </div> */}

          {/* 装飾的な区切り線 */}
          <div className="flex items-center justify-center gap-3 opacity-40 pt-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400" />
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </div>
        </section>

        {/* 主な機能セクション */}
        <section className="space-y-12 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {/* セクションタイトル */}
          <div className="text-center space-y-4">
            <h2
              className="text-4xl md:text-5xl font-bold text-gray-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ✦Key Features
            </h2>
            <span className="text-gray-600 text-lg font-light">主な機能</span>
            {/* <p className="text-gray-600 text-lg font-light">
              Powerful tools to maximize your hashtag strategy
            </p> */}
          </div>

          {/* 機能カード */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = iconComponents[feature.icon];
              const colors = colorClasses[feature.color];

              return (
                <div
                  key={feature.id}
                  onClick={() => window.location.href = feature.link}
                  className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 ${colors.hover} hover:bg-white/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer`}
                >
                  {/* アイコン背景 */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg ${colors.shadow}`}
                  >
                    {IconComponent && <IconComponent />}
                  </div>

                  {/* タイトル */}
                  <h3
                    className="text-2xl font-bold text-gray-800 mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {feature.title}
                  </h3>

                  {/* 説明 */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 更新履歴セクション */}
        <section className="space-y-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {/* セクションタイトル */}
          <div className="text-center">
            <h2
              className="text-4xl md:text-5xl font-bold text-gray-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ✦Change history
            </h2>
            <span className="text-gray-600 text-lg font-light">変更履歴</span>
          </div>

          {/* 更新履歴カード */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl space-y-8">
            {changeLogs.map((log, index) => (
              <div
                key={log.id}
                className={`pb-8 ${
                  index < changeLogs.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                {/* バージョンと日付 */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-block px-4 py-1 bg-gradient-to-r from-amber-500 to-sky-500 text-white text-sm font-semibold rounded-full shadow-md">
                    {log.version}
                  </span>
                  <span className="text-gray-500 text-sm font-light">
                    {formatDate(log.date)}
                  </span>
                </div>

                {/* 変更内容 */}
                <ul className="space-y-2 ml-4">
                  {log.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-amber-500 mt-1">✦</span>
                      <span className="text-sm leading-relaxed">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 装飾的なアイコン列 */}
        <div className="flex justify-center gap-6 text-5xl opacity-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <span className="text-amber-500">✦</span>
          <span className="text-sky-500">◆</span>
          <span className="text-emerald-500">✧</span>
          <span className="text-amber-500">◆</span>
          <span className="text-sky-500">✦</span>
        </div>

        {/* フッター */}
        <footer className="text-center pt-10 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <p className="text-gray-500 text-sm font-light tracking-wide">
            © 2025 {APP_TITLE}. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2 italic">
            Built with React 19 + Tailwind CSS 4
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ItalianHome;
