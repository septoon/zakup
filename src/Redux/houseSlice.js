import { createSlice } from '@reduxjs/toolkit';

const houseSlice = createSlice({
  name: 'house',
  initialState: {
    items: [],
  },
  reducers: {
    addHouseToItems: (state, action) => {
      state.items.push({ ...action.payload, quantity: 1 });
    },
    clearHouseItems: (state) => {
      state.items = [];
    }
  },
});
  
export const {
  addHouseToItems, clearHouseItems
} = houseSlice.actions;

export default houseSlice.reducer;


