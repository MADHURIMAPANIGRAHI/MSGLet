"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { User, Mail, Lock, Loader2, CheckCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/Api";
import TermsContent from "@/components/legal/TermsContent";
import PrivacyContent from "@/components/legal/PrivacyContent";
const Signin = () => {
  const navigate = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const updateField = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    const payload = {
      username: formData.fullName,
      gmail: formData.email,
      password: formData.password,
    };
    
    try {
    await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setIsSuccess(true);

    setTimeout(() => {
      navigate.push("/login");
    }, 2000);
  }catch (error) {
    setIsLoading(false);
     if (error.message.includes("exists")) {
    setErrors({ form: "User already exists. Please login." });
  } else {
    setErrors({ form: error.message });
  }
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Start building with scalable messaging APIs"
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-primary" />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold text-foreground mb-2"
            >
              Account Created Successfully!
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground"
            >
              Redirecting you to login...
            </motion.p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FloatingInput
              id="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={updateField("fullName")}
              error={errors.fullName}
              success={!!formData.fullName && !errors.fullName}
              icon={<User className="w-5 h-5" />}
            />

            <FloatingInput
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={updateField("email")}
              error={errors.email}
              success={!!formData.email && !errors.email}
              icon={<Mail className="w-5 h-5" />}
            />

            <div className="space-y-2">
              <FloatingInput
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={updateField("password")}
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                showPasswordToggle
              />
              <PasswordStrength password={formData.password} />
            </div>

            <FloatingInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={updateField("confirmPassword")}
              error={errors.confirmPassword}
              success={
                !!formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                !errors.confirmPassword
              }
              icon={<Lock className="w-5 h-5" />}
              showPasswordToggle
            />

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked)}
                  className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                >
                  I agree to the{" "}
                  <button
  type="button"
  onClick={() => setActiveModal("terms")}
  className="text-primary hover:underline"
>
  Terms of Service
</button>
 <span> & </span>
<button
  type="button"
  onClick={() => setActiveModal("privacy")}
  className="text-primary hover:underline"
>
  Privacy Policy
</button>
                </label>
              </div>

              {errors.terms && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.terms}
                </motion.p>
              )}
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.div>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
      <AnimatePresence>
  {activeModal && (
    <motion.div
     className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-md pt-[10vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setActiveModal(null)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background w-[90%] max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-background px-6 py-4 border-b">
          <h2 className="text-2xl font-bold">
            {activeModal === "terms"
              ? "Terms of Service"
              : "Privacy Policy"}
          </h2>
        </div>

        {/* Scroll Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[65vh]">
          {activeModal === "terms"
            ? <TermsContent />
            : <PrivacyContent />}
        </div>

        {/* Close Button */}
        <div className="px-6 py-4 border-t text-right">
          <Button onClick={() => setActiveModal(null)}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </AuthLayout>
  );
};

export default Signin;
