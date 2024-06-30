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
      const index = state.items.findIndex(item => item.name === action.payload.name);
      if (index !== -1) {
        state.items[index] = { ...action.payload, quantity: state.items[index].quantity + 1 };
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      setItemFunc(state.items);
    },
    clearItems: (state) => {
      state.items = [];
      setItemFunc(state.items);
    },
    removeVegetableByName: (state, action) => {
      state.items = state.items.filter(item => item.name !== action.payload);
      setItemFunc(state.items);
    },
  },
});

export const {
  addVegetablesToItems,
  clearItems,
  removeVegetableByName
} = vegetSlice.actions;

export default vegetSlice.reducer;