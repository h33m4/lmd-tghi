import React from "react";

import { metaObject } from "@/config/site.config";
import BIConnectorsPage from "@/components/shared/program-admin/credentials/credentaialsManager";
import FeatureComingSoonCard from "@/components/shared/program-admin/FeatureComingSoon";
import { Share2 } from "lucide-react";

export const metadata = {
  ...metaObject("Ethiopia Program | Admin - BI Connectors"),
};

export default function page() {
  return (
    <>
      <div className="  h-full">
        {/* <BIConnectorsPage /> */}
        <FeatureComingSoonCard
          cardClassName="h-full flex items-center justify-center"
          title="BI Connectors"
          description="Generate and manage BI connection credentials"
          icon={Share2}
        />
      </div>
    </>
  );
}
