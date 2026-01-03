"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User, AuthState } from "@repo/types";
import {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  clearAuth,
} from "./storage";

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Restore auth state from storage on mount
    const storedToken = getToken();
    const storedUser = getStoredUser<User>();

    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUserState(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (user: User, token: string) => {
    setToken(token);
    setStoredUser(user);
    setTokenState(token);
    setUserState(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
    setIsAuthenticated(false);
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
        login,
        logout,
        setUser,
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
