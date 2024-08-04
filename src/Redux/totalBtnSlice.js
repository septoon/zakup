import { createSlice } from '@reduxjs/toolkit';


const totalVisibleSlice = createSlice({
  name: 'isTotalVisible',
  initialState: {
    totalVisible: false,
    totalSent: false
  },
  reducers: {
    setTotalVisible: (state, action) => {
      state.totalVisible = action.payload;
    },
    setTotalSent: (state, action) => {
      state.totalSent = action.payload;
    }
  },
});

export const {
  setTotalVisible,
  setTotalSent
} = totalVisibleSlice.actions;

export default totalVisibleSlice.reducer;

export const selectTotalVisible = (state) => state.isTotalVisible.totalVisible;