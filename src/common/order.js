'use client'

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';

import { clearDishCart, removeDish, decrementDish, incrementDish } from '../GlobalRedux/Features/cart/cartSlice';

import Trash from '../../public/img/trash.svg';
import CartIcon from '@/public/img/cart-logo.svg';

import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import OrderFinish from '../components/OrderFinish';
import Order from '../components/Order';
import CartItem from '../components/CartItem';

const Cart = () => {
  const dispatch = useDispatch();
  
  const isBrowser = typeof window !== 'undefined';

  const { items, totalCount, totalPrice } = isBrowser && useSelector(({ cart }) => ({
    items: cart.items,
    totalPrice: cart.totalPrice,
    totalCount: cart.totalCount,
  }));

  // Создаем новый массив уникальных элементов, используя метод reduce().
  const uniqueProducts = items.reduce((acc, current) => {
    // Проверяем, есть ли элемент с таким же id в массиве acc
    const isDuplicate = acc.find(
      (item) => item.id === current.id,
    );
    // Если элемент не найден, добавляем его в массив acc.
    if (!isDuplicate) {
      acc.push(current);
    }
    // Возвращаем массив acc на каждой итерации
    return acc;
  }, []);

  const countById = (items, id, activeSize) => {
    return items.reduce((count, i) => {
      if (i.id === id && i.activeSize === activeSize) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const [isOrderFinish, setIsOrderFinish] = useState(false);

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState('center');
  const show = (position) => {
    setPosition(position);
    setVisible(true);
  };

  const footerContent = (
    <div className="flex justify-between items-center">
      <span className="text-sm text-left w-1/2">
        В течение 10-ти минут с вами свяжется оператор, для подтверждения заказа.
      </span>
      <Button
        label="Ok"
        className="py-2 px-4 h-10"
        icon="pi pi-check"
        onClick={() => setIsOrderFinish(false)}
        autoFocus
      />
    </div>
  );

  const onClickRemoveDish = (dishObj) => {
    dispatch(removeDish(dishObj));
  };
  const onClickClearCart = () => {
    dispatch(clearDishCart());
  };

  const onClickMinusDish = (dishObj) => {
    dispatch(decrementDish(dishObj));
  };

  const onClickPlusDish = (dishObj) => {
    dispatch(incrementDish(dishObj));
    console.log(items);
  };

  const [datetime24h, setDateTime24h] = useState(new Date());
  const shortDate = datetime24h.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const shortTime = datetime24h.toLocaleTimeString('ru-RU', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });

  const [checked, setChecked] = useState(false);

  const [orderType, setOrderType] = useState('Доставка');
  const ordersCount = Math.floor(Math.random() * 99999999);

  const [orderValues, setOrderValues] = useState({});

  const sendOrder = async (
    orderType,
    address,
    phoneNumber,
    comment,
    dishes,
    items,
    countById,
    totalItems,
    pay,
  ) => {
    let message =
      orderType === 'Доставка'
        ? `
    Заказ # ${ordersCount}
    ${orderType}
    ${dishes.toString()}
    Сумма: ${totalPrice}
    Адрес Доставки: ${address}
    Номер телефона: ${phoneNumber}
            ${
              checked
                ? `
    Дата доставки: ${shortDate}
    Время доставки: ${shortTime}`
                : `
    Дата доставки: Сегодня
    Время доставки: Сейчас`
            }
    Комментарий: ${comment}
    Способ оплаты: ${pay}
          `
        : `Заказ # ${ordersCount}
    ${orderType}
    ${dishes.toString()}
    Сумма: ${totalPrice}
    Номер телефона: ${phoneNumber}
            ${
              checked
                ? `
    Дата доставки: ${shortDate}
    Время доставки: ${shortTime}`
                : `
    Дата доставки: Сегодня
    Время доставки: Сейчас`
            }
          `;
    setOrderValues({
      orderType,
      address,
      phoneNumber,
      comment,
      dishes,
      totalPrice,
      items,
      countById,
      totalItems,
      pay,
    });
    await axios
      .post('https://api.telegram.org/bot6588296927:AAFEdBfmYFTQKRPOXc_I6hX4aDOCU5hhOp8/sendMessage', {
        chat_id: '-1002117927304',
        text: message,
      })
      .then((res) => {
        onClickClearCart();
      })
      .catch((err) => {
        console.warn(err);
      });
  };
  return (
    <div className="py-6 w-full">
      <h1 className="pl-6 text-title font-bold font-comfortaa">Корзина</h1>
      <Dialog
        header="Ваш заказ"
        visible={visible}
        position={position}
        className="w-screen lg:w-[40vw]"
        onHide={() => setVisible(false)}
        draggable={false}
        resizable={false}>
        <Order
          checked={checked}
          setChecked={setChecked}
          setIsOrderFinish={setIsOrderFinish}
          datetime24h={datetime24h}
          setDateTime24h={setDateTime24h}
          setVisible={setVisible}
          onClickClearCart={onClickClearCart}
          countById={countById}
          totalItems={items}
          items={uniqueProducts}
          totalCount={totalCount}
          totalPrice={totalPrice}
          sendOrder={sendOrder}
          orderType={orderType}
          setOrderType={setOrderType}
        />
      </Dialog>
      <Dialog
        header="Спасибо за заказ"
        visible={isOrderFinish}
        position={position}
        className="w-screen lg:w-[40vw]"
        footer={footerContent}
        onHide={() => setIsOrderFinish(false)}
        draggable={false}
        resizable={false}>
        <OrderFinish orderValues={orderValues} shortDate={shortDate} shortTime={shortTime} />
      </Dialog>
      <div className="px-1">
        {items.length ? (
          // Если в корзине что-то есть
          <>
            <div className="w-full flex justify-end text-lightSlate-gray pr-6">
              <div
                className="flex mt-2 mb-4"
                onClick={() => {
                  let popup = window.confirm('Вы уверены, что хотите очистить корзину?');
                  popup && dispatch(clearDishCart());
                }}>
                <Image className="text-lightSlate-gray" src={Trash} alt="trash" />
                <span>Очистить корзину</span>
              </div>
            </div>
            <div className="px-2 h-auto pt-2 mb-6">
              {uniqueProducts.map((item, index) => {
                const count = countById(items, item.id, item.activeSize);

                return (
                  <CartItem
                    key={index}
                    countById={count}
                    onClickMinusDish={() => onClickMinusDish({ dishId: item.id })}
                    onClickPlusDish={() => onClickPlusDish({ dishId: item.id })}
                    onClickRemoveDish={() => onClickRemoveDish({ dishId: item.id })}
                    {...item}
                  />
                );
              })}
            </div>
            <div className="">
              <div className="mb-3 w-full flex flex-col justify-between px-3 transition-all">
                <span>
                  {' '}
                  Всего блюд:{' '}
                  <b className="font-bold text-lg text-lightSlate-gray">{totalCount} шт.</b>{' '}
                </span>
                <span>
                  {' '}
                  Сумма заказа: <b className="text-lightSlate-gray text-lg">{totalPrice} ₽</b>{' '}
                </span>
              </div>
              <div className="w-full pl-3">
                <Button
                  className="px-4 py-2 bg-lightSlate-gray text-white rounded-md"
                  onClick={() => show('bottom')}
                  label="Оформить заказ"
                />
              </div>
            </div>
          </>
        ) : (
          // Если корзина пустая
          <div className="px-6 pt-6 w-full flex flex-col items-center justify-around">
            <h2 className="mb-6 self-start">Корзина пустая</h2>
            <Image src={CartIcon} className="opacity-50 w-1/2 max-w-[300px]" alt="cart" />
            <span className="mt-6">
              Вероятней всего, вы еще ничего не заказали. Для того, чтобы сделать заказ, перейди на
              страницу меню.
            </span>
            <Link href="/menu" className="">
              <Button
                className="px-4 py-2 bg-lightSlate-gray text-white rounded-md fixed bottom-main-btn left-6 lg:left-[20%]"
                label="Вернуться назад"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
