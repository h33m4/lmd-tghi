import React from "react";
import CountryAdminLayout from "@/components/shared/program-admin/CountryAdminLayout";

export default function LiberiaAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CountryAdminLayout
      program="Liberia"
      flagSrc="/assets/img/country/liberia-flag.png"
    >
      {children}
    </CountryAdminLayout>
  );
}
