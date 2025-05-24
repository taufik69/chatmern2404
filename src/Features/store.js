import { configureStore } from "@reduxjs/toolkit";
import friendReducer from "./slices/friendSlice";
export default configureStore({
  reducer: {
    freinds: friendReducer,
  },
});
