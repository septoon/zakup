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
  reorderCatalogItemAndPersist,
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
import { normalizeQuantityInput, parseQuantity } from '../common/quantity';
import CatalogAdminDialog from './CatalogAdminDialog';

const createCatalogDraft = (nextSection, nextGroup, sourceItem = {}) => ({
  section: nextSection,
  group: nextGroup || getFirstCatalogGroup(nextSection),
  name: sourceItem.name || '',
  count: String(sourceItem.count ?? 1),
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
  const [count, setCount]     = useState('0');
  const [comment, setComment] = useState('');
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [adminVisible, setAdminVisible] = useState(false);
  const [adminMode, setAdminMode] = useState('add');
  const [adminPath, setAdminPath] = useState(null);
  const [adminDraft, setAdminDraft] = useState(null);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [reorderError, setReorderError] = useState('');
  const [dragPath, setDragPath] = useState(null);
  const [dropPath, setDropPath] = useState(null);

  const [search, setSearch] = useState('');
  const matchesSearch = (str) =>
    str.toLowerCase().includes(search.toLowerCase().trim());

  const inputRef = useRef(null);
  const keyboardPrimerRef = useRef(null);
  const reorderDragRef = useRef({ path: null, pointerId: null });

  const dismissKeyboard = useCallback(() => {
    const activeElement = document.activeElement;

    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }

    inputRef.current?.blur();
    keyboardPrimerRef.current?.blur();
    window.getSelection?.()?.removeAllRanges?.();
  }, []);

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

  const closeItemDialog = useCallback(() => {
    dismissKeyboard();
    setIsOpen(false);
    window.setTimeout(dismissKeyboard, 0);
  }, [dismissKeyboard]);

  const addVegets = (obj) => {
    closeItemDialog();
    dispatch(addVegetableAndPersist(obj));
  };

  const removeVegets = (obj) => {
    closeItemDialog();
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

  const isSameCatalogPath = (first, second) =>
    first?.section === second?.section &&
    first?.group === second?.group &&
    first?.index === second?.index;

  const canDropCatalogItem = (from, to) =>
    from?.section === to?.section &&
    from?.group === to?.group &&
    Number.isInteger(from?.index) &&
    Number.isInteger(to?.index) &&
    from.index !== to.index;

  const resetCatalogDrag = () => {
    reorderDragRef.current = { path: null, pointerId: null };
    setDragPath(null);
    setDropPath(null);
  };

  const getCatalogPathFromPoint = (clientX, clientY) => {
    const row = document
      .elementFromPoint(clientX, clientY)
      ?.closest('[data-catalog-row="true"]');

    if (!row) {
      return null;
    }

    return {
      section: row.dataset.catalogSection,
      group: row.dataset.catalogGroup,
      index: Number(row.dataset.catalogIndex),
    };
  };

  const moveCatalogItem = async (from, to) => {
    if (!canDropCatalogItem(from, to)) {
      return;
    }

    setReorderError('');

    try {
      await dispatch(reorderCatalogItemAndPersist({ from, to }));
      impact([12, 24]);
    } catch (err) {
      setReorderError(err?.message || err || 'Не удалось сохранить порядок');
    }
  };

  const startCatalogDrag = (event, path) => {
    if (!isAdmin) {
      return;
    }

    reorderDragRef.current = { path, pointerId: event.pointerId };
    setDragPath(path);
    setDropPath(null);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    impact(8);
  };

  const updateCatalogDrag = (event) => {
    const { path, pointerId } = reorderDragRef.current;

    if (!path || pointerId !== event.pointerId) {
      return;
    }

    const nextDropPath = getCatalogPathFromPoint(event.clientX, event.clientY);
    setDropPath(canDropCatalogItem(path, nextDropPath) ? nextDropPath : null);
    event.preventDefault();
  };

  const finishCatalogDrag = (event) => {
    const { path, pointerId } = reorderDragRef.current;

    if (!path || pointerId !== event.pointerId) {
      return;
    }

    const nextDropPath = getCatalogPathFromPoint(event.clientX, event.clientY);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    resetCatalogDrag();
    void moveCatalogItem(path, nextDropPath);
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
    const path = { section: sectionSource, group, index };
    const sourceKey = getCatalogSourceKey(item);
    const selectedItem = getSelectedSourceItem(item);
    const metaText = selectedItem
      ? item.counted && selectedItem.count > 0
        ? `${selectedItem.count} ${selectedItem.type}`
        : 'выбрано'
      : item.counted
      ? item.type
      : '';

    return (
      <div
        key={item.label + index}
        className={[
          'catalog-row',
          isAdmin ? 'catalog-row--admin' : '',
          selectedItem ? 'catalog-row--selected' : '',
          isSameCatalogPath(dragPath, path) ? 'catalog-row--dragging' : '',
          isSameCatalogPath(dropPath, path) ? 'catalog-row--drop-target' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-catalog-row="true"
        data-catalog-section={sectionSource}
        data-catalog-group={group}
        data-catalog-index={index}
      >
        {isAdmin && (
          <button
            type="button"
            className="catalog-row__drag"
            aria-label={`Переместить ${item.label}`}
            onPointerDown={(event) => startCatalogDrag(event, path)}
            onPointerMove={updateCatalogDrag}
            onPointerUp={finishCatalogDrag}
            onPointerCancel={resetCatalogDrag}
          >
            <i className="pi pi-bars" aria-hidden="true" />
          </button>
        )}
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
            setCount(String(selectedItem ? selectedItem.count : item.counted ? 1 : 0));
            setComment(selectedItem ? selectedItem.comment : '');
          }}
        >
          <span className="catalog-row__name">{item.label}</span>
          {metaText && <span className="catalog-row__meta">{metaText}</span>}
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
    content: section.data
      .map((sourceItem, idx) => ({ sourceItem, idx }))
      .filter(({ sourceItem }) => matchesSearch(sourceItem.name))
      .map(({ sourceItem, idx }) =>
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

  const quantityCount = parseQuantity(count);

  const footerContent = (
    <div className="dialog-actions">
      <Button
        label="Удалить"
        icon="pi pi-times"
        className="p-button-danger"
        disabled={!selectedItems.some((selectedItem) => selectedItem.sourceSelections?.[item.sourceKey])}
        onPointerDown={dismissKeyboard}
        onMouseDown={dismissKeyboard}
        onTouchStart={dismissKeyboard}
        onClick={() => {
          impact([20, 20, 20]);
          removeVegets(item);
        }}
      />
      <Button
        label="Добавить"
        icon="pi pi-check"
        onPointerDown={dismissKeyboard}
        onMouseDown={dismissKeyboard}
        onTouchStart={dismissKeyboard}
        onClick={() => {
          impact([20, 20, 20]);
          item.counted
            ? quantityCount > 0 && addVegets({ ...item, count: quantityCount, comment })
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
        inputMode="decimal"
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
      {reorderError && <p className="catalog-error">{String(reorderError)}</p>}
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
        onHide={closeItemDialog}
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
            <input
              placeholder="комментарий..."
              value={comment}
              onChange={(e) => {
                const newComment = e.target.value;
                setComment(newComment);
                setItem((prev) => ({ ...prev, comment: newComment }));
              }}
            />
          </div>

          {item.counted && (
            <div className="quantity-field">
              <input
                ref={inputRef}
                type="text"
                value={count}
                onFocus={handleFocus}
                onClick={handleFocus}
                onChange={(e) => {
                  const newCount = normalizeQuantityInput(e.target.value);
                  setCount(newCount);
                  setItem((prev) => ({ ...prev, count: parseQuantity(newCount) }));
                }}
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
              />
              <span>{item.type}</span>
            </div>
            )}
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
