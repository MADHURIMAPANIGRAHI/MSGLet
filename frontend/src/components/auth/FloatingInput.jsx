
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  success,
  icon,
  showPasswordToggle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isActive = isFocused || value.length > 0;
  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="relative">
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full h-14 px-4 pt-4 pb-2 rounded-xl bg-card/50 border-2 transition-all duration-300 outline-none",
            icon && "pl-12",
            showPasswordToggle && "pr-12",
            isFocused && !error && "border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
            !isFocused && !error && "border-border hover:border-primary/50",
            error && "border-destructive",
            success && !error && "border-primary"
          )}
        />

        {/* Floating Label */}
        <motion.label
          htmlFor={id}
          className={cn(
            "absolute pointer-events-none transition-all z-20",
    "bg-card px-1",               
    icon ? "left-12" : "left-4",   
    isActive
      ? "top-2 text-xs text-primary"
      : "top-1/2 -translate-y-1/2 text-muted-foreground"
          )}
        >
          {label}
        </motion.label>

        {/* Show / Hide Password */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Success Tick */}
        {success && !error && value && (
          <motion.div
    className={cn(
      "absolute top-1/3 -translate-y-1/2",
      showPasswordToggle ? "right-12" : "right-4" 
    )}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
  >
    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
      <Check className="w-3 h-3 text-primary-foreground" />
    </div>
  </motion.div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          className="mt-2 text-sm text-destructive flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <X size={16} />
          {error}
        </motion.p>
      )}
    </div>
  );
};
