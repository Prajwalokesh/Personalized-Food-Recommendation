"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { analysisService } from "@/services/analysis";
import type { AnalysisResult, MedicalCondition } from "@/types/analysis";
import { MEDICAL_CONDITIONS } from "@/types/analysis";
import { analysisFormSchema, type AnalysisFormData } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Camera,
  CheckCircle,
  Heart,
  Brain,
  Activity,
  AlertCircle,
  Sparkles,
  Rocket,
  CircleDashed,
  Info,
  RefreshCw,
  ShieldCheck,
  Utensils,
  Bookmark,
  FileImage,
  ScanSearch,
  Carrot,
  Download,
  Share2,
  Clock,
  Popcorn,
} from "lucide-react";

export default function AnalysePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<
    MedicalCondition | ""
  >("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    selectedCondition?: string;
    foodImage?: string;
  }>({});

  // Animation references
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = true; // Always consider it in view initially
  const heroControls = useAnimation();

  // Scroll to results animation
  useEffect(() => {
    if (analysisResult) {
      setTimeout(() => {
        document.getElementById("analysis-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  }, [analysisResult]);

  // Hero section animation
  useEffect(() => {
    // Always show the hero section on initial render and page refresh
    heroControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    });
  }, [heroControls]);

  const validateForm = (): boolean => {
    try {
      if (!selectedImage || !selectedCondition) {
        setError("Please select both a food image and medical condition");
        return false;
      }

      analysisFormSchema.parse({
        selectedCondition,
        foodImage: selectedImage,
      });

      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: { selectedCondition?: string; foodImage?: string } = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0] as "selectedCondition" | "foodImage";
          if (field === "selectedCondition" || field === "foodImage") {
            errors[field] = err.message;
          }
        });
      }

      setValidationErrors(errors);
      setError(Object.values(errors).join(". "));
      return false;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setError("");
      setValidationErrors((prev) => ({ ...prev, foodImage: undefined }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConditionChange = (value: string) => {
    setSelectedCondition(value as MedicalCondition);
    setError("");
    setValidationErrors((prev) => ({ ...prev, selectedCondition: undefined }));
  };

  const handleAnalyze = async () => {
    if (!validateForm()) {
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setValidationErrors({});

    try {
      const result = await analysisService.analyzeFood(
        selectedImage as File,
        selectedCondition as MedicalCondition,
      );

      if (result.success) {
        setAnalysisResult(result.data.result);
        setAnalysisData(result.data);
      } else {
        setError("Analysis failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      setError(
        error?.response?.data?.message || "An error occurred during analysis",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-[#090f1c] dark:via-[#0c1628]/70 dark:to-[#090f1c]">
        <Navbar />

        {/* Analysis Section */}
        <section className="relative py-24 md:py-28">
          {/* Decorative elements */}
          <div className="absolute top-1/3 left-0 -z-10 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl filter dark:bg-blue-600/15"></div>
          <div className="absolute right-1/4 bottom-1/3 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter dark:bg-blue-500/15"></div>
          <div className="absolute top-1/2 right-0 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl filter dark:bg-blue-400/15"></div>

          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <motion.div
                ref={heroRef}
                animate={heroControls}
                initial={{ opacity: 1, y: 0 }}
                className="mb-16 space-y-4 text-center"
              >
                <div className="relative inline-flex">
                  <Badge
                    variant="secondary"
                    className="relative mx-auto w-fit border-blue-200 bg-blue-100/80 px-3 py-1.5 backdrop-blur-sm dark:border-blue-700 dark:bg-blue-900/50"
                  >
                    <ScanSearch className="mr-1.5 h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">
                      AI-Powered Analysis
                    </span>
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                    </span>
                  </Badge>
                </div>

                <h1 className="bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl dark:from-blue-300 dark:via-blue-400 dark:to-blue-500">
                  Analyze Your Food
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl md:text-2xl dark:text-blue-100">
                  Get instant AI-powered safety recommendations based on your
                  medical condition
                </p>

                <div className="mx-auto mt-2 flex max-w-sm flex-wrap items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-100/80 px-3 py-1 dark:border-green-800 dark:bg-green-900/30">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Accurate
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-100/80 px-3 py-1 dark:border-violet-800 dark:bg-violet-900/30">
                    <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-medium text-violet-700 dark:text-violet-400">
                      Personalized
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100/80 px-3 py-1 dark:border-amber-800 dark:bg-amber-900/30">
                    <Rocket className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      Fast
                    </span>
                  </div>
                </div>

                {/* Added animated illustration */}
                <div className="mt-6 flex justify-center">
                  <div className="relative h-12 w-12">
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500"></div>
                      <div className="absolute top-1/2 -right-2 h-2 w-2 -translate-y-1/2 rounded-full bg-violet-500"></div>
                      <div className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-green-500"></div>
                      <div className="absolute top-1/2 -left-2 h-2 w-2 -translate-y-1/2 rounded-full bg-amber-500"></div>
                    </motion.div>
                    <div className="absolute inset-3 rounded-full border-2 border-dashed border-blue-200 dark:border-blue-800"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-blue-100 dark:border-blue-900"></div>
                    <div className="absolute inset-3 flex items-center justify-center">
                      <Carrot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Image Upload Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full"
                >
                  <Card className="upload-card-fix h-full overflow-hidden border border-white/20 bg-gradient-to-br from-white/80 to-white/50 shadow-lg backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-blue-900/30 dark:from-zinc-900/80 dark:to-zinc-900/60 dark:hover:border-blue-800/50">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-6 dark:from-blue-900/20 dark:to-zinc-900/50">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md dark:from-blue-500 dark:to-blue-400">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0"
                            animate={{
                              x: ["0%", "100%"],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "linear",
                            }}
                          />
                          <FileImage className="relative z-10 h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                            Upload Food Image
                          </CardTitle>
                          <CardDescription className="mt-1 text-slate-600 dark:text-blue-200/70">
                            For accurate analysis
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex h-[calc(100%-76px)] flex-col p-6">
                      <div className="mb-3 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-violet-900/20 dark:text-violet-300"
                        >
                          <Activity className="mr-1 h-3 w-3" />
                          Step 1 of 2
                        </Badge>
                      </div>
                      <div className="upload-dropzone-fix flex flex-1 flex-col space-y-4">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedImage ? "preview" : "upload"}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className={`group relative flex flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                              selectedImage
                                ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20"
                                : "border-blue-200 bg-white/50 hover:border-blue-400 dark:border-blue-800 dark:bg-zinc-900/50 dark:hover:border-blue-600"
                            } ${validationErrors.foodImage ? "border-red-500 bg-red-50 dark:bg-red-900/10" : ""}`}
                          >
                            {/* Glassmorphism and shimmer effects */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-white/70 to-white/30 backdrop-blur-[2px] dark:from-blue-950/20 dark:to-zinc-950/10"></div>
                            <div className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-t from-blue-100 to-transparent opacity-20 transition-transform duration-1000 group-hover:translate-y-0 dark:from-blue-900/30"></div>

                            {selectedImage ? (
                              <div className="w-full space-y-4">
                                {imagePreview ? (
                                  <motion.div
                                    className="relative mx-auto h-48 w-48 overflow-hidden rounded-xl shadow-lg"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", damping: 15 }}
                                  >
                                    <img
                                      src={imagePreview}
                                      alt="Food preview"
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/30 ring-offset-2"></div>
                                    <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/60 to-transparent p-2">
                                      <Badge
                                        variant="secondary"
                                        className="bg-white/80 text-blue-800 dark:bg-black/50 dark:text-blue-300"
                                      >
                                        <Camera className="mr-1 h-3 w-3" /> Food
                                        Photo
                                      </Badge>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    animate={{
                                      scale: [1, 1.05, 1],
                                      opacity: [0.8, 1, 0.8],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2,
                                    }}
                                  >
                                    <CheckCircle className="mx-auto h-16 w-16 text-green-500 dark:text-green-400" />
                                  </motion.div>
                                )}
                                <div>
                                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                                    {selectedImage.name}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Ready for analysis (
                                    {(selectedImage.size / 1024 / 1024).toFixed(
                                      2,
                                    )}{" "}
                                    MB)
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                  }}
                                >
                                  <RefreshCw className="mr-1 h-3.5 w-3.5" />{" "}
                                  Choose Different Image
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center space-y-4">
                                <motion.div
                                  className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20"
                                  animate={{
                                    boxShadow: [
                                      "0 0 0 rgba(59, 130, 246, 0.4)",
                                      "0 0 20px rgba(59, 130, 246, 0.2)",
                                      "0 0 0 rgba(59, 130, 246, 0.4)",
                                    ],
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                  }}
                                >
                                  <Upload className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                  <motion.span
                                    className="absolute inset-0 rounded-full border-4 border-blue-400/30"
                                    animate={{
                                      scale: [1, 1.1, 1],
                                      opacity: [0.7, 0.3, 0.7],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 3,
                                      ease: "easeInOut",
                                    }}
                                  ></motion.span>
                                </motion.div>
                                <div>
                                  <h3 className="mb-1 text-lg font-semibold text-blue-900 dark:text-blue-100">
                                    Drag & drop your food image
                                  </h3>
                                  <p className="text-slate-500 dark:text-slate-400">
                                    or click to browse files
                                  </p>
                                  <motion.p
                                    className="mt-2 text-xs text-slate-400 dark:text-slate-500"
                                    animate={{
                                      opacity: [0.7, 1, 0.7],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 4,
                                      ease: "easeInOut",
                                    }}
                                  >
                                    Supported: JPG, PNG, WebP (Max 5MB)
                                  </motion.p>
                                </div>
                              </div>
                            )}
                            <input
                              type="file"
                              id="food-image-input"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              onChange={handleImageUpload}
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                          </motion.div>
                        </AnimatePresence>

                        {validationErrors.foodImage && (
                          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-400">
                            <AlertCircle className="h-4 w-4" />
                            <p>{validationErrors.foodImage}</p>
                          </div>
                        )}

                        {!selectedImage && (
                          <div className="button-container-fix mt-3">
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400 dark:shadow-blue-500/10 dark:hover:from-blue-600 dark:hover:to-blue-500"
                              onClick={() => {
                                // Simulate click on the hidden file input using ID for better targeting
                                const fileInput = document.getElementById(
                                  "food-image-input",
                                ) as HTMLInputElement;
                                if (fileInput) fileInput.click();
                              }}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Select Food Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Medical Condition Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="h-full"
                >
                  <Card className="h-full overflow-hidden border border-white/20 bg-gradient-to-br from-white/80 to-white/50 shadow-lg backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 dark:border-blue-900/30 dark:from-zinc-900/80 dark:to-zinc-900/60 dark:hover:border-blue-800/50">
                    <CardHeader className="bg-gradient-to-r from-violet-50 to-white pb-6 dark:from-violet-900/20 dark:to-zinc-900/50">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-500 text-white shadow-md dark:from-violet-500 dark:to-violet-400">
                          <motion.div
                            className="absolute inset-0 rounded-full bg-violet-600/20"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 3,
                              ease: "easeInOut",
                            }}
                          />
                          <Heart className="relative z-10 h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-violet-900 dark:text-violet-100">
                            Medical Condition
                          </CardTitle>
                          <CardDescription className="mt-1 text-slate-600 dark:text-violet-200/70">
                            For personalized analysis
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex h-[calc(100%-76px)] flex-col p-6">
                      <div className="flex flex-1 flex-col space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-900/20 dark:text-violet-300"
                            >
                              <Activity className="mr-1 h-3 w-3" />
                              Step 2 of 2
                            </Badge>
                          </div>

                          <Label
                            htmlFor="condition"
                            className="text-base font-medium text-slate-800 dark:text-slate-200"
                          >
                            Select Your Medical Condition:
                          </Label>

                          <div className="relative">
                            <Select
                              value={selectedCondition}
                              onValueChange={handleConditionChange}
                            >
                              <SelectTrigger
                                className={`w-full border-2 border-violet-200 bg-white/70 shadow-sm focus:border-violet-500 focus:ring-violet-500/20 dark:border-violet-800/60 dark:bg-zinc-900/40 dark:focus:border-violet-600 dark:focus:ring-violet-600/20 ${
                                  validationErrors.selectedCondition
                                    ? "border-red-500 focus:border-red-500"
                                    : ""
                                }`}
                              >
                                <SelectValue placeholder="Choose your condition..." />
                              </SelectTrigger>
                              <SelectContent className="max-h-80 bg-white dark:bg-zinc-900">
                                {MEDICAL_CONDITIONS.map((condition) => (
                                  <SelectItem
                                    key={condition.value}
                                    value={condition.value}
                                    className="focus:bg-violet-50 dark:focus:bg-violet-900/20"
                                  >
                                    {condition.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {!validationErrors.selectedCondition && (
                              <motion.div
                                className="absolute top-1/2 right-10 -translate-y-1/2 text-violet-500 dark:text-violet-400"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                  opacity: selectedCondition ? 1 : 0,
                                  scale: selectedCondition ? 1 : 0,
                                }}
                              >
                                <CheckCircle className="h-5 w-5" />
                              </motion.div>
                            )}
                          </div>

                          {validationErrors.selectedCondition && (
                            <motion.div
                              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-400"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ type: "spring", damping: 20 }}
                            >
                              <AlertCircle className="h-4 w-4" />
                              <p>{validationErrors.selectedCondition}</p>
                            </motion.div>
                          )}
                        </div>

                        <div className="mt-4 flex-1">
                          <div className="rounded-xl border border-violet-200/70 bg-gradient-to-br from-violet-50/80 to-white/60 p-4 shadow-sm backdrop-blur-sm dark:border-violet-800/30 dark:from-violet-900/10 dark:to-zinc-900/30">
                            <div className="flex items-center gap-2 text-violet-800 dark:text-violet-300">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-800/50">
                                <Info className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-sm font-medium">
                                Why we need this information:
                              </span>
                            </div>

                            <div className="mt-3 space-y-4">
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Our AI analyzes how nutrients in your food may
                                interact with your specific health condition to
                                provide safe, personalized dietary
                                recommendations.
                              </p>

                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500"></div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400">
                                    <span className="font-medium text-violet-700 dark:text-violet-400">
                                      Safe food choices
                                    </span>{" "}
                                    tailored to your condition
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500"></div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400">
                                    <span className="font-medium text-violet-700 dark:text-violet-400">
                                      Alternative suggestions
                                    </span>{" "}
                                    when needed
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {MEDICAL_CONDITIONS.slice(0, 3).map(
                                  (condition) => (
                                    <Badge
                                      key={condition.value}
                                      className="bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:hover:bg-violet-900/60"
                                      variant="secondary"
                                    >
                                      {condition.label}
                                    </Badge>
                                  ),
                                )}
                                <Badge
                                  className="bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/40"
                                  variant="outline"
                                >
                                  +{MEDICAL_CONDITIONS.length - 3} more
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Analyze Button */}
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="relative mx-auto max-w-md">
                  {/* Decorative elements */}
                  <motion.div
                    className="absolute -top-10 -left-14 h-20 w-20 rounded-full bg-blue-400/10 blur-xl dark:bg-blue-400/5"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute -right-10 bottom-0 h-16 w-16 rounded-full bg-violet-400/10 blur-lg dark:bg-violet-400/5"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 6,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />

                  {/* Status indication */}
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${selectedImage ? "bg-green-500" : "bg-slate-300"}`}
                    ></div>
                    <div className="h-0.5 w-6 bg-slate-200 dark:bg-slate-700"></div>
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${selectedCondition ? "bg-green-500" : "bg-slate-300"}`}
                    ></div>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={
                      !selectedImage || !selectedCondition || isAnalyzing
                    }
                    className="group relative h-16 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 px-10 text-xl font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40 disabled:from-slate-400 disabled:via-slate-500 disabled:to-slate-500 disabled:opacity-70 disabled:hover:translate-y-0 dark:from-blue-500 dark:via-blue-400 dark:to-violet-400 dark:shadow-blue-500/20 dark:hover:shadow-blue-500/30"
                    size="lg"
                  >
                    {/* Animated gradient background */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_2s_infinite]"></span>

                    {isAnalyzing ? (
                      <span className="flex items-center justify-center">
                        <motion.div
                          className="mr-3 flex h-6 w-6 items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 1.5,
                          }}
                        >
                          <CircleDashed className="h-6 w-6" />
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Analyzing Your Food...
                        </motion.span>
                      </span>
                    ) : (
                      <motion.span
                        className="flex items-center justify-center"
                        whileHover={{ scale: 1.03 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Brain className="mr-3 h-6 w-6" />
                        Analyze Food Safety
                      </motion.span>
                    )}
                  </Button>

                  <motion.div
                    className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge
                      className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      variant="secondary"
                    >
                      <Sparkles className="mr-1 h-3 w-3" /> AI-Powered
                    </Badge>
                    <Badge
                      className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      variant="outline"
                    >
                      <Clock className="mr-1 h-3 w-3" /> ~5-10 seconds
                    </Badge>
                  </motion.div>
                </div>
              </motion.div>

              {/* Analysis Results */}
              {analysisResult && (
                <motion.div
                  className="mt-16"
                  id="analysis-results"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <Card className="overflow-hidden border border-white/20 bg-gradient-to-br from-white/80 to-white/50 shadow-xl backdrop-blur-md dark:border-blue-900/30 dark:from-zinc-900/80 dark:to-zinc-900/60">
                    {/* Success animation bar at the top */}
                    <motion.div
                      className="h-1 w-full bg-gradient-to-r from-green-500 via-blue-500 to-violet-500"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    />
                    <CardHeader className="relative border-b border-slate-200/50 bg-gradient-to-r from-blue-50 to-white pb-6 dark:border-slate-700/30 dark:from-blue-900/20 dark:to-zinc-900/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow-md dark:from-green-500 dark:to-emerald-400">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                            Analysis Results
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-400">
                            Based on your condition:{" "}
                            <span className="font-medium text-blue-700 dark:text-blue-400">
                              {
                                MEDICAL_CONDITIONS.find(
                                  (c) => c.value === selectedCondition,
                                )?.label
                              }
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-5">
                      {/* Left column - Image and Food Info */}
                      <div className="space-y-6 lg:col-span-2">
                        {/* Food Image */}
                        {(analysisData?.foodImage || imagePreview) && (
                          <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Utensils className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                Analyzed Food
                              </Label>
                              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                Detected
                              </Badge>
                            </div>

                            <motion.div
                              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-zinc-900/50"
                              whileHover={{ scale: 1.02 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <div className="relative aspect-square w-full overflow-hidden">
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                                <img
                                  src={
                                    analysisData?.foodImage
                                      ? analysisService.getFoodImageUrl(
                                          analysisData.foodImage.fileId,
                                        )
                                      : imagePreview || ""
                                  }
                                  alt="Food"
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  onError={(
                                    e: React.SyntheticEvent<
                                      HTMLImageElement,
                                      Event
                                    >,
                                  ) => {
                                    if (selectedImage && imagePreview) {
                                      e.currentTarget.src = imagePreview;
                                    }
                                  }}
                                />

                                {/* Overlay with food name */}
                                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
                                  <h3 className="font-medium text-white">
                                    {analysisResult?.predicted_food}
                                  </h3>
                                </div>
                              </div>
                              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/20">
                                <div className="flex items-center gap-1.5">
                                  <FileImage className="h-3.5 w-3.5 text-slate-400" />
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {analysisData?.foodImage?.originalFileName?.substring(
                                      0,
                                      20,
                                    ) ||
                                      selectedImage?.name?.substring(0, 20) ||
                                      "Food Image"}
                                    {((analysisData?.foodImage?.originalFileName
                                      ?.length ?? 0) > 20 ||
                                      (selectedImage?.name?.length ?? 0) >
                                        20) &&
                                      "..."}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="bg-white text-xs dark:bg-zinc-900"
                                >
                                  {analysisData?.foodImage?.fileType || "JPG"}
                                </Badge>
                              </div>
                            </motion.div>

                            {/* Download/share options */}
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Download className="mr-1 h-3 w-3" /> Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Share2 className="mr-1 h-3 w-3" /> Share
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {/* Food Details */}
                        <div className="space-y-4 rounded-xl border border-slate-200 bg-white/70 p-5 backdrop-blur-sm dark:border-slate-700 dark:bg-zinc-900/30">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-slate-900 dark:text-slate-100">
                              Detected Food
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                              <Utensils className="mr-1 h-3 w-3" /> Food Item
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/30">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                              <Popcorn className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {analysisResult.predicted_food}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Safety Message
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {analysisResult.safety_message}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right column - Health Analysis */}
                      <div className="space-y-6 lg:col-span-3">
                        {/* Health Analysis */}
                        <div className="space-y-3 rounded-xl border border-slate-200 bg-white/70 p-5 backdrop-blur-sm dark:border-slate-700 dark:bg-zinc-900/30">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-slate-900 dark:text-slate-100">
                              Health Analysis
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                              <Brain className="mr-1 h-3 w-3" /> AI Analysis
                            </Badge>
                          </div>

                          <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-zinc-900/50">
                            <MarkdownRenderer
                              content={analysisResult.health_analysis}
                              className="prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-strong:text-slate-900 prose-ul:text-slate-700 prose-li:text-slate-700 dark:prose-headings:text-slate-100 dark:prose-p:text-slate-300 dark:prose-a:text-blue-400 dark:prose-strong:text-slate-100 dark:prose-ul:text-slate-300 dark:prose-li:text-slate-300"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/50 bg-gradient-to-b from-slate-50/80 to-white/90 p-6 backdrop-blur-sm dark:border-slate-700/30 dark:from-slate-900/30 dark:to-zinc-900/60">
                      <motion.div
                        className="flex max-w-xl items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/70 p-2 text-sm text-slate-700 backdrop-blur-sm dark:border-blue-800/60 dark:bg-blue-900/20 dark:text-slate-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/70">
                          <Info className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                        </div>
                        <span>
                          This analysis is for informational purposes only and
                          should not replace professional medical advice.
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex flex-wrap gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                      >
                        <Button
                          variant="outline"
                          className="border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800"
                          onClick={() => {
                            setSelectedImage(null);
                            setSelectedCondition("");
                            setAnalysisResult(null);
                            setAnalysisData(null);
                            setImagePreview(null);
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          New Analysis
                        </Button>

                        <Button className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 dark:from-blue-500 dark:via-blue-400 dark:to-violet-400 dark:shadow-blue-500/10 dark:hover:shadow-blue-500/20">
                          {/* Animated shimmer */}
                          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                          <Bookmark className="mr-2 h-4 w-4" />
                          Save to History
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{
                      duration: 0.4,
                      opacity: { duration: 0.3 },
                      height: { duration: 0.4 },
                    }}
                  >
                    <Card className="overflow-hidden border-red-200 bg-gradient-to-r from-red-50 to-red-50/70 shadow-md backdrop-blur-sm dark:border-red-800/70 dark:from-red-900/30 dark:to-red-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
                          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                              }}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </motion.div>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{error}</p>
                            <p className="text-sm text-red-500/70 dark:text-red-400/70">
                              Please check your inputs and try again
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto h-8 w-8 rounded-full p-0 text-red-500 hover:bg-red-100 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
                            onClick={() => setError("")}
                          >
                            <span className="sr-only">Dismiss</span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                            >
                              <path
                                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
