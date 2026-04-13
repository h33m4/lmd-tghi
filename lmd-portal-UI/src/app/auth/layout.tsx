import React from "react";
import Footer from "@/components/footer/Footer";
import NonAuthNavbar from "@/components/navbar/NonAuth";
import ReCaptureProvider from "@/components/Providers/ReCaptureProvider";

import AuthHero from "./_components/AuthHero";

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
  return (
    <ReCaptureProvider>
      <main className="page-constraints p-0 flex flex-col gap-0">
        <NonAuthNavbar showSignInButton={false} />
        <AuthHero />
        {children} <Footer />
      </main>
    </ReCaptureProvider>
  );
};

export default AuthPageLayout;
