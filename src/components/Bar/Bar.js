import React from 'react';
import { Link } from 'react-router-dom';
import BarGoods from './BarGoods';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import Template from '../Template';
import { vegetablesDataBar } from '../../common/data/bar/vegetablesDataBar';
import { duzinaDataBar } from '../../common/data/bar/duzinaDataBar';

const Bar = () => {
  const { items } = useSelector(({ vegetables }) => ({
    items: vegetables.items
  }));
  return (
    <div className="flex flex-col relative">
      <div className="flex justify-start items-center pl-5 h-16 text-blue font-medium">
        <Link to="/zakup">Назад</Link>
      </div>
      <Template vegetablesData={vegetablesDataBar} duzinaData={duzinaDataBar}  />
      <div className='w-full px-5 fixed bottom-3'>
        <Button label="Отправить" className="bg-blue w-full text-white py-3 rounded-lg" />
      </div>
    </div>
  );
};

export default Bar;
