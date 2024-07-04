import { configureStore } from "@reduxjs/toolkit";

import vegetSlice from "./Redux/vegetSlice";
import addressSlice from "./Redux/addressSlice";

const store = configureStore({
  reducer: {
    vegetables: vegetSlice,
    addressSelection: addressSlice,
  }
})

export default store

