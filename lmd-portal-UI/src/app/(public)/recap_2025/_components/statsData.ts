export interface YearStats {
  totalPageViews: number;
  totalUniquePageVisits: number;
  totalSessions: number;
  totalLogins: number;
  uniqueUsers: number;
  averageSessionDuration: string;
  totalHoursSpent: number;
  totalSessionDuration: number;
  topCountries: { country: string; count: number }[];
  topCities: { city: string; count: number }[];
  topPages: { page: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  osBreakdown: { os: string; count: number }[];
  monthlyActivity: { month: string; count: number }[];
  topTechUsers: {
    email: string;
    name: string;
    department: string;
    uniqueVisits: number;
    totalVisits: number;
  }[];
  topNonTechUsers: {
    email: string;
    name: string;
    department: string;
    uniqueVisits: number;
    totalVisits: number;
  }[];
}

export const portalStatsData: YearStats = {
  totalPageViews: 11894,
  totalUniquePageVisits: 147,
  totalSessions: 8650,
  totalLogins: 759,
  totalHoursSpent: 400,
  averageSessionDuration: "70 min",
  uniqueUsers: 59,
  totalSessionDuration: 987654, // seconds
  topCountries: [
    { country: "Ghana", count: 135 },
    { country: "United States", count: 96 },
    { country: "United Kingdom", count: 54 },
    { country: "Ethiopia", count: 37 },
    { country: "Liberia", count: 32 },
    { country: "Malawi", count: 32 },
    { country: "India", count: 10 },
    { country: "Uganda", count: 9 },
    { country: "Unknown", count: 56 },
  ],
  topCities: [
    { city: "Accra", count: 194 },
    { city: "Berlin", count: 900 },
    { city: "Mumbai", count: 850 },
    { city: "São Paulo", count: 750 },
    { city: "Toronto", count: 600 },
  ],
  topPages: [
    { page: "KPI Dashboard", count: 3200 },
    { page: "KPI Dashboard - Data Tables", count: 2100 },
    { page: "External KPI Dashboard", count: 496 },
    { page: "Ethiopia Program", count: 472 },
    { page: "Liberia Program", count: 114 },
  ],
  deviceBreakdown: [
    { device: "Desktop", count: 59 },
    { device: "Mobile", count: 4 },
    { device: "Tablet", count: 1 },
  ],
  browserBreakdown: [
    { browser: "Chrome", count: 55 },
    { browser: "Safari", count: 4 },
    { browser: "Microsoft Edge", count: 3 },
  ],
  osBreakdown: [
    { os: "Windows", count: 43 },
    { os: "MacOS", count: 19 },
    { os: "Linux", count: 4 },
  ],
  monthlyActivity: [
    { month: "April", count: 485 },
    { month: "May", count: 1510 },
    { month: "June", count: 1426 },
    { month: "July", count: 756 },
    { month: "August", count: 626 },
    { month: "September", count: 1226 },
    { month: "October", count: 2509 },
    { month: "November", count: 2007 },
    { month: "December", count: 1349 },
  ],
  topTechUsers: [
    {
      email: "bwillet@lastmilehealth.org",
      name: "Barbara Willet",
      department: "GMERL",
      uniqueVisits: 41,
      totalVisits: 468,
    },
    {
      email: "jkrause@lastmilehealth.org",
      name: "Julie Krause",
      department: "GMERL",
      uniqueVisits: 35,
      totalVisits: 415,
    },
    {
      email: "mbegley@lastmilehealth.org",
      name: "Mark Begley",
      department: "GMERL",
      uniqueVisits: 12,
      totalVisits: 265,
    },
    {
      email: "mmantus@lastmilehealth.org",
      name: "Moly Mantus",
      department: "GMERL",
      uniqueVisits: 30,
      totalVisits: 216,
    },
    {
      email: "mdennis@lastmilehealth.org",
      name: "Mardieh Dennis",
      department: "Liberia Technical Services",
      uniqueVisits: 29,
      totalVisits: 214,
    },
    {
      email: "dnair@lastmilehealth.org",
      name: "Divya Nair",
      department: "CTO",
      uniqueVisits: 18,
      totalVisits: 136,
    },
  ],
  topNonTechUsers: [
    {
      email: "ddake@lastmilehealth.org",
      name: "Dela Dake",
      department: "F&A",
      uniqueVisits: 28,
      totalVisits: 265,
    },
    {
      email: "dburnett@lastmilehealth.org",
      name: "Delia Burnett",
      department: "P&C",
      uniqueVisits: 19,
      totalVisits: 162,
    },
    {
      email: "aasenso-addo@lastmilehealth.org",
      name: "Angelina Asenso-Addo",
      department: "P&C",
      uniqueVisits: 17,
      totalVisits: 143,
    },

    {
      email: "awaldron@lastmilehealth.org",
      name: "Abigail Waldron",
      department: "PSP",
      uniqueVisits: 33,
      totalVisits: 111,
    },
    {
      email: "ekojo-osafo@lastmilehealth.org",
      name: "Emmanuel Kojo Osafo",
      department: "P&C",
      uniqueVisits: 19,
      totalVisits: 101,
    },
    {
      email: "cblizzard@lastmilehealth.org",
      name: "Catherine Blizzard",
      department: "P&C",
      uniqueVisits: 22,
      totalVisits: 94,
    },
  ],
};
