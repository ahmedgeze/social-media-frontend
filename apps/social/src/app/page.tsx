"use client";

import { useState, useEffect } from "react";
import type { Post, User } from "@repo/types";
import { getPosts, getUsers } from "@repo/api-client";
import { Spinner } from "@repo/ui/spinner";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import UserSelector from "@/components/UserSelector";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [postsRes, usersRes] = await Promise.all([getPosts(), getUsers()]);

      if (postsRes.success) {
        setPosts(postsRes.data.content);
      }

      if (usersRes.success) {
        setUsers(usersRes.data.content);
        // Auto-select first user if available
        if (usersRes.data.content.length > 0 && !selectedUserId) {
          setSelectedUserId(usersRes.data.content[0]!.id);
        }
      }
    } catch {
      setError("Failed to load data. Make sure the backend is running.");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadData}>Try Again</Button>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Feed</h1>

      <UserSelector
        users={users}
        selectedUserId={selectedUserId}
        onSelect={setSelectedUserId}
      />

      {selectedUserId && (
        <CreatePost userId={selectedUserId} onPostCreated={loadData} />
      )}

      {posts.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500">No posts yet. Be the first to post!</p>
        </Card>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={selectedUserId || ""}
              onRefresh={loadData}
            />
          ))}
        </div>
      )}
    </div>
  );
}
