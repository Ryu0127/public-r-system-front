import React from 'react';
import ButtonCyan from 'components/atoms/buttons/ButtonCyan';

const FotterWorkProjectMonthlyAttendance = ({cssDownloadDoc, cssUpdateBtn}) => {
  return (
    <footer className="fotter">
      <div className="container">
        <div className="text-center pt-2">
          <div className="d-inline pl-3">
            <ButtonCyan addClass={cssDownloadDoc + ' w-64'} text="勤務表をダウンロード" />
            <ButtonCyan addClass={cssUpdateBtn + ' w-64'} text="更新" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FotterWorkProjectMonthlyAttendance;