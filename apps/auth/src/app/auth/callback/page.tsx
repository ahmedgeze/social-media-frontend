"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@repo/ui/card";
import {
  exchangeCodeForTokens,
  parseJwt,
  useAuth,
  type TokenBundle,
} from "@repo/auth-lib";
import type { User } from "@repo/types";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const { loginWithTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (errorParam) {
        setError(errorDescription || errorParam);
        setProcessing(false);
        return;
      }

      if (!code) {
        setError("No authorization code received");
        setProcessing(false);
        return;
      }

      try {
        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code);

        // Parse user info from ID token
        const idTokenPayload = parseJwt(tokens.id_token);

        // Create user object from token claims
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

        // Store tokens and user
        loginWithTokens(tokenBundle, user);

        // Redirect to the original page or home
        // If state is a relative path or "/", redirect to core app
        let returnUrl = state || "/";
        if (returnUrl.startsWith("/") && !returnUrl.startsWith("//")) {
          // Relative path - redirect to core app (port 3000)
          const coreAppUrl = window.location.origin.replace(":3001", ":3000").replace(":3002", ":3000");
          returnUrl = `${coreAppUrl}${returnUrl}`;
        }
        window.location.href = returnUrl;
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Failed to complete authentication");
        setProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, loginWithTokens]);

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Try again
          </a>
        </div>
      </Card>
    );
  }

  if (processing) {
    return (
      <Card className="w-full max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Completing sign in...
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Please wait while we verify your credentials.
          </p>
        </div>
      </Card>
    );
  }

  return null;
}
