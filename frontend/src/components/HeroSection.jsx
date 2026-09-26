import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./AnimatedBackground";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      <div className="container relative z-10 px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-glass-border bg-card/40 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Now with real-time webhooks</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Messaging APIs{" "}
            <span className="text-gradient-cyan">Built for Scale</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Secure, scalable microservice APIs for message sending, receiving, 
            notifications, and usage tracking.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Link href="/login">
            <Button variant="glow" size="xl" className="group">
              
              Get API Key
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              
            </Button>
            </Link>
            <Link href="/docs">
            <Button variant="glow-outline" size="xl">
              
                <BookOpen className="mr-2" />
                View Documentation
              
            </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {[
              { value: "99.99%", label: "Uptime SLA" },
              { value: "10M+", label: "Messages/day" },
              { value: "<50ms", label: "Latency" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient-cyan">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
