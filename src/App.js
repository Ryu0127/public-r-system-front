import { useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { initGA, logPageView } from './utils/analytics';
import Profile from './components/Profile';
import Settings from './components/Settings';
import OshiKatsuSaportContainer from 'features/home/oshi-katsu-saport/containers/OshiKatsuSaportContainer';
import HashtagSearchContainer from 'features/oshi-katsu-saport/hashtag-search/containers/HashtagSearchContainer';
import EgoSearchContainer from 'features/oshi-katsu-saport/ego-search/containers/EgoSearchContainer';
import LifeScheduleDayContainer from 'features/life/life-schedule-day/containers/LifeScheduleDayContainer';
import LifeScheduleMonthContainer from 'features/life/life-schedule-month/containers/LifeScheduleMonthContainer';
import EventsCalendarContainer from 'features/events/events-calendar/containers/EventsCalendarContainer';
import EventAdminContainer from 'features/admin/events/containers/EventAdminContainer';
import EventFormContainer from 'features/admin/event-edit/containers/EventFormContainer';
import TalentAdminContainer from 'features/admin/talents/containers/TalentAdminContainer';
import TalentFormContainer from 'features/admin/talent-edit/containers/TalentFormContainer';
import MusicAdminContainer from 'features/admin/talent-music/containers/MusicAdminContainer';
import MusicFormContainer from 'features/admin/talent-music-edit/containers/MusicFormContainer';
import AdminDashboardContainer from 'features/admin/dashboard/containers/AdminDashboardContainer';
import AdminProtectedLayout from 'features/admin/layout/AdminProtectedLayout';
import LoginContainer from 'features/auth/login/containers/LoginContainer';
import TalentMusicContainer from 'features/talent-music/containers/TalentMusicContainer';
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
        <Route path="/ego-search-support" element={<EgoSearchContainer />} />
        {/* 楽曲一覧 */}
        <Route path="/music" element={<TalentMusicContainer />} />
        {/* 旧URLから新URLへリダイレクト */}
        <Route path="/talent-music" element={<Navigate to="/music" replace />} />
        {/* 生活管理システム */}
        <Route path="/life/life-schedule-day" element={<LifeScheduleDayContainer />} />
        <Route path="/life/life-schedule-month" element={<LifeScheduleMonthContainer />} />
        {/* イベントカレンダー */}
        <Route path="/events/calendar" element={<EventsCalendarContainer />} />
        {/* 管理画面（一律認証） */}
        <Route path="/admin" element={<AdminProtectedLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardContainer />} />
          {/* イベント管理 */}
          <Route path="events" element={<EventAdminContainer />} />
          <Route path="events/new" element={<EventFormContainer />} />
          <Route path="events/:id/edit" element={<EventFormContainer />} />
          {/* タレント管理 */}
          <Route path="talents" element={<TalentAdminContainer />} />
          <Route path="talents/new" element={<TalentFormContainer />} />
          <Route path="talents/:id/edit" element={<TalentFormContainer />} />
          {/* 楽曲管理 */}
          <Route path="talent-music" element={<MusicAdminContainer />} />
          <Route path="talent-music/new" element={<MusicFormContainer />} />
          <Route path="talent-music/:id/edit" element={<MusicFormContainer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;