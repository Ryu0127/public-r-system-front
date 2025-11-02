import React from 'react';

interface SelectTimeHourProps {
  name: string;
  addClass: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const hourOptions = Array.from({ length: 49 }, (_, i) => ({
  text: String(i).padStart(2, '0'),
  value: String(i).padStart(2, '0')
}));

const SelectTimeHour: React.FC<SelectTimeHourProps> = ({ name, addClass, value, onChange }) => {
  return (
      <select className={addClass} name={name} onChange={onChange}>
        {hourOptions.map((item, index) => (
            <option key={index} value={item.value} selected={item.value === value}>
                {item.text}
            </option>
        ))}
      </select>
  );
};
  
export default SelectTimeHour;