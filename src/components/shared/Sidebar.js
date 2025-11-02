import React from 'react';
import {
  CSidebar,
  CSidebarNav,
} from '@coreui/react';

const Sidebar = ({ visible, content }) => {
  return (
    <CSidebar
      unfoldable
      visible={visible}
      className="bg-white"
      style={{ top: '65px', width: '250px', height: '100%', zIndex: 1000}}
    >
      <CSidebarNav>
        {content}
      </CSidebarNav>
    </CSidebar>
  );
};

export default Sidebar;