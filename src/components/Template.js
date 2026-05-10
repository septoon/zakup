import React, { useCallback, useState, useEffect, useRef } from 'react';
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
import {
  addCatalogItemAndPersist,
  deleteCatalogItemAndPersist,
  selectCatalogError,
  selectCatalogSection,
  selectCatalogStatus,
  updateCatalogItemAndPersist,
} from '../Redux/catalogSlice';

import { impact } from '../common/device';
import {
  CATALOG_ADD_EVENT,
  CATALOG_SECTION_MAP,
  getFirstCatalogGroup,
} from '../common/catalogSchema';
import { useAdminAccess } from '../common/useAdminAccess';
import CatalogAdminDialog from './CatalogAdminDialog';

const createCatalogDraft = (nextSection, nextGroup, sourceItem = {}) => ({
  section: nextSection,
  group: nextGroup || getFirstCatalogGroup(nextSection),
  name: sourceItem.name || '',
  count: String(sourceItem.count ?? 0),
  commented: Boolean(sourceItem.commented),
  counted: sourceItem.counted ?? true,
  type: sourceItem.type || 'шт.',
  category: sourceItem.category || nextGroup || 'other',
});

const Template = ({ sectionSource }) => {
  const dispatch = useDispatch();

  const selectedItems = useSelector(selectVegetablesItems);
  const catalogSection = useSelector((state) => selectCatalogSection(state, sectionSource));
  const catalogStatus = useSelector(selectCatalogStatus);
  const catalogError = useSelector(selectCatalogError);
  const isAdmin = useAdminAccess();

  const [isOpen, setIsOpen]   = useState(false);
  const [item, setItem]       = useState({});
  const [count, setCount]     = useState(0);
  const [comment, setComment] = useState('');
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [adminVisible, setAdminVisible] = useState(false);
  const [adminMode, setAdminMode] = useState('add');
  const [adminPath, setAdminPath] = useState(null);
  const [adminDraft, setAdminDraft] = useState(null);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminError, setAdminError] = useState('');

  const [search, setSearch] = useState('');
  const matchesSearch = (str) =>
    str.toLowerCase().includes(search.toLowerCase().trim());

  const inputRef = useRef(null);
  const keyboardPrimerRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isOpen]);

  const openAddDialog = useCallback((nextSection = sectionSource) => {
    const nextGroup = getFirstCatalogGroup(nextSection);
    setAdminMode('add');
    setAdminPath(null);
    setAdminDraft(createCatalogDraft(nextSection, nextGroup, { category: nextGroup }));
    setAdminError('');
    setAdminVisible(true);
  }, [sectionSource]);

  useEffect(() => {
    const handleCatalogAdd = (event) => {
      if (event.detail?.section === sectionSource) {
        openAddDialog(sectionSource);
      }
    };

    window.addEventListener(CATALOG_ADD_EVENT, handleCatalogAdd);
    return () => window.removeEventListener(CATALOG_ADD_EVENT, handleCatalogAdd);
  }, [openAddDialog, sectionSource]);

  const addVegets = (obj) => {
    setIsOpen(false);
    dispatch(addVegetableAndPersist(obj));
  };

  const removeVegets = (obj) => {
    setIsOpen(false);
    dispatch(removeVegetableAndPersist(obj));
  };

  const onTabChange = (e) => setActiveIndexes(e.index);

  const handleOpenDialog = () => setIsOpen(true);

  const primeKeyboard = (nextItem) => {
    if (!nextItem.counted) {
      return;
    }

    keyboardPrimerRef.current?.focus({ preventScroll: true });
  };

  const getCatalogSourceKey = (nextItem) =>
    [sectionSource, nextItem.category, nextItem.label, nextItem.type, nextItem.counted].join('|');

  const getSelectedSourceItem = (nextItem) => {
    const sourceKey = getCatalogSourceKey(nextItem);
    const selectedItem = selectedItems.find((selected) => {
      return (
        selected.category === nextItem.category &&
        selected.name === nextItem.label &&
        selected.type === nextItem.type &&
        selected.counted === nextItem.counted &&
        selected.sourceSelections?.[sourceKey]
      );
    });

    if (!selectedItem) {
      return null;
    }

    return {
      ...selectedItem,
      ...selectedItem.sourceSelections[sourceKey],
      sourceKey,
    };
  };

  const openEditDialog = (sourceItem, group, index) => {
    setAdminMode('edit');
    setAdminPath({ section: sectionSource, group, index });
    setAdminDraft(createCatalogDraft(sectionSource, group, sourceItem));
    setAdminError('');
    setAdminVisible(true);
  };

  const openDuplicateDialog = () => {
    setAdminMode('duplicate');
    setAdminError('');
  };

  const getAdminPayload = () => ({
    to: {
      section: adminDraft.section,
      group: adminDraft.group,
    },
    item: {
      name: adminDraft.name.trim(),
      count: Number(adminDraft.count) || 0,
      commented: Boolean(adminDraft.commented),
      counted: Boolean(adminDraft.counted),
      type: adminDraft.type,
      category: adminDraft.category,
    },
  });

  const saveAdminDraft = async () => {
    setAdminSaving(true);
    setAdminError('');

    try {
      const payload = getAdminPayload();
      if (adminMode === 'edit') {
        await dispatch(updateCatalogItemAndPersist({ ...payload, from: adminPath }));
      } else {
        await dispatch(addCatalogItemAndPersist(payload));
      }
      setAdminVisible(false);
    } catch (err) {
      setAdminError(err?.message || err || 'Не удалось сохранить');
    } finally {
      setAdminSaving(false);
    }
  };

  const deleteAdminItem = async () => {
    if (!window.confirm('Удалить позицию из catalog.json?')) {
      return;
    }

    setAdminSaving(true);
    setAdminError('');

    try {
      await dispatch(deleteCatalogItemAndPersist(adminPath));
      setAdminVisible(false);
    } catch (err) {
      setAdminError(err?.message || err || 'Не удалось удалить позицию');
    } finally {
      setAdminSaving(false);
    }
  };

  const itemRenderer = (item, index, sourceItem, group) => {
    const sourceKey = getCatalogSourceKey(item);
    const selectedItem = getSelectedSourceItem(item);

    return (
      <div
        key={item.label + index}
        className={`catalog-row ${selectedItem ? 'catalog-row--selected' : ''}`}
      >
        <button
          type="button"
          className="catalog-row__select"
          onClick={() => {
            primeKeyboard(item);
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
              sourceKey,
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
        {isAdmin && (
          <button
            type="button"
            className="catalog-row__edit"
            aria-label={`Редактировать ${item.label}`}
            onClick={() => {
              impact();
              openEditDialog(sourceItem, group, index);
            }}
          >
            <i className="pi pi-pencil" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  };

  const sourceSections = (CATALOG_SECTION_MAP[sectionSource]?.groups || [])
    .map((group) => ({
      group: group.value,
      header: group.label,
      data: catalogSection[group.value] || [],
    }))
    .filter((section) => section.data);

  const items = sourceSections.map((section) => ({
    header: section.header,
    content: section.data.filter((sourceItem) => matchesSearch(sourceItem.name)).map((sourceItem, idx) =>
      itemRenderer(
        {
          label: sourceItem.name,
          commented: sourceItem.commented,
          counted: sourceItem.counted,
          type: sourceItem.type,
          category: sourceItem.category,
        },
        idx,
        sourceItem,
        section.group
      )
    ),
  }));

  const getSearchActiveIndexes = (nextSearch) => {
    const query = nextSearch.toLowerCase().trim();

    if (!query) {
      return [];
    }

    return sourceSections.reduce((acc, section, index) => {
      const hasMatches = section.data.some((sectionItem) =>
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
        disabled={!selectedItems.some((selectedItem) => selectedItem.sourceSelections?.[item.sourceKey])}
        onClick={() => {
          impact([20, 20, 20]);
          removeVegets(item);
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
      />
    </div>
  );

  const handleFocus = (e) => e.target.select();

  return (
    <div className="catalog-screen">
      <input
        ref={keyboardPrimerRef}
        className="keyboard-primer"
        type="text"
        inputMode="numeric"
        aria-hidden="true"
        tabIndex={-1}
      />
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
      {catalogStatus === 'loading' && (
        <div className="catalog-state">
          <i className="pi pi-spin pi-spinner" aria-hidden="true" />
          <span>Загружаю позиции...</span>
        </div>
      )}
      {catalogStatus === 'failed' && (
        <div className="catalog-state catalog-state--error">
          <i className="pi pi-exclamation-triangle" aria-hidden="true" />
          <span>Позиции с API не загрузились, показана локальная копия.</span>
        </div>
      )}
      {catalogError && catalogStatus === 'failed' && (
        <p className="catalog-error">{String(catalogError)}</p>
      )}
      <Accordion
        multiple
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
            window.requestAnimationFrame(() => {
              inputRef.current?.focus();
              inputRef.current?.select();
            });
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
      <CatalogAdminDialog
        visible={adminVisible}
        mode={adminMode}
        draft={adminDraft}
        saving={adminSaving}
        error={adminError}
        onChange={setAdminDraft}
        onClose={() => {
          if (!adminSaving) {
            setAdminVisible(false);
          }
        }}
        onSave={saveAdminDraft}
        onDelete={deleteAdminItem}
        onDuplicate={openDuplicateDialog}
      />
    </div>
  );
};

export default Template;
