import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { ITunesMusic } from '../modules/itunesApi';

interface DraftItem {
  service: ITunesMusic;
  count: number;
}

export interface DraftFlags {
  lvh: boolean;
  kidneyDamage: boolean;
  arteryStiffness: boolean;
}

interface DraftState {
  count: number;
  items: DraftItem[];
  flags: DraftFlags;
  patientName: string;
  maxAd: string;
  map: number | null;
  comment: string;
  error: string | null;
}

const initialState: DraftState = {
  count: 0,
  items: [],
  flags: {
    lvh: false,
    kidneyDamage: false,
    arteryStiffness: false,
  },
  patientName: '',
  maxAd: '',
  map: null,
  comment: '',
  error: null,
};

export const addServiceToDraftAsync = createAsyncThunk(
  'draft/addServiceToDraftAsync',
  async (service: ITunesMusic) => service,
);

export const deleteServiceFromDraftAsync = createAsyncThunk(
  'draft/deleteServiceFromDraftAsync',
  async (collectionId: number) => collectionId,
);

export const deleteDraftAsync = createAsyncThunk('draft/deleteDraftAsync', async () => true);

const parseMaxAd = (value: string): { sys?: number; dia?: number } => {
  const normalized = value.replace(',', '.').trim();
  const m = normalized.match(/(\d+(?:\.\d+)?)\s*[\/ ]\s*(\d+(?:\.\d+)?)/);
  if (!m) return {};
  const sys = Number(m[1]);
  const dia = Number(m[2]);
  if (!Number.isFinite(sys) || !Number.isFinite(dia)) return {};
  return { sys, dia };
};

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    setPatientName(state, action: { payload: string }) {
      state.patientName = action.payload;
    },
    setMaxAd(state, action: { payload: string }) {
      state.maxAd = action.payload;
      state.map = null;
    },
    calculateMap(state) {
      const { sys, dia } = parseMaxAd(state.maxAd);
      if (sys === undefined || dia === undefined) {
        state.map = null;
        return;
      }
      // MAP = (SYS + 2*DIA)/3
      state.map = Math.round(((sys + 2 * dia) / 3) * 10) / 10;
    },
    setComment(state, action: { payload: string }) {
      state.comment = action.payload;
    },
    toggleFlag(state, action: { payload: keyof DraftFlags }) {
      state.flags[action.payload] = !state.flags[action.payload];
    },
    resetDraft(state) {
      Object.assign(state, initialState);
    },
    setError(state, action: { payload: string | null }) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addServiceToDraftAsync.fulfilled, (state, action) => {
        const existing = state.items.find(
          (x) => x.service.collectionId === action.payload.collectionId,
        );
        if (existing) {
          existing.count += 1;
        } else {
          state.items.push({ service: action.payload, count: 1 });
        }
        state.count = state.items.reduce((sum, item) => sum + item.count, 0);
      })
      .addCase(deleteServiceFromDraftAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((x) => x.service.collectionId !== action.payload);
        state.count = state.items.reduce((sum, item) => sum + item.count, 0);
      })
      .addCase(deleteDraftAsync.fulfilled, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export const {
  calculateMap,
  resetDraft,
  setComment,
  setError,
  setMaxAd,
  setPatientName,
  toggleFlag,
} = draftSlice.actions;

export default draftSlice.reducer;
