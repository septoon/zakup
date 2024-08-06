import './App.css';
import React, { useEffect, useState } from 'react';
import Chef from './common/images/chef.png';
import Bar from './common/images/bar.png';
import Grill from './common/images/grill.png';
import House from './common/images/household.png';
import { Link } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress } from './Redux/addressSlice';
import WebApp from '@twa-dev/sdk';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    WebApp.ready();
  }, []);

  const [selectCafe, setSelectCafe] = useState(false);

  const { address } = useSelector(({ addressSelection }) => ({
    address: addressSelection.address,
  }));

  const selectAddress = (adr) => {
    dispatch(addAddress(adr));
    setSelectCafe(false);
  };

  const onLinkClick = () => {
    WebApp.HapticFeedback.impactOccurred('medium');
    WebApp.expand()
    address === '' ? setSelectCafe(true) : setSelectCafe(false);
  };

  const linkClassName = 'w-[80%] h-20 flex justify-start pl-5 items-center mb-5 bg-silver dark:bg-darkGray rounded-lg';

  return (
    <div className="flex flex-col justify-start items-center pt-10 w-screen h-screen overflow-hidden">
      <div
        onClick={() => {
          setSelectCafe(true);
          WebApp.HapticFeedback.impactOccurred('soft');
        }}
        className="w-[80%] h-20 flex justify-between px-5 items-center mb-5 bg-silver dark:bg-darkGray rounded-lg"
      >
        <span className="dark:text-white">Закуп для кафе: </span>
        <span className="dark:text-white font-bold underline cursor-pointer">
          {address ? address : 'Не выбрано'}
        </span>
      </div>
      <Link to="/kitchen" onClick={onLinkClick} className={linkClassName}>
        <img src={Chef} className="h-5 mr-3" alt="kitchen" />
        <span className="dark:text-white">Кухня</span>
      </Link>
      <Link to="/bar" onClick={onLinkClick} className={linkClassName}>
        <img src={Bar} className="h-5 mr-3" alt="bar" />
        <span className="dark:text-white">Бар</span>
      </Link>
      <Link to="/mangal" onClick={onLinkClick} className={linkClassName}>
        <img src={Grill} className="h-5 mr-3" alt="grill" />
        <span className="dark:text-white">Мангал</span>
      </Link>
      <Link to="/house" onClick={onLinkClick} className={linkClassName}>
        <img src={House} className="h-5 mr-3" alt="household" />
        <span className="dark:text-white">Хоз товары</span>
      </Link>
      <Dialog
        header="Выберите кафе:"
        visible={selectCafe}
        position="bottom"
        style={{ width: '95vw' }}
        onHide={() => {
          setSelectCafe(false);
        }}
        draggable={false}
        resizable={false}
      >
        <div className="flex flex-col">
          <span className="w-full cursor-pointer mb-3 font-semibold" onClick={() => selectAddress('Ленина')}>
            Ленина
          </span>
          <span className="w-full cursor-pointer font-semibold" onClick={() => selectAddress('Парковая')}>
            Парковая
          </span>
        </div>
      </Dialog>
    </div>
  );
}

export default App;
