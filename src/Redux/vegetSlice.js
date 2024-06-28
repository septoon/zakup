import { createSlice } from '@reduxjs/toolkit';

const isBrowser = typeof window !== 'undefined';

const setItemFunc = (items) => {
  localStorage.setItem('vegetableItems', JSON.stringify(items));
};

const vegetSlice = createSlice({
  name: 'vegetables',
  initialState: {
    items: isBrowser ? (localStorage.getItem('vegetableItems') ? JSON.parse(localStorage.getItem('vegetableItems')) : []) : [],
  },
  reducers: {
    addVegetablesToItems: (state, action) => {
      state.items.push({ ...action.payload, quantity: 1 });
      setItemFunc(state.items);
    },
    clearItems: (state) => {
      state.items = [];
      setItemFunc(state.items);
    },
  },
});

export const {
  addVegetablesToItems,
  clearItems
} = vegetSlice.actions;

export default vegetSlice.reducer;