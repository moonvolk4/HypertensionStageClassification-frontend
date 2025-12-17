import { Api } from './Api';

const ACCESS_TOKEN_KEY = 'access_token';

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

export const api = new Api<string>({
  baseURL: '',
  secure: true,
  securityWorker: (token) => {
    if (!token) return {};
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },
});

// Restore token on page reload
api.setSecurityData(tokenStorage.get());

export const setAccessToken = (token: string | null) => {
  if (token) {
    tokenStorage.set(token);
  } else {
    tokenStorage.clear();
  }
  api.setSecurityData(token);
};
