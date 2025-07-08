"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PublicRoute from "@/components/PublicRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AppLogo from "@/components/AppLogo";
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate required fields
    if (
      !formData.firstName.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        // Redirect to login page after successful registration
        router.push("/login?message=Registration successful! Please log in.");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-green-400/10 blur-3xl filter"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl filter"></div>
        <div className="absolute top-1/3 right-0 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl filter"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 w-full max-w-6xl"
        >
          <Card className="overflow-hidden border border-green-100/80 bg-white/80 shadow-xl backdrop-blur-sm dark:border-green-900/30 dark:bg-gray-900/80">
            <div className="grid md:grid-cols-6">
              {/* Left side - Signup Image */}
              <div className="hidden md:col-span-3 md:block">
                <div className="relative h-full">
                  <Image
                    src="/signupImage.jpg"
                    alt="Healthy lifestyle"
                    fill
                    style={{ objectFit: "cover" }}
                    className="opacity-90"
                    priority
                  />
                </div>
              </div>

              {/* Right side - Registration Form */}
              <div className="p-2 md:col-span-3 md:p-6">
                <CardHeader className="space-y-1 px-2 md:px-4">
                  <div className="mb-2 flex items-center justify-center md:justify-start">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AppLogo variant="icon-only" size="lg" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="ml-2 text-xl font-bold"
                    >
                      NutriScan
                    </motion.div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Create your account
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Join NutriScan to analyze your food based on your medical
                    conditions
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-4 space-y-4 px-2 md:px-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center space-x-2 rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          First Name
                        </Label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-4 w-4" />
                          </div>
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="First name"
                            className="border-gray-300 bg-white pl-10 focus:border-green-500 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-green-400"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Last Name
                        </Label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-4 w-4" />
                          </div>
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Last name"
                            className="border-gray-300 bg-white pl-10 focus:border-green-500 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-green-400"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Username
                      </Label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-4 w-4" />
                        </div>
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="Choose a username"
                          className="border-gray-300 bg-white pl-10 focus:border-green-500 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-green-400"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="h-4 w-4" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="border-gray-300 bg-white pl-10 focus:border-green-500 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-green-400"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Create a password"
                          className="border-gray-300 bg-white pl-10 focus:border-green-500 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-green-400"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          className="border-gray-300 bg-white pl-10 focus:border-green-500 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-green-400"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 dark:from-green-500 dark:to-blue-400"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="mr-2 h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating Account...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1s_infinite]"></span>
                    </Button>
                  </form>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                        Already registered?
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      Have an account?{" "}
                      <Link
                        href="/login"
                        className="hover font-semibold text-blue-600 dark:hover:text-blue-300"
                      >
                        Sign in
                      </Link>
                    </p>
                    <Link
                      href="/"
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      ← Back to home
                    </Link>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </PublicRoute>
  );
}
