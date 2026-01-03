"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { createUser } from "@repo/api-client";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
        bio: formData.bio || undefined,
      });

      if (response.success) {
        // Redirect to login after successful registration
        window.location.href = "/login";
      } else {
        setError(response.message || "Registration failed");
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Join our community today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="username"
          label="Username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name (optional)"
          value={formData.fullName}
          onChange={handleChange}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}
