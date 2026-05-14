import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import {
  CATALOG_SECTIONS,
  CATALOG_SECTION_MAP,
  PURCHASE_CATEGORY_OPTIONS,
  UNIT_OPTIONS,
  getFirstCatalogGroup,
} from '../common/catalogSchema';
import { normalizeQuantityInput } from '../common/quantity';

const getSectionGroups = (section) => CATALOG_SECTION_MAP[section]?.groups || [];

const CatalogAdminDialog = ({
  visible,
  mode,
  draft,
  saving,
  error,
  onChange,
  onClose,
  onSave,
  onDelete,
  onDuplicate,
}) => {
  if (!draft) {
    return null;
  }

  const sectionGroups = getSectionGroups(draft.section);
  const canSave = draft.name.trim() && draft.section && draft.group && draft.category;
  const isDuplicate = mode === 'duplicate';
  const isEdit = mode === 'edit';

  const setDraft = (patch) => onChange({ ...draft, ...patch });
  const setDestination = (patch) => {
    const nextDraft = { ...draft, ...patch };
    if (patch.group) {
      nextDraft.category = patch.group;
    }
    onChange(nextDraft);
  };

  const getHeader = () => {
    if (isDuplicate) {
      return 'Дублировать позицию';
    }

    return isEdit ? 'Редактировать позицию' : 'Добавить позицию';
  };

  const getSaveLabel = () => {
    if (saving) {
      return 'Сохраняю...';
    }

    if (isDuplicate) {
      return 'Дублировать';
    }

    return isEdit ? 'Сохранить' : 'Добавить';
  };

  const footer = (
    <div className="catalog-admin-actions">
      {isEdit && (
        <Button
          label="Удалить"
          icon="pi pi-trash"
          className="p-button-danger"
          disabled={saving}
          onClick={onDelete}
        />
      )}
      {isEdit && (
        <Button
          label="Дублировать"
          icon="pi pi-copy"
          className="p-button-secondary"
          disabled={saving}
          onClick={onDuplicate}
        />
      )}
      <Button
        label={getSaveLabel()}
        icon={saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        disabled={!canSave || saving}
        onClick={onSave}
      />
    </div>
  );

  return (
    <Dialog
      header={getHeader()}
      className="catalog-admin-dialog"
      visible={visible}
      position="bottom"
      style={{ width: 'min(92vw, 620px)' }}
      footer={footer}
      onHide={onClose}
      dismissableMask={!saving}
      draggable={false}
      resizable={false}
    >
      <form
        className="catalog-admin-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSave) {
            onSave();
          }
        }}
      >
        <label>
          <span>Название</span>
          <input
            type="text"
            value={draft.name}
            autoFocus
            disabled={isDuplicate}
            onChange={(event) => setDraft({ name: event.target.value })}
          />
        </label>

        <div className="catalog-admin-form__row">
          <label>
            <span>Раздел</span>
            <select
              value={draft.section}
              onChange={(event) => {
                const section = event.target.value;
                const group = getFirstCatalogGroup(section);
                setDestination({
                  section,
                  group,
                });
              }}
            >
              {CATALOG_SECTIONS.map((section) => (
                <option key={section.value} value={section.value}>
                  {section.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Магазин</span>
            <select
              value={draft.group}
              onChange={(event) => setDestination({ group: event.target.value })}
            >
              {sectionGroups.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="catalog-admin-form__row">
          <label>
            <span>Категория итога</span>
            <select
              value={draft.category}
              disabled={isDuplicate}
              onChange={(event) => setDraft({ category: event.target.value })}
            >
              {PURCHASE_CATEGORY_OPTIONS.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Ед.</span>
            <select
              value={draft.type}
              disabled={isDuplicate}
              onChange={(event) => setDraft({ type: event.target.value })}
            >
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit || 'empty'} value={unit}>
                  {unit || 'без ед.'}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="catalog-admin-switches">
          <label>
            <input
              type="checkbox"
              checked={draft.counted}
              disabled={isDuplicate}
              onChange={(event) => setDraft({ counted: event.target.checked })}
            />
            <span>Учитывать количество</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={draft.commented}
              disabled={isDuplicate}
              onChange={(event) => setDraft({ commented: event.target.checked })}
            />
            <span>Разрешить комментарий</span>
          </label>
        </div>

        <label>
          <span>Базовое значение</span>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={draft.count}
            disabled={isDuplicate}
            onChange={(event) => setDraft({ count: normalizeQuantityInput(event.target.value) })}
          />
        </label>

        {saving && <p className="catalog-admin-form__status">Отправляю изменения...</p>}
        {error && <p className="catalog-admin-form__error">{String(error)}</p>}
      </form>
    </Dialog>
  );
};

export default CatalogAdminDialog;
