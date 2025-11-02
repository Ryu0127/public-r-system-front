import React, { useState } from 'react';
import Sidebar from 'components/shared/Sidebar';
import Overlay from 'components/Overlay';
import HeaderCoreUi from 'components/molecules/headers/HeaderCoreUi';

const LayoutBase = ({ children, hearderContent, sidebarContent, fotterContent }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <div>
      <Sidebar visible={sidebarVisible} content={sidebarContent} />
      <Overlay visible={sidebarVisible} onClick={closeSidebar} />
      <div id="template" className="wrapper d-flex flex-column min-vh-100 bg-light">
        <HeaderCoreUi hearderContent={hearderContent} onClick={toggleSidebar} />
        <div className="c-body">
          <main className="c-main pb-20">
            {children}
          </main>
        </div>
        {fotterContent}
      </div>
    </div>
  );
}

export default LayoutBase;