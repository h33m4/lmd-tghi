import { motion } from "framer-motion";
import { Calendar, Rocket, TrendingUp, Users } from "lucide-react";

const milestones = [
  {
    month: "April",
    title: "LMD 2.0 Launch Across Org",
    description:
      "Successfully rolled out Last Mile Data portal organization-wide",
    icon: Rocket,
    bgColor: "bg-lmh-green",
    textColor: "text-white",
  },
  {
    month: "September",
    title: "KPI Dashboard 2.0 Transition",
    description:
      "Complete transition of KPI dashboard from google sheet to LMD 2.0 portal",
    icon: TrendingUp,
    bgColor: "bg-lmh-blue",
    textColor: "text-lmh-dark-blue",
  },
  {
    month: "November & December",
    title: "MERL & Program Capacity Building",
    description:
      "The LMD team engaged MERL and Program teams to strengthen their capacity to effectively leverage LMD in their work",
    icon: Users,
    bgColor: "bg-lmh-pink",
    textColor: "text-white",
  },
];

export function TimelineSlide() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lmh-blue/20 text-lmh-blue mb-4">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">2025 Milestones</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
          Key <span className="text-lmh-yellow">Moments</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The pivotal achievements that shaped our year
        </p>
      </motion.div>

      <div className="relative max-w-4xl w-full">
        {/* Timeline line */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-lmh-blue via-lmh-yellow to-lmh-green"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.month}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
            className={`flex items-center gap-8 mb-12 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div
              className={`flex-1 ${
                index % 2 === 0 ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`glass p-6 rounded-2xl border border-white/10 inline-block ${
                  index % 2 === 0 ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${milestone.bgColor} ${milestone.textColor} text-sm font-semibold mb-3`}
                >
                  {milestone.month}
                </div>
                <h3 className="text-xl font-display font-bold mb-2 text-white">
                  {milestone.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {milestone.description}
                </p>
              </div>
            </div>

            {/* Center icon */}
            <motion.div
              className={`relative z-10 w-14 h-14 rounded-full ${milestone.bgColor} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.1 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.2 }}
            >
              <milestone.icon className={`w-6 h-6 ${milestone.textColor}`} />
            </motion.div>

            <div className="flex-1" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
