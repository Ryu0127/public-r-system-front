import React from 'react';
import { DashboardState, DashboardActions } from '../hooks/useDashboardState';
import WeatherWidget from '../components/WeatherWidget';
import ScheduleWidget from '../components/ScheduleWidget';
import SwitchBotWidget from '../components/SwitchBotWidget';
import Loading from 'components/Loading';
import LayoutBaseTs from 'components/layouts/LayoutBaseTs';
import HeaderSideMenu from 'components/molecules/headers/HeaderSideMenu';

export interface PresenterProps {
  state: DashboardState;
  actions: DashboardActions;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
}

const DashboardPresenter: React.FC<PresenterProps> = ({
  state,
  actions,
  sidebarVisible,
  onToggleSidebar,
  onCloseSidebar,
}) => {
  return (
    <LayoutBaseTs
      sidebarContent={<HeaderSideMenu items={[]} />}
      sidebarVisible={sidebarVisible}
      onToggle={onToggleSidebar}
      onClose={onCloseSidebar}
    >
      <>
        {state.config.isLoading ? (
          <Loading />
        ) : (
          <div className="min-h-screen bg-gray-100">
            {/* ヘッダー */}
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-2xl font-bold text-gray-800">ホームダッシュボード</h1>
                <p className="text-sm text-gray-600 mt-1">
                  今日の天気、予定、デバイスの状態を一目で確認
                </p>
              </div>
            </div>

            {/* メインコンテンツ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="space-y-6">
                {/* 天気エリア */}
                <WeatherWidget
                  currentWeather={state.data.currentWeather}
                  hourlyWeather={state.data.hourlyWeather}
                />

                {/* SwitchBotエリア */}
                <SwitchBotWidget
                  devices={state.data.devices}
                  onToggleDevice={actions.toggleDevice}
                  onChangeAirconMode={actions.changeAirconMode}
                  onChangeAirconTemp={actions.changeAirconTemp}
                />

                {/* スケジュールエリア */}
                <ScheduleWidget schedules={state.data.schedules} />
              </div>
            </div>
          </div>
        )}
      </>
    </LayoutBaseTs>
  );
};

export default DashboardPresenter;
