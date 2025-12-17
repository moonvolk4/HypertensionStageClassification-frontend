import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../api';
import type { RootState } from '../store';

const LOCAL_RECORDS_KEY = 'local_records_v1';

const localRecordsStorage = {
  get(): RecordItem[] {
    try {
      const raw = localStorage.getItem(LOCAL_RECORDS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as RecordItem[];
    } catch {
      return [];
    }
  },
  set(items: RecordItem[]) {
    localStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify(items));
  },
};

export interface RecordItem {
  id: number;
  status?: number | string;
  creator_id?: number;
  creator_username?: string;
  created_at?: string;
  formed_at?: string | null;
  finished_at?: string | null;
  moderator_id?: number | null;
  comment?: string | null;
  items_count?: number;
}

interface RecordsState {
  items: RecordItem[];
  loading: boolean;
  error: string | null;
}

const initialState: RecordsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchRecordsAsync = createAsyncThunk<
  RecordItem[],
  void,
  { state: RootState; rejectValue: string }
>('records/fetchRecordsAsync', async (_, { getState, rejectWithValue }) => {
  const { username, isModerator } = getState().user;

  try {
    const response = await api.api.recordsList();
    const data: any = (response as any).data;
    const apiRecords: RecordItem[] = Array.isArray(data) ? (data as RecordItem[]) : [];

    const local = localRecordsStorage.get();
    const visibleLocal = isModerator
      ? local
      : local.filter((r) => String(r.creator_username ?? '').trim() === String(username).trim());

    return [...visibleLocal, ...apiRecords];
  } catch (_e) {
    const local = localRecordsStorage.get();
    const visibleLocal = isModerator
      ? local
      : local.filter((r) => String(r.creator_username ?? '').trim() === String(username).trim());

    if (visibleLocal.length) return visibleLocal;
    return rejectWithValue('Ошибка при загрузке заявок');
  }
});

export const formRecordFromDraftAsync = createAsyncThunk<
  RecordItem,
  void,
  { state: RootState; rejectValue: string }
>('records/formRecordFromDraftAsync', async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const { isAuthenticated, username } = state.user;
  const draft = state.draft;

  if (!isAuthenticated) return rejectWithValue('Нужно авторизоваться');
  if (!draft.items.length) return rejectWithValue('Добавьте хотя бы одну стадию');

  const nowIso = new Date().toISOString();
  const record: RecordItem = {
    id: Date.now(),
    status: 'Сформирована',
    creator_username: username,
    created_at: nowIso,
    formed_at: nowIso,
    finished_at: null,
    items_count: draft.count,
    comment: draft.comment || null,
  };

  const existing = localRecordsStorage.get();
  localRecordsStorage.set([record, ...existing]);
  return record;
});

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    resetRecords(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecordsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecordsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecordsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка при загрузке заявок';
      })
      .addCase(formRecordFromDraftAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(formRecordFromDraftAsync.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
        state.error = null;
      })
      .addCase(formRecordFromDraftAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Не удалось сформировать заявку';
      });
  },
});

export const { resetRecords } = recordsSlice.actions;
export default recordsSlice.reducer;
