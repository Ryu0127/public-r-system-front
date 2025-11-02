import React from 'react';

const sideMenus = [
  { label: 'youtube動画一覧', href: '/contents/youtube/live' },
  { label: '同人一覧', href: '/contents/doujins' },
  { label: '画像一覧リサイズ', href: '/contents/imgs/resize' },
  { label: '動画一覧', href: '/contents/videos' },
];

const SideMenuContents = () => {
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

export default SideMenuContents;