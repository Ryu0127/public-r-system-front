import React, { useCallback } from 'react';
import LayoutBaseTs from 'components/layouts/LayoutBaseTs';
import HeaderSideMenu from 'components/molecules/headers/HeaderSideMenu';
import { MealMenuSuggesterState, MealMenuSuggesterActions, MealTime } from '../types';
import { mealTimeConfigs } from '../data/menuData';
import MealSection from '../components/MealSection';
import DaySelector from '../components/DaySelector';

const sideMenuItems = [
  { label: '日次スケジュール', href: '/life/life-schedule-day' },
  { label: '月次スケジュール', href: '/life/life-schedule-month' },
  { label: '献立メニュー', href: '/life/meal-menu' },
];

interface MealMenuSuggesterPresenterProps {
  state: MealMenuSuggesterState;
  actions: MealMenuSuggesterActions;
}

const MealMenuSuggesterPresenter: React.FC<MealMenuSuggesterPresenterProps> = ({
  state,
  actions,
}) => {
  const selectedDay = state.data.weekMenus[state.config.selectedDayIndex];

  const handleShuffleItem = useCallback(
    (mealTime: MealTime, itemIndex: number) => {
      actions.shuffleMealItem(state.config.selectedDayIndex, mealTime, itemIndex);
    },
    [actions, state.config.selectedDayIndex]
  );

  const handleShuffleSection = useCallback(
    (mealTime: MealTime) => {
      actions.shuffleSection(state.config.selectedDayIndex, mealTime);
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
      baseBackgroundColorCss="bg-stone-100"
      headerContent={
        <span
          className="text-stone-700 text-sm tracking-wider"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Menu della Settimana
        </span>
      }
    >
      <div className="min-h-screen bg-stone-100">
        <div className="max-w-xl mx-auto px-3 py-4 md:py-8">

          {/* Page title */}
          <div className="text-center mb-5">
            <h1
              className="text-2xl md:text-3xl text-stone-800 tracking-wider"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              Menu della Settimana
            </h1>
            <p className="text-xs text-stone-400 tracking-[0.15em] mt-1">
              一週間の献立
            </p>
          </div>

          {/* Day selector */}
          <div className="mb-5">
            <DaySelector
              weekMenus={state.data.weekMenus}
              selectedDayIndex={state.config.selectedDayIndex}
              onSelectDay={actions.configControl.selectDay}
            />
          </div>

          {/* Selected date display */}
          {selectedDay && (
            <div className="text-center mb-4">
              <p
                className="text-sm text-stone-500 tracking-wider"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
              >
                {selectedDay.date.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </p>
            </div>
          )}

          {/* Meal sections */}
          {selectedDay && (
            <div className="space-y-4 animate-scale-in">
              {mealTimeConfigs.map((config) => (
                <MealSection
                  key={config.key}
                  config={config}
                  items={selectedDay[config.key]}
                  isShuffling={
                    state.config.isShuffling === config.key ||
                    state.config.isShuffling === 'all'
                  }
                  onShuffleItem={handleShuffleItem}
                  onShuffleSection={handleShuffleSection}
                />
              ))}
            </div>
          )}

          {/* Bottom action buttons */}
          <div className="flex flex-col items-center gap-3 mt-6 mb-8">
            <button
              onClick={handleShuffleDay}
              className="px-8 py-2.5 bg-white text-stone-700 text-xs tracking-[0.2em] uppercase border border-stone-300 hover:bg-stone-50 hover:border-stone-400 transition-all duration-200"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            >
              <span className="material-symbols-outlined text-sm mr-1.5 align-middle">refresh</span>
              Shuffle Today
            </button>
            <button
              onClick={actions.shuffleAll}
              className="px-6 py-2 text-[11px] text-stone-400 tracking-[0.15em] uppercase hover:text-stone-600 transition-all duration-200"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Shuffle Entire Week
            </button>
          </div>

        </div>
      </div>
    </LayoutBaseTs>
  );
};

export default MealMenuSuggesterPresenter;
