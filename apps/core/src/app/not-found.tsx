import Link from "next/link";
import { Button } from "@repo/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
        been moved or deleted.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
