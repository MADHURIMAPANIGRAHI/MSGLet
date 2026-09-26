import { motion } from "framer-motion";
import { Shield, Zap, Lock, MessageSquare } from "lucide-react";
import { AnimatedBackground } from "../AnimatedBackground";

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding (hidden on mobile) */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-lg">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                MSGLet
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl xl:text-5xl font-bold text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Messaging APIs
              <span className="text-gradient-cyan block">
                Built for Scale
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Secure, scalable microservice APIs for message sending, receiving,
              notifications, and usage tracking.
            </motion.p>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: Shield, text: "Enterprise-grade security" },
                { icon: Zap, text: "99.99% uptime SLA" },
                { icon: Lock, text: "End-to-end encryption" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Security indicator */}
            <motion.div
              className="mt-12 flex items-center gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Your data is encrypted and secure</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Mobile Logo */}
            <motion.div
              className="flex items-center gap-3 mb-8 lg:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">
                MSGLet
              </span>
            </motion.div>

            {/* Auth Card */}
            <motion.div
              className="glass-card p-8 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -2 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {title}
                </h2>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>

              {children}
            </motion.div>

            {/* Footer Links */}
            <motion.div
              className="mt-6 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <span className="mx-2">·</span>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <span className="mx-2">·</span>
              <a href="#" className="hover:text-primary transition-colors">
                Support
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
