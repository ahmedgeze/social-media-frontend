"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Spinner } from "@repo/ui/spinner";
import {
  directLogin,
  parseJwt,
  setTokens,
  setStoredUser,
  getToken,
  getStoredUser,
  type TokenBundle,
} from "@repo/auth-lib";
import type { User } from "@repo/types";

function LoginForm() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = getToken();
    const user = getStoredUser();
    if (token && user) {
      window.location.href = returnUrl.startsWith("/")
        ? `http://localhost:3000${returnUrl}`
        : returnUrl;
    }
  }, [returnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tokens = await directLogin(username, password);

      // Parse user info from ID token
      const idTokenPayload = parseJwt(tokens.id_token);

      const user: User = {
        id: idTokenPayload.sub as string,
        username: (idTokenPayload.preferred_username as string) || "",
        email: (idTokenPayload.email as string) || "",
        displayName:
          (idTokenPayload.name as string) ||
          (idTokenPayload.preferred_username as string) ||
          "",
        avatarUrl: (idTokenPayload.picture as string) || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const tokenBundle: TokenBundle = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
        expiresIn: tokens.expires_in,
      };

      // Store directly without context
      setTokens(tokenBundle);
      setStoredUser(user);

      // Redirect to core app
      const redirectTo = returnUrl.startsWith("/")
        ? `http://localhost:3000${returnUrl}`
        : returnUrl;
      window.location.href = redirectTo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Username or Email"
          placeholder="Enter your username or email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
