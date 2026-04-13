import { motion } from "framer-motion";
import { Building2, BarChart3 } from "lucide-react";

const departments = [
  {
    name: "GMERL",
    uniquePageVisits: 114,
    totalPages: 4138,
    users: 9,
    bgColor: "bg-lmh-green",
  },
  {
    name: "HSS",
    uniquePageVisits: 119,
    totalPages: 5700,
    users: 8,
    bgColor: "bg-lmh-blue",
  },
  {
    name: "PSP",
    uniquePageVisits: 38,
    totalPages: 216,
    users: 6,
    bgColor: "bg-lmh-pink",
  },
  {
    name: "P&C",
    uniquePageVisits: 39,
    totalPages: 556,
    users: 7,
    bgColor: "bg-lmh-yellow",
  },
  {
    name: "F&A",
    uniquePageVisits: 36,
    totalPages: 342,
    users: 5,
    bgColor: "bg-lmh-green",
  },
  {
    name: "Ethiopia Digital Health",
    uniquePageVisits: 14,
    totalPages: 108,
    users: 3,
    bgColor: "bg-lmh-yellow",
  },
  {
    name: "Ethiopia MERL",
    uniquePageVisits: 16,
    totalPages: 85,
    users: 3,
    bgColor: "bg-lmh-blue",
  },
  {
    name: "Liberia MERL",
    uniquePageVisits: 30,
    totalPages: 280,
    users: 3,
    bgColor: "bg-lmh-pink",
  },
];

export function DepartmentsSlide() {
  // const maxVisits = Math.max(...departments.map((d) => d.uniquePageVisits));
  // const totalVisits = departments.reduce(
  //   (sum, d) => sum + d.uniquePageVisits,
  //   0
  // );

  const rankedDepartments = [...departments].sort(
    (a, b) => b.uniquePageVisits - a.uniquePageVisits
  );

  const maxVisits = Math.max(
    ...rankedDepartments.map((d) => d.uniquePageVisits)
  );

  const totalVisits = rankedDepartments.reduce(
    (sum, d) => sum + d.uniquePageVisits,
    0
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lmh-blue/20 text-lmh-blue mb-4">
          <Building2 className="w-4 h-4" />
          <span className="text-sm font-medium">Department Analytics</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
          Usage by <span className="text-lmh-yellow">Department</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Engagement based on unique page visits and active users
        </p>
      </motion.div>

      <div className="max-w-3xl w-full space-y-4">
        {rankedDepartments.map((dept, index) => (
          <motion.div
            key={dept.name}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="glass p-4 rounded-xl border border-lmh-blue/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${dept.bgColor}`} />
                <span className="font-display font-semibold text-white">
                  {dept.name}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {dept.users} users
                </span>
                <span className="font-bold text-white">
                  {dept.uniquePageVisits.toLocaleString()}{" "}
                  <span className="font-semibold">unique page views</span>
                </span>
              </div>
            </div>

            <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${dept.bgColor} rounded-full`}
                initial={{ width: 0 }}
                animate={{
                  width: `${(dept.uniquePageVisits / maxVisits) * 100}%`,
                }}
                transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
              />
            </div>

            <div className="mt-1 text-right text-xs text-muted-foreground">
              {((dept.uniquePageVisits / totalVisits) * 100).toFixed(1)}% of
              total visits
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insight card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-8 glass p-6 rounded-2xl border border-lmh-blue/30 max-w-md text-center"
      >
        <BarChart3 className="w-8 h-8 text-lmh-blue mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          Departments with broader user participation generated the highest
          share of{" "}
          <span className="font-semibold text-white">unique page visits</span>,
          indicating deeper engagement with the platform.
        </p>
      </motion.div>
    </div>
  );
}
