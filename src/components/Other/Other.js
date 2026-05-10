import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addVegetableAndPersist } from '../../Redux/vegetSlice';
import withOrderProps from '../withOrderProps';
import { impact } from '../../common/device';

const OTHER_CATEGORIES = [
  { value: 'other', label: 'Иное' },
  { value: 'lyuda', label: 'Люда' },
  { value: 'duzina', label: 'Дюжина' },
  { value: 'vegetables', label: 'Овощи' },
  { value: 'mangal', label: 'Мясо' },
  { value: 'house', label: 'Хоз товары' },
];

const UNIT_OPTIONS = ['шт.', 'кг.', 'г.', 'пач.', 'уп.', 'б.', 'пуч.', 'пласт.', 'полос.', 'ящ.',];

const Other = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [count, setCount] = useState('1');
  const [type, setType] = useState('шт.');
  const [saved, setSaved] = useState(false);

  const normalizedName = name.trim();
  const normalizedCount = Number(count) || 1;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!normalizedName) {
      return;
    }

    const item = {
      name: normalizedName,
      count: normalizedCount,
      counted: true,
      comment: '',
      commented: false,
      type,
      category,
      sourceKey: ['other', category, normalizedName, type, true].join('|'),
    };

    impact();
    dispatch(addVegetableAndPersist(item));
    setName('');
    setCount('1');
    setSaved(true);
  };

  return (
    <div className="section-screen">
      <header className="section-header">
        <button type="button" onClick={() => navigate('/')} aria-label="Назад">
          <i className="pi pi-arrow-left" aria-hidden="true" />
        </button>
        <div>
          <span>Раздел</span>
          <h1>Иное</h1>
        </div>
      </header>

      <form className="manual-item-form" onSubmit={handleSubmit}>
        <label>
          <span>Позиция</span>
          <input
            type="text"
            value={name}
            placeholder="Свободная позиция..."
            autoFocus
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
          />
        </label>

        <label>
          <span>Магазин</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setSaved(false);
            }}
          >
            {OTHER_CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="manual-item-form__row">
          <label>
            <span>Количество</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={count}
              onChange={(event) => {
                setCount(event.target.value.replace(/\D/g, ''));
                setSaved(false);
              }}
            />
          </label>

          <label>
            <span>Ед.</span>
            <select
              value={type}
              onChange={(event) => {
                setType(event.target.value);
                setSaved(false);
              }}
            >
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" disabled={!normalizedName}>
          Добавить
        </button>

        <p className="manual-item-form__status">{saved ? 'Добавлено в итог' : ''}</p>
      </form>
    </div>
  );
};

export default withOrderProps(Other);
