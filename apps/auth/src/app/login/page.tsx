"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Implement actual login API call
      // For now, simulate login
      if (email && password) {
        // Redirect to home after successful login
        window.location.href = "/";
      } else {
        setError("Please enter email and password");
      }
    } catch {
      setError("Login failed. Please try again.");
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
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            href="/register"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
}
