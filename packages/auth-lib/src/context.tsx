"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { User, AuthState } from "@repo/types";
import {
  getToken,
  getStoredUser,
  setStoredUser,
  clearAuth,
  setTokens,
  getRefreshToken,
  isTokenExpired,
  type TokenBundle,
} from "./storage";
import {
  redirectToLogin as keycloakLogin,
  redirectToLogout as keycloakLogout,
  refreshTokens,
  keycloakConfig,
} from "./keycloak";

interface AuthContextType extends AuthState {
  login: (returnUrl?: string) => Promise<void>;
  loginWithTokens: (tokens: TokenBundle, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  refreshAuth: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const tokens = await refreshTokens(refreshToken);
      setTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
        expiresIn: tokens.expires_in,
      });
      setTokenState(tokens.access_token);
      return true;
    } catch {
      clearAuth();
      setTokenState(null);
      setUserState(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = getStoredUser<User>();

      if (storedToken && storedUser) {
        if (isTokenExpired()) {
          const refreshed = await refreshAuth();
          if (refreshed) {
            setTokenState(getToken());
            setUserState(storedUser);
            setIsAuthenticated(true);
          }
        } else {
          setTokenState(storedToken);
          setUserState(storedUser);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshAuth]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAndRefresh = async () => {
      if (isTokenExpired()) {
        await refreshAuth();
      }
    };

    // Check every minute
    const interval = setInterval(checkAndRefresh, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshAuth]);

  const login = async (returnUrl?: string) => {
    await keycloakLogin(returnUrl);
  };

  const loginWithTokens = (tokens: TokenBundle, user: User) => {
    setTokens(tokens);
    setStoredUser(user);
    setTokenState(tokens.accessToken);
    setUserState(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
    setIsAuthenticated(false);
    keycloakLogout();
  };

  const setUser = (user: User) => {
    setStoredUser(user);
    setUserState(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        loginWithTokens,
        logout,
        setUser,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
