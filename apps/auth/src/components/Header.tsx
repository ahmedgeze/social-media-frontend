"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@repo/auth-lib";

const CORE_URL = process.env.NEXT_PUBLIC_CORE_URL || "http://localhost:3000";
const SOCIAL_URL = process.env.NEXT_PUBLIC_SOCIAL_URL || "http://localhost:3002";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = CORE_URL;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between h-16">
          <a
            href={CORE_URL}
            className="text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            Social Media
          </a>

          <nav className="flex items-center gap-6">
            <a
              href={CORE_URL}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </a>
            <a
              href={SOCIAL_URL}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Feed
            </a>
            <a
              href={`${SOCIAL_URL}/users`}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Users
            </a>

            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 ${
                    pathname === "/profile"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {user?.displayName || user?.username || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/login"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/register"
                      ? "bg-blue-100 border-blue-600 text-blue-600"
                      : "border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
