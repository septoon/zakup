// src/components/Order.js
import React, { useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import '../custom.css';

import { setTotalVisible } from '../Redux/totalBtnSlice';
import {
  selectCurrentDate,
  selectVegetablesItems,
  selectVegetablesStatus,
  selectVegetablesError,
} from '../Redux/vegetSlice';
import { formatDateLabel } from '../common/purchaseDate';

/* ────────── Мемо-селектор: всё, что нужно компоненту ────────── */
const selectOrderData = createSelector(
  [selectVegetablesItems, selectVegetablesStatus, selectVegetablesError, selectCurrentDate],
  (items, status, error, currentDate) => ({
    items,
    status,
    error,
    currentDate,
  })
);

const Order = ({ totalVisible }) => {
  const dispatch = useDispatch();
  const { items, status, error, currentDate } = useSelector(selectOrderData);

  /* Категории хранится в стейте → распределяем локально */
  const vegets = useMemo(() => items.filter((i) => i.category === 'vegetables'), [items]);
  const duzina = useMemo(() => items.filter((i) => i.category === 'duzina'), [items]);
  const mangal = useMemo(() => items.filter((i) => i.category === 'mangal'), [items]);
  const house  = useMemo(() => items.filter((i) => i.category === 'house'),  [items]);

 const date = useMemo(() => formatDateLabel(currentDate), [currentDate]);

  const renderSection = (title, data) =>
    data.length > 0 && (
      <div className="order-section">
        <h3>{title}</h3>
        {data.map((i, idx) => (
          <div className="order-row" key={idx}>
            <span>{i.name}{i.comment ? ` (${i.comment})` : ''}</span>
            <strong>{i.counted ? `${i.count}${i.type}` : '1'}</strong>
          </div>
        ))}
      </div>
    );

  return (
    <div className="card">
      <Dialog
        className="order-dialog"
        header="Итог"
        visible={totalVisible}
        position="bottom"
        style={{ width: 'min(94vw, 640px)' }}
        onHide={() => dispatch(setTotalVisible(false))}
        dismissableMask
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
          <div className="order-summary">
            <p className="order-date">на {date}</p>
            {renderSection('Овощи', vegets)}
            {renderSection('Дюжина', duzina)}
            {renderSection('Мангал', mangal)}
            {renderSection('Хоз товары', house)}
            {items.length === 0 && <p className="empty-state">В заявке пока нет позиций</p>}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Order;
