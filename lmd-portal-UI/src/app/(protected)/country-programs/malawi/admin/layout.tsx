import React from "react";
import CountryAdminLayout from "@/components/shared/program-admin/CountryAdminLayout";

export default function MalawiAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CountryAdminLayout
      program="Malawi"
      flagSrc="/assets/img/country/malawi-flag.png"
    >
      {children}
    </CountryAdminLayout>
  );
}
