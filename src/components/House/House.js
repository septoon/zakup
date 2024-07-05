import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';

import { houseData } from '../../common/data/house/houseData';
import Template from '../Template';
import Order from '../Order';

const House = () => {
  const [visible, setVisible] = useState(false);

  const show = () => {
      setVisible(true);
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex justify-start items-center pl-5 h-16 text-blue font-medium">
        <Link to="/zakup">Назад</Link>
      </div>
      <Template houseData={houseData}  />
      <Order visible={visible} setVisible={setVisible} />
      <div className='w-full px-5 fixed bottom-5'>
        <Button label="Итог" onClick={() => show('bottom')} className="bg-blue w-full text-white py-3 rounded-lg" />
      </div>
    </div>
  );
};

export default House;
