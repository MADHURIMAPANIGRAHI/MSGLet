import { motion } from "framer-motion";
import {
  Activity,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { AnimatedBorderCard } from "./AnimatedBorderCard";

const stats = [
  {
    icon: Activity,
    label: "Total Requests",
    value: "2.4M",
    change: "+12.5%",
    trend: "up",
    description: "vs last month",
  },
  {
    icon: Users,
    label: "Active Users",
    value: "18,429",
    change: "+8.2%",
    trend: "up",
    description: "vs last month",
  },
  {
    icon: Clock,
    label: "API Latency",
    value: "42ms",
    change: "-15.3%",
    trend: "up",
    description: "avg response time",
  },
  {
    icon: AlertTriangle,
    label: "Error Rate",
    value: "0.12%",
    change: "+0.02%",
    trend: "down",
    description: "vs last month",
  },
];

export const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AnimatedBorderCard>
              <div className="p-5 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend === "up" && stat.label !== "Error Rate"
                        ? "bg-primary/10 text-primary"
                        : stat.trend === "down" || stat.label === "Error Rate"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            </AnimatedBorderCard>
          </motion.div>
        );
      })}
    </div>
  );
};