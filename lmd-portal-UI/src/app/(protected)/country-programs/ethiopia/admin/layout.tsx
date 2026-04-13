import React from "react";
import CountryAdminLayout from "@/components/shared/program-admin/CountryAdminLayout";

export default function EthiopiaAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CountryAdminLayout
      program="Ethiopia"
      flagSrc="/assets/img/country/ethiopia-flag.png"
    >
      {children}
    </CountryAdminLayout>
  );
}
