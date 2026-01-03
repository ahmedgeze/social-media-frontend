"use client";

import { useState, useEffect } from "react";
import type { User } from "@repo/types";
import { getUsers } from "@repo/api-client";
import { Spinner } from "@repo/ui/spinner";
import { Card } from "@repo/ui/card";
import { Avatar } from "@repo/ui/avatar";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Browse community members
        </p>
      </div>

      {users.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500">No users found.</p>
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
                  {user.displayName && (
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {user.displayName}
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
