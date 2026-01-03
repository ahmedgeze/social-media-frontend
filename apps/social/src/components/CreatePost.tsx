"use client";

import { useState } from "react";
import { createPost } from "@repo/api-client";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Textarea } from "@repo/ui/textarea";

interface CreatePostProps {
  userId: number;
  onPostCreated: () => void;
}

export default function CreatePost({ userId, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await createPost({ content, userId });
      if (res.success) {
        setContent("");
        onPostCreated();
      } else {
        setError(res.message);
      }
    } catch {
      setError("Failed to create post");
    }

    setLoading(false);
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-end mt-3">
          <Button
            type="submit"
            loading={loading}
            disabled={!content.trim()}
          >
            Post
          </Button>
        </div>
      </form>
    </Card>
  );
}
