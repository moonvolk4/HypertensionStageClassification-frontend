import { combineReducers, configureStore } from "@reduxjs/toolkit";
import stageFilterReducer from "./slices/stageFilterSlice";

// глобальное хранилище Redux Toolkit
export default configureStore({
  reducer: combineReducers({
    stageData: stageFilterReducer,
  }),
});
