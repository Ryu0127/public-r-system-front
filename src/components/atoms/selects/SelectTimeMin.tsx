import React from 'react';

interface SelectTimeMinProps {
  name: string;
  addClass: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const minOptions = [
  {text: '00', value: '00'},
  {text: '15', value: '15'},
  {text: '30', value: '30'},
  {text: '45', value: '45'},
];

const SelectTimeMin: React.FC<SelectTimeMinProps> = ({ name, addClass, value, onChange }) => {
  return (
      <select className={addClass} name={name} onChange={onChange}>
        {minOptions.map((item, index) => (
            <option key={index} value={item.value} selected={item.value === value}>
                {item.text}
            </option>
        ))}
      </select>
  );
};
  
export default SelectTimeMin;