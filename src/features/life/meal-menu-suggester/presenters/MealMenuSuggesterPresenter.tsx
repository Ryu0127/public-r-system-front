import React, { useCallback } from 'react';
import LayoutBaseTs from 'components/layouts/LayoutBaseTs';
import HeaderSideMenu from 'components/molecules/headers/HeaderSideMenu';
import { MealMenuSuggesterState, MealMenuSuggesterActions, MealTime } from '../types';
import { mealTimeConfigs } from '../data/menuData';
import MenuCard from '../components/MenuCard';
import DaySelector from '../components/DaySelector';
import OrnamentalDivider from '../components/OrnamentalDivider';

const sideMenuItems = [
  { label: '日次スケジュール', href: '/life/life-schedule-day' },
  { label: '月次スケジュール', href: '/life/life-schedule-month' },
  { label: '献立メニュー', href: '/life/meal-menu' },
];

interface MealMenuSuggesterPresenterProps {
  state: MealMenuSuggesterState;
  actions: MealMenuSuggesterActions;
}

const formatDateHeader = (date: Date): string => {
  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const MealMenuSuggesterPresenter: React.FC<MealMenuSuggesterPresenterProps> = ({
  state,
  actions,
}) => {
  const selectedDay = state.data.weekMenus[state.config.selectedDayIndex];

  const handleShuffle = useCallback(
    (mealTime: MealTime) => {
      actions.shuffleMeal(state.config.selectedDayIndex, mealTime);
    },
    [actions, state.config.selectedDayIndex]
  );

  const handleShuffleDay = useCallback(() => {
    actions.shuffleDay(state.config.selectedDayIndex);
  }, [actions, state.config.selectedDayIndex]);

  return (
    <LayoutBaseTs
      sidebarVisible={state.config.sidebarVisible}
      sidebarContent={<HeaderSideMenu items={sideMenuItems} />}
      onToggle={actions.configControl.sidebarVisible.toggle}
      onClose={actions.configControl.sidebarVisible.close}
      baseBackgroundColorCss="bg-amber-50/30"
      headerContent={
        <span
          className="text-amber-900/70 text-sm tracking-wider"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Menu della Settimana
        </span>
      }
    >
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #faf6ef 0%, #f5ede0 50%, #faf6ef 100%)' }}>
        <div className="max-w-lg mx-auto px-4 py-6 md:py-10">

          {/* ── Title Area ── */}
          <div className="text-center mb-6">
            {/* Top ornament */}
            <div className="mb-4 select-none">
              <span className="text-amber-800/25 text-xs tracking-[0.6em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                &#x2729; &nbsp; &#x2729; &nbsp; &#x2729;
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl text-amber-900/85 mb-2 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: '0.02em' }}
            >
              Menu della Settimana
            </h1>
            <p
              className="text-sm text-amber-800/45 tracking-[0.15em] italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              &#x2014; 一週間の献立 &#x2014;
            </p>

            <OrnamentalDivider variant="heavy" />
          </div>

          {/* ── Day Selector ── */}
          <div className="mb-6">
            <DaySelector
              weekMenus={state.data.weekMenus}
              selectedDayIndex={state.config.selectedDayIndex}
              onSelectDay={actions.configControl.selectDay}
            />
          </div>

          {/* ── Menu Paper ── */}
          {selectedDay && (
            <div
              className="relative animate-scale-in"
              style={{
                background: 'linear-gradient(135deg, #fefcf7 0%, #faf5eb 40%, #f7f0e3 100%)',
                boxShadow: '0 2px 20px rgba(120, 80, 30, 0.08), 0 1px 4px rgba(120, 80, 30, 0.05)',
                border: '1px solid rgba(180, 140, 80, 0.15)',
              }}
            >
              {/* Paper inner border (decorative) */}
              <div
                className="m-3 md:m-5 py-6 px-4 md:px-6"
                style={{
                  border: '1px solid rgba(180, 140, 80, 0.12)',
                  borderStyle: 'double',
                  borderWidth: '3px',
                }}
              >
                {/* Date header */}
                <div className="text-center mb-6">
                  <p
                    className="text-lg md:text-xl text-amber-900/70 tracking-wider"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontStyle: 'italic' }}
                  >
                    {formatDateHeader(selectedDay.date)}
                  </p>
                  <div className="mt-1">
                    <span className="text-xs text-amber-800/35 tracking-[0.3em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {selectedDay.date.toLocaleDateString('ja-JP', { weekday: 'long' })}
                    </span>
                  </div>
                </div>

                <OrnamentalDivider variant="light" />

                {/* Menu items for each meal time */}
                <div className="space-y-6 mt-4">
                  {mealTimeConfigs.map((config, index) => (
                    <React.Fragment key={config.key}>
                      <MenuCard
                        mealTimeConfig={config}
                        menuItem={selectedDay[config.key]}
                        isShuffling={
                          state.config.isShuffling === config.key ||
                          state.config.isShuffling === 'all'
                        }
                        onShuffle={handleShuffle}
                      />
                      {index < mealTimeConfigs.length - 1 && (
                        <OrnamentalDivider variant="heavy" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <OrnamentalDivider variant="heavy" />

                {/* Action buttons */}
                <div className="flex flex-col items-center gap-3 mt-4">
                  <button
                    onClick={handleShuffleDay}
                    className="px-6 py-2 text-sm tracking-[0.2em] text-amber-800/70 hover:text-amber-900 border border-amber-800/25 hover:border-amber-800/50 transition-all duration-200 hover:bg-amber-50/50 uppercase"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                  >
                    Rinnovare il Giorno
                  </button>
                  <button
                    onClick={actions.shuffleAll}
                    className="px-6 py-2 text-xs tracking-[0.15em] text-amber-800/40 hover:text-amber-800/70 transition-all duration-200 uppercase"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                  >
                    Rinnovare Tutta la Settimana
                  </button>
                </div>

                {/* Bottom ornament */}
                <div className="text-center mt-6 select-none">
                  <span className="text-amber-800/20 text-xs tracking-[0.6em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    &#x2729; &nbsp; &#x2729; &nbsp; &#x2729;
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Footer text ── */}
          <div className="text-center mt-8 mb-4">
            <p
              className="text-xs text-amber-800/30 italic tracking-wider"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              &ldquo; La buona cucina è la base della vera felicità &rdquo;
            </p>
            <p
              className="text-[10px] text-amber-800/20 mt-1 tracking-widest"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              &#x2014; Auguste Escoffier
            </p>
          </div>

        </div>
      </div>
    </LayoutBaseTs>
  );
};

export default MealMenuSuggesterPresenter;
