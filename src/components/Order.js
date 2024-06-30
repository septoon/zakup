import React from "react";
import { Dialog } from 'primereact/dialog';

const Order = ({ visible, setVisible, footerContent, items }) => {
  const vegets = items.filter((item) => item.category === 'vegetables');
  const duzina = items.filter((item) => item.category === 'duzina');
  const mangal = items.filter((item) => item.category === 'mangal');
  const house = items.filter((item) => item.category === 'house');

  const renderSection = (title, data, sendOrder) => (
    data.length > 0 ? (
      <div className="flex flex-col mt-4">
        <h1 className="text-xl font-medium mb-2">{title}:</h1>
        {data.map((i, index) => (<span key={index}>{`${i.name} - ${i.count}${i.type}`}</span>))}
      </div>
    ) : null
  );

  const goodsList = items.map((i) => {
    const value = `${i.name} - ${i.count}${i.type}`;
    return value;
  });

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