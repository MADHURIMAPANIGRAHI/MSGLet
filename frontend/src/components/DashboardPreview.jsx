import { motion } from "framer-motion";
import {
  Send,
  MessageSquareText,
  Activity,
  Bell,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  trend,
  delay,
}) => (
  <motion.div
    className="glass-card p-5"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      <div
        className={`flex items-center gap-1 text-xs ${
          trend === "up" ? "text-green-400" : "text-red-400"
        }`}
      >
        {trend === "up" ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {change}
      </div>
    </div>

    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </motion.div>
);

const AnimatedChart = () => (
  <motion.div
    className="glass-card p-6 col-span-2"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4, duration: 0.6 }}
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h4 className="font-semibold">Message Volume</h4>
        <p className="text-sm text-muted-foreground">Last 7 days</p>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Sent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-muted-foreground">Received</span>
        </div>
      </div>
    </div>

    {/* Chart bars */}
    <div className="flex items-end justify-between h-40 gap-2">
      {[65, 45, 80, 55, 90, 70, 85].map((height, i) => (
        <div key={i} className="flex-1 flex flex-col gap-1">
          <motion.div
            className="bg-primary/80 rounded-t-sm relative overflow-hidden"
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{
              delay: 0.5 + i * 0.1,
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          </motion.div>

          <motion.div
            className="bg-secondary/60 rounded-t-sm"
            initial={{ height: 0 }}
            whileInView={{ height: `${height * 0.6}%` }}
            viewport={{ once: true }}
            transition={{
              delay: 0.6 + i * 0.1,
              duration: 0.6,
              ease: "easeOut",
            }}
          />
        </div>
      ))}
    </div>

    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <span key={day}>{day}</span>
      ))}
    </div>
  </motion.div>
);

export const DashboardPreview = () => {
  return (
    <section className="py-32 relative">
      <div className="container px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real-time <span className="text-gradient-purple">Dashboard</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor every message, API call, and notification from one beautiful
            interface
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-card overflow-hidden border-2 border-glass-border/50">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border bg-card/80">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>

              <div className="flex-1 mx-4">
                <div className="bg-muted/50 rounded-md px-4 py-1.5 text-sm text-muted-foreground max-w-md mx-auto">
                  dashboard.MSGLet.io
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 bg-background/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  icon={Send}
                  label="Messages Sent"
                  value="1.2M"
                  change="+12.5%"
                  trend="up"
                  delay={0.1}
                />
                <StatCard
                  icon={MessageSquareText}
                  label="Received"
                  value="892K"
                  change="+8.2%"
                  trend="up"
                  delay={0.2}
                />
                <StatCard
                  icon={Activity}
                  label="API Calls"
                  value="4.5M"
                  change="+23.1%"
                  trend="up"
                  delay={0.3}
                />
                <StatCard
                  icon={Bell}
                  label="Notifications"
                  value="156K"
                  change="-2.4%"
                  trend="down"
                  delay={0.35}
                />
              </div>

              <AnimatedChart />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
