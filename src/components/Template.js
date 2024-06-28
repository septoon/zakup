import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const Template = ({mangalData, vegetablesData, duzinaData, houseData}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState('');
  const [itemType, setItemType] = useState('');
  const [activeIndexes, setActiveIndexes] = useState([0, 1]);

  const onTabChange = (e) => {
    setActiveIndexes(e.index);
  };

  const itemRenderer = (item) => (
    <div className="flex items-center px-3 py-2">
      <span
        onClick={(e) => {
          setIsOpen(true);
          setItem(item.label);
          setItemType(item.type);
        }}
        className={`mx-2 cursor-pointer ${item.items && 'font-semibold'}`}>
        {item.label}
      </span>
      <span>{item.count > 0 && item.count}</span>
    </div>
  );

  const items = houseData ? [
    {
      header: 'Хоз товары',
      content: houseData.map((house) => itemRenderer({ label: house.name, type: house.type })),
    },
  ] : mangalData ? [
    {
      header: 'Мясо',
      content: mangalData.map((meat) => itemRenderer({ label: meat.name, type: meat.type })),
    },
  ] : [
    {
      header: 'Овощи',
      content: vegetablesData.map((vegetable) => itemRenderer({ label: vegetable.name, type: vegetable.type })),
    },
    {
      header: 'Дюжина',
      content: duzinaData.map((goods) => itemRenderer({ label: goods.name, type: goods.type })),
    },
  ];

  const footerContent = (
    <div>
      <Button label="Ok" icon="pi pi-check" onClick={() => setIsOpen(false)} autoFocus />
    </div>
  );

  return (
    <div className="card flex w-full justify-center">
      <Accordion activeIndex={activeIndexes} className="w-full" onTabChange={onTabChange}>
        {items.map((item, index) => (
          <AccordionTab key={index} header={item.header}>
            {item.content}
          </AccordionTab>
        ))}
      </Accordion>
      <Dialog
        header="Количество"
        className="w-full"
        visible={isOpen}
        footer={footerContent}
        onHide={() => setIsOpen(false)}>
        <div className="w-full flex justify-between">
          <span>{item}</span>
          <div>
            <input type="number" className="border-1 bg-silver rounded-md w-12 mr-2" />
            <span>{itemType}</span>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Template;
