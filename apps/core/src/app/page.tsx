"use client";

import Link from "next/link";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { useAuth } from "@repo/auth-lib";

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {isAuthenticated
            ? `Welcome back, ${user?.displayName || user?.username}!`
            : "Welcome to Social Media"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {isAuthenticated
            ? "Check out the latest posts and connect with your friends."
            : "Connect with friends, share your thoughts, and discover new content. Join our community today!"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">Share Posts</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Express yourself and share your thoughts with the world.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-semibold mb-2">Comment & Engage</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Join conversations and connect with others.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-4">❤️</div>
          <h3 className="text-lg font-semibold mb-2">Like & Support</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Show appreciation for content you enjoy.
          </p>
        </Card>
      </div>

      <div className="flex justify-center gap-4 pt-8">
        {isLoading ? (
          <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        ) : isAuthenticated ? (
          <>
            <Link href="/feed">
              <Button size="lg">Go to Feed</Button>
            </Link>
            <Link href="/profile">
              <Button variant="secondary" size="lg">
                My Profile
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
