// src/Redux/vegetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/* ─────── 0. Константы ─────── */
const BASE_URL = process.env.REACT_APP_URL || '';  // .env.local
const FILE     = 'zakup.json';
const DATA_URL = `${BASE_URL}/api/data/${FILE}`;   // GET
const SAVE_URL = `${BASE_URL}/api/save/${FILE}`;   // PUT

/* ─────── 1. Async-thunks ─────── */

/* GET из zakup.json */
export const fetchVegetables = createAsyncThunk(
  'vegetables/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(DATA_URL, { cache: 'no-store' });
      return data.items ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* PUT в zakup.json */
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
    items: [],           // источник правды — сервер
    status: 'idle',      // idle | loading | succeeded | failed
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

      /* save — только логируем ошибку */
      .addCase(saveVegetables.rejected,   (s, a) => { s.error = a.payload; }),
});

/* ─────── 3. Комбо-thunks (persist → refetch) ─────── */

export const addVegetableAndPersist = (item) => async (dispatch, getState) => {
  dispatch(vegetSlice.actions.addVegetablesToItems(item));
  const { items } = getState().vegetables;
  try {
    await dispatch(saveVegetables(items)).unwrap();
  } finally {
    dispatch(fetchVegetables());          // мгновенно подтягиваем свежий JSON
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