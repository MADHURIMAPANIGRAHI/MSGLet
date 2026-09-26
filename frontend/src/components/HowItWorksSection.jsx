import { motion } from "framer-motion";
import { UserPlus, Key, Code, Send, Activity } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Register / Login", description: "Create your account in seconds" },
  { icon: Key, title: "Generate API Key", description: "Get your unique access credentials" },
  { icon: Code, title: "Integrate API", description: "Add our SDK to your project" },
  { icon: Send, title: "Send & Receive", description: "Start messaging at scale" },
  { icon: Activity, title: "Monitor Usage", description: "Track everything in real-time" },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />

      <div className="container px-4 relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started in <span className="text-gradient-cyan">5 Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From signup to sending messages in minutes
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  {/* Step number */}
                  <motion.div
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                  >
                    {index + 1}
                  </motion.div>

                  <motion.div
                    className="glass-card p-6 text-center h-full"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 30px hsl(var(--primary) / 0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-card border border-glass-border flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8 text-primary" />
                    </motion.div>

                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Arrow connector for mobile/tablet */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden md:block lg:hidden absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-0.5 h-6 bg-primary/30" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
