import { createSlice } from '@reduxjs/toolkit';

const mangalSlice = createSlice({
  name: 'mangal',
  initialState: {
    items: [],
  },
  reducers: {
    addMangalToItems: (state, action) => {
      state.items.push({ ...action.payload, quantity: 1 });
    },
    clearMangalItems: (state) => {
      state.items = [];
    }
  },
});
  
export const {
  addMangalToItems, clearMangalItems
} = mangalSlice.actions;

export default mangalSlice.reducer;


