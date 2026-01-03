"use client";

import { useState } from "react";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Avatar } from "@repo/ui/avatar";
import { useAuth } from "@repo/auth-lib";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
  });

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

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please log in to view your profile
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Avatar
            name={user.displayName || user.username}
            size="xl"
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.displayName || user.username}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>

        {editing ? (
          <div className="space-y-4">
            <Input
              name="displayName"
              label="Display Name"
              value={formData.displayName}
              onChange={handleChange}
              placeholder={user.displayName || "Enter display name"}
            />
            <Input
              name="bio"
              label="Bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
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
                Username
              </label>
              <p className="text-gray-900 dark:text-white">@{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <p className="text-gray-900 dark:text-white">
                {user.displayName || "Not set"}
              </p>
            </div>
            <Button onClick={() => setEditing(true)} className="w-full">
              Edit Profile
            </Button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="danger" className="w-full" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
