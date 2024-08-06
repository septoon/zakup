import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainButton } from '@twa-dev/sdk/react';
import WebApp from '@twa-dev/sdk';
import { useDispatch, useSelector } from 'react-redux';
import { selectTotalVisible, setTotalVisible } from './Redux/totalBtnSlice';
import { selectAddress } from './Redux/addressSlice';
import Order from './components/Order';
import { createSelector } from 'reselect';
import { clearItems, selectVegetablesItems } from './Redux/vegetSlice';
import { sendOrder } from './common/sendOrder';

// Мемоизированный селектор
const selectOrderData = createSelector(
  [selectVegetablesItems, selectAddress],
  (items, address) => ({
    items,
    address,
  })
);

const Layout = () => {
  const dispatch = useDispatch();

  const totalVisible = useSelector(selectTotalVisible);
  const { items, address } = useSelector(selectOrderData);

  const vegets = items.filter((item) => item.category === 'vegetables');
  const duzina = items.filter((item) => item.category === 'duzina');
  const mangal = items.filter((item) => item.category === 'mangal');
  const house = items.filter((item) => item.category === 'house');

  const vegetsList = vegets
  .map((i) => {
    return i.counted
      ? `${i.name} ${i.comment ? `(${i.comment})` : ''} - ${i.count}${i.type},`
      : `${i.name},`;
  })
  .join('\n');
const duzinaList = duzina
  .map((i) => {
    return i.counted
      ? `${i.name} ${i.comment ? `(${i.comment})` : ''} - ${i.count}${i.type},`
      : `${i.name},`;
  })
  .join('\n');
const mangalList = mangal
  .map((i) => {
    return i.counted
      ? `${i.name} ${i.comment ? `(${i.comment})` : ''} - ${i.count}${i.type},`
      : `${i.name},`;
  })
  .join('\n');
const houseList = house
  .map((i) => {
    return i.counted
      ? `${i.name} ${i.comment ? `(${i.comment})` : ''} - ${i.count}${i.type},`
      : `${i.name},`;
  })
  .join('\n');

  const show = () => {
    dispatch(setTotalVisible(true));
  };

  const handleButtonClick = () => {
    if (totalVisible) {
      if (address !== '') {
        WebApp.HapticFeedback.notificationOccurred('success');
        dispatch(setTotalVisible(false));
        sendOrder('Овощи', vegetsList.toString(), address);
        sendOrder('Дюжина', duzinaList.toString(), address);
        sendOrder('Мангал', mangalList.toString(), address);
        sendOrder('Хоз товары', houseList.toString(), address);
        dispatch(clearItems());
        localStorage.removeItem('selectedItem');
        localStorage.removeItem('selectedItems');
      }
    } else {
      WebApp.expand()
      show();
    }
  };

  return (
    <div className="flex flex-col justify-start items-center pt-10 w-screen h-screen overflow-hidden">
      <Outlet />
      <Order totalVisible={totalVisible} vegets={vegets} duzina={duzina} mangal={mangal} house={house} />
      <MainButton text={totalVisible ? (address === '' ? 'Выберите адрес кафе' : 'Отправить') : 'Итог'} onClick={handleButtonClick} />
    </div>
  );
};

export default Layout;