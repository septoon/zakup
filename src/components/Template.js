import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { addVegetablesToItems } from '../Redux/vegetSlice';

const Template = ({ mangalData, vegetablesData, duzinaData, houseData }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(() => {
    const savedItem = localStorage.getItem('selectedItem');
    return savedItem ? JSON.parse(savedItem) : {};
  });
  const [count, setCount] = useState(0);
  const [activeIndexes, setActiveIndexes] = useState([0, 1]);
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedItems = localStorage.getItem('selectedItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('selectedItem', JSON.stringify(item));
  }, [item]);

  useEffect(() => {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addVegets = (obj) => {
    setIsOpen(false);
    dispatch(addVegetablesToItems(obj));
    setSelectedItems((prevSelectedItems) => {
      const existingItem = prevSelectedItems.find(i => i.name === obj.name);
      if (existingItem) {
        return prevSelectedItems.map(i => i.name === obj.name ? obj : i);
      }
      return [...prevSelectedItems, obj];
    });
  };

  const onTabChange = (e) => {
    setActiveIndexes(e.index);
  };

  const itemRenderer = (item) => {
    const selectedItem = selectedItems.find(i => i.name === item.label);
    return (
      <div className="flex items-center px-3 py-2">
        <span
          onClick={() => {
            setIsOpen(true);
            setItem({
              name: item.label,
              count: selectedItem ? selectedItem.count : 0,
              type: item.type,
            });
            setCount(selectedItem ? selectedItem.count : 0);
          }}
          className={`mx-2 cursor-pointer ${item.items && 'font-semibold'}`}
        >
          {item.label}
        </span>
        {selectedItem && <span className="ml-2">{selectedItem.count > 0 && `(${selectedItem.count} ${selectedItem.type})`}</span>}
        <span>{item.count > 0 && item.count}</span>
      </div>
    );
  };

  const items = houseData
    ? [
        {
          header: 'Хоз товары',
          content: houseData.map((house) =>
            itemRenderer({ label: house.name, type: house.type })
          ),
        },
      ]
    : mangalData
    ? [
        {
          header: 'Мясо',
          content: mangalData.map((meat) =>
            itemRenderer({ label: meat.name, type: meat.type })
          ),
        },
      ]
    : [
        {
          header: 'Овощи',
          content: vegetablesData.map((vegetable) =>
            itemRenderer({ label: vegetable.name, type: vegetable.type })
          ),
        },
        {
          header: 'Дюжина',
          content: duzinaData.map((goods) =>
            itemRenderer({ label: goods.name, type: goods.type }))
        },
      ];

  const footerContent = (
    <div>
      <Button label="Добавить" icon="pi pi-check" onClick={() => count > 0 && addVegets({ ...item, count })} autoFocus />
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
        onHide={() => setIsOpen(false)}
      >
        <div className="w-full flex justify-between">
          <span>{item.name}</span>
          <div>
            <input
              ref={inputRef}
              type="number"
              value={count > 0 ? count : ''}
              onChange={(e) => {
                const newCount = parseInt(e.target.value, 10);
                setCount(newCount);
                setItem((prevItem) => ({ ...prevItem, count: newCount }));
              }}
              className="border-1 bg-silver rounded-md w-12 mr-2"
            />
            <span>{item.type}</span>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Template;