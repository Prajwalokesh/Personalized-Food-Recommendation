"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PublicRoute from "@/components/PublicRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AppLogo from "@/components/AppLogo";
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Brain,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear messages when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        console.log("Login successful - PublicRoute will handle redirect");
        // PublicRoute will automatically redirect authenticated users
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl filter"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl filter"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl filter"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 w-full max-w-5xl"
        >
          <Card className="overflow-hidden border border-blue-100/80 bg-white/80 shadow-xl backdrop-blur-sm dark:border-blue-900/30 dark:bg-gray-900/80">
            <div className="grid md:grid-cols-2">
              {/* Left side - Login Form */}
              <div className="p-2 md:p-6">
                <CardHeader className="space-y-1 px-0 md:px-4">
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
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Sign in to analyze your food and get personalized health
                    recommendations
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-4 space-y-6 px-0 md:px-4">
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center space-x-2 rounded-md bg-green-50 p-3 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">{successMessage}</span>
                    </motion.div>
                  )}

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
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="border-gray-300 bg-white pl-10 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-blue-400"
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
                          <Lock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          className="border-gray-300 bg-white pl-10 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-blue-400"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div></div>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400"
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
                          Signing In...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1s_infinite]"></span>
                    </Button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                        OR
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      Don't have an account?{" "}
                      <Link
                        href="/register"
                        className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Sign up
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

              {/* Right side - Image */}
              <div className="hidden md:block">
                <div className="relative h-full">
                  <Image
                    src="/loginImage.jpg"
                    alt="Healthy food background"
                    fill
                    style={{ objectFit: "cover" }}
                    className="opacity-90"
                    priority
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </PublicRoute>
  );
}
