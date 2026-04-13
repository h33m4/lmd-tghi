import React from "react";
import CountryAdminLayout from "@/components/shared/program-admin/CountryAdminLayout";

export default function SierraLeoneAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CountryAdminLayout
      program="Sierra_Leone"
      flagSrc="/assets/img/country/sierra-leone-flag.png"
    >
      {children}
    </CountryAdminLayout>
  );
}
