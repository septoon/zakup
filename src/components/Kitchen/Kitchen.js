import React from 'react';
import { Link } from 'react-router-dom';
import KitchenGoods from './KitchenGoods';
import { vegetablesData } from '../../common/data/kitchen/vegetablesData';
import { duzinaData } from '../../common/data/kitchen/duzinaData';
import { Button } from 'primereact/button';
import Template from '../Template';

const Kitchen = () => {
  return (
    <div className="flex flex-col relative">
      <div className="flex justify-start items-center pl-5 h-16 text-blue font-medium">
        <Link to="/zakup">Назад</Link>
      </div>
      <Template vegetablesData={vegetablesData} duzinaData={duzinaData} />
      <div className='w-full px-5 fixed bottom-3'>
        <Button label="Отправить" className="bg-blue w-full text-white py-3 rounded-lg" />
      </div>
    </div>
  );
};

export default Kitchen;
