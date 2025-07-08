"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
  FileCheck,
  ShieldAlert,
  Leaf,
  ArrowRight,
  Activity,
  HeartPulse,
  Apple,
  PanelRight,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";

export default function Home() {
  const { theme } = useTheme();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-[#090f1c] dark:via-[#0c1628] dark:to-[#090f1c]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-8 sm:py-12 md:py-20 lg:py-28">
        {/* Decorative elements - adjusted for better mobile appearance */}
        <div className="absolute top-1/4 left-0 -z-10 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl filter dark:bg-blue-600/15"></div>
        <div className="absolute right-1/4 bottom-1/3 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter dark:bg-blue-500/15"></div>
        <div className="absolute top-1/2 right-0 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl filter dark:bg-blue-400/15"></div>

        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-10">
          {/* Text content - left for desktop, bottom for mobile */}
          <motion.div
            className="order-2 mt-6 max-w-xl flex-1 text-center lg:order-1 lg:mt-0 lg:text-left"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.div
              className="mb-6 flex items-center justify-center gap-2 lg:justify-start"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/30 to-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-700 backdrop-blur-sm dark:border-blue-400/40 dark:text-blue-200">
                <HeartPulse className="mr-1 h-3.5 w-3.5" /> Smart Food Analysis
              </span>
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent dark:from-blue-300 dark:via-blue-200 dark:to-blue-400">
                NutriScan
              </span>
              <br />
              <span className="mt-2 block text-3xl text-slate-800 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
                Safe Food Choices
              </span>
            </h1>

            <p className="mb-8 text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl dark:text-blue-100">
              Get instant AI-powered analysis of your food. Upload an image and
              learn if it's safe for your specific health condition.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:justify-start">
              <Button
                size="lg"
                className="h-auto rounded-xl border-0 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 text-sm text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-blue-600 sm:px-8 sm:py-6 sm:text-base dark:from-blue-500 dark:to-blue-400 dark:shadow-blue-500/20 dark:hover:from-blue-600 dark:hover:to-blue-500"
                asChild
              >
                <Link href="/analyse">
                  Analyze Food{" "}
                  <ArrowRight className="ml-1 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-auto rounded-xl border-2 border-blue-500/30 px-6 py-5 text-sm text-blue-700 transition-colors hover:bg-blue-50/50 sm:px-8 sm:py-6 sm:text-base dark:border-blue-400/40 dark:text-blue-200 dark:hover:bg-blue-900/30"
                asChild
              >
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </motion.div>

          {/* Image - right for desktop, top for mobile */}
          <motion.div
            className="relative order-1 min-h-[260px] w-full flex-1 md:min-h-[300px] lg:order-2 lg:min-h-[500px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative flex h-full min-h-[260px] w-full items-center justify-center md:min-h-[300px] lg:min-h-[500px]">
              {/* Enhanced glow behind image */}
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-transparent via-blue-500/15 to-blue-500/20 blur-3xl dark:from-transparent dark:via-blue-600/15 dark:to-blue-600/25"></div>

              <div className="relative h-[300px] w-full sm:h-[350px] md:h-[400px] lg:h-[500px]">
                <Image
                  src="/Image.png"
                  alt="NutriScan App"
                  fill
                  className="scale-110 object-contain sm:scale-125 md:scale-150"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative container mx-auto px-4 py-24 lg:py-32">
        {/* Decorative elements */}
        <div className="absolute top-1/3 left-1/4 -z-10 h-64 w-64 rounded-full bg-blue-600/8 blur-3xl filter dark:bg-blue-400/5"></div>
        <div className="absolute right-1/3 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/8 blur-3xl filter dark:bg-blue-500/5"></div>

        {/* Decorative elements - stars and glows */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient glows */}
          <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10"></div>
          <div className="absolute top-2/3 right-1/4 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/10"></div>
          <div className="absolute bottom-10 left-1/3 h-36 w-36 rounded-full bg-teal-400/15 blur-3xl dark:bg-teal-600/10"></div>

          {/* Subtle stars/sparkles */}
          <div className="absolute top-[15%] right-[20%] size-1.5 rounded-full bg-blue-400 dark:bg-blue-300"></div>
          <div className="absolute top-[30%] left-[15%] size-2 rounded-full bg-violet-400 dark:bg-violet-300"></div>
          <div className="absolute top-[65%] right-[25%] size-1.5 rounded-full bg-teal-400 dark:bg-teal-300"></div>
          <div className="absolute top-[85%] left-[30%] size-2 rounded-full bg-blue-400 dark:bg-blue-300"></div>
        </div>

        <motion.div
          className="mb-16 text-center lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-flex items-center rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/30 to-blue-400/30 px-3 py-1 text-xs font-medium text-blue-700 backdrop-blur-sm dark:border-blue-400/30 dark:text-blue-200">
            Simple Process
          </span>
          <h2 className="mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-3xl font-bold text-transparent [text-shadow:0_4px_30px_rgba(56,189,248,0.2)] md:text-5xl dark:from-blue-300 dark:via-blue-200 dark:to-blue-400">
            How NutriScan Works
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-blue-100">
            Our advanced AI helps you make informed food choices based on your
            specific health conditions
          </p>
        </motion.div>

        {/* Timeline container */}
        <div className="relative mx-auto max-w-5xl">
          {/* Central timeline SVG path - curvy dotted line */}
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 -z-10 flex justify-center">
            <svg width="60" height="100%" className="overflow-visible">
              {/* Curvy dotted path */}
              <path
                d="M30,0 Q45,150 15,300 Q45,450 30,600"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                className="stroke-dasharray-[5,10] animate-dash-slow"
                stroke="url(#timelineGradient)"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient
                  id="timelineGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    className="stop-color-blue-300 dark:stop-color-blue-700"
                  />
                  <stop
                    offset="50%"
                    className="stop-color-violet-400 dark:stop-color-violet-600"
                  />
                  <stop
                    offset="100%"
                    className="stop-color-teal-400 dark:stop-color-teal-600"
                  />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Step 1: Upload Food Image */}
          <motion.div
            className="relative mb-24"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center md:flex-row">
              {/* Left content for desktop (right for mobile) */}
              <div className="order-2 mb-6 w-full md:order-1 md:mb-0 md:w-1/2 md:pr-12">
                <Card className="group overflow-hidden border border-blue-100 bg-white/90 shadow-lg shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/20 dark:border-blue-900 dark:bg-zinc-900/80 dark:shadow-blue-400/5 dark:hover:border-blue-800 dark:hover:shadow-blue-400/10">
                  <CardContent className="relative p-6">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-500 dark:to-indigo-400"></div>
                    <h3 className="mb-3 text-xl font-semibold text-blue-900 dark:text-blue-100">
                      Upload Food Image
                    </h3>
                    <p className="text-slate-600 dark:text-blue-200/90">
                      Take a photo of your food or upload an existing image to
                      our secure platform. Our system accepts most image formats
                      and processes them instantly.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Center timeline node */}
              <div className="absolute left-1/2 z-10 -translate-x-1/2">
                <div className="relative">
                  <motion.div
                    className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30 dark:border-zinc-900 dark:from-blue-500 dark:to-indigo-400 dark:shadow-blue-500/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Upload className="h-7 w-7" />
                  </motion.div>
                  <div className="absolute -inset-3 -z-10 rounded-full bg-blue-500/20 blur-lg dark:bg-blue-400/10"></div>
                </div>
                <div className="mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <span className="font-bold text-blue-700 dark:text-blue-300">
                    1
                  </span>
                </div>
              </div>

              {/* Right content - empty for desktop, visual balance */}
              <div className="order-1 hidden w-full md:order-2 md:block md:w-1/2 md:pl-12"></div>
            </div>
          </motion.div>

          {/* Step 2: Enter Health Profile */}
          <motion.div
            className="relative mb-24"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center md:flex-row">
              {/* Left content - empty for desktop, visual balance */}
              <div className="order-2 hidden w-full md:order-1 md:block md:w-1/2 md:pr-12"></div>

              {/* Center timeline node */}
              <div className="absolute left-1/2 z-10 -translate-x-1/2">
                <div className="relative">
                  <motion.div
                    className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 dark:border-zinc-900 dark:from-violet-400 dark:to-purple-500 dark:shadow-violet-400/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Activity className="h-7 w-7" />
                  </motion.div>
                  <div className="absolute -inset-3 -z-10 rounded-full bg-violet-400/20 blur-lg dark:bg-violet-500/10"></div>
                </div>
                <div className="mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900">
                  <span className="font-bold text-violet-700 dark:text-violet-300">
                    2
                  </span>
                </div>
              </div>

              {/* Right content for desktop (left for mobile) */}
              <div className="order-2 mb-6 w-full md:order-2 md:mb-0 md:w-1/2 md:pl-12">
                <Card className="group overflow-hidden border border-violet-100 bg-white/90 shadow-lg shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/20 dark:border-violet-900 dark:bg-zinc-900/80 dark:shadow-violet-400/5 dark:hover:border-violet-800 dark:hover:shadow-violet-400/10">
                  <CardContent className="relative p-6">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500"></div>
                    <h3 className="mb-3 text-xl font-semibold text-violet-900 dark:text-violet-100">
                      Enter Health Profile
                    </h3>
                    <p className="text-slate-600 dark:text-violet-200/90">
                      Provide information about your medical conditions or
                      dietary restrictions. This helps our AI tailor
                      recommendations specifically to your health needs.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>

          {/* Step 3: Get Recommendations */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center md:flex-row">
              {/* Left content for desktop (right for mobile) */}
              <div className="order-2 mb-6 w-full md:order-1 md:mb-0 md:w-1/2 md:pr-12">
                <Card className="group overflow-hidden border border-teal-100 bg-white/90 shadow-lg shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/20 dark:border-teal-900 dark:bg-zinc-900/80 dark:shadow-teal-400/5 dark:hover:border-teal-800 dark:hover:shadow-teal-400/10">
                  <CardContent className="relative p-6">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 dark:from-teal-500 dark:to-emerald-600"></div>
                    <h3 className="mb-3 text-xl font-semibold text-teal-900 dark:text-teal-100">
                      Get Recommendations
                    </h3>
                    <p className="text-slate-600 dark:text-teal-200/90">
                      Our AI analyzes the food and provides personalized safety
                      recommendations. Receive detailed insights about whether
                      the food is suitable for your condition.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Center timeline node */}
              <div className="absolute left-1/2 z-10 -translate-x-1/2">
                <div className="relative">
                  <motion.div
                    className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-lg shadow-teal-500/30 dark:border-zinc-900 dark:from-teal-500 dark:to-emerald-600 dark:shadow-teal-400/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FileCheck className="h-7 w-7" />
                  </motion.div>
                  <div className="absolute -inset-3 -z-10 rounded-full bg-teal-400/20 blur-lg dark:bg-teal-500/10"></div>
                </div>
                <div className="mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                  <span className="font-bold text-teal-700 dark:text-teal-300">
                    3
                  </span>
                </div>
              </div>

              {/* Right content - empty for desktop, visual balance */}
              <div className="order-1 hidden w-full md:order-2 md:block md:w-1/2 md:pl-12"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background design with enhanced effects */}
        <div className="from-background via-background/95 to-background/90 absolute inset-0 -z-10 bg-gradient-to-b dark:from-black dark:via-zinc-900/90 dark:to-zinc-900/95"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]"></div>
        <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(ellipse_at_center_right,rgba(96,165,250,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center_right,rgba(96,165,250,0.08),transparent_70%)]"></div>

        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-r from-blue-400/10 to-violet-500/10 blur-3xl"></div>
        <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-500/10 blur-3xl"></div>

        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="relative inline-block">
              <span className="mb-4 inline-flex items-center rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/40 to-blue-400/40 px-4 py-1.5 text-xs font-medium text-blue-700 backdrop-blur-sm dark:border-blue-400/40 dark:text-blue-200">
                Powerful Features
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                </span>
              </span>
            </div>
            <h2 className="relative mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-3xl font-bold text-transparent md:text-5xl dark:from-blue-300 dark:via-violet-300 dark:to-blue-300">
              Why Choose NutriScan
              <span className="absolute -top-8 -right-8 text-blue-400 opacity-20">
                <Sparkles className="h-10 w-10" />
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-blue-100">
              Advanced technology to ensure you make the safest food choices for
              your health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[
              {
                icon: <ShieldAlert className="h-7 w-7" />,
                title: "Food Safety Analysis",
                description:
                  "Get detailed analysis on whether a food is safe for your specific medical condition.",
                color: "blue",
                gradient: "from-blue-600 to-indigo-500",
                darkGradient: "from-blue-500 to-indigo-400",
                bgGlow: "blue-500/20",
              },
              {
                icon: <HeartPulse className="h-7 w-7" />,
                title: "Personalized Recommendations",
                description:
                  "Receive tailored recommendations based on your unique health profile.",
                color: "violet",
                gradient: "from-violet-500 to-purple-400",
                darkGradient: "from-violet-400 to-purple-300",
                bgGlow: "violet-500/20",
              },
              {
                icon: <Leaf className="h-7 w-7" />,
                title: "Nutritional Information",
                description:
                  "Access comprehensive nutritional data to make informed dietary choices.",
                color: "teal",
                gradient: "from-teal-500 to-emerald-400",
                darkGradient: "from-teal-400 to-emerald-300",
                bgGlow: "teal-500/20",
              },
              {
                icon: <PanelRight className="h-7 w-7" />,
                title: "History Tracking",
                description:
                  "Keep track of your food analysis history to monitor your eating patterns.",
                color: "cyan",
                gradient: "from-cyan-500 to-blue-400",
                darkGradient: "from-cyan-400 to-blue-300",
                bgGlow: "cyan-500/20",
              },
              {
                icon: <Apple className="h-7 w-7" />,
                title: "Food Alternatives",
                description:
                  "Get suggestions for safer food alternatives suitable for your health condition.",
                color: "blue",
                gradient: "from-blue-500 to-indigo-600",
                darkGradient: "from-blue-400 to-indigo-500",
                bgGlow: "blue-500/20",
              },
              {
                icon: <Activity className="h-7 w-7" />,
                title: "Real-time Analysis",
                description:
                  "Instant results so you can make quick decisions about your food choices.",
                color: "sky",
                gradient: "from-sky-500 to-blue-400",
                darkGradient: "from-sky-400 to-blue-300",
                bgGlow: "sky-500/20",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="group perspective-1000"
              >
                <Card className="h-full overflow-hidden border border-white/20 bg-gradient-to-br from-white/80 to-white/50 shadow-lg backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-blue-900/30 dark:from-zinc-900/80 dark:to-zinc-900/60 dark:hover:border-blue-800/50">
                  <CardContent className="relative p-8">
                    {/* Glassmorphic highlight effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-white/5"></div>

                    <div className="relative mb-6">
                      {/* Animated gradient border */}
                      <div className="animate-gradient-x absolute -inset-0.5 rounded-xl bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100"></div>

                      {/* Icon container with 3D hover effect */}
                      <div
                        className={`relative size-16 rounded-xl bg-gradient-to-br ${feature.gradient} dark:${feature.darkGradient} flex items-center justify-center text-white shadow-lg shadow-${feature.bgGlow} transition-all duration-500 group-hover:shadow-xl group-hover:shadow-${feature.bgGlow} group-hover:-translate-y-1 dark:shadow-${feature.color}-500/10`}
                      >
                        {feature.icon}

                        {/* Pulsing effect behind icon */}
                        <span className="animate-ping-slow absolute inset-0 rounded-xl opacity-0 ring-2 ring-white/20 group-hover:opacity-30"></span>
                      </div>

                      {/* Glow effect on hover */}
                      <div
                        className={`absolute -inset-3 rounded-2xl bg-gradient-to-br ${feature.gradient} dark:${feature.darkGradient} -z-10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20`}
                      ></div>
                    </div>

                    <h3 className="relative mb-3 text-xl font-semibold transition-colors duration-300 group-hover:text-blue-700 md:text-2xl dark:group-hover:text-blue-300">
                      {feature.title}
                      <span className="absolute bottom-0 -left-1 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-transparent transition-all duration-500 group-hover:w-full"></span>
                    </h3>

                    <p className="text-slate-600 transition-colors duration-300 group-hover:text-slate-700 dark:text-blue-100/80 dark:group-hover:text-blue-100">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
