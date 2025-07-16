import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import '../custom.css';

import {
  addVegetableAndPersist,
  removeVegetableAndPersist,
  selectVegetablesItems,            // ← достаём список из Redux
} from '../Redux/vegetSlice';

import WebApp from '@twa-dev/sdk';

const Template = ({ mangalData, vegetablesData, duzinaData, houseData }) => {
  const dispatch = useDispatch();

  /* ────────── Redux-state вместо localStorage ────────── */
  const selectedItems = useSelector(selectVegetablesItems);

  /* ────────── Локальные состояния ────────── */
  const [isOpen, setIsOpen]   = useState(false);
  const [item, setItem]       = useState({});           // текущий редактируемый товар
  const [count, setCount]     = useState(0);
  const [comment, setComment] = useState('');
  const [activeIndexes, setActiveIndexes] = useState([0, 1]);

  const inputRef = useRef(null);

  /* Фокус на инпуте после открытия модалки */
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      WebApp.MainButton.hide();
    } else {
      WebApp.MainButton.show();
    }
  }, [isOpen]);

  /* ────────── CRUD через Redux ────────── */
  const addVegets = (obj) => {
    setIsOpen(false);
    dispatch(addVegetableAndPersist(obj));
  };

  const removeVegets = (name) => {
    setIsOpen(false);
    dispatch(removeVegetableAndPersist(name));
  };

  /* ────────── Accordion helpers ────────── */
  const onTabChange = (e) => setActiveIndexes(e.index);

  const handleOpenDialog = () => setIsOpen(true);

  /* Вывод каждой позиции в списке */
  const itemRenderer = (item, index) => {
    const selectedItem = selectedItems.find((i) => i.name === item.label);

    return (
      <div
        key={item.label + index}
        className="flex items-center pr-3 py-2 section-separator"
        onClick={() => {
          handleOpenDialog();
          setItem({
            name: item.label,
            count: selectedItem ? selectedItem.count : item.counted ? 1 : 0,
            counted: item.counted,
            comment: selectedItem ? selectedItem.comment : '',
            commented: item.commented,
            type: item.type,
            category: item.category,
          });
          setCount(selectedItem ? selectedItem.count : item.counted ? 1 : 0);
          setComment(selectedItem ? selectedItem.comment : '');
        }}
      >
        <span className={`cursor-pointer ${item.items && 'font-semibold'}`}>{item.label}</span>
        {selectedItem && (
          <span className="ml-2">
            {selectedItem.count > 0 && `(${selectedItem.count} ${selectedItem.type})`}
          </span>
        )}
      </div>
    );
  };

  /* Данные для аккордеона */
  const items = houseData
    ? [
        {
          header: 'Хоз товары',
          content: houseData.map((house, idx) =>
            itemRenderer(
              {
                label: house.name,
                commented: house.commented,
                counted: house.counted,
                type: house.type,
                category: house.category,
              },
              idx
            )
          ),
        },
      ]
    : mangalData
    ? [
        {
          header: 'Мясо',
          content: mangalData.map((meat, idx) =>
            itemRenderer(
              {
                label: meat.name,
                commented: meat.commented,
                counted: meat.counted,
                type: meat.type,
                category: meat.category,
              },
              idx
            )
          ),
        },
      ]
    : [
        {
          header: 'Овощи',
          content: vegetablesData.map((veg, idx) =>
            itemRenderer(
              {
                label: veg.name,
                commented: veg.commented,
                counted: veg.counted,
                type: veg.type,
                category: veg.category,
              },
              idx
            )
          ),
        },
        {
          header: 'Дюжина',
          content: duzinaData.map((dz, idx) =>
            itemRenderer(
              {
                label: dz.name,
                commented: dz.commented,
                counted: dz.counted,
                type: dz.type,
                category: dz.category,
              },
              idx
            )
          ),
        },
      ];

  /* ────────── Диалог «кол-во/комментарий» ────────── */
  const footerContent = (
    <div className="flex justify-between items-center">
      <Button
        label={item.count > 0 && 'Удалить'}
        icon={item.count > 0 && 'pi pi-times'}
        className="p-button-danger"
        onClick={() => {
          WebApp.HapticFeedback.impactOccurred('heavy');
          removeVegets(item.name);
        }}
      />
      <Button
        label="Добавить"
        icon="pi pi-check"
        onClick={() => {
          WebApp.HapticFeedback.impactOccurred('heavy');
          item.counted
            ? count > 0 && addVegets({ ...item, count, comment })
            : addVegets({ ...item, count: 1, comment });
        }}
        autoFocus
      />
    </div>
  );

  const handleFocus = (e) => e.target.select();

  return (
    <div className="card flex w-full justify-center overflow-y-scroll pt-5">
      <Accordion
        activeIndex={activeIndexes}
        className="w-full pb-12"
        onTabChange={onTabChange}
      >
        {items.map((it, idx) => (
          <AccordionTab
            key={idx}
            header={it.header}
            headerClassName="accord"
            contentClassName="accord"
            onClick={() => WebApp.HapticFeedback.impactOccurred('soft')}
          >
            {it.content}
          </AccordionTab>
        ))}
      </Accordion>

      <Dialog
        header="Количество"
        className="w-full dark:bg-dark dark:text-white"
        visible={isOpen}
        footer={footerContent}
        onHide={() => setIsOpen(false)}
        onShow={() => inputRef.current && inputRef.current.focus()}
      >
        <div className="w-full flex justify-between mt-2">
          <div>
            <span>{item.name}</span>
            {item.commented && (
              <input
                placeholder="дополнение..."
                value={comment}
                className="border-1 bg-silver rounded-md w-[50%] pl-2 mx-2 dark:bg-dark"
                onChange={(e) => {
                  const newComment = e.target.value;
                  setComment(newComment);
                  setItem((prev) => ({ ...prev, comment: newComment }));
                }}
              />
            )}
          </div>

          <div className={item.counted ? 'w-24 flex justify-end' : 'w-auto'}>
            {item.counted ? (
              <input
                ref={inputRef}
                type="number"
                value={count > 0 ? count : ''}
                onFocus={handleFocus}
                onChange={(e) => {
                  const newCount = parseInt(e.target.value, 10);
                  setCount(newCount);
                  setItem((prev) => ({ ...prev, count: newCount }));
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