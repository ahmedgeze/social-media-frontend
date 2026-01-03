// Token storage utilities
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const ID_TOKEN_KEY = 'auth_id_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
const USER_KEY = 'auth_user';

// Access token
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Refresh token
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function removeRefreshToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ID token
export function getIdToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function setIdToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ID_TOKEN_KEY, token);
}

export function removeIdToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ID_TOKEN_KEY);
}

// Token expiry
export function getTokenExpiry(): number | null {
  if (typeof window === 'undefined') return null;
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
}

export function setTokenExpiry(expiresIn: number): void {
  if (typeof window === 'undefined') return;
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
}

export function removeTokenExpiry(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function isTokenExpired(): boolean {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  return Date.now() >= expiry - 60000; // 60 second buffer
}

// User storage
export function getStoredUser<T>(): T | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function setStoredUser<T>(user: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

// OAuth2 tokens bundle
export interface TokenBundle {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
}

export function setTokens(tokens: TokenBundle): void {
  setToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
  setIdToken(tokens.idToken);
  setTokenExpiry(tokens.expiresIn);
}

export function clearAuth(): void {
  removeToken();
  removeRefreshToken();
  removeIdToken();
  removeTokenExpiry();
  removeStoredUser();
}
