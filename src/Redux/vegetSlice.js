import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'vegetables',
  initialState: {
    items: [],
  },
  reducers: {
    addVegetablesToItems: (state, action) => {
      state.items.push({ ...action.payload, quantity: 1 });
      
    },
  },
});
  
export const {
  addVegetablesToItems
} = cartSlice.actions;

export default cartSlice.reducer;
