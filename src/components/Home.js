import React from 'react';

interface HomeProps {
  title: string;
  message: string;
}

const Home: React.FC<HomeProps> = ({ title, message }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
};

export default Home;