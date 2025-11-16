import React from 'react';
import { HomeChangeLog } from 'hooks/api/home/useHomeChangeLogsGetApi';

// 日付フォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

interface ChangeLogsSectionProps {
  changeLogs: HomeChangeLog[];
}

const ChangeLogsSection: React.FC<ChangeLogsSectionProps> = ({ changeLogs }) => {
  return (
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
  );
};

export default ChangeLogsSection;
