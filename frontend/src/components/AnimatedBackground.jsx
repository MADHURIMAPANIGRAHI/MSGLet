'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Bell, Zap } from "lucide-react";

/* Floating Icon */
const FloatingIcon = ({ children, delay, duration, x, y }) => (
  <motion.div
    className="absolute text-primary/20"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      rotate: [-5, 5, -5],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

/* Data Line */
const DataLine = ({ delay, top }) => (
  <motion.div
    className="absolute left-0 h-px w-full"
    style={{ top: `${top}%` }}
    initial={{ opacity: 0, scaleX: 0 , scaleY: 0}}
    animate={{ opacity: [0, 0.5, 0], scaleX: [0, 2, 0], scaleY:[3,0,0] }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
  </motion.div>
);

/* Particle */
const Particle = ({ delay, x, y }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-primary/40"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

export const AnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  // ✅ Generate random particles ONLY on client
  useEffect(() => {
    const generatedParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      delay: i * 0.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));

    setParticles(generatedParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

      {/* Floating icons */}
      <FloatingIcon delay={0} duration={8} x={10} y={20}>
        <MessageSquare size={48} />
      </FloatingIcon>
      <FloatingIcon delay={1} duration={10} x={85} y={15}>
        <Send size={40} />
      </FloatingIcon>
      <FloatingIcon delay={2} duration={7} x={75} y={60}>
        <Bell size={36} />
      </FloatingIcon>
      <FloatingIcon delay={1.5} duration={9} x={15} y={70}>
        <Zap size={44} />
      </FloatingIcon>

      {/* Data flow lines */}
      <DataLine delay={0} top={30} />
      <DataLine delay={2} top={50} />
      <DataLine delay={4} top={70} />

      {/* Particles */}
      {particles.map(p => (
        <Particle key={p.id} {...p} />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#00e5ff 1px, transparent 1px),
            linear-gradient(90deg, #00e5ff 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};
