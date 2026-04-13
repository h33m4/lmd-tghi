import { LmhPrograms } from "@/types";
import { BarChart3, LucideProps } from "lucide-react";
import React from "react";

interface AdminSectionComponentProps {
  title: string;
  description: string;
  rightSideHeaderContent?: React.ReactNode;
  children: React.ReactNode;
  HeaderIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

function AdminSectionComponent({
  title,
  description,
  rightSideHeaderContent,
  children,
  HeaderIcon = BarChart3,
}: AdminSectionComponentProps) {
  return (
    <div className="bg-background/50 rounded-xl shadow-sm border">
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 ">
        <div className="flex items-end justify-between ">
          <div className="flex gap-2">
            <div className="h-14 w-14 bg-lmh-blue/10 rounded-xl flex items-center justify-center">
              <HeaderIcon className="h-7 w-7 text-lmh-blue" />
            </div>
            <div className="">
              <h2 className="text-lg font-bold text-lmh-pink dark:text-gray-200">
                {title}
              </h2>
              <p className="text-sm text-foreground mt-1">{description}</p>
            </div>
          </div>

          {rightSideHeaderContent}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default AdminSectionComponent;
