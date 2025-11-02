import React from 'react';
import ButtonCyan from 'components/atoms/buttons/ButtonCyan';

const FotterEventPurchaseList = ({sumAmount, cssUpdateBtn, cssCreateDocBtn}) => {
  return (
    <footer className="fotter">
      <div className="container">
        <div className="text-center pt-2">
          <div className="d-inline pt-1">
            <label id="sum_amount" style={{ fontSize: '1.3rem' }}>￥{sumAmount.toLocaleString()}</label>
          </div>
          <div className="d-inline pl-3">
            <ButtonCyan addClass={cssUpdateBtn + ' w-64'} text="更新" />
          </div>
          <div className="d-inline pl-3">
            <ButtonCyan addClass={cssCreateDocBtn + ' w-64'} text="購入リストを作成" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FotterEventPurchaseList;