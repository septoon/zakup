import React from "react";
import { Dialog } from 'primereact/dialog';
import { sendOrder } from "../common/data/sendOrder";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { clearItems } from "../Redux/vegetSlice";

const Order = ({ visible, setVisible }) => {
  const dispatch = useDispatch()

  const { items } = useSelector(({ vegetables }) => ({
    items: vegetables.items
  }));

  const vegets = items.filter((item) => item.category === 'vegetables');
  const duzina = items.filter((item) => item.category === 'duzina');
  const mangal = items.filter((item) => item.category === 'mangal');
  const house = items.filter((item) => item.category === 'house');

  const renderSection = (title, data) => (
    data.length > 0 ? (
      <div className="flex flex-col mt-4">
        <h1 className="text-xl font-medium mb-2">{title}:</h1>
        {data.map((i, index) => (<span key={index}>{`${i.name} - ${i.count}${i.type}`}</span>))}
      </div>
    ) : null
  );

  const vegetsList = vegets.map((i) => {
    return `${i.name} - ${i.count}${i.type}`;
  }).join('\n');
  const duzinaList = duzina.map((i) => {
    return `${i.name} - ${i.count}${i.type}`;
  }).join('\n');
  const mangalList =  mangal.map((i) => {
    return `${i.name} - ${i.count}${i.type}`;
  }).join('\n');
  const houseList = house.map((i) => {
    return `${i.name} - ${i.count}${i.type}`;
  }).join('\n');

  const Load = () => {
    sendOrder('Овощи', vegetsList.toString(), dispatch, clearItems, setVisible)
    sendOrder('Дюжина', duzinaList.toString(), dispatch, clearItems, setVisible)
    sendOrder('Мангал', mangalList.toString(), dispatch, clearItems, setVisible)
    sendOrder('Хоз товары', houseList.toString(), dispatch, clearItems, setVisible)
  }

  const footerContent = (
    <div>
      <Button label="Отправить" onClick={Load} className="bg-blue w-full text-white py-3 rounded-lg" />
    </div>
  );
  return (
    <div className="card">
      <Dialog
        header="Итог"
        visible={visible}
        position={'bottom'}
        style={{ width: '95vw' }}
        onHide={() => { if (!visible) return; setVisible(false); }}
        footer={footerContent}
        draggable={false}
        resizable={false}
      >
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