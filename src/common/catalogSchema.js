export const CATALOG_SECTIONS = [
  {
    value: 'kitchen',
    label: 'Кухня',
    groups: [
      { value: 'vegetables', label: 'Овощи' },
      { value: 'duzina', label: 'Дюжина' },
      { value: 'lyuda', label: 'Люда' },
    ],
  },
  {
    value: 'bar',
    label: 'Бар',
    groups: [
      { value: 'vegetables', label: 'Овощи' },
      { value: 'duzina', label: 'Дюжина' },
      { value: 'house', label: 'Хоз товары' },
    ],
  },
  {
    value: 'mangal',
    label: 'Мангал',
    groups: [
      { value: 'mangal', label: 'Мясо' },
      { value: 'vegetables', label: 'Овощи' },
      { value: 'duzina', label: 'Дюжина' },
      { value: 'lyuda', label: 'Люда' },
    ],
  },
  {
    value: 'house',
    label: 'Хоз товары',
    groups: [{ value: 'house', label: 'Хоз товары' }],
  },
];

export const CATALOG_ADD_EVENT = 'zakup-catalog-add';

export const CATALOG_SECTION_MAP = CATALOG_SECTIONS.reduce((acc, section) => {
  acc[section.value] = section;
  return acc;
}, {});

export const CATALOG_SECTION_BY_PATH = {
  '/kitchen': 'kitchen',
  '/bar': 'bar',
  '/mangal': 'mangal',
  '/house': 'house',
  '/zakup/kitchen': 'kitchen',
  '/zakup/bar': 'bar',
  '/zakup/mangal': 'mangal',
  '/zakup/house': 'house',
};

export const PURCHASE_CATEGORY_OPTIONS = [
  { value: 'vegetables', label: 'Овощи' },
  { value: 'duzina', label: 'Дюжина' },
  { value: 'lyuda', label: 'Люда' },
  { value: 'mangal', label: 'Мясо' },
  { value: 'house', label: 'Хоз товары' },
  { value: 'other', label: 'Иное' },
];

export const UNIT_OPTIONS = ['шт.', 'кг.', 'г.', 'пач.', 'уп.', 'б.', 'пуч.', ''];

export const getFirstCatalogGroup = (section) => CATALOG_SECTION_MAP[section]?.groups[0]?.value || '';
