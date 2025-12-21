import React from 'react';
import { HomeFeature } from 'hooks/api/home/useHomeFeaturesGetApi';

// アイコンコンポーネント
const HashIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

const CalendarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// アイコンマッピング
const iconComponents: { [key: string]: React.FC } = {
  Hash: HashIcon,
  Search: SearchIcon,
  TrendingUp: TrendingUpIcon,
  BarChart3: BarChart3Icon,
  Calendar: CalendarIcon,
};

// カラーマッピング
const colorClasses: { [key: string]: { gradient: string; shadow: string; hover: string } } = {
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
  purple: {
    gradient: 'from-purple-400 to-purple-600',
    shadow: 'shadow-purple-500/30',
    hover: 'hover:border-purple-300',
  },
};

interface FeaturesSectionProps {
  features: HomeFeature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <section className="space-y-6 animate-fade-in" style={{ animationDelay: '0.15s', marginTop: '60px' }}>
      {/* セクションタイトル */}
      <div className="text-center space-y-4">
        <h2
          className="text-4xl md:text-5xl font-bold text-gray-800"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ✦Key Features
        </h2>
        <span className="text-gray-600 text-lg font-light">主な機能</span>
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
  );
};

export default FeaturesSection;
