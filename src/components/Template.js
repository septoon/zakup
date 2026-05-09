import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import '../custom.css';

import {
  addVegetableAndPersist,
  removeVegetableAndPersist,
  selectVegetablesItems,
} from '../Redux/vegetSlice';

import { impact } from '../common/device';

const Template = ({ mangalData, vegetablesData, duzinaData, houseData }) => {
  const dispatch = useDispatch();

  const selectedItems = useSelector(selectVegetablesItems);

  const [isOpen, setIsOpen]   = useState(false);
  const [item, setItem]       = useState({});
  const [count, setCount]     = useState(0);
  const [comment, setComment] = useState('');
  const [activeIndexes, setActiveIndexes] = useState([0, 1]);

  const [search, setSearch] = useState('');
  const matchesSearch = (str) =>
    str.toLowerCase().includes(search.toLowerCase().trim());

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  const addVegets = (obj) => {
    setIsOpen(false);
    dispatch(addVegetableAndPersist(obj));
  };

  const removeVegets = (name) => {
    setIsOpen(false);
    dispatch(removeVegetableAndPersist(name));
  };

  const onTabChange = (e) => setActiveIndexes(e.index);

  const handleOpenDialog = () => setIsOpen(true);

  const itemRenderer = (item, index) => {
    const selectedItem = selectedItems.find((i) => i.name === item.label);

    return (
      <button
        type="button"
        key={item.label + index}
        className={`catalog-row ${selectedItem ? 'catalog-row--selected' : ''}`}
        onClick={() => {
          impact();
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
        <span className="catalog-row__name">{item.label}</span>
        <span className="catalog-row__meta">
          {selectedItem ? (
            selectedItem.count > 0 ? `${selectedItem.count} ${selectedItem.type}` : 'выбрано'
          ) : (
            item.counted ? item.type : 'шт'
          )}
        </span>
      </button>
    );
  };

  const items = houseData
    ? [
        {
          header: 'Хоз товары',
          content: houseData.filter((house) => matchesSearch(house.name)).map((house, idx) =>
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
          content: mangalData.filter((meat) => matchesSearch(meat.name)).map((meat, idx) =>
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
          content: vegetablesData.filter((veg) => matchesSearch(veg.name)).map((veg, idx) =>
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
          content: duzinaData.filter((dz) => matchesSearch(dz.name)).map((dz, idx) =>
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

  const getSearchActiveIndexes = (nextSearch) => {
    const query = nextSearch.toLowerCase().trim();

    if (!query) {
      return items.map((_, index) => index);
    }

    const sections = houseData
      ? [houseData]
      : mangalData
      ? [mangalData]
      : [vegetablesData, duzinaData];

    return sections.reduce((acc, section, index) => {
      const hasMatches = section.some((sectionItem) =>
        sectionItem.name.toLowerCase().includes(query)
      );
      return hasMatches ? [...acc, index] : acc;
    }, []);
  };

  const footerContent = (
    <div className="dialog-actions">
      <Button
        label="Удалить"
        icon="pi pi-times"
        className="p-button-danger"
        disabled={!selectedItems.some((selectedItem) => selectedItem.name === item.name)}
        onClick={() => {
          impact([20, 20, 20]);
          removeVegets(item.name);
        }}
      />
      <Button
        label="Добавить"
        icon="pi pi-check"
        onClick={() => {
          impact([20, 20, 20]);
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
    <div className="catalog-screen">
      <label className="search-field">
        <i className="pi pi-search" aria-hidden="true" />
        <input
          type="search"
          placeholder="Поиск позиции"
          value={search}
          onChange={(e) => {
            const nextSearch = e.target.value;
            setSearch(nextSearch);
            setActiveIndexes(getSearchActiveIndexes(nextSearch));
          }}
        />
      </label>
      <Accordion
        activeIndex={activeIndexes}
        className="catalog-accordion"
        onTabChange={onTabChange}
      >
        {items.map((it, idx) => (
          <AccordionTab
            key={idx}
            header={it.header}
            headerClassName="accord"
            contentClassName="accord"
            onClick={() => impact(8)}
          >
            {it.content.length ? it.content : <p className="empty-state">Ничего не найдено</p>}
          </AccordionTab>
        ))}
      </Accordion>

      <Dialog
        header="Позиция"
        className="item-dialog"
        visible={isOpen}
        style={{ width: 'min(90vw, 560px)' }}
        footer={footerContent}
        onHide={() => setIsOpen(false)}
        dismissableMask
        onShow={() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
          }
        }}
      >
        <div className="item-form">
          <div className="item-form__title">
            <span>{item.name}</span>
            {item.commented && (
              <input
                placeholder="дополнение..."
                value={comment}
                onChange={(e) => {
                  const newComment = e.target.value;
                  setComment(newComment);
                  setItem((prev) => ({ ...prev, comment: newComment }));
                }}
              />
            )}
          </div>

          <div className="quantity-field">
            {item.counted ? (
              <input
                ref={inputRef}
                type="text"
                value={count > 0 ? count : ''}
                onFocus={handleFocus}
                onClick={handleFocus}
                onChange={(e) => {
                  const newCount = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
                  setCount(newCount);
                  setItem((prev) => ({ ...prev, count: newCount }));
                }}
                inputMode="numeric"
                pattern="[0-9]*"
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
