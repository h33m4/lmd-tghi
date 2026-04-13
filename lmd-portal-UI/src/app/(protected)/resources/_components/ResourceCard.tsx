"use client";
import Link from "next/link";

import HowToGuidesIcon from "@public/assets/icons/resources/how-to-guides.svg";
import MERLToolsIcon from "@public/assets/icons/resources/merl-tools.svg";
import FAQsIcon from "@public/assets/icons/resources/faq.svg";
import SOPIcons from "@public/assets/icons/resources/sop.svg";
import OtherToolsIcon from "@public/assets/icons/resources/other-tools.svg";

export interface IResource {
  name: string;
  icon: () => React.JSX.Element;
  description: string;
  href: string;
  target?: string;
  rel?: string;
}

const AllResources: IResource[] = [
  {
    name: "How to guides",
    icon: () => <HowToGuidesIcon width="60" height="45" viewBox="0 0 85 73" />,
    description: "List of how to go guides",
    href: "/docs",
  },
  {
    name: "MERL Team Tools",
    icon: () => <MERLToolsIcon width="60" height="45" viewBox="0 0 85 73" />,
    description: "List of how to go guides",
    href: "https://lastmilehealth.slite.com/app/docs/nB-oGx4aYl7cbv",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  //   {
  //     name: "Standard Operating Practises (SOP)",
  //     icon: () => <SOPIcons width="60" height="45" viewBox="0 0 85 73" />,
  //     description: "List of how to go guides",
  //     href: "/resources",
  //     target: "_blank",
  //     rel: "noopener noreferrer",
  //   },
  //   {
  //     name: "Learning Agenda",
  //     icon: () => <HowToGuidesIcon width="60" height="45" viewBox="0 0 85 73" />,
  //     description: "List of how to go guides",
  //     href: "/resources",
  //   },

  {
    name: "Other MERL Tools",
    icon: () => <OtherToolsIcon width="60" height="45" viewBox="0 0 85 73" />,
    description: "Other MERL Tools",
    href: "/https://lastmilehealth.slite.com/app/docs/tv6AT-13cmbab5",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    name: "FAQs",
    icon: () => <FAQsIcon width="60" height="45" viewBox="0 0 85 73" />,
    description: "List of how to go guides",
    href: "/docs/faqs",
  },
];

const ResourceCard = ({ resource }: { resource: IResource }) => {
  return (
    <Link
      href={resource.href}
      className="border rounded-sm hover:bg-background hover:border-primary flex flex-col items-center justify-center gap-2 py-6 px-6"
      target={resource.target}
      rel={resource.rel}
    >
      <resource.icon />
      <span>{resource.name}</span>
    </Link>
  );
};

const Resources = () => {
  return (
    <section className="web-page-constraints">
      <div className="my-2  h-[15rem] bg-[url('/assets/img/bg-banner.png')] bg-cover bg-center rounded-2xl"></div>
      <div className="my-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 2xl:gap-10">
          {AllResources.map((resource, _ind) => (
            <ResourceCard resource={resource} key={_ind} />
          ))}
        </div>

        {/* Country Program Guides */}
        <div className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Country Programs</p>
            <h2 className="text-xl font-bold text-foreground">Dashboard &amp; Tool Guides</h2>
            <p className="text-sm text-muted-foreground mt-1">Step-by-step documentation for country-specific dashboards and tools.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            <Link
              href="/resources/liberia-okr-dashboard"
              className="border rounded-lg hover:bg-background hover:border-primary flex flex-col gap-3 py-6 px-6 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <HowToGuidesIcon width="22" height="22" viewBox="0 0 85 73" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Liberia</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">OKR Dashboard</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                How to view, update, and manage OKR records — including monthly updates and milestones. Covers both regular users and admins.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;
