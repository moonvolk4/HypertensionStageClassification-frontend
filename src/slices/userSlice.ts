import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api, setAccessToken, tokenStorage } from '../api';

const USERNAME_KEY = 'username';
const IS_MODERATOR_KEY = 'is_moderator';

const usernameStorage = {
  get(): string {
    return localStorage.getItem(USERNAME_KEY) || '';
  },
  set(username: string) {
    localStorage.setItem(USERNAME_KEY, username);
  },
  clear() {
    localStorage.removeItem(USERNAME_KEY);
  },
};

const isModeratorStorage = {
  get(): boolean {
    return localStorage.getItem(IS_MODERATOR_KEY) === 'true';
  },
  set(value: boolean) {
    localStorage.setItem(IS_MODERATOR_KEY, value ? 'true' : 'false');
  },
  clear() {
    localStorage.removeItem(IS_MODERATOR_KEY);
  },
};

interface UserState {
  username: string;
  isAuthenticated: boolean;
  isModerator: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  username: usernameStorage.get(),
  isAuthenticated: Boolean(tokenStorage.get()),
  isModerator: isModeratorStorage.get(),
  loading: false,
  error: null,
};

export const loginUserAsync = createAsyncThunk<
  { username: string; isModerator: boolean },
  { username: string; password: string },
  { rejectValue: string }
>('user/loginUserAsync', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.api.usersLoginCreate({
      username: credentials.username,
      password: credentials.password,
    });

    const data: any = (response as any).data;
    const token: string | undefined = data?.token;
    const username = String(data?.user?.username ?? credentials.username ?? '').trim();
    const isModerator = Boolean(data?.user?.is_moderator ?? data?.user?.isModerator ?? false);

    if (!token || !username) return rejectWithValue('Ошибка авторизации');

    setAccessToken(token);
    usernameStorage.set(username);
    isModeratorStorage.set(isModerator);
    return { username, isModerator };
  } catch (_e) {
    return rejectWithValue('Ошибка авторизации');
  }
});

export const registerUserAsync = createAsyncThunk<
  { username: string },
  { username: string; password: string },
  { rejectValue: string }
>('user/registerUserAsync', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.api.usersRegisterCreate({
      username: credentials.username,
      password: credentials.password,
    });

    const data: any = (response as any).data;
    const username = String(data?.username ?? credentials.username ?? '').trim();
    if (!username) return rejectWithValue('Ошибка регистрации');
    return { username };
  } catch (_e) {
    return rejectWithValue('Ошибка регистрации');
  }
});

export const logoutUserAsync = createAsyncThunk('user/logoutUserAsync', async () => {
  setAccessToken(null);
  usernameStorage.clear();
  isModeratorStorage.clear();
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.isAuthenticated = true;
        state.isModerator = action.payload.isModerator;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.username = '';
        state.isAuthenticated = false;
        state.isModerator = false;
        state.error = (action.payload as string) || 'Ошибка авторизации';
      })

      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка регистрации';
      })

      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.username = '';
        state.isAuthenticated = false;
        state.isModerator = false;
        state.error = null;
      });
  },
});

export default userSlice.reducer;
