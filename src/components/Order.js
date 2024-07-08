import React from 'react';
import { Dialog } from 'primereact/dialog';
import { sendOrder } from '../common/data/sendOrder';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { clearItems } from '../Redux/vegetSlice';

const Order = ({ visible, setVisible }) => {
  const dispatch = useDispatch();

  const { items, address } = useSelector(({ vegetables, addressSelection }) => ({
    items: vegetables.items,
    address: addressSelection.address,
  }));

  const vegets = items.filter((item) => item.category === 'vegetables');
  const duzina = items.filter((item) => item.category === 'duzina');
  const mangal = items.filter((item) => item.category === 'mangal');
  const house = items.filter((item) => item.category === 'house');

  const renderSection = (title, data) =>
    data.length > 0 ? (
      <div className="flex flex-col mt-4">
        <h1 className="text-xl font-medium mb-2">{title}:</h1>
        {data.map((i, index) => (
          <span key={index}>
            {i.counted
              ? `${i.name} ${i.comment ? `(${i.comment})` : ''} - ${i.count}${i.type},`
              : `${i.name} ${i.comment ? `(${i.comment})` : ''},`}
          </span>
        ))}
      </div>
    ) : null;

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

  const Load = () => {
    if (address !== '') {
      setVisible(false);
      sendOrder('Овощи', vegetsList.toString(), address);
      sendOrder('Дюжина', duzinaList.toString(), address);
      sendOrder('Мангал', mangalList.toString(), address);
      sendOrder('Хоз товары', houseList.toString(), address);
      dispatch(clearItems());
      localStorage.removeItem('selectedItem');
      localStorage.removeItem('selectedItems');
    }
  };

  const footerContent = (
    <div>
      <Button
        label={address === '' ? 'Выберите адрес кафе' : 'Отправить'}
        onClick={Load}
        className="bg-blue w-full text-white py-3 rounded-lg"
      />
    </div>
  );
  return (
    <div className="card">
      <Dialog
        header={`Кафе "${address}" | Итог:`}
        visible={visible}
        position={'bottom'}
        style={{ width: '95vw' }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
        draggable={false}
        resizable={false}>
        <div className="w-full h-full">
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
