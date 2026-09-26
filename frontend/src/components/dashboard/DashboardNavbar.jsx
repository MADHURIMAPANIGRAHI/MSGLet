"use client";
import { motion } from "framer-motion";
import { Zap, Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Dashboard", href: "/user/dashboard" },
  
  { label: "API", href: "/user/apikeys" },
  
];

export const DashboardNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
const pathname = usePathname();
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 h-16"
    >
      <div className="h-full mx-4 mt-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-cyan transition-all duration-300 group-hover:bg-primary/30">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:block">
              MSGLet
            </span>
          </Link>

          
          {/* Desktop Navigation */}
          
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden md:flex w-10 h-10 rounded-xl bg-muted/50 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </button>

            {/* Upgrade Button */}
            {/* <Button variant="glow" size="sm" className="hidden sm:flex">
              Upgrade Plan
            </Button> */}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden mx-4 mt-2 p-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  link.label === "Dashboard"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};