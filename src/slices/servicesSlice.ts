import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../api';
import type { RootState } from '../store';
import type { ITunesMusic } from '../modules/itunesApi';
import { stageToITunes } from '../modules/itunesApi';
import { SONGS_MOCK } from '../modules/mock';

interface ServicesState {
  searchValue: string;
  sysFrom: number;
  sysTo: number;
  diaFrom: number;
  diaTo: number;
  services: ITunesMusic[];
  loading: boolean;
}

const initialState: ServicesState = {
  searchValue: '',
  sysFrom: 0,
  sysTo: 0,
  diaFrom: 0,
  diaTo: 0,
  services: [],
  loading: false,
};

export const fetchServicesAsync = createAsyncThunk<
  ITunesMusic[],
  void,
  { state: RootState; rejectValue: string }
>('services/fetchServicesAsync', async (_, { getState, rejectWithValue }) => {
  const { services } = getState();

  try {
    const query: Record<string, any> = {};
    if (services.searchValue.trim()) query.query = services.searchValue.trim();
    if (services.sysFrom) query.sys_from = services.sysFrom;
    if (services.sysTo) query.sys_to = services.sysTo;
    if (services.diaFrom) query.dia_from = services.diaFrom;
    if (services.diaTo) query.dia_to = services.diaTo;

    // swagger-typescript-api generated RequestParams doesn't expose `query` in the type,
    // but the runtime client supports it.
    const response = await (api.api as any).stagesList({ query });

    const data: any = (response as any).data;
    const stages: any[] = Array.isArray(data) ? data : data?.items || data?.results || [];

    return stages.map(stageToITunes);
  } catch (_e) {
    return rejectWithValue('Ошибка при загрузке данных');
  }
});

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSearchValue(state, action: { payload: string }) {
      state.searchValue = action.payload;
    },
    setSysFrom(state, action: { payload: number }) {
      state.sysFrom = action.payload;
    },
    setSysTo(state, action: { payload: number }) {
      state.sysTo = action.payload;
    },
    setDiaFrom(state, action: { payload: number }) {
      state.diaFrom = action.payload;
    },
    setDiaTo(state, action: { payload: number }) {
      state.diaTo = action.payload;
    },
    resetFilters(state) {
      state.searchValue = '';
      state.sysFrom = 0;
      state.sysTo = 0;
      state.diaFrom = 0;
      state.diaTo = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServicesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServicesAsync.rejected, (state) => {
        state.loading = false;
        state.services = SONGS_MOCK.results.filter((item) =>
          item.collectionCensoredName
            .toLocaleLowerCase()
            .startsWith(state.searchValue.toLocaleLowerCase()),
        );
      });
  },
});

export const { setSearchValue, setSysFrom, setSysTo, setDiaFrom, setDiaTo, resetFilters } =
  servicesSlice.actions;

export default servicesSlice.reducer;
