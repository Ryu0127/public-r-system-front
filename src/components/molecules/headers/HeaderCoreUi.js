import { CHeader } from '@coreui/react';

const HeaderCoreUi = ({ headerContent, addCss="", onClick }) => {
  return (
    <CHeader className="d-flex c-header" style={{ position: 'sticky', top: '0', zIndex: '1000', padding: '0px 50px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span className={`material-symbols-outlined js-menu ${addCss}`} style={{ fontSize: '30px' }} onClick={onClick}>menu</span>
        </div>
        {headerContent}
        {/* <div>
          <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>person</span>
        </div> */}
    </CHeader>
  );
};

export default HeaderCoreUi;