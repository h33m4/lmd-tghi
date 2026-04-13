import Footer from "@/components/footer/Footer";
import AuthNavbar from "@/components/navbar/AuthNavbar";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Not Found",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const NotfoundPage = () => {
  return (
    <div className="h-full">
      <AuthNavbar />
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
              <p className="text-base font-semibold text-primary">404</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-pink sm:text-5xl">
                Page not found hehe.
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Sorry, we could not find the page you are looking for.
              </p>
              <div className="mt-20">
                <Link
                  href="/home"
                  className=" text-base font-medium text-primary hover:bg-gray-200 border border-primary px-3 py-2 rounded-md"
                >
                  Go back home
                  {/* <span aria-hidden="true"> →</span> */}
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default NotfoundPage;
