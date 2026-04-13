import FeatureComingSoonCard from "@/components/shared/program-admin/FeatureComingSoon";
import { metaObject } from "@/config/site.config";
import React from "react";
import { BarChart3 } from "lucide-react";

export const metadata = {
  ...metaObject("Malawi Program | Admin - Analytics"),
};

export default function page() {
  return (
    <>
      <div className="  h-full">
        <FeatureComingSoonCard
          cardClassName="h-full flex items-center justify-center"
          title="Advanced Analytics"
          description="Deep insights and predictive analytics for program performance"
          icon={BarChart3}
        />
      </div>
    </>
  );
}
