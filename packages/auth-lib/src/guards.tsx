"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "./context";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, redirectTo]);

  if (!isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}

interface PublicOnlyRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PublicOnlyRoute({
  children,
  redirectTo = "/",
}: PublicOnlyRouteProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, redirectTo]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
