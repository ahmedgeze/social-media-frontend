"use client";

import { useState, useEffect } from "react";
import type { User } from "@repo/types";
import { getUsers, createUser } from "@repo/api-client";
import { Spinner } from "@repo/ui/spinner";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Avatar } from "@repo/ui/avatar";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    bio: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data.content);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const response = await createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
        bio: formData.bio || undefined,
      });

      if (response.success) {
        setFormData({
          username: "",
          email: "",
          password: "",
          fullName: "",
          bio: "",
        });
        setShowForm(false);
        loadUsers();
      } else {
        setFormError(response.message || "Failed to create user");
      }
    } catch {
      setFormError("Failed to create user");
    }

    setFormLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add User"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="username"
                label="Username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input
                name="fullName"
                label="Full Name"
                placeholder="Enter full name (optional)"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <Input
              name="bio"
              label="Bio"
              placeholder="Enter bio (optional)"
              value={formData.bio}
              onChange={handleChange}
            />
            {formError && (
              <p className="text-red-500 text-sm">{formError}</p>
            )}
            <Button type="submit" loading={formLoading}>
              Create User
            </Button>
          </form>
        </Card>
      )}

      {users.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500">No users found. Create one!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <div className="flex items-start gap-4">
                <Avatar name={user.username} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{user.username}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {user.email}
                  </p>
                  {user.fullName && (
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {user.fullName}
                    </p>
                  )}
                  {user.bio && (
                    <p className="text-gray-500 text-sm mt-2">{user.bio}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">
                    Joined {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
