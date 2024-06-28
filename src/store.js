import { configureStore } from "@reduxjs/toolkit";

import vegetSlice from "./Redux/vegetSlice";
import duzinaSlice from "./Redux/duzinaSlice";
import mangalSlice from "./Redux/mangalSlice";
import houseSlice from "./Redux/houseSlice";

const store = configureStore({
  reducer: {
    vegetables: vegetSlice,
    duzina: duzinaSlice,
    mangal: mangalSlice,
    house: houseSlice
  }
})

export default store

