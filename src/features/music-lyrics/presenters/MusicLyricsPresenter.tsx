import React from 'react';
import { Link } from 'react-router-dom';
import { MusicLyricsActions, MusicLyricsState } from '../hooks/useMusicLyricsState';
import { MusicLyricsHeader } from '../components/MusicLyricsHeader';
import { LyricsDisplayControls } from '../components/LyricsDisplayControls';
import { LyricsView } from '../components/LyricsView';
import { YoutubeEmbedPanel } from '../components/YoutubeEmbedPanel';
import { LyricsStatusMessage } from '../components/LyricsStatusMessage';
import { ScrollToTopButton } from 'features/talent-music/components/ScrollToTopButton';
import Spinner from 'components/atoms/Spinner';
import DecorativeBackground from 'components/molecules/DecorativeBackground';
import { isValidYoutubeVideoId } from 'features/talent-music/utils/youtubeVideoId';

interface MusicLyricsPresenterProps {
  state: MusicLyricsState;
  actions: MusicLyricsActions;
  onRetry?: () => void;
}

const formatDate = (dateStr: string): string | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const MusicLyricsPresenter: React.FC<MusicLyricsPresenterProps> = ({ state, actions, onRetry }) => {
  const { config, data, ui } = state;
  const { music, lyrics } = data;
  const hasVideo = !!music && isValidYoutubeVideoId(music.youtubeVideoId);
  const releaseDateLabel = music ? formatDate(music.releaseDate) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative pb-16">
      <DecorativeBackground topBorderClass="border-red-200" bottomBorderClass="border-pink-200" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        <MusicLyricsHeader onBackToHome={() => { window.location.href = '/'; }} />

        <div className="mb-6">
          <Link
            to="/music"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            楽曲一覧に戻る
          </Link>
        </div>

        {config.isLoading && (
          <div className="flex justify-center items-center py-16">
            <Spinner sizeClass="h-10 w-10" borderClass="border-4 border-red-400 border-t-transparent" />
          </div>
        )}

        {!config.isLoading && config.errorKind === 'notFound' && (
          <LyricsStatusMessage
            title="楽曲が見つかりませんでした"
            description="URLが正しいか確認してください"
          />
        )}

        {!config.isLoading && config.errorKind && config.errorKind !== 'notFound' && (
          <LyricsStatusMessage
            title="歌詞・コール情報を取得できませんでした"
            description="時間をおいて再度お試しください"
            onRetry={onRetry}
          />
        )}

        {!config.isLoading && !config.errorKind && music && (
          <div className="animate-fade-in">
            {/* 楽曲情報 */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    music.type === 'cover' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {music.type === 'cover' ? 'カバー曲' : 'オリジナル曲'}
                </span>
                {releaseDateLabel && <span className="text-xs text-gray-400">{releaseDateLabel}</span>}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 break-words">{music.title}</h2>
            </div>

            {config.isDemo && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                デモ表示中です。表示されている歌詞・コールはサンプルデータです。
              </div>
            )}

            <div className={hasVideo ? 'lg:grid lg:grid-cols-5 lg:gap-8' : ''}>
              {/* 動画（PC では歌詞の横に固定表示） */}
              {hasVideo && (
                <div className="lg:col-span-2 mb-6 lg:mb-0">
                  <div className="lg:sticky lg:top-6">
                    <YoutubeEmbedPanel
                      videoId={music.youtubeVideoId}
                      title={music.title}
                      isVisible={ui.isVideoVisible}
                      onToggleVisible={actions.toggleVideoVisible}
                    />
                  </div>
                </div>
              )}

              {/* 歌詞・コール */}
              <div className={hasVideo ? 'lg:col-span-3' : 'max-w-3xl mx-auto'}>
                {lyrics ? (
                  <>
                    <LyricsDisplayControls
                      mode={ui.mode}
                      fontSize={ui.fontSize}
                      onModeChange={actions.setMode}
                      onFontSizeChange={actions.setFontSize}
                    />

                    {lyrics.note && (
                      <div className="mb-4 px-4 py-3 rounded-xl bg-pink-50 border border-pink-100 text-sm text-pink-800 whitespace-pre-wrap">
                        {lyrics.note}
                      </div>
                    )}

                    <LyricsView sections={lyrics.sections} mode={ui.mode} fontSize={ui.fontSize} />

                    {lyrics.updatedAt && formatDate(lyrics.updatedAt) && (
                      <p className="mt-3 text-right text-xs text-gray-400">
                        最終更新: {formatDate(lyrics.updatedAt)}
                      </p>
                    )}
                  </>
                ) : (
                  <LyricsStatusMessage
                    title="歌詞・コール情報はまだ登録されていません"
                    description="登録されるまでしばらくお待ちください"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default MusicLyricsPresenter;
