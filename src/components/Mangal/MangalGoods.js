import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { vegetablesData } from '../../common/data/kitchen/vegetablesData';
import { Button } from 'primereact/button';
import { duzinaData } from '../../common/data/kitchen/duzinaData';

const MangalGoods = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState('');
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
        }}
        className={`mx-2 cursor-pointer ${item.items && 'font-semibold'}`}>
        {item.label}
      </span>
    </div>
  );

  const items = [
    {
      header: 'Мясо',
      content: vegetablesData.map((vegetable) => itemRenderer({ label: vegetable.name })),
    }
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
          <input type="number" className="border-1 bg-silver rounded-md w-12" />
        </div>
      </Dialog>
    </div>
  );
};

export default MangalGoods;
