import React from 'react';
import ButtonCyan from 'components/atoms/buttons/ButtonCyan';

export interface LifeScheduleDayFotterProps {
  controls?: {
    taskControls: {
      onUpdate: () => void;
    };
  };
}

export const LifeScheduleDayFotter: React.FC<LifeScheduleDayFotterProps> = ({
  controls = {
    taskControls: {
      onUpdate: () => {},
    },
  },
}) => {
  return (
    <footer className="fotter">
      <div className="container">
        <div className="text-center pt-2">
          <div className="d-inline pl-3">
            <ButtonCyan
              addClass="w-64"
              text="保存"
              onClick={controls.taskControls.onUpdate}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LifeScheduleDayFotter;