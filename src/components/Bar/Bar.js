import React from 'react';
import { Link } from 'react-router-dom';
import BarGoods from './BarGoods';

const Bar = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-start items-center pl-5 h-16 text-blue font-medium">
        <Link to="/zakup">Назад</Link>
      </div>
      <BarGoods />
    </div>
  );
};

export default Bar;
