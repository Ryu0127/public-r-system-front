import React from 'react';

interface Item {
  label: string;
  href: string;
}

interface Props {
  items: Item[];
}

const HeaderSideMenu: React.FC<Props> = ({ items=[] }) => {
  return (
    <div className="menu">
      <ul className="c-sidebar-nav">
        {items.map((item, index) => (
          <li key={index} className="c-sidebar-nav-item">
            <a className="c-sidebar-nav-link align-bottom justify-between" href={item.href}>
              <label className="font-bold text-gray-700">{item.label}</label>
              <span className="material-symbols-outlined">navigate_next</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderSideMenu;