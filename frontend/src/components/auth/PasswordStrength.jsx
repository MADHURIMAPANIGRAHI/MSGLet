import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;

    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;

    return score;
  };

  const strength = getStrength(password);

  const getLabel = () => {
    if (strength === 0) return "Enter password";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Strong";
    return "Very Strong";
  };

  const getColor = () => {
    if (strength === 0) return "bg-muted";
    if (strength <= 2) return "bg-destructive";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-primary";
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Strength Bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full",
              level <= strength ? getColor() : "bg-muted"
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: level <= strength ? 1 : 0.5 }}
            transition={{ duration: 0.2, delay: level * 0.05 }}
          />
        ))}
      </div>

      {/* Strength Text */}
      <p
        className={cn(
          "text-xs",
          strength <= 2
            ? "text-destructive"
            : strength <= 3
            ? "text-yellow-500"
            : "text-primary"
        )}
      >
        Password strength: {getLabel()}
      </p>
    </div>
  );
};
