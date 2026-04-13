"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { ArrowBigLeft, House } from "lucide-react";

export default function NotFoundComponent() {
  const router = useRouter();
  return (
    <div className="flex min-h-full flex-col bg-background pt-16 pb-12">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
        <div className="flex flex-shrink-0 justify-center">
          <Link href="/" className="inline-flex">
            <span className="sr-only">Your Company</span>
            {/* illustrations  */}
          </Link>
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="font-semibold text-primary text-3xl">404</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-pink sm:text-5xl">
              Page not found.
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Sorry, we could not find the page you are looking for.
            </p>
            <div className="mt-20  flex items-center justify-center gap-2">
              <Button
                className="mr-2 h-9"
                variant={"dark-blue"}
                onClick={() => router.back()}
              >
                {/* <ArrowBigLeft className="h-4 w-4 ml-2" /> */}
                Go Back
              </Button>
              <Link
                href="/home"
                className="h-9 flex items-center justify-center text-base font-medium text-primary hover:bg-gray-200 border border-primary px-3 py-2 rounded-md"
              >
                Go Home
                {/* <House className="h-4 w-4 ml-2" /> */}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
