import React from 'react';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { selectAddress } from '../Redux/addressSlice';
import { createSelector } from 'reselect';
import '../custom.css';
import { setTotalVisible } from '../Redux/totalBtnSlice';

// Мемоизированный селектор
const selectOrderData = createSelector(
  [selectAddress],
  (address) => ({
    address,
  })
);

const Order = ({ totalVisible, date, vegets, duzina, mangal, house }) => {
  const dispatch = useDispatch();

  const { address } = useSelector(selectOrderData);

  const renderSection = (title, data) =>
    data.length > 0 ? (
      <div className="flex flex-col mt-4">
        <h1 className="text-xl font-medium mb-2">{title}:</h1>
        {data.map((i, index) => (
          <span key={index}>
            {i.counted
              ? `${i.name}${i.comment ? `( ${i.comment})` : ''} - ${i.count}${i.type}${data.length > 1 ? ',' : ''}`
              : `${i.name}${i.comment ? ` (${i.comment})` : ''}${data.length > 1 ? ',' : ''}`}
          </span>
        ))}
      </div>
    ) : null;

  return (
    <div className="card">
      <Dialog
        className="dialog"
        // header={`Кафе "${address}" | Итог:`}
        header="Итог:"
        visible={totalVisible}
        position={'bottom'}
        style={{ width: '95vw' }}
        onHide={() => {
          dispatch(setTotalVisible(false));
        }}
        draggable={false}
        resizable={false}
      >
        <div className="w-full h-full">
          <h2>на {date}</h2>
          {renderSection('Овощи', vegets)}
          {renderSection('Дюжина', duzina)}
          {renderSection('Мангал', mangal)}
          {renderSection('Хоз товары', house)}
        </div>
      </Dialog>
    </div>
  );
};

export default Order;