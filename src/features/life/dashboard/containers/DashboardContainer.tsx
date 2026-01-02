import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'hooks/auth/useAuth';
import { DashboardState, useDashboardState } from '../hooks/useDashboardState';
import DashboardPresenter from '../presenters/DashboardPresenter';

const initialState: DashboardState = {
  config: {
    isLoading: true,
  },
  data: {
    currentWeather: {
      temperature: 0,
      weatherIcon: '',
      weatherText: '',
      humidity: 0,
      windSpeed: 0,
      location: '',
    },
    weeklyWeather: [],
    schedules: [],
    devices: [],
  },
};

const DashboardContainer: React.FC = () => {
  const { isAuthenticated, isChecking } = useAuth();
  const [state, setState] = useState<DashboardState>(initialState);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { actions } = useDashboardState(state, setState);

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  if (isChecking || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>ホームダッシュボード | ホロリスの推し活サポート</title>
        <meta
          name="description"
          content="自宅周辺の天気、予定、デバイスの状態を一目で確認できるダッシュボード"
        />
        <meta property="og:title" content="ホームダッシュボード | ホロリスの推し活サポート" />
        <meta
          property="og:description"
          content="自宅周辺の天気、予定、デバイスの状態を一目で確認できるダッシュボード"
        />
        <meta property="og:url" content="https://public-r-system-front.vercel.app/life/dashboard" />
        <link rel="canonical" href="https://public-r-system-front.vercel.app/life/dashboard" />
      </Helmet>
      <DashboardPresenter
        state={state}
        actions={actions}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={handleToggleSidebar}
        onCloseSidebar={handleCloseSidebar}
      />
    </>
  );
};

export default DashboardContainer;
