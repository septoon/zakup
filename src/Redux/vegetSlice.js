// src/Redux/vegetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/* ─────── 0. Константы ─────── */
const BASE_URL   = process.env.REACT_APP_URL || '';          // https://api.shashlichny-dom.ru
const FILE       = 'zakup.json';
const GET_URL    = `${BASE_URL}/${FILE}`;                    // ➜ https://.../zakup.json
const SAVE_URL   = `${BASE_URL}/api/save/${FILE}`;           // ➜ https://.../api/save/zakup.json

/* ─────── 1. Async-thunks ─────── */

/** GET /zakup.json?t=timestamp  (Nginx отдаёт статический файл + CORS-заголовки) */
export const fetchVegetables = createAsyncThunk(
  'vegetables/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const url = `${GET_URL}?t=${Date.now()}`;               // ⛔️ обходим кеш уровня CDN/WKWebView
      const { data } = await axios.get(url);
      return data.items ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/** PUT /api/save/zakup.json  (Express сохраняет + Nginx проксирует) */
export const saveVegetables = createAsyncThunk(
  'vegetables/save',
  async (items, { rejectWithValue }) => {
    try {
      await axios.put(SAVE_URL, { items });
      return items;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ─────── 2. Slice ─────── */
const vegetSlice = createSlice({
  name: 'vegetables',
  initialState: {
    items: [],
    status: 'idle',        // idle | loading | succeeded | failed
    error:  null,
  },
  reducers: {
    addVegetablesToItems(state, { payload }) {
      const idx = state.items.findIndex((i) => i.name === payload.name);
      if (idx !== -1) {
        state.items[idx] = {
          ...state.items[idx],
          ...payload,
          count: (state.items[idx].count || 0) + (payload.count || 1),
        };
      } else {
        state.items.push({ ...payload, count: payload.count || 1 });
      }
    },
    removeVegetableByName(state, { payload: name }) {
      state.items = state.items.filter((i) => i.name !== name);
    },
    clearItems(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) =>
    builder
      /* fetch */
      .addCase(fetchVegetables.pending,   (s) => { s.status = 'loading'; })
      .addCase(fetchVegetables.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload; })
      .addCase(fetchVegetables.rejected,  (s, a) => { s.status = 'failed'; s.error = a.payload; })

      /* save (ошибку просто логируем) */
      .addCase(saveVegetables.rejected,   (s, a) => { s.error = a.payload; }),
});

/* ─────── 3. Комбо-thunks: persist → refetch ─────── */

export const addVegetableAndPersist = (item) => async (dispatch, getState) => {
  dispatch(vegetSlice.actions.addVegetablesToItems(item));
  const { items } = getState().vegetables;
  try {
    await dispatch(saveVegetables(items)).unwrap();
  } finally {
    dispatch(fetchVegetables());      // берём свежее, как в «Available»
  }
};

export const removeVegetableAndPersist = (name) => async (dispatch, getState) => {
  dispatch(vegetSlice.actions.removeVegetableByName(name));
  const { items } = getState().vegetables;
  try {
    await dispatch(saveVegetables(items)).unwrap();
  } finally {
    dispatch(fetchVegetables());
  }
};

export const clearItemsAndPersist = () => async (dispatch) => {
  dispatch(vegetSlice.actions.clearItems());
  try {
    await dispatch(saveVegetables([])).unwrap();
  } finally {
    dispatch(fetchVegetables());
  }
};

/* ─────── 4. Селекторы ─────── */
export const selectVegetablesItems  = (state) => state.vegetables.items;
export const selectVegetablesStatus = (state) => state.vegetables.status;
export const selectVegetablesError  = (state) => state.vegetables.error;

/* ─────── 5. Экспорт ─────── */
export const { clearItems } = vegetSlice.actions;
export default vegetSlice.reducer;