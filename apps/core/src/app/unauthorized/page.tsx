import Link from "next/link";
import { Button } from "@repo/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">401</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
        Unauthorized
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
        You need to be logged in to access this page. Please login to continue.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/">
          <Button variant="secondary">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
