"use client";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Code2,
  CreditCard,
  Settings,
  Users,
  MessageSquare,
  Key,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter  } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth"; 
import { useToast } from "@/hooks/use-toast";
const mainLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/user/dashboard" },
  //{ icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  //{ icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  //{ icon: Users, label: "Users", href: "/dashboard/users" },
  //{ icon: Code2, label: "API Console", href: "/dashboard/api" },
  { icon: Key, label: "API Keys", href: "/user/apikeys" },
];

// const settingsLinks = [
//   { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
//   { icon: Shield, label: "Security", href: "/dashboard/security" },
//   { icon: Settings, label: "Settings", href: "/dashboard/settings" },
// ];

const bottomLinks = [
  { icon: LogOut, label: "Sign Out", href: "/login", isLogout: true },
];

export const DashboardSidebar = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const { toast } = useToast();
   const handleLogout = async (e) => {
    e.preventDefault();
    
    try {
      await logout(); // ✅ Call the logout function from auth.js
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      // Even if backend fails, we cleared the session, so redirect anyway
      toast({
        title: "Logged out",
        description: "Session cleared successfully.",
      });
      router.push("/login");
    }
  };

  const NavLink = ({ icon: Icon, label, href, isLogout }) => {
    const isActive = currentPath === href;

    if ((isLogout)) {
      return (
        <button
          onClick={handleLogout}
          className={cn(
            "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative w-full text-left",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Icon className="w-5 h-5 transition-all duration-200 group-hover:text-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      );
    }

    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
          isActive
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        <Icon
          className={cn(
            "w-5 h-5 transition-all duration-200",
            isActive ? "text-primary" : "group-hover:text-foreground"
          )}
        />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="hidden lg:flex fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] flex-col"
    >
      <div className="flex-1 m-4 mr-0 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 p-4 flex flex-col">
        {/* Main Menu */}
        <div className="space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </p>
          {mainLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>

        {/* Settings */}
        {/* <div className="mt-6 space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Settings
          </p>
          {settingsLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div> */}

        <div className="flex-1" />

        {/* Usage Card */}
        {/* <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-4">
           <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              API Usage
            </span>
            <span className="text-xs font-bold text-primary">78%</span>
          </div> 

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            />
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            78,000 / 100,000 requests
          </p>
        </div> */}

        {/* Bottom Links */}
        <div className="border-t border-border/30 pt-4 space-y-1">
          {bottomLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>
      </div>
    </motion.aside>
  );
};