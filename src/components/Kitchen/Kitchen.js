import React from 'react';
import { Link } from 'react-router-dom';
import KitchenGoods from './KitchenGoods';

const Kitchen = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-start items-center pl-5 h-16 text-blue font-medium">
        <Link to="/zakup">Назад</Link>
      </div>
      <KitchenGoods />
    </div>
  );
};

export default Kitchen;
