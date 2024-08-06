import { createSlice } from '@reduxjs/toolkit';

const totalVisibleSlice = createSlice({
  name: 'isTotalVisible',
  initialState: {
    totalVisible: false,
  },
  reducers: {
    setTotalVisible: (state, action) => {
      state.totalVisible = action.payload;
    },
  },
});

export const { setTotalVisible } = totalVisibleSlice.actions;

export default totalVisibleSlice.reducer;

export const selectTotalVisible = (state) => state.isTotalVisible.totalVisible;