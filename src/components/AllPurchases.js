import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchVegetables,
  replacePurchaseSectionAndPersist,
  selectPurchases,
  selectVegetablesError,
  selectVegetablesStatus,
} from '../Redux/vegetSlice';
import { ADMIN_ACCESS_EVENT, hasAdminAccess } from '../common/adminAccess';
import {
  formatSectionText,
  parseSectionText,
  PURCHASE_SECTIONS,
} from '../common/purchaseSections';
import { impact } from '../common/device';
import { formatDateLabel, getPurchaseDateKey } from '../common/purchaseDate';

const AllPurchases = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const purchases = useSelector(selectPurchases);
  const status = useSelector(selectVegetablesStatus);
  const error = useSelector(selectVegetablesError);
  const [isAdmin, setIsAdmin] = useState(hasAdminAccess);
  const [selectedDate, setSelectedDate] = useState('');
  const [drafts, setDrafts] = useState({});
  const [copiedSection, setCopiedSection] = useState('');
  const [copyErrorSection, setCopyErrorSection] = useState('');
  const [savedSection, setSavedSection] = useState('');
  const [editedSections, setEditedSections] = useState({});
  const dateInputRef = useRef(null);

  const dates = useMemo(
    () => Object.keys(purchases).sort((a, b) => b.localeCompare(a)),
    [purchases]
  );

  const selectedPurchase = useMemo(
    () => purchases[selectedDate] ?? { date: selectedDate, items: [] },
    [purchases, selectedDate]
  );

  useEffect(() => {
    dispatch(fetchVegetables());
  }, [dispatch]);

  useEffect(() => {
    const handleAdminAccessChange = () => setIsAdmin(hasAdminAccess());

    window.addEventListener(ADMIN_ACCESS_EVENT, handleAdminAccessChange);
    window.addEventListener('storage', handleAdminAccessChange);

    return () => {
      window.removeEventListener(ADMIN_ACCESS_EVENT, handleAdminAccessChange);
      window.removeEventListener('storage', handleAdminAccessChange);
    };
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(getPurchaseDateKey());
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedPurchase) {
      return;
    }

    const nextDrafts = PURCHASE_SECTIONS.reduce((acc, section) => {
      const items = selectedPurchase.items.filter((item) => item.category === section.category);
      acc[section.category] = formatSectionText(items);
      return acc;
    }, {});

    setDrafts(nextDrafts);
    setEditedSections({});
  }, [selectedDate, selectedPurchase]);

  useEffect(() => {
    if (!selectedDate) {
      return undefined;
    }

    const changedCategories = Object.keys(editedSections).filter((category) => editedSections[category]);

    if (!changedCategories.length) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      changedCategories.forEach((category) => {
        dispatch(
          replacePurchaseSectionAndPersist({
            dateKey: selectedDate,
            category,
            items: parseSectionText(drafts[category] ?? '', category),
          })
        );
        setSavedSection(category);
      });
      setEditedSections((current) =>
        changedCategories.reduce((acc, category) => {
          acc[category] = false;
          return acc;
        }, { ...current })
      );
    }, 650);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, drafts, editedSections, selectedDate]);

  const copyWithFallback = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  };

  const handleCopy = async (section) => {
    const text = drafts[section.category] ?? '';
    let copied = false;

    if (!text) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (err) {
      copied = false;
    }

    if (!copied) {
      try {
        copied = copyWithFallback(text);
      } catch (err) {
        copied = false;
      }
    }

    setCopiedSection(copied ? section.category : '');
    setCopyErrorSection(copied ? '' : section.category);
    impact();
  };

  const handleDateChange = (event) => {
    const dateKey = event.target.value || getPurchaseDateKey();
    setSelectedDate(dateKey);
  };

  if (!isAdmin) {
    return (
      <div className="section-screen">
        <header className="section-header">
          <button type="button" onClick={() => navigate('/')} aria-label="Назад">
            <i className="pi pi-arrow-left" aria-hidden="true" />
          </button>
          <div>
            <span>Архив</span>
            <h1>Все закупы</h1>
          </div>
        </header>
        <p className="empty-state">Нужны админ-права</p>
      </div>
    );
  }

  return (
    <div className="section-screen purchases-screen">
      <header className="section-header">
        <button type="button" onClick={() => navigate('/')} aria-label="Назад">
          <i className="pi pi-arrow-left" aria-hidden="true" />
        </button>
        <div>
          <span>Архив</span>
          <h1>Все закупы</h1>
        </div>
      </header>

      {status === 'failed' && <p className="empty-state">Ошибка: {String(error)}</p>}

      <div className="date-picker">
        <button
          type="button"
          onClick={() => {
            const input = dateInputRef.current;
            if (!input) return;

            if (input.showPicker) {
              input.showPicker();
            } else {
              input.focus();
              input.click();
            }
          }}
        >
          {selectedDate ? formatDateLabel(selectedDate) : 'Выберите дату'}
        </button>
        <input ref={dateInputRef} type="date" value={selectedDate} onChange={handleDateChange} />
      </div>

      {!dates.length && <p className="empty-state">Закупов пока нет</p>}

      <div className="purchase-sections">
        {PURCHASE_SECTIONS.map((section) => (
          <section className="purchase-section" key={section.category}>
            <header>
              <h2>{section.title}</h2>
              <button
                type="button"
                onClick={() => handleCopy(section)}
                aria-label={`Скопировать ${section.title}`}
              >
                <i className="pi pi-copy" aria-hidden="true" />
              </button>
            </header>
            <textarea
              value={drafts[section.category] ?? ''}
              onChange={(event) => {
                setDrafts((current) => ({
                  ...current,
                  [section.category]: event.target.value,
                }));
                setEditedSections((current) => ({
                  ...current,
                  [section.category]: true,
                }));
                setSavedSection('');
              }}
              placeholder="Список пуст"
            />
            <div className="purchase-section__footer">
              <span>
                {copyErrorSection === section.category
                  ? 'Не удалось скопировать'
                  : copiedSection === section.category
                  ? 'Скопировано'
                  : editedSections[section.category]
                  ? 'Сохраняется...'
                  : savedSection === section.category
                  ? 'Сохранено'
                  : ''}
              </span>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AllPurchases;
