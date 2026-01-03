"use client";

import { useState } from "react";
import type { Post, Comment } from "@repo/types";
import {
  likePost,
  unlikePost,
  getComments,
  createComment,
  hasUserLikedPost,
} from "@repo/api-client";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Avatar } from "@repo/ui/avatar";

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onRefresh: () => void;
}

export default function PostCard({
  post,
  currentUserId,
  onRefresh,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    const res = await getComments(String(post.id));
    if (res.success) {
      setComments(res.data.content);
    }
  };

  const checkLikeStatus = async () => {
    const res = await hasUserLikedPost(String(post.id));
    if (res.success) {
      setLiked(res.data);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      await loadComments();
      await checkLikeStatus();
    }
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      if (liked) {
        await unlikePost(String(post.id));
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(String(post.id));
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch {
      console.error("Like error");
    }
    setLoading(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const res = await createComment(String(post.id), { content: newComment });

    if (res.success) {
      setComments([res.data, ...comments]);
      setNewComment("");
      onRefresh();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="mb-4">
      <div className="flex items-center mb-3">
        <Avatar name={post.username} />
        <div className="ml-3">
          <p className="font-semibold">{post.username}</p>
          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full rounded-lg mb-4"
        />
      )}

      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 border-t pt-3">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1 hover:text-blue-500 ${
            liked ? "text-red-500" : ""
          }`}
        >
          <span>{liked ? "\u2764\ufe0f" : "\ud83e\udd0d"}</span>
          <span>{likeCount}</span>
        </button>
        <button
          onClick={handleToggleComments}
          className="flex items-center gap-1 hover:text-blue-500"
        >
          <span>\ud83d\udcac</span>
          <span>{post.commentCount}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 border-t pt-4">
          <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
            <Input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>

          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {comment.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-2">No comments yet</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
