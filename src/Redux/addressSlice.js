import { createSlice } from '@reduxjs/toolkit';

const isBrowser = typeof window !== 'undefined';

const setItemFunc = (adr) => {
  localStorage.setItem('addressSelection', JSON.stringify(adr));
};

const addressSlice = createSlice({
  name: 'addressSelection',
  initialState: {
    address: isBrowser ? (localStorage.getItem('addressSelection') ? JSON.parse(localStorage.getItem('addressSelection')) : '') : '',
  },
  reducers: {
    addAddress: (state, action) => {
      state.address = action.payload;
      setItemFunc(state.address);
    },
  },
});

export const {
  addAddress,
} = addressSlice.actions;

export default addressSlice.reducer;

// Селектор для получения address
export const selectAddress = (state) => state.addressSelection.address;