// src/components/Order.js
import React, { useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import '../custom.css';

import { setTotalVisible } from '../Redux/totalBtnSlice';
import { selectAddress } from '../Redux/addressSlice';
import {
  selectVegetablesItems,
  selectVegetablesStatus,
  selectVegetablesError,
} from '../Redux/vegetSlice';

/* ────────── Мемо-селектор: всё, что нужно компоненту ────────── */
const selectOrderData = createSelector(
  [selectAddress, selectVegetablesItems, selectVegetablesStatus, selectVegetablesError],
  (address, items, status, error) => ({
    address,
    items,
    status,
    error,
  })
);

const Order = ({ totalVisible }) => {
  const dispatch = useDispatch();
  const { address, items, status, error } = useSelector(selectOrderData);

  /* Категории хранится в стейте → распределяем локально */
  const vegets = useMemo(() => items.filter((i) => i.category === 'vegetables'), [items]);
  const duzina = useMemo(() => items.filter((i) => i.category === 'duzina'), [items]);
  const mangal = useMemo(() => items.filter((i) => i.category === 'mangal'), [items]);
  const house  = useMemo(() => items.filter((i) => i.category === 'house'),  [items]);

 const date = useMemo(
    () =>
      new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    []
  );

  const renderSection = (title, data) =>
    data.length > 0 && (
      <div className="flex flex-col mt-4">
        <h1 className="text-xl font-medium mb-2">{title}:</h1>
        {data.map((i, idx) => (
          <span key={idx}>
            {i.counted
              ? `${i.name}${i.comment ? ` (${i.comment})` : ''} - ${i.count}${i.type}${
                  data.length - 1 !== idx ? ',' : ''
                }`
              : `${i.name}${i.comment ? ` (${i.comment})` : ''}${data.length - 1 !== idx ? ',' : ''}`}
          </span>
        ))}
      </div>
    );

  return (
    <div className="card">
      <Dialog
        className="dialog"
        header="Итог:"
        visible={totalVisible}
        position="bottom"
        style={{ width: '95vw' }}
        onHide={() => dispatch(setTotalVisible(false))}
        draggable={false}
        resizable={false}
      >
        {/* ────────── LOADING / ERROR / DATA ────────── */}
        {status === 'loading' ? (
          <div className="flex justify-center py-6">
            <ProgressSpinner />
          </div>
        ) : status === 'failed' ? (
          <p className="text-red-500">Ошибка: {error}</p>
        ) : (
          <div className="w-full h-full">
            <h2>на {date}</h2>
            {renderSection('Овощи', vegets)}
            {renderSection('Дюжина', duzina)}
            {renderSection('Мангал', mangal)}
            {renderSection('Хоз товары', house)}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Order;