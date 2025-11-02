import React from 'react';

interface SelectProps {
  name: string;
  addClass: string;
  options: Option[];
  value: any;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
interface Option {
  value: any;
  text: string;
}

const Select: React.FC<SelectProps> = ({ name, addClass, options, value, onChange }) => {
  return (
      <select className={addClass} name={name} value={value} onChange={onChange}>
        {options.map((item, index) => (
            <option key={index} value={item.value}>
                {item.text}
            </option>
        ))}
      </select>
  );
};
  
export default Select;