import React, { useState, ReactNode } from 'react';
import Sidebar from 'components/shared/Sidebar';
import Overlay from 'components/Overlay';
import HeaderCoreUi from 'components/molecules/headers/HeaderCoreUi';

interface LayoutBaseProps {
  children: ReactNode;
  headerContent?: ReactNode;
  sidebarContent?: ReactNode;
  footerContent?: ReactNode;
  sidebarVisible?: boolean;
  toggleSidebarActionCss?: string;
  closeSidebarActionCss?: string;
  baseBackgroundColorCss?: string;
  onToggle?: () => void;
  onClose?: () => void;
}

const LayoutBaseTs: React.FC<LayoutBaseProps> = ({
  children,
  headerContent,
  sidebarContent,
  footerContent,
  sidebarVisible,
  toggleSidebarActionCss,
  closeSidebarActionCss,
  baseBackgroundColorCss = 'bg-light',
  onToggle,
  onClose
}) => {
  return (
    <div>
      <Sidebar visible={sidebarVisible} content={sidebarContent} />
      <Overlay visible={sidebarVisible} addCss={closeSidebarActionCss} onClick={onClose} />
      <div id="template" className={`wrapper d-flex flex-column min-vh-100 ${baseBackgroundColorCss}`}>
        <HeaderCoreUi headerContent={headerContent} addCss={toggleSidebarActionCss} onClick={onToggle} />
        <div className="c-body">
          <main className="c-main pb-20">
            {children}
          </main>
        </div>
        {footerContent}
      </div>
    </div>
  );
}

export default LayoutBaseTs;