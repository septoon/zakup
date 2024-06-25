import { configureStore } from "@reduxjs/toolkit";

import vegetSlice from "./Redux/vegetSlice";

const store = configureStore({
  reducer: {
    vegetables: vegetSlice
  }
})

export default store

