"use client";

import { useState, useEffect } from "react";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Avatar } from "@repo/ui/avatar";
import { getUsers } from "@repo/api-client";
import type { User } from "@repo/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // For demo, get first user
      const response = await getUsers();
      if (response.success && response.data.content.length > 0) {
        const userData = response.data.content[0]!;
        setUser(userData);
        setFormData({
          fullName: userData.fullName || "",
          bio: userData.bio || "",
        });
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    // TODO: Implement update user API call
    setEditing(false);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">User not found</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => (window.location.href = "/login")}
        >
          Go to Login
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <Avatar name={user.username} size="xl" className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.username}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
      </div>

      {editing ? (
        <div className="space-y-4">
          <Input
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <Input
            name="bio"
            label="Bio"
            value={formData.bio}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditing(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <p className="text-gray-900 dark:text-white">
              {user.fullName || "Not set"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <p className="text-gray-900 dark:text-white">
              {user.bio || "No bio yet"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Member Since
            </label>
            <p className="text-gray-900 dark:text-white">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button onClick={() => setEditing(true)} className="w-full">
            Edit Profile
          </Button>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="danger"
          className="w-full"
          onClick={() => {
            // TODO: Implement logout
            window.location.href = "/";
          }}
        >
          Sign Out
        </Button>
      </div>
    </Card>
  );
}
