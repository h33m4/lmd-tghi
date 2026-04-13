import { auth } from "@/auth";
import { metaObject } from "@/config/site.config";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  ...metaObject("Unauthorized"),
};

export default async function UnauthorizedPage() {
  const session = await auth();
  const groups = session?.user?.groups ?? [];

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <span className="grid h-16 w-16 place-content-center rounded-full bg-red-50 border border-red-200">
          <ShieldExclamationIcon className="h-8 w-8 text-red-500" />
        </span>

        <div>
          <h1 className="text-2xl th-font-heavy text-lmh-dark-grey dark:text-foreground mb-1">
            Access Denied
          </h1>
          <p className="text-sm text-th-text-muted">
            You don&apos;t have permission to view this page.
          </p>
        </div>

        {groups.length > 0 && (
          <div className="text-xs text-th-text-muted border rounded-md px-3 py-2 bg-muted/40 w-full">
            Your current access level:{" "}
            <span className="th-font-medium text-foreground">
              {groups.join(", ")}
            </span>
          </div>
        )}

        <p className="text-xs text-th-text-muted">
          If you believe this is a mistake, contact an LMD administrator to
          request elevated access.
        </p>

        <div className="flex gap-3 mt-2">
          <Link
            href="/home"
            className="inline-flex items-center h-8 px-4 text-sm rounded-md bg-lmh-dark-blue text-white th-font-book hover:opacity-90 transition-opacity"
          >
            Go to Home
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center h-8 px-4 text-sm rounded-md border th-font-book hover:bg-muted transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
