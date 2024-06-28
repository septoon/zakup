import { createSlice } from '@reduxjs/toolkit';

const duzinaSlice = createSlice({
  name: 'duzina',
  initialState: {
    items: [],
  },
  reducers: {
    addDuzinaToItems: (state, action) => {
      state.items.push({ ...action.payload, quantity: 1 });
    },
    clearDuzinaItems: (state) => {
      state.items = [];
    }
  },
});
  
export const {
  addDuzinaToItems, clearDuzinaItems
} = duzinaSlice.actions;

export default duzinaSlice.reducer;


