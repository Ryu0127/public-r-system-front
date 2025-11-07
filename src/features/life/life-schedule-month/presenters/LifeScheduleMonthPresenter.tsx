import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LifeScheduleMonthState, LifeScheduleMonthActions } from '../hooks/useLifeScheduleMonthState';
import LifeScheduleMonthHeader from '../components/LifeScheduleMonthHeader';
import LifeScheduleMonthCalendar from '../components/LifeScheduleMonthCalendar';
import Loading from 'components/Loading';
import LayoutBaseTs from 'components/layouts/LayoutBaseTs';
import HeaderSideMenu from 'components/molecules/headers/HeaderSideMenu';

export interface PresenterProps {
  state: LifeScheduleMonthState;
  actions: LifeScheduleMonthActions;
}

/**
 * 月次スケジュールPresenter
 */
const LifeScheduleMonthPresenter: React.FC<PresenterProps> = ({ state, actions }) => {
  const navigate = useNavigate();

  // 日付クリック時の処理（日次スケジュール画面へ遷移）
  const handleDateClick = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const usageYmd = `${year}-${month}-${day}`;
      navigate(`/life/life-schedule-day?usageYmd=${usageYmd}`);
    },
    [navigate]
  );

  return (
    <LayoutBaseTs
      sidebarContent={<HeaderSideMenu items={[]} />}
      sidebarVisible={state.config.sidebarVisible}
      onToggle={actions.configControl.sidebarVisible.toggle}
      onClose={actions.configControl.sidebarVisible.close}
    >
      <>
        {state.config.isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col bg-gray-100 min-h-screen">
            {/* ヘッダー */}
            <LifeScheduleMonthHeader
              currentMonth={state.requestParams.currentMonth}
              onPrevMonth={() => actions.changeMonth(-1)}
              onNextMonth={() => actions.changeMonth(1)}
              onToday={actions.goToToday}
            />

            {/* カレンダー */}
            <div className="flex-1 p-4">
              <LifeScheduleMonthCalendar
                currentMonth={state.requestParams.currentMonth}
                monthlyTasks={state.data.monthlyTasks}
                onDateClick={handleDateClick}
              />
            </div>
          </div>
        )}
      </>
    </LayoutBaseTs>
  );
};

export default LifeScheduleMonthPresenter;
