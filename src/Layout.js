// src/Layout.js
import React, { useEffect, useMemo, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { MainButton } from '@twa-dev/sdk/react';
import WebApp from '@twa-dev/sdk';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalVisible, selectTotalVisible } from './Redux/totalBtnSlice';
import { selectAddress } from './Redux/addressSlice';
import { createSelector } from 'reselect';
import {
  selectVegetablesItems,
  clearItemsAndPersist,
} from './Redux/vegetSlice';
import Order from './components/Order';
import { sendOrder } from './common/sendOrder';

/* ────────── Разрешённые Telegram-ID ────────── */
const ALLOWED_IDS = [
  Number(process.env.REACT_APP_ADMIN_ID),
  Number(process.env.REACT_APP_SECOND_ADMIN_ID),
  Number(process.env.REACT_APP_REST_ID),
  Number(process.env.REACT_APP_MODERATOR_ID),
  Number(process.env.REACT_APP_USER_ID),
].filter(Boolean);

/* ────────── Селектор «товары + адрес» ────────── */
const selectOrderData = createSelector(
  [selectVegetablesItems, selectAddress],
  (items, address) => ({ items, address })
);

const Layout = () => {
  const dispatch = useDispatch();

  const totalVisible       = useSelector(selectTotalVisible);
  const { items, address } = useSelector(selectOrderData);

  /* ─────── разбор по категориям ─────── */
  const vegets = useMemo(() => items.filter(i => i.category === 'vegetables'), [items]);
  const duzina = useMemo(() => items.filter(i => i.category === 'duzina'),     [items]);
  const mangal = useMemo(() => items.filter(i => i.category === 'mangal'),     [items]);
  const house  = useMemo(() => items.filter(i => i.category === 'house'),      [items]);

  const formatList = (arr) =>
    arr
      .map(i =>
        i.counted
          ? `${i.name}${i.comment ? ` (${i.comment})` : ''} - ${i.count}${i.type},`
          : `${i.name},`
      )
      .join('\n');

  const vegetsList = formatList(vegets);
  const duzinaList = formatList(duzina);
  const mangalList = formatList(mangal);
  const houseList  = formatList(house);

  const date = useMemo(
    () =>
      new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    []
  );

  /* ─────── кнопка «Отправить/Итог» ─────── */
  const handleButtonClick = () => {
    const userId = WebApp?.initDataUnsafe?.user?.id;

    if (totalVisible) {
      const canSend = address !== '' && ALLOWED_IDS.includes(userId);

      if (canSend) {
        WebApp.HapticFeedback.notificationOccurred('success');
        dispatch(setTotalVisible(false));

        sendOrder('Овощи',     date, vegetsList, address);
        sendOrder('Дюжина',    date, duzinaList, address);
        sendOrder('Мангал',    date, mangalList, address);
        sendOrder('Хоз товары',date, houseList,  address);

        dispatch(clearItemsAndPersist());
      } else {
        WebApp.HapticFeedback.notificationOccurred('warning');
        console.warn('Отправка запрещена: выберите адрес и убедитесь, что ваш ID разрешён.');
      }
    } else {
      WebApp.expand();
      dispatch(setTotalVisible(true));
    }
  };

  const buttonLabel = totalVisible
    ? address === '' ? 'Выберите адрес кафе' : 'Отправить'
    : 'Итог';

  /* ─────── UI ─────── */
  return (
    <div className="flex flex-col justify-start items-center w-screen h-screen overflow-hidden">
      <Outlet />
      <Order totalVisible={totalVisible} />
      <MainButton text={buttonLabel} onClick={handleButtonClick} />
    </div>
  );
};

export default Layout;