import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import localCatalog from '../common/data/catalog.json';
import { CATALOG_SECTIONS, getFirstCatalogGroup } from '../common/catalogSchema';

const normalizeBaseUrl = (value) => {
  const normalized = String(value || '').trim();

  if (!normalized || normalized === 'undefined' || normalized === 'null') {
    return '';
  }

  return normalized.replace(/\/$/, '');
};

const BASE_URL = normalizeBaseUrl(process.env.REACT_APP_URL);
const FILE = 'catalog.json';
const GET_URL = BASE_URL ? `${BASE_URL}/${FILE}` : '';
const SAVE_URL = BASE_URL ? `${BASE_URL}/api/save/${FILE}` : '';
const CATALOG_VERSION = 1;

const createEmptySections = () =>
  CATALOG_SECTIONS.reduce((sections, section) => {
    sections[section.value] = section.groups.reduce((groups, group) => {
      groups[group.value] = [];
      return groups;
    }, {});
    return sections;
  }, {});

const normalizeItem = (item = {}) => ({
  name: String(item.name || '').trim(),
  count: Number(item.count) || 0,
  commented: Boolean(item.commented),
  counted: Boolean(item.counted),
  type: String(item.type || ''),
  category: String(item.category || 'other'),
});

const normalizeCatalog = (data) => {
  const sections = createEmptySections();

  CATALOG_SECTIONS.forEach((section) => {
    section.groups.forEach((group) => {
      const items = data?.sections?.[section.value]?.[group.value];
      sections[section.value][group.value] = Array.isArray(items)
        ? items.map(normalizeItem).filter((item) => item.name)
        : [];
    });
  });

  return {
    version: Number(data?.version) || CATALOG_VERSION,
    sections,
  };
};

const getCatalogAfterMutation = (state) => ({
  version: state.version,
  sections: state.sections,
});

const removeCatalogItem = (sections, path) => {
  const items = sections[path.section]?.[path.group];

  if (!items || path.index < 0 || path.index >= items.length) {
    return null;
  }

  const [removed] = items.splice(path.index, 1);
  return removed;
};

const insertCatalogItem = (sections, path, item, index) => {
  const section = path.section;
  const group = path.group || getFirstCatalogGroup(section);

  if (!sections[section]) {
    sections[section] = {};
  }

  if (!sections[section][group]) {
    sections[section][group] = [];
  }

  const nextItem = normalizeItem(item);

  if (Number.isInteger(index) && index >= 0 && index <= sections[section][group].length) {
    sections[section][group].splice(index, 0, nextItem);
    return;
  }

  sections[section][group].push(nextItem);
};

const moveCatalogItem = (sections, from, to) => {
  const items = sections[from.section]?.[from.group];

  if (
    !items ||
    from.section !== to.section ||
    from.group !== to.group ||
    from.index === to.index ||
    from.index < 0 ||
    to.index < 0 ||
    from.index >= items.length ||
    to.index >= items.length
  ) {
    return;
  }

  const [moved] = items.splice(from.index, 1);
  items.splice(to.index, 0, moved);
};

export const fetchCatalog = createAsyncThunk(
  'catalog/fetch',
  async (_, { rejectWithValue }) => {
    if (!GET_URL) {
      return normalizeCatalog(localCatalog);
    }

    try {
      const { data } = await axios.get(`${GET_URL}?t=${Date.now()}`);
      return normalizeCatalog(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const saveCatalog = createAsyncThunk(
  'catalog/save',
  async (catalog, { rejectWithValue }) => {
    if (!SAVE_URL) {
      return catalog;
    }

    try {
      await axios.put(SAVE_URL, catalog);
      return catalog;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    ...normalizeCatalog(localCatalog),
    status: 'idle',
    saveStatus: 'idle',
    error: null,
  },
  reducers: {
    addCatalogItem(state, { payload }) {
      insertCatalogItem(state.sections, payload.to, payload.item);
    },
    updateCatalogItem(state, { payload }) {
      const removed = removeCatalogItem(state.sections, payload.from);
      const shouldKeepIndex =
        payload.from.section === payload.to.section &&
        payload.from.group === payload.to.group;
      insertCatalogItem(
        state.sections,
        payload.to,
        payload.item || removed,
        shouldKeepIndex ? payload.from.index : undefined
      );
    },
    deleteCatalogItem(state, { payload }) {
      removeCatalogItem(state.sections, payload);
    },
    reorderCatalogItem(state, { payload }) {
      moveCatalogItem(state.sections, payload.from, payload.to);
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCatalog.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.version = payload.version;
        state.sections = payload.sections;
        state.error = null;
      })
      .addCase(fetchCatalog.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })
      .addCase(saveCatalog.pending, (state) => {
        state.saveStatus = 'loading';
      })
      .addCase(saveCatalog.fulfilled, (state) => {
        state.saveStatus = 'succeeded';
        state.error = null;
      })
      .addCase(saveCatalog.rejected, (state, { payload }) => {
        state.saveStatus = 'failed';
        state.error = payload;
      }),
});

export const addCatalogItemAndPersist = (payload) => async (dispatch, getState) => {
  dispatch(catalogSlice.actions.addCatalogItem(payload));
  const catalog = getCatalogAfterMutation(getState().catalog);
  await dispatch(saveCatalog(catalog)).unwrap();
};

export const updateCatalogItemAndPersist = (payload) => async (dispatch, getState) => {
  dispatch(catalogSlice.actions.updateCatalogItem(payload));
  const catalog = getCatalogAfterMutation(getState().catalog);
  await dispatch(saveCatalog(catalog)).unwrap();
};

export const deleteCatalogItemAndPersist = (payload) => async (dispatch, getState) => {
  dispatch(catalogSlice.actions.deleteCatalogItem(payload));
  const catalog = getCatalogAfterMutation(getState().catalog);
  await dispatch(saveCatalog(catalog)).unwrap();
};

export const reorderCatalogItemAndPersist = (payload) => async (dispatch, getState) => {
  dispatch(catalogSlice.actions.reorderCatalogItem(payload));
  const catalog = getCatalogAfterMutation(getState().catalog);
  await dispatch(saveCatalog(catalog)).unwrap();
};

export const selectCatalogSection = (state, section) => state.catalog.sections[section] || {};
export const selectCatalogStatus = (state) => state.catalog.status;
export const selectCatalogError = (state) => state.catalog.error;

export default catalogSlice.reducer;
