import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { addVegetablesToItems, removeVegetableByName } from '../Redux/vegetSlice';

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

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleDialogOpened = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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

  const removeVegets = (name) => {
    setIsOpen(false);
    dispatch(removeVegetableByName(name));
    setSelectedItems((prevSelectedItems) => prevSelectedItems.filter(i => i.name !== name));
  };

  const onTabChange = (e) => {
    setActiveIndexes(e.index);
  };

  const itemRenderer = (item) => {
    const selectedItem = selectedItems.find(i => i.name === item.label);
    return (
      <div className="flex items-center px-3 py-2" onClick={() => {
        handleOpenDialog();
        setItem({
          name: item.label,
          count: selectedItem ? selectedItem.count : 0,
          type: item.type,
          category: item.category
        });
        setCount(selectedItem ? selectedItem.count : 0);
      }}>
        <span className={`mx-2 cursor-pointer ${item.items && 'font-semibold'}`}>
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
            itemRenderer({ label: house.name, type: house.type, category: house.category })
          ),
        },
      ]
    : mangalData
    ? [
        {
          header: 'Мясо',
          content: mangalData.map((meat) =>
            itemRenderer({ label: meat.name, type: meat.type, category: meat.category })
          ),
        },
      ]
    : [
        {
          header: 'Овощи',
          content: vegetablesData.map((vegetable) =>
            itemRenderer({ label: vegetable.name, type: vegetable.type, category: vegetable.category })
          ),
        },
        {
          header: 'Дюжина',
          content: duzinaData.map((duzina) =>
            itemRenderer({ label: duzina.name, type: duzina.type, category: duzina.category }))
        },
      ];

  const footerContent = (
    <div className="flex justify-between">
      <Button label="Удалить" icon="pi pi-times" className="p-button-danger" onClick={() => removeVegets(item.name)} />
      <Button label="Добавить" icon="pi pi-check" onClick={() => count > 0 && addVegets({ ...item, count })} autoFocus />
    </div>
  );

  return (
    <div className="card flex w-full justify-center">
      <Accordion activeIndex={activeIndexes} className="w-full" onTabChange={onTabChange}>
        {items.map((item, index) => (
          <AccordionTab headerClassName='' key={index} header={item.header}>
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
        onShow={handleDialogOpened}
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
              inputMode="numeric"
              pattern="[0-9]*"
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