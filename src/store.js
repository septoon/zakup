import { configureStore } from "@reduxjs/toolkit";

import vegetSlice from "./Redux/vegetSlice";
import addressSlice from "./Redux/addressSlice";
import totalBtnSlice from "./Redux/totalBtnSlice";

const store = configureStore({
  reducer: {
    vegetables: vegetSlice,
    addressSelection: addressSlice,
    isTotalVisible: totalBtnSlice,
  }
})

export default store

