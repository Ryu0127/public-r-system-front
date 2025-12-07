import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { initGA, logPageView } from './utils/analytics';
import Profile from './components/Profile';
import Settings from './components/Settings';
import OshiKatsuSaportContainer from 'features/home/oshi-katsu-saport/containers/OshiKatsuSaportContainer';
import HashtagSearchContainer from 'features/oshi-katsu-saport/hashtag-search/containers/HashtagSearchContainer';
import { CollabSearchContainer } from 'features/oshi-katsu-saport/collab-search/containers/CollabSearchContainer';
import LifeScheduleDayContainer from 'features/life/life-schedule-day/containers/LifeScheduleDayContainer';
import LifeScheduleMonthContainer from 'features/life/life-schedule-month/containers/LifeScheduleMonthContainer';
import EventsCalendarContainer from 'features/events/events-calendar/containers/EventsCalendarContainer';
import LoginContainer from 'features/auth/login/containers/LoginContainer';
import './App.css';

// ページ遷移を追跡するコンポーネント
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    // Googleアナリティクスの初期化
    initGA();
  }, []);

  return (
    <Router>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<OshiKatsuSaportContainer />} />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/talent-hashtag-support" element={<HashtagSearchContainer />} />
        <Route path="/talent-collab-search" element={<CollabSearchContainer />} />
        {/* 生活管理システム */}
        <Route path="/life/life-schedule-day" element={<LifeScheduleDayContainer />} />
        <Route path="/life/life-schedule-month" element={<LifeScheduleMonthContainer />} />
        {/* イベントカレンダー */}
        <Route path="/events/calendar" element={<EventsCalendarContainer />} />
      </Routes>
    </Router>
  );
}

export default App;