import { ISideBarNavigationData } from "@/types";
import {
  HomeIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
  MapIcon,
  CircleStackIcon,
  GlobeEuropeAfricaIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {
  EthiopiaIcon,
  LiberiaIcon,
  MalawiIcon,
  SierraLeoneIcon,
} from "../../../app/(protected)/kpi-dashboard/components/country-flags";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import AnalyticsCircularIcon from "@/components/icons/analytics-circular";
import TableCollapsibleIcon from "@/components/icons/table-collapsible";
import TableEnhancedIcon from "@/components/icons/table-enhanced";
import FinancialStatisticsIcon from "@/components/icons/financial-statistics";
import GlobeIcon from "@/components/icons/globe";
import AfricaMap from "@/components/icons/africa-map";
import FAQIcon from "@/components/icons/faq";
import AffIcon from "@/components/icons/aff-icon";

const KpiDashboardNavigationData: ISideBarNavigationData[] = [
  { name: "Overview", icon: HomeIcon, current: true, href: "/" },
  {
    name: "Theory of Change",
    icon: AnalyticsCircularIcon, //ChartPieIcon
    current: false,
    href: "/theory-of-change",
  },
  {
    name: "KPI Progress Summary",
    icon: FinancialStatisticsIcon,
    current: false,
    href: "/kpi-progress-summary",
  },
  {
    name: "Global Scale KPIs",
    icon: GlobeIcon,
    href: "/global-scale",
    current: false,
  },
  {
    name: "Ethiopia KPIs",
    icon: EthiopiaIcon,
    href: "/ethiopia",
    current: false,
  },
  {
    name: "Liberia KPIs",
    icon: LiberiaIcon,
    href: "/liberia",
    current: false,
  },
  {
    name: "Malawi KPIs",
    icon: MalawiIcon,
    href: "/malawi",
    current: false,
  },
  {
    name: "Sierra Leone KPIs",
    icon: SierraLeoneIcon,
    href: "/sierra_leone",
    current: false,
  },
  {
    name: "AFF KPIs",
    icon: AffIcon,
    href: "/aff",
    current: false,
  },
  {
    name: "KPI Data Table",
    icon: TableCollapsibleIcon,
    href: "/kpi-data-tables",
    current: false,
  },
  {
    name: "Frequently Asked Questions",
    icon: QuestionMarkCircledIcon,
    href: "/faq",
    current: false,
  },
];

const KpiDashboardAdminNavigationData: ISideBarNavigationData[] = [
  {
    name: "KPI Change Log",
    icon: TableEnhancedIcon,
    href: "/kpi-change-log",
    current: false,
  },
];

export { KpiDashboardNavigationData, KpiDashboardAdminNavigationData };
