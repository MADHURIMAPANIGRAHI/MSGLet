'use client';
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { tokenStore } from "@/lib/auth";
import { apiRequest, ApiError } from "@/lib/Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maps API error status/message to a user-friendly string
  const resolveErrorMessage = (err) => {
    if (!(err instanceof ApiError)) return "Something went wrong. Please try again.";

    switch (err.status) {
      case 401:
        // Backend returns "Invalid credentials" for both wrong email and wrong password
        return "Invalid email or password. Please check your credentials and try again.";
      case 404:
        return "No account found with this email address.";
      case 409:
        return "An account with this email already exists.";
      case 422:
        return "Invalid input. Please check your details.";
      case 429:
        return "Too many login attempts. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      default:
        // Fall back to the parsed detail message from the server if available
        return err.message || "Something went wrong. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const data = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({
          gmail: email,
          password: password,
        }),
      });

      tokenStore.set(data.access_token);
      window.location.href = "/user/apikeys?fresh=1";
    } catch (err) {
      setErrors({ form: resolveErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Secure access to your messaging microservices"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FloatingInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          success={!!email && !errors.email}
          icon={<Mail className="w-5 h-5" />}
        />

        <FloatingInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          success={!!password && !errors.password}
          icon={<Lock className="w-5 h-5" />}
          showPasswordToggle
        />

        {errors.form && (
          <p className="text-sm text-red-600 text-center">{errors.form}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="remember"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember me
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            variant="glow"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </motion.div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;