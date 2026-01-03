/**
 * Keycloak configuration for frontend authentication
 */
export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

export const keycloakConfig: KeycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8180",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "social-media",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "social-media-frontend",
};

/**
 * Keycloak auth endpoints
 */
export const keycloakEndpoints = {
  authorize: `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth`,
  token: `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
  logout: `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`,
  userinfo: `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`,
  register: `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/registrations`,
};

/**
 * Generate PKCE code verifier and challenge for secure auth
 */
export async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const verifier = generateRandomString(128);
  const challenge = await generateCodeChallenge(verifier);
  return { verifier, challenge };
}

function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const values = new Uint8Array(length);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(values);
  } else {
    // Fallback for SSR - will be regenerated on client
    for (let i = 0; i < length; i++) {
      values[i] = Math.floor(Math.random() * 256);
    }
  }
  values.forEach((value) => {
    result += chars[value % chars.length];
  });
  return result;
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(digest);
}

function base64URLEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Direct login with username/password (Resource Owner Password Credentials)
 */
export async function directLogin(
  username: string,
  password: string
): Promise<{
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
}> {
  const response = await fetch(keycloakEndpoints.token, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: keycloakConfig.clientId,
      username,
      password,
      scope: "openid profile email",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || "Login failed");
  }

  return response.json();
}

/**
 * Redirect to Keycloak login (PKCE flow - for SSO scenarios)
 */
export async function redirectToLogin(returnUrl?: string): Promise<void> {
  const { verifier, challenge } = await generatePKCE();
  sessionStorage.setItem("pkce_verifier", verifier);

  const params = new URLSearchParams({
    client_id: keycloakConfig.clientId,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: "code",
    scope: "openid profile email",
    state: returnUrl || window.location.pathname,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  window.location.href = `${keycloakEndpoints.authorize}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
}> {
  const verifier = sessionStorage.getItem("pkce_verifier");
  if (!verifier) {
    throw new Error("PKCE verifier not found");
  }

  const response = await fetch(keycloakEndpoints.token, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: keycloakConfig.clientId,
      code,
      redirect_uri: `${window.location.origin}/auth/callback`,
      code_verifier: verifier,
    }),
  });

  sessionStorage.removeItem("pkce_verifier");

  if (!response.ok) {
    throw new Error("Failed to exchange code for tokens");
  }

  return response.json();
}

/**
 * Redirect to Keycloak logout
 */
export function redirectToLogout(): void {
  const params = new URLSearchParams({
    client_id: keycloakConfig.clientId,
    post_logout_redirect_uri: window.location.origin,
  });

  window.location.href = `${keycloakEndpoints.logout}?${params.toString()}`;
}

/**
 * Refresh tokens using refresh token
 */
export async function refreshTokens(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
}> {
  const response = await fetch(keycloakEndpoints.token, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: keycloakConfig.clientId,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh tokens");
  }

  return response.json();
}

/**
 * Redirect to Keycloak registration
 */
export async function redirectToRegister(returnUrl?: string): Promise<void> {
  const { verifier, challenge } = await generatePKCE();
  sessionStorage.setItem("pkce_verifier", verifier);

  const params = new URLSearchParams({
    client_id: keycloakConfig.clientId,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: "code",
    scope: "openid profile email",
    state: returnUrl || "/",
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  window.location.href = `${keycloakEndpoints.register}?${params.toString()}`;
}

/**
 * Parse JWT token to extract user info
 */
export function parseJwt(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return {};
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}
