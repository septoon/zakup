import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import '../custom.css';
import { addVegetablesToItems, removeVegetableByName } from '../Redux/vegetSlice';
import WebApp from '@twa-dev/sdk';

const Template = ({ mangalData, vegetablesData, duzinaData, houseData }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(() => {
    const savedItem = localStorage.getItem('selectedItem');
    return savedItem ? JSON.parse(savedItem) : {};
  });
  const [count, setCount] = useState(0);
  const [comment, setComment] = useState('');
  const [activeIndexes, setActiveIndexes] = useState([0, 1]);
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedItems = localStorage.getItem('selectedItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const handleFocus = (event) => event.target.select();

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

  const itemRenderer = (item, index) => {
    const selectedItem = selectedItems.find(i => i.name === item.label);
    return (
      <div key={item.label + index} className="flex items-center px-3 py-2" onClick={() => {
        handleOpenDialog();
        setItem({
          name: item.label,
          count: selectedItem ? selectedItem.count : item.counted ? 1 : 0,
          counted: item.counted,
          comment: selectedItem ? selectedItem.comment : '',
          commented: item.commented,
          type: item.type,
          category: item.category
        });
        setCount(selectedItem ? selectedItem.count : item.counted ? 1 : 0);
        setComment(selectedItem ? selectedItem.comment : '');
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
          content: houseData.map((house, index) =>
            itemRenderer({ label: house.name, commented: house.commented, counted: house.counted, type: house.type, category: house.category }, index)
          ),
        },
      ]
    : mangalData
    ? [
        {
          header: 'Мясо',
          content: mangalData.map((meat, index) =>
            itemRenderer({ label: meat.name, commented: meat.commented, counted: meat.counted, type: meat.type, category: meat.category }, index)
          ),
        },
      ]
    : [
        {
          header: 'Овощи',
          content: vegetablesData.map((vegetable, index) =>
            itemRenderer({ label: vegetable.name, commented: vegetable.commented, counted: vegetable.counted, type: vegetable.type, category: vegetable.category }, index)
          ),
        },
        {
          header: 'Дюжина',
          content: duzinaData.map((duzina, index) =>
            itemRenderer({ label: duzina.name, commented: duzina.commented, counted: duzina.counted, type: duzina.type, category: duzina.category }, index))
        },
      ];

  const footerContent = (
    <div className="flex justify-between items-center">
      <Button label={item.count > 0 && "Удалить"} icon={item.count > 0 && "pi pi-times"} className="p-button-danger" onClick={() => {
        WebApp.HapticFeedback.impactOccurred('heavy')
        removeVegets(item.name)
      }} />
      <Button label="Добавить" icon="pi pi-check" onClick={() => {
        WebApp.HapticFeedback.impactOccurred('heavy')
        item.counted ? count > 0 && addVegets({ ...item, count, comment }) : addVegets({ ...item, count: 1, comment })
      }} autoFocus />
    </div>
  );

  return (
    <div className="card flex w-full justify-center overflow-y-scroll pt-5">
      <Accordion activeIndex={activeIndexes} className="w-full pb-12" onTabChange={onTabChange}>
        {items.map((item, index) => (
          <AccordionTab contentClassName='accord' onClick={() => WebApp.HapticFeedback.impactOccurred('soft')} headerClassName='accord' key={index} header={item.header}>
            {item.content}
          </AccordionTab>
        ))}
      </Accordion>
      <Dialog
        header="Количество"
        className="w-full dark:bg-dark dark:text-white"
        visible={isOpen}
        footer={footerContent}
        onHide={() => setIsOpen(false)}
        onShow={handleDialogOpened}
      >
        <div className="w-full flex justify-between mt-2">
          <div>
            <span>{item.name}</span>
            {item.commented && (
              <input 
                placeholder='дополнение...' 
                value={comment} 
                className="border-1 bg-silver rounded-md w-[45%] mx-2 dark:bg-dark"
                onChange={(e) => {
                  const newComment = e.target.value;
                  setComment(newComment);
                  setItem((prevItem) => ({ ...prevItem, comment: newComment }));
                }}
              />
            )}
          </div>
          <div className={item.counted ? 'w-24 flex justify-end' : 'w-auto'}>
            {item.counted ? (
              <input
                ref={inputRef}
                type="number"
                onFocus={handleFocus}
                value={count > 0 ? count : ''}
                onChange={(e) => {
                  const newCount = parseInt(e.target.value, 10);
                  setCount(newCount);
                  setItem((prevItem) => ({ ...prevItem, count: newCount }));
                }}
                inputMode="numeric"
                pattern="[0-9]*"
                className="border-1 bg-silver rounded-md w-10 mr-2 dark:bg-dark"
              />
            ) : (
              <span>1</span>
            )}
            <span>{item.type}</span>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Template;