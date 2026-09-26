"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-secondary/30 bg-secondary/10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-secondary">
              Free tier includes 10,000 messages/month
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Start Building in{" "}
            <span className="text-gradient-cyan">Minutes</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of developers building the next generation of messaging applications.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link href="/signup">
            <Button variant="glow" size="xl" className="group">
              Create Free Account
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            </Link>
          </motion.div>

          <motion.p
            className="mt-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            No credit card required • Setup in under 2 minutes
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
