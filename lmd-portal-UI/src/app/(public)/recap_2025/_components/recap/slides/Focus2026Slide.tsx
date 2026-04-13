import { motion } from "framer-motion";
import {
  Sparkles,
  Bot,
  Database,
  LayoutDashboard,
  Target,
  ArrowRight,
} from "lucide-react";

const focusItems = [
  {
    icon: LayoutDashboard,
    title: "Functional Programs Dashboard",
    description:
      "Fully functional enterprise-grade program and project dashboards with automatic reports for our programs including AFF.",
    bgColor: "bg-lmh-green",
    textColor: "text-white",
    tag: "Coming FY26 Q3",
  },
  {
    icon: Bot,
    title: "LMD AI Agent",
    description:
      "Query dashboards and portal content using natural language. Get instant insights without complex filters.",
    bgColor: "bg-lmh-pink",
    textColor: "text-white",
    tag: "Coming FY26 Q3",
  },
  {
    icon: Database,
    title: "AI-Powered Data Pipelines",
    description:
      "Automated ingestion of routine program and project data with intelligent validation, transformation and insights",
    bgColor: "bg-lmh-blue",
    textColor: "text-lmh-dark-blue",
    tag: "Coming FY26 Q3",
  },

  {
    icon: Target,
    title: "Automated OKR Tracker",
    description:
      "Facilitates automatic tracking and monitoring of program OKRs using live system data, piloted through the Liberia OKR Dashboard.",
    bgColor: "bg-lmh-yellow",
    textColor: "text-lmh-dark-blue",
    tag: "Coming FY26 Q3",
  },
];

export function Focus2026Slide() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lmh-blue/20 text-lmh-blue mb-4"
          animate={{
            boxShadow: [
              "0 0 20px rgba(75, 183, 214, 0.3)",
              "0 0 40px rgba(75, 183, 214, 0.5)",
              "0 0 20px rgba(75, 183, 214, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Looking Ahead</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl  text-white font-bold mb-4">
          Focus for <span className="text-lmh-yellow">2026</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Exciting innovations coming to the platform
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {focusItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group glass p-6 rounded-2xl border border-lmh-blue/20 hover:border-lmh-blue/40 transition-all cursor-pointer relative overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div
              className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-5 transition-opacity`}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <item.icon className={`w-6 h-6 ${item.textColor}`} />
                </motion.div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${item.bgColor} ${item.textColor}`}
                >
                  {item.tag}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold mb-2 group-hover:text-lmh-blue transition-colors text-white">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>

              {/* <motion.div
                className="mt-4 flex items-center gap-2 text-lmh-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </motion.div> */}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-muted-foreground text-sm">
          Stay tuned for updates as we build the future of{" "}
          <span className="text-lmh-green font-semibold">
            data-driven health programs
          </span>
        </p>
      </motion.div>
    </div>
  );
}
