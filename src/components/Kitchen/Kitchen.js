import React from 'react';
import { Link } from 'react-router-dom';
import KitchenGoods from './KitchenGoods';
import { Button } from 'primereact/button';

const Kitchen = () => {
  return (
    <div className="flex flex-col relative">
      <div className="flex justify-start items-center pl-5 h-16 text-blue font-medium">
        <Link to="/zakup">Назад</Link>
      </div>
      <KitchenGoods />
      <div className='w-full px-5 fixed bottom-20'>
        <Button label="Отправить" className="bg-blue w-full text-white py-2 rounded-lg" />
      </div>
    </div>
  );
};

export default Kitchen;
