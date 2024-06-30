import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import Template from '../Template';
import { vegetablesDataBar } from '../../common/data/bar/vegetablesDataBar';
import { duzinaDataBar } from '../../common/data/bar/duzinaDataBar';
import { clearItems } from '../../Redux/vegetSlice';
import Order from '../Order';

const Bar = () => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const show = () => {
      setVisible(true);
  };

  const { items } = useSelector(({ vegetables }) => ({
    items: vegetables.items
  }));

  const handleSend = () => {
    if(items.length > 0) {
      console.log(items);
      dispatch(clearItems());
      localStorage.removeItem('selectedItem');
      localStorage.removeItem('selectedItems');
      setVisible(false)
    }
  };
  const footerContent = (
    <div>
      <Button label="Отправить" onClick={handleSend} className="bg-blue w-full text-white py-3 rounded-lg" />
    </div>
  );
  return (
    <div className="flex flex-col relative">
      <div className="flex justify-start items-center pl-5 h-16 text-blue font-medium">
        <Link to="/zakup">Назад</Link>
      </div>
      <Template vegetablesData={vegetablesDataBar} duzinaData={duzinaDataBar}  />
      <Order visible={visible} setVisible={setVisible} footerContent={footerContent} items={items} />
      <div className='w-full px-5 fixed bottom-3'>
        <Button label="Итог" onClick={() => show('bottom')} className="bg-blue w-full text-white py-3 rounded-lg" />
      </div>
    </div>
  );
};

export default Bar;
