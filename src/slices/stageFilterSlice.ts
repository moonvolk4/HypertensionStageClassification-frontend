import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const stageFilterSlice = createSlice({
  name: "stageFilters",
  // начальное состояние фильтров стадий
  initialState: {
    query: "",
    sysFrom: 0,
    sysTo: 0,
    diaFrom: 0,
    diaTo: 0,
  },
  // редьюсеры мутируют состояние и ничего не возвращают
  reducers: {
    setQuery(state, { payload }) {
      state.query = payload;
    },
    setSysFrom(state, { payload }) {
      state.sysFrom = payload;
    },
    setSysTo(state, { payload }) {
      state.sysTo = payload;
    },
    setDiaFrom(state, { payload }) {
      state.diaFrom = payload;
    },
    setDiaTo(state, { payload }) {
      state.diaTo = payload;
    },
    resetFilters(state) {
      state.query = "";
      state.sysFrom = 0;
      state.sysTo = 0;
      state.diaFrom = 0;
      state.diaTo = 0;
    },
  },
});

// хук для чтения фильтров из хранилища
export const useStageFilters = () =>
  useSelector((state: any) => state.stageData);

export const {
  setQuery: setQueryAction,
  setSysFrom: setSysFromAction,
  setSysTo: setSysToAction,
  setDiaFrom: setDiaFromAction,
  setDiaTo: setDiaToAction,
  resetFilters: resetFiltersAction,
} = stageFilterSlice.actions;

export default stageFilterSlice.reducer;
