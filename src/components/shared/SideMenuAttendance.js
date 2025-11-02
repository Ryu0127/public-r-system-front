import React from 'react';

const sideMenus = [
  { label: '案件一覧', href: '/attendance/work-projects' },
  { label: '勤怠一覧', href: '/attendance/monthly-attendance' },
];

const SideMenuAttendance = () => {
  return (
    <div className="menu">
      <ul className="c-sidebar-nav">
        {sideMenus.map((sideMenu, index) => (
          <li key={index} className="c-sidebar-nav-item">
            <a className="c-sidebar-nav-link align-bottom justify-between" href={sideMenu.href}>
              <label className="font-bold text-gray-700">{sideMenu.label}</label>
              <span className="material-symbols-outlined">navigate_next</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenuAttendance;