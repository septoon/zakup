// src/Redux/vegetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getPurchaseDateKey } from '../common/purchaseDate';

/* ─────── 0. Константы ─────── */
const normalizeBaseUrl = (value) => {
  const normalized = String(value || '').trim();

  if (!normalized || normalized === 'undefined' || normalized === 'null') {
    return '';
  }

  return normalized.replace(/\/$/, '');
};

const BASE_URL   = normalizeBaseUrl(process.env.REACT_APP_URL);
const FILE       = 'zakup.json';
const GET_URL    = BASE_URL ? `${BASE_URL}/${FILE}` : '';
const SAVE_URL   = BASE_URL ? `${BASE_URL}/api/save/${FILE}` : '';
const ARCHIVE_VERSION = 2;

const purchaseDateKey = getPurchaseDateKey();

const normalizePurchase = (dateKey, purchase) => ({
  date: dateKey,
  items: Array.isArray(purchase?.items) ? purchase.items : [],
});

const normalizeArchive = (data) => {
  if (data?.purchases && typeof data.purchases === 'object') {
    return Object.entries(data.purchases).reduce((acc, [dateKey, purchase]) => {
      acc[dateKey] = normalizePurchase(dateKey, purchase);
      return acc;
    }, {});
  }

  if (Array.isArray(data?.items)) {
    return {
      [purchaseDateKey]: {
        date: purchaseDateKey,
        items: data.items,
      },
    };
  }

  return {
    [purchaseDateKey]: {
      date: purchaseDateKey,
      items: [],
    },
  };
};

const serializeArchive = (purchases) => ({
  version: ARCHIVE_VERSION,
  purchases,
});

const getCurrentItems = (state) => state.purchases[state.currentDate]?.items ?? [];

const setCurrentItems = (state, items) => {
  state.purchases[state.currentDate] = {
    date: state.currentDate,
    items,
  };
};

const getItemKey = (item) => [item.category, item.name, item.type, item.counted].join('|');

const getSourceKey = (item) =>
  item.sourceKey || ['legacy', item.category, item.name, item.type, item.counted].join('|');

const normalizeSourceSelections = (item) => {
  if (item?.sourceSelections && typeof item.sourceSelections === 'object') {
    return item.sourceSelections;
  }

  return {
    [getSourceKey(item)]: {
      count: item.count || 1,
      comment: item.comment || '',
    },
  };
};

const getTotalCount = (sourceSelections) =>
  Object.values(sourceSelections).reduce((total, sourceItem) => {
    return total + (Number(sourceItem.count) || 0);
  }, 0);

/* ─────── 1. Async-thunks ─────── */

/** GET /zakup.json?t=timestamp  (Nginx отдаёт статический файл + CORS-заголовки) */
export const fetchVegetables = createAsyncThunk(
  'vegetables/fetch',
  async (_, { getState, rejectWithValue }) => {
    if (!GET_URL) {
      return getState().vegetables.purchases;
    }

    try {
      const url = `${GET_URL}?t=${Date.now()}`;               // ⛔️ обходим кеш уровня CDN/WKWebView
      const { data } = await axios.get(url);
      return normalizeArchive(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/** PUT /api/save/zakup.json  (Express сохраняет + Nginx проксирует) */
export const saveVegetables = createAsyncThunk(
  'vegetables/save',
  async (purchases, { rejectWithValue }) => {
    if (!SAVE_URL) {
      return purchases;
    }

    try {
      await axios.put(SAVE_URL, serializeArchive(purchases));
      return purchases;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ─────── 2. Slice ─────── */
const vegetSlice = createSlice({
  name: 'vegetables',
  initialState: {
    currentDate: purchaseDateKey,
    purchases: {
      [purchaseDateKey]: {
        date: purchaseDateKey,
        items: [],
      },
    },
    status: 'idle',        // idle | loading | succeeded | failed
    error:  null,
  },
  reducers: {
    addVegetablesToItems(state, { payload }) {
      const currentItems = getCurrentItems(state);
      const payloadKey = getItemKey(payload);
      const sourceKey = getSourceKey(payload);
      const idx = currentItems.findIndex((i) => getItemKey(i) === payloadKey);

      if (idx !== -1) {
        const sourceSelections = normalizeSourceSelections(currentItems[idx]);
        const nextSourceSelections = {
          ...sourceSelections,
          [sourceKey]: {
            count: payload.count || 1,
            comment: payload.comment || '',
          },
        };

        currentItems[idx] = {
          ...currentItems[idx],
          ...payload,
          count: getTotalCount(nextSourceSelections),
          sourceSelections: nextSourceSelections,
        };
      } else {
        const sourceSelections = {
          [sourceKey]: {
            count: payload.count || 1,
            comment: payload.comment || '',
          },
        };

        currentItems.push({
          ...payload,
          count: getTotalCount(sourceSelections),
          sourceSelections,
        });
      }
      setCurrentItems(state, currentItems);
    },
    removeVegetableByName(state, { payload }) {
      if (typeof payload === 'string') {
        setCurrentItems(state, getCurrentItems(state).filter((i) => i.name !== payload));
        return;
      }

      const currentItems = getCurrentItems(state);
      const sourceKey = getSourceKey(payload);
      const nextItems = currentItems.reduce((acc, currentItem) => {
        if (getItemKey(currentItem) !== getItemKey(payload)) {
          return [...acc, currentItem];
        }

        const sourceSelections = { ...normalizeSourceSelections(currentItem) };
        delete sourceSelections[sourceKey];

        if (!Object.keys(sourceSelections).length) {
          return acc;
        }

        return [
          ...acc,
          {
            ...currentItem,
            count: getTotalCount(sourceSelections),
            sourceSelections,
          },
        ];
      }, []);

      setCurrentItems(state, nextItems);
    },
    clearItems(state) {
      setCurrentItems(state, []);
    },
    setCurrentDate(state, { payload: dateKey }) {
      state.currentDate = dateKey;

      if (!state.purchases[dateKey]) {
        state.purchases[dateKey] = {
          date: dateKey,
          items: [],
        };
      }
    },
    replacePurchaseSection(state, { payload }) {
      const { dateKey, category, items } = payload;
      const purchase = state.purchases[dateKey] ?? { date: dateKey, items: [] };
      const otherItems = purchase.items.filter((item) => item.category !== category);

      state.purchases[dateKey] = {
        date: dateKey,
        items: [...otherItems, ...items],
      };
    },
  },
  extraReducers: (builder) =>
    builder
      /* fetch */
      .addCase(fetchVegetables.pending,   (s) => { s.status = 'loading'; })
      .addCase(fetchVegetables.fulfilled, (s, a) => { s.status = 'succeeded'; s.purchases = a.payload; })
      .addCase(fetchVegetables.rejected,  (s, a) => { s.status = 'failed'; s.error = a.payload; })

      /* save (ошибку просто логируем) */
      .addCase(saveVegetables.rejected,   (s, a) => { s.error = a.payload; }),
});

/* ─────── 3. Комбо-thunks: persist → refetch ─────── */

export const addVegetableAndPersist = (item) => async (dispatch, getState) => {
  dispatch(vegetSlice.actions.addVegetablesToItems(item));
  const { purchases } = getState().vegetables;
  try {
    await dispatch(saveVegetables(purchases)).unwrap();
  } catch (err) {
    console.warn('Не удалось сохранить закуп:', err);
  } finally {
    dispatch(fetchVegetables());      // берём свежее, как в «Available»
  }
};

export const removeVegetableAndPersist = (item) => async (dispatch, getState) => {
  dispatch(vegetSlice.actions.removeVegetableByName(item));
  const { purchases } = getState().vegetables;
  try {
    await dispatch(saveVegetables(purchases)).unwrap();
  } catch (err) {
    console.warn('Не удалось сохранить закуп:', err);
  } finally {
    dispatch(fetchVegetables());
  }
};

export const replacePurchaseSectionAndPersist = (payload) => async (dispatch, getState) => {
  dispatch(vegetSlice.actions.replacePurchaseSection(payload));
  const { purchases } = getState().vegetables;
  try {
    await dispatch(saveVegetables(purchases)).unwrap();
  } catch (err) {
    console.warn('Не удалось сохранить закуп:', err);
  } finally {
    dispatch(fetchVegetables());
  }
};

export const clearItemsAndPersist = () => async (dispatch, getState) => {
  dispatch(vegetSlice.actions.clearItems());
  const { purchases } = getState().vegetables;
  try {
    await dispatch(saveVegetables(purchases)).unwrap();
  } catch (err) {
    console.warn('Не удалось сохранить закуп:', err);
  } finally {
    dispatch(fetchVegetables());
  }
};

/* ─────── 4. Селекторы ─────── */
export const selectVegetablesItems  = (state) => state.vegetables.purchases[state.vegetables.currentDate]?.items ?? [];
export const selectPurchases        = (state) => state.vegetables.purchases;
export const selectCurrentDate      = (state) => state.vegetables.currentDate;
export const selectVegetablesStatus = (state) => state.vegetables.status;
export const selectVegetablesError  = (state) => state.vegetables.error;

/* ─────── 5. Экспорт ─────── */
export const { clearItems, setCurrentDate } = vegetSlice.actions;
export default vegetSlice.reducer;
