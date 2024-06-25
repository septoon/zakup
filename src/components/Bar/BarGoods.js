import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { vegetablesDataBar } from '../../common/data/bar/vegetablesDataBar';
import { duzinaDataBar } from '../../common/data/bar/duzinaDataBar';
import { addVegetablesToItems } from '../../Redux/vegetSlice';

import { Dialog } from 'primereact/dialog';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';

const BarGoods = ({vegetItems}) => {
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState('');
  const [activeIndexes, setActiveIndexes] = useState([0, 1]);


  const onTabChange = (e) => {
    setActiveIndexes(e.index);
  };

  const addVegetables = (name, count, type) => {
    const obj = {
      name,
      count,
      type,
    };
    dispatch(addVegetablesToItems(obj));
  }

  const itemRenderer = (item) => (
    <div className="flex items-center px-3 py-2">
      <span
        onClick={(e) => {
          setIsOpen(true);
          setItem(item.label);
          addVegetables(item.name, item.count, item.type)
        }}
        className={`mx-2 cursor-pointer ${item.items && 'font-semibold'}`}>
        {item.label}
      </span>
    </div>
  );

  const items = [
    {
      header: 'Овощи',
      content: vegetablesDataBar.map((vegetable) => itemRenderer({ label: vegetable.name, count: vegetable.count, type: vegetable.type })),
    },
    {
      header: 'Дюжина',
      content: duzinaDataBar.map((vegetable) => itemRenderer({ label: vegetable.name })),
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
          {
            vegetItems.map((i) => {
              return(
                <span>{`${i.name} - ${i.count} ${i.type}`}</span>
              )
            })
          }
          <input type="number" className="border-1 bg-silver rounded-md w-12" />
        </div>
      </Dialog>
    </div>
  );
};

export default BarGoods;