import {
  ChartPieIcon,
  CircleStackIcon,
  DocumentChartBarIcon,
  HomeIcon,
  MapIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { ISideBarNavigationData } from "@/types";

const MalawiNavigation: ISideBarNavigationData[] = [
  { name: "Overview", icon: HomeIcon, current: true, href: "" },
  {
    name: "Dashboards",
    icon: ChartPieIcon,
    current: false,
    href: "/dashboards",
    // children: [
    //   // { name: "Sample dashboard", href: "/dashboards/sampledashboard" },
    //   // { name: "CBMNC Training", href: "/dashboards/cbmnc-training" },
    //   { name: "iCHIS Training", href: "/dashboards/ichis-training" },
    // ],
  },
  {
    name: "Reports",
    icon: DocumentChartBarIcon,
    current: false,
    href: "/reports",
    // children: [{ name: "Data Review", href: "/reports/data-reviews" }],
  },
  {
    name: "Maps",
    icon: MapIcon,
    href: "/maps",
    current: false,
  },
  {
    name: "Program Data",
    icon: CircleStackIcon,
    href: "/program-data",
    current: false,
  },
];

const LiberiaNavigation: ISideBarNavigationData[] = [
  { name: "Overview", icon: HomeIcon, current: true, href: "" },
  {
    name: "Dashboards",
    icon: ChartPieIcon,
    current: false,
    href: "/dashboards",
    // children: [
    //   // { name: "Sick Child", href: "/dashboards/sick-child" },
    //   // { name: "NCHAP Scale", href: "/dashboards/nchap-scale" },
    //   {
    //     name: "CHA Module 1 Summary",
    //     href: "/dashboards/cha-module-1-summary",
    //   },
    // ],
  },
  {
    name: "Reports",
    icon: DocumentChartBarIcon,
    current: false,
    href: "/reports",
    // children: [{ name: "Data Review", href: "/reports/data-reviews" }],
  },
  {
    name: "Maps",
    icon: MapIcon,
    href: "/maps",
    current: false,
  },
  {
    name: "Program Data",
    icon: CircleStackIcon,
    href: "/program-data",
    current: false,
  },
];

const EthiopiaNavigation: ISideBarNavigationData[] = [
  { name: "Overview", icon: HomeIcon, current: true, href: "" },
  {
    name: "Dashboards",
    icon: ChartPieIcon,
    current: false,
    href: "/dashboards",
    // children: [
    //   {
    //     name: "Blended IRT Training",
    //     href: "/dashboards/blended-irt-training",
    //   },
    //   // {
    //   //   name: "NCD Training",
    //   //   href: "/dashboards/ncd-training",
    //   // },
    // ],
  },
  {
    name: "Reports",
    icon: DocumentChartBarIcon,
    current: false,
    href: "/reports",
    // children: [{ name: "Data Review", href: "/reports/data-reviews" }],
  },
  {
    name: "Maps",
    icon: MapIcon,
    href: "/maps",
    current: false,
  },
  {
    name: "Program Data",
    icon: CircleStackIcon,
    href: "/program-data",
    current: false,
  },
];

const SierraLeoneNavigation: ISideBarNavigationData[] = [
  { name: "Overview", icon: HomeIcon, current: true, href: "" },
  {
    name: "Dashboards",
    icon: ChartPieIcon,
    current: false,
    href: "/dashboards",
    // children: [
    //   // { name: "Sample dashboard", href: "/dashboards/sampledashboard" },
    //   // { name: "EGH Dashboard", href: "/dashboards/egh-training" },
    //   {
    //     name: "Nation Pre-Service Training for CHWs",
    //     href: "/dashboards/national-pre-service-training-for-chws",
    //   },
    // ],
  },
  {
    name: "Reports",
    icon: DocumentChartBarIcon,
    current: false,
    href: "/reports",
    // children: [{ name: "Data Review", href: "/reports/data-reviews" }],
  },
  {
    name: "Maps",
    icon: MapIcon,
    href: "/maps",
    current: false,
  },
  {
    name: "Program Data",
    icon: CircleStackIcon,
    href: "/program-data",
    current: false,
  },
];

export {
  MalawiNavigation,
  LiberiaNavigation,
  EthiopiaNavigation,
  SierraLeoneNavigation,
};
