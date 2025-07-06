"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Camera,
  Heart,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  User,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth();

  console.log("Home");

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4 lg:space-y-6">
                <Badge
                  variant="secondary"
                  className="bg-nutriscan-slate-100 dark:bg-nutriscan-slate-800/50 border-nutriscan-slate-200 dark:border-nutriscan-slate-700 w-fit px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
                >
                  <Zap className="text-nutriscan-slate-600 dark:text-nutriscan-slate-400 mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                  <span className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 font-semibold">
                    AI-Powered Food Analysis
                  </span>
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  <span className="text-nutriscan-slate-900 dark:text-white">
                    Personalized Food
                  </span>
                  <span className="text-nutriscan-primary dark:text-nutriscan-primary block">
                    Safety for Your Health
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-lg text-base leading-relaxed sm:text-lg lg:text-xl">
                  {isAuthenticated && user
                    ? `Welcome back, ${user.firstName}! Upload a photo of your food to get personalized safety recommendations based on your health profile.`
                    : "Upload a photo of your food and get personalized safety recommendations based on your chronic diseases and medical conditions. Stay healthy with AI-powered food analysis."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                {loading ? (
                  <div className="bg-muted h-12 w-32 animate-pulse rounded-md sm:h-14"></div>
                ) : isAuthenticated ? (
                  <Button
                    size="lg"
                    asChild
                    className="bg-nutriscan-primary hover:bg-nutriscan-primary-hover h-12 px-6 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl sm:h-14 sm:px-8 sm:text-lg"
                  >
                    <Link href="/analyse">
                      Start Analysing
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      asChild
                      className="bg-nutriscan-primary hover:bg-nutriscan-primary-hover h-12 px-6 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl sm:h-14 sm:px-8 sm:text-lg"
                    >
                      <Link href="/register">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 text-nutriscan-slate-700 dark:text-nutriscan-slate-300 hover:bg-nutriscan-slate-50 dark:hover:bg-nutriscan-slate-800/50 h-12 border-2 px-6 text-base font-semibold transition-all duration-300 sm:h-14 sm:px-8 sm:text-lg"
                    >
                      <Link href="/login">
                        Login
                        <User className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:gap-6 sm:text-sm lg:gap-8">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <CheckCircle className="text-nutriscan-success h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-muted-foreground font-medium">
                    Free to start
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <CheckCircle className="text-nutriscan-success h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-muted-foreground font-medium">
                    Instant results
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <CheckCircle className="text-nutriscan-success h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-muted-foreground font-medium">
                    Privacy focused
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto mt-8 max-w-sm sm:max-w-md md:max-w-lg lg:mt-0 lg:max-w-xl xl:max-w-2xl">
              <div className="bg-nutriscan-slate-100 dark:bg-nutriscan-slate-800/30 relative rounded-2xl p-0.5 sm:rounded-3xl sm:p-1">
                <div className="bg-background rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
                  <div className="bg-background border-nutriscan-slate-200 dark:border-nutriscan-slate-700 mx-auto flex h-64 w-64 items-center justify-center rounded-xl border-2 sm:h-80 sm:w-80 sm:rounded-2xl md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem]">
                    <div className="space-y-3 px-4 text-center sm:space-y-4 md:space-y-5 lg:space-y-6">
                      <div className="relative">
                        <Camera className="text-nutriscan-primary dark:text-nutriscan-primary relative mx-auto h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24" />
                      </div>
                      <div className="space-y-1 sm:space-y-2 md:space-y-3">
                        <h3 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl">
                          Upload & Analyze
                        </h3>
                        <p className="text-muted-foreground mx-auto max-w-xs text-sm sm:text-base md:text-lg">
                          AI-powered food recognition and safety analysis
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced floating cards */}
              <div className="dark:bg-nutriscan-slate-800/80 border-nutriscan-slate-200 dark:border-nutriscan-slate-700 absolute -top-2 -right-2 rounded-lg border bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:-top-4 sm:-right-4 sm:rounded-xl sm:p-3 sm:shadow-xl sm:hover:shadow-2xl md:-top-6 md:-right-6 md:p-4">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Star className="text-nutriscan-accent-amber dark:text-nutriscan-accent-amber h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <span className="text-nutriscan-slate-800 dark:text-nutriscan-slate-200 text-xs font-semibold sm:text-sm">
                    99% Accuracy
                  </span>
                </div>
              </div>

              <div className="dark:bg-nutriscan-slate-800/80 border-nutriscan-slate-200 dark:border-nutriscan-slate-700 absolute -bottom-2 -left-2 rounded-lg border bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:-bottom-4 sm:-left-4 sm:rounded-xl sm:p-3 sm:shadow-xl sm:hover:shadow-2xl md:-bottom-6 md:-left-6 md:p-4">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Shield className="text-nutriscan-accent-emerald dark:text-nutriscan-accent-emerald h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <span className="text-nutriscan-slate-800 dark:text-nutriscan-slate-200 text-xs font-semibold sm:text-sm">
                    Secure & Private
                  </span>
                </div>
              </div>

              <div className="dark:bg-nutriscan-slate-800/80 border-nutriscan-slate-200 dark:border-nutriscan-slate-700 absolute top-1/2 -left-4 rounded-lg border bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:-left-6 sm:rounded-xl sm:p-3 sm:shadow-xl sm:hover:shadow-2xl md:-left-8 md:p-4 lg:-left-10">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Heart className="text-nutriscan-accent-rose dark:text-nutriscan-accent-rose h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <span className="text-nutriscan-slate-800 dark:text-nutriscan-slate-200 text-xs font-semibold sm:text-sm">
                    Health First
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 space-y-3 text-center sm:mb-16 sm:space-y-4">
            <Badge
              variant="secondary"
              className="bg-nutriscan-slate-100 dark:bg-nutriscan-slate-800/50 border-nutriscan-slate-200 dark:border-nutriscan-slate-700 mx-auto w-fit px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 font-semibold">
                Features
              </span>
            </Badge>
            <h2 className="text-nutriscan-slate-900 text-2xl font-bold sm:text-3xl md:text-4xl dark:text-white">
              Why Choose NutriScan?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg lg:text-xl">
              Advanced AI technology meets personalized health insights to keep
              you safe and healthy.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group dark:bg-nutriscan-slate-900/50 border-nutriscan-slate-200 dark:border-nutriscan-slate-700 relative overflow-hidden bg-white transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="bg-nutriscan-primary-light dark:bg-nutriscan-primary-dark border-nutriscan-primary/20 dark:border-nutriscan-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg border">
                  <Camera className="text-nutriscan-primary dark:text-nutriscan-primary h-6 w-6" />
                </div>
                <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100">
                  AI Food Recognition
                </CardTitle>
                <CardDescription>
                  Advanced machine learning identifies food items from photos
                  with 99% accuracy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="text-nutriscan-success mr-2 h-4 w-4" />
                    Instant food identification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-nutriscan-success mr-2 h-4 w-4" />
                    Ingredient analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-nutriscan-success mr-2 h-4 w-4" />
                    Nutritional breakdown
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group dark:bg-nutriscan-slate-900/50 border-nutriscan-slate-200 dark:border-nutriscan-slate-700 relative overflow-hidden bg-white transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="bg-nutriscan-accent-rose-light dark:bg-nutriscan-accent-rose-dark border-nutriscan-accent-rose/20 dark:border-nutriscan-accent-rose mb-4 flex h-12 w-12 items-center justify-center rounded-lg border">
                  <Heart className="text-nutriscan-accent-rose dark:text-nutriscan-accent-rose h-6 w-6" />
                </div>
                <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100">
                  Health Personalization
                </CardTitle>
                <CardDescription>
                  Tailored recommendations based on your chronic diseases and
                  medical conditions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="text-nutriscan-success mr-2 h-4 w-4" />
                    Chronic disease management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-nutriscan-success mr-2 h-4 w-4" />
                    Medical condition alerts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-nutriscan-success mr-2 h-4 w-4" />
                    Personalized nutrient analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group dark:bg-nutriscan-slate-900/50 border-nutriscan-slate-200 dark:border-nutriscan-slate-700 relative overflow-hidden bg-white transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="bg-nutriscan-accent-emerald-light dark:bg-nutriscan-accent-emerald-dark border-nutriscan-accent-emerald/20 dark:border-nutriscan-accent-emerald mb-4 flex h-12 w-12 items-center justify-center rounded-lg border">
                  <Zap className="text-nutriscan-accent-emerald dark:text-nutriscan-accent-emerald h-6 w-6" />
                </div>
                <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100">
                  Instant Results
                </CardTitle>
                <CardDescription>
                  Get comprehensive food safety analysis and recommendations in
                  seconds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="text-nutriscan-success mr-2 h-4 w-4" />
                    Real-time analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-nutriscan-success mr-2 h-4 w-4" />
                    Safety scoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-nutriscan-success mr-2 h-4 w-4" />
                    Alternative suggestions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-nutriscan-slate-900 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 text-center sm:gap-8 md:grid-cols-4">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                10K+
              </div>
              <div className="text-nutriscan-slate-300 text-sm font-medium sm:text-base">
                Foods Analyzed
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                99%
              </div>
              <div className="text-nutriscan-slate-300 text-sm font-medium sm:text-base">
                Accuracy Rate
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                5K+
              </div>
              <div className="text-nutriscan-slate-300 text-sm font-medium sm:text-base">
                Happy Users
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                24/7
              </div>
              <div className="text-nutriscan-slate-300 text-sm font-medium sm:text-base">
                AI Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
            <h2 className="text-nutriscan-slate-900 text-2xl font-bold sm:text-3xl md:text-4xl dark:text-white">
              {isAuthenticated
                ? "Ready to Analyze Your Food?"
                : "Ready to Analyze Your Food?"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg lg:text-xl">
              {isAuthenticated
                ? "Start analyzing your food photos to get personalized safety recommendations based on your health profile."
                : "Join NutriScan and get personalized food safety recommendations based on your health conditions."}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              {loading ? (
                <div className="bg-muted mx-auto h-12 w-32 animate-pulse rounded-md"></div>
              ) : isAuthenticated ? (
                <Button
                  size="lg"
                  asChild
                  className="bg-nutriscan-primary hover:bg-nutriscan-primary-hover h-12 px-6 text-base text-white sm:px-8 sm:text-lg"
                >
                  <Link href="/analyse">
                    Start Analysing
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    asChild
                    className="bg-nutriscan-primary hover:bg-nutriscan-primary-hover h-12 px-6 text-base text-white sm:px-8 sm:text-lg"
                  >
                    <Link href="/register">
                      Sign Up Free
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 text-nutriscan-slate-700 dark:text-nutriscan-slate-300 hover:bg-nutriscan-slate-50 dark:hover:bg-nutriscan-slate-800/50 h-12 border-2 px-6 text-base sm:px-8 sm:text-lg"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                </>
              )}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {isAuthenticated
                ? "Upload your food photos to get personalized safety recommendations."
                : "Free to use. Login required for personalized recommendations."}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
