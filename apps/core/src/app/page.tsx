import Link from "next/link";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Social Media
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Connect with friends, share your thoughts, and discover new content.
          Join our community today!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">Share Posts</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Express yourself and share your thoughts with the world.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-semibold mb-2">Comment & Engage</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Join conversations and connect with others.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-4">❤️</div>
          <h3 className="text-lg font-semibold mb-2">Like & Support</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Show appreciation for content you enjoy.
          </p>
        </Card>
      </div>

      <div className="flex justify-center gap-4 pt-8">
        <Link href="/register">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/feed">
          <Button variant="secondary" size="lg">
            Browse Feed
          </Button>
        </Link>
      </div>
    </div>
  );
}
