import { configureStore } from "@reduxjs/toolkit";

import vegetSlice from "./Redux/vegetSlice";
import addressSlice from "./Redux/addressSlice";
import totalBtnSlice from "./Redux/totalBtnSlice";
import catalogSlice from "./Redux/catalogSlice";

const store = configureStore({
  reducer: {
    vegetables: vegetSlice,
    addressSelection: addressSlice,
    isTotalVisible: totalBtnSlice,
    catalog: catalogSlice,
  }
})

export default store
