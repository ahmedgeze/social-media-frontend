"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/feed", label: "Feed" },
    { href: "/users", label: "Users" },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            Social Media
          </Link>

          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  pathname === item.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
