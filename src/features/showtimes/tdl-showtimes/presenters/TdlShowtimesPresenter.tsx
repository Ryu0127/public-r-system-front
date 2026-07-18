import React from 'react';
import ShowLegend from '../components/ShowLegend';
import ShowTimeline from '../components/ShowTimeline';
import CrowdPanel from '../components/CrowdPanel';
import FoodPanel from '../components/FoodPanel';
import { TdlShowtimesActions, TdlShowtimesState } from '../hooks/showtimesUtils';
import '../styles/tdlShowtimes.css';

interface TdlShowtimesPresenterProps {
  state: TdlShowtimesState;
  actions: TdlShowtimesActions;
}

/**
 * TDL ショー&パレード Presenter
 */
const TdlShowtimesPresenter: React.FC<TdlShowtimesPresenterProps> = ({
  state,
  actions,
}) => {
  const { config, data } = state;
  const showtimes = data.showtimes;

  if (config.isLoading) {
    return (
      <div className="tdl-showtimes">
        <div className="wrap">
          <div className="status-box">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (config.error || !showtimes) {
    return (
      <div className="tdl-showtimes">
        <div className="wrap">
          <div className="status-box">{config.error ?? 'データがありません'}</div>
        </div>
      </div>
    );
  }

  const { park } = showtimes;
  const [year, month, day] = park.date.split('-');
  const dateLabel = `${year}.${Number(month)}.${Number(day)}`;

  return (
    <div className="tdl-showtimes">
      <div className="wrap">
        <header>
          <div className="date-eyebrow">Tokyo Disneyland · Show &amp; Parade</div>
          <h1>
            {dateLabel}
            <span className="dow">（{park.dayOfWeek}）</span>
            <br />
            ショーパレ <span className="accent">タイムライン</span>
          </h1>
          <div className="park-meta">
            <span>
              パーク運営時間{' '}
              <strong>
                {park.openTime} – {park.closeTime}
              </strong>
            </span>
            <span>全公演を開始時刻順に掲載</span>
          </div>
          {park.seasonTag && <span className="season-tag">{park.seasonTag}</span>}
        </header>

        <nav className="tab-nav" role="tablist">
          <button
            type="button"
            className={`tab-btn${config.activeTab === 'shows' ? ' active' : ''}`}
            role="tab"
            aria-selected={config.activeTab === 'shows'}
            onClick={() => actions.setActiveTab('shows')}
          >
            ショー&パレード
          </button>
          <button
            type="button"
            className={`tab-btn${config.activeTab === 'crowd' ? ' active' : ''}`}
            role="tab"
            aria-selected={config.activeTab === 'crowd'}
            onClick={() => actions.setActiveTab('crowd')}
          >
            アトラクション混雑
          </button>
          <button
            type="button"
            className={`tab-btn${config.activeTab === 'food' ? ' active' : ''}`}
            role="tab"
            aria-selected={config.activeTab === 'food'}
            onClick={() => actions.setActiveTab('food')}
          >
            フードメニュー
          </button>
        </nav>

        {config.activeTab === 'shows' && (
          <div>
            <ShowLegend
              shows={showtimes.shows}
              enabledShows={config.enabledShows}
              onToggle={actions.toggleShow}
              officialUrl={park.officialShowUrl}
            />
            <ShowTimeline
              timeline={showtimes.timeline}
              shows={showtimes.shows}
              enabledShows={config.enabledShows}
              excludedPrograms={showtimes.excludedPrograms}
              stoppedPrograms={showtimes.stoppedPrograms}
            />
          </div>
        )}

        {config.activeTab === 'crowd' && (
          <CrowdPanel
            crowd={showtimes.crowd}
            crowdSourceUrl={park.crowdSourceUrl}
            slotIndex={config.crowdSlotIndex}
            areaFilter={config.crowdAreaFilter}
            rankFilter={config.crowdRankFilter}
            onSlotChange={actions.setCrowdSlotIndex}
            onAreaFilterChange={actions.setCrowdAreaFilter}
            onRankFilterChange={actions.setCrowdRankFilter}
          />
        )}

        {config.activeTab === 'food' && showtimes.food && (
          <FoodPanel
            food={showtimes.food}
            categoryFilter={config.foodCategoryFilter}
            onCategoryFilterChange={actions.setFoodCategoryFilter}
          />
        )}

        <footer className="page-footer">
          出典：東京ディズニーリゾート公式サイト（
          <a href={park.officialShowUrl} target="_blank" rel="noopener noreferrer">
            パレード/ショー一覧
          </a>
          ・各ショーの月間スケジュール、2026年7月時点）。
          <br />
          アトラクション混雑の目安は一般的な傾向をまとめたものです。アトラクション別・時間帯別の詳細な過去データ分析は
          <a href={park.crowdSourceUrl} target="_blank" rel="noopener noreferrer">
            urtrip「ディズニーランド 人気アトラクション攻略用 過去データ分析」
          </a>
          （毎日更新）をご参照ください。
          <br />
          公演時間は予告なく変更・中止になる場合があります。当日は東京ディズニーリゾート・アプリで最新情報をご確認ください。
        </footer>
      </div>
    </div>
  );
};

export default TdlShowtimesPresenter;
