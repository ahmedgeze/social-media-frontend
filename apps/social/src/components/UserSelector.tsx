"use client";

import type { User } from "@repo/types";
import { Avatar } from "@repo/ui/avatar";
import { Card } from "@repo/ui/card";

interface UserSelectorProps {
  users: User[];
  selectedUserId: string | null;
  onSelect: (userId: string) => void;
}

export default function UserSelector({
  users,
  selectedUserId,
  onSelect,
}: UserSelectorProps) {
  return (
    <Card className="mb-6">
      <h3 className="font-semibold mb-3">Select User</h3>
      <div className="flex flex-wrap gap-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelect(user.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              selectedUserId === user.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <Avatar name={user.username} size="sm" />
            <span className="font-medium">{user.username}</span>
          </button>
        ))}
      </div>
      {users.length === 0 && (
        <p className="text-gray-500 text-center">
          No users found. Create one first!
        </p>
      )}
    </Card>
  );
}
