import { createSlice } from '@reduxjs/toolkit';

const vegetSlice = createSlice({
  name: 'vegetables',
  initialState: {
    items: [],
  },
  reducers: {
    addVegetablesToItems: (state, action) => {
      state.items.push({ ...action.payload, quantity: 1 });
    },
    clearItems: (state) => {
      state.items = [];
    }
  },
});
  
export const {
  addVegetablesToItems, clearItems
} = vegetSlice.actions;

export default vegetSlice.reducer;


