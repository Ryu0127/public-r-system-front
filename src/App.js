import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItalianHome from './components/ItalianHome';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import LifeScheduleDayContainer from 'features/life/life-schedule-day/containers/LifeScheduleDayContainer';
import LifeScheduleMonthContainer from 'features/life/life-schedule-month/containers/LifeScheduleMonthContainer';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ItalianHome />} />
        <Route path="/old-home" element={<Home title="Home Page" message="Welcome to the home page!" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        {/* 生活管理システム */}
        <Route path="/life/life-schedule-day" element={<LifeScheduleDayContainer />} />
        <Route path="/life/life-schedule-month" element={<LifeScheduleMonthContainer />} />
      </Routes>
    </Router>
  );
}

export default App;