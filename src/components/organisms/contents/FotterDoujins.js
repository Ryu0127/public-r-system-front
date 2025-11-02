import React from 'react';
import ButtonCyan from 'components/atoms/buttons/ButtonCyan';

const FotterDoujins = ({cssUpdateBtn}) => {
  return (
    <footer className="fotter">
      <div className="container">
        <div className="text-center pt-2">
          <div className="d-inline pl-3">
            <ButtonCyan addClass={cssUpdateBtn + ' w-64'} text="更新" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FotterDoujins;
