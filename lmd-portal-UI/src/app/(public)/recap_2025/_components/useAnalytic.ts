// import { useState, useEffect, SetStateAction } from "react";
// import Papa from "papaparse";
// import { PortalEvent } from "./analytics";
// import { YearStats } from "./statsData";

// export function useAnalyticsData() {
//   const [data, setData] = useState<PortalEvent[]>([]);
//   const [stats, setStats] = useState<YearStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const response = await fetch("./events.csv");
//         const csvText = await response.text();

//         Papa.parse<PortalEvent>(csvText, {
//           header: true,
//           complete: (results) => {
//             const events = results.data.filter((e) => e.id);
//             setData(events);
//             setStats(calculateStats(events));
//             setLoading(false);
//           },
//           error: (err: { message: SetStateAction<string | null> }) => {
//             setError(err.message);
//             setLoading(false);
//           },
//         });
//       } catch (err) {
//         setError("Failed to load analytics data");
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, []);

//   return { data, stats, loading, error };
// }

// function calculateStats(events: PortalEvent[]): YearStats {
//   const uniqueUsers = new Set(events.map((e) => e.UserEmail)).size;
//   const sessions = events.filter((e) => e.EventType === "session");
//   const logins = events.filter((e) => e.EventType === "login");
//   const pageViews = events.filter((e) => e.EventType === "page");

//   // Total session duration in seconds
//   const totalSessionDuration = sessions.reduce((sum, e) => {
//     const duration = parseInt(e.SessionDuration) || 0;
//     return sum + duration;
//   }, 0);

//   // Country breakdown
//   const countryMap = new Map<string, number>();
//   events.forEach((e) => {
//     if (e.DeviceLocationCountry) {
//       countryMap.set(
//         e.DeviceLocationCountry,
//         (countryMap.get(e.DeviceLocationCountry) || 0) + 1
//       );
//     }
//   });
//   const topCountries = Array.from(countryMap.entries())
//     .map(([country, count]) => ({ country, count }))
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 5);

//   // City breakdown
//   const cityMap = new Map<string, number>();
//   events.forEach((e) => {
//     if (e.DeviceLocationCity) {
//       cityMap.set(
//         e.DeviceLocationCity,
//         (cityMap.get(e.DeviceLocationCity) || 0) + 1
//       );
//     }
//   });
//   const topCities = Array.from(cityMap.entries())
//     .map(([city, count]) => ({ city, count }))
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 5);

//   // Page breakdown
//   const pageMap = new Map<string, number>();
//   pageViews.forEach((e) => {
//     if (e.PageURL) {
//       const pageName = extractPageName(e.PageURL);
//       pageMap.set(pageName, (pageMap.get(pageName) || 0) + 1);
//     }
//   });
//   const topPages = Array.from(pageMap.entries())
//     .map(([page, count]) => ({ page, count }))
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 5);

//   // Device breakdown
//   const deviceMap = new Map<string, number>();
//   events.forEach((e) => {
//     if (e.DeviceType) {
//       deviceMap.set(e.DeviceType, (deviceMap.get(e.DeviceType) || 0) + 1);
//     }
//   });
//   const deviceBreakdown = Array.from(deviceMap.entries())
//     .map(([device, count]) => ({ device, count }))
//     .sort((a, b) => b.count - a.count);

//   // Browser breakdown
//   const browserMap = new Map<string, number>();
//   events.forEach((e) => {
//     if (e.DeviceBrowser) {
//       browserMap.set(
//         e.DeviceBrowser,
//         (browserMap.get(e.DeviceBrowser) || 0) + 1
//       );
//     }
//   });
//   const browserBreakdown = Array.from(browserMap.entries())
//     .map(([browser, count]) => ({ browser, count }))
//     .sort((a, b) => b.count - a.count);

//   // OS breakdown
//   const osMap = new Map<string, number>();
//   events.forEach((e) => {
//     if (e.DeviceOS) {
//       osMap.set(e.DeviceOS, (osMap.get(e.DeviceOS) || 0) + 1);
//     }
//   });
//   const osBreakdown = Array.from(osMap.entries())
//     .map(([os, count]) => ({ os, count }))
//     .sort((a, b) => b.count - a.count);

//   // Monthly activity
//   const monthMap = new Map<string, number>();
//   const monthNames = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   events.forEach((e) => {
//     if (e.Timestamp) {
//       const date = new Date(e.Timestamp);
//       const month = monthNames[date.getMonth()];
//       monthMap.set(month, (monthMap.get(month) || 0) + 1);
//     }
//   });
//   const monthlyActivity = monthNames.map((month) => ({
//     month,
//     count: monthMap.get(month) || 0,
//   }));

//   // Top users
//   const userMap = new Map<string, number>();
//   events.forEach((e) => {
//     if (e.UserEmail) {
//       userMap.set(e.UserEmail, (userMap.get(e.UserEmail) || 0) + 1);
//     }
//   });
//   const topUsers = Array.from(userMap.entries())
//     .map(([email, count]) => ({ email, count }))
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 5);

//   return {
//     totalEvents: events.length,
//     totalSessions: sessions.length,
//     totalLogins: logins.length,
//     uniqueUsers,
//     totalSessionDuration,
//     topCountries,
//     topCities,
//     topPages,
//     deviceBreakdown,
//     browserBreakdown,
//     osBreakdown,
//     monthlyActivity,
//     topUsers,
//   };
// }

// function extractPageName(url: string): string {
//   try {
//     const urlObj = new URL(url);
//     const path = urlObj.pathname;
//     if (path === "/" || path === "") return "Home";
//     const segments = path.split("/").filter(Boolean);
//     return segments.join(" / ");
//   } catch {
//     return url;
//   }
// }
