"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  History,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Heart,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  Info,
} from "lucide-react";
import { analysisService } from "@/services/analysis";
import type { AnalysisHistoryItem, PaginationMeta } from "@/types/analysis";
import { MEDICAL_CONDITIONS } from "@/types/analysis";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<AnalysisHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [selectedItem, setSelectedItem] = useState<AnalysisHistoryItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Utility functions
  const getMedicalConditionLabel = (condition: string): string => {
    const found = MEDICAL_CONDITIONS.find((mc) => mc.value === condition);
    return found?.label || condition;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch analysis history
  const fetchHistory = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await analysisService.getAnalysisHistory(page, 9); // 9 items per page for 3x3 grid
      setHistoryData(response.data.histories);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch analysis history",
      );
      console.error("Error fetching history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load history on component mount
  useEffect(() => {
    fetchHistory(1);
  }, []);

  // Effect to handle modal body scrolling
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
      setIsModalOpen(true);
    } else {
      document.body.style.overflow = "";
      setIsModalOpen(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case "recommended":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800";
      case "moderate intake":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800";
      case "avoid":
      case "best avoided at night":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";
      case "consume with care":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800";
    }
  };

  const handleDelete = async (analysisId: string) => {
    try {
      setIsDeleting(analysisId);

      // Call the delete API
      await analysisService.deleteAnalysis(analysisId);

      // Remove from local state immediately for better UX
      setHistoryData(historyData.filter((item) => item._id !== analysisId));

      // If this was the last item on the page and we're not on page 1, go to previous page
      if (
        historyData.length === 1 &&
        pagination &&
        pagination.currentPage > 1
      ) {
        fetchHistory(pagination.currentPage - 1);
      } else {
        // Refresh current page to update pagination info
        fetchHistory(currentPage);
      }
    } catch (err: any) {
      console.error("Error deleting analysis:", err);
      setError(err.response?.data?.message || "Failed to delete analysis");
    } finally {
      setIsDeleting(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
        <Navbar />

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <motion.div
                className="mb-12 space-y-4 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge
                  variant="secondary"
                  className="relative mx-auto w-fit border-blue-200 bg-blue-100/80 px-3 py-1.5 backdrop-blur-sm dark:border-blue-700 dark:bg-blue-900/50"
                >
                  <History className="mr-1.5 h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    Analysis Timeline
                  </span>
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                  </span>
                </Badge>
                <h1 className="bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl dark:from-white dark:to-slate-400">
                  Your Food Analysis History
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
                  Review your previous food analyses and track your health
                  journey. All your sessions are stored securely for your
                  reference.
                </p>
              </motion.div>

              {/* Loading State */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/50 bg-white/70 backdrop-blur-sm">
                    <CardContent className="py-12 text-center">
                      <div className="relative mx-auto mb-4 h-16 w-16">
                        <Loader2 className="text-nutriscan-slate-400 dark:text-nutriscan-slate-500 absolute inset-0 h-16 w-16 animate-spin" />
                        <div className="bg-primary/20 absolute inset-0 h-16 w-16 animate-ping rounded-full"></div>
                      </div>
                      <h3 className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 mb-2 text-xl font-semibold">
                        Loading History...
                      </h3>
                      <p className="text-muted-foreground">
                        Please wait while we fetch your analysis history.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <Card className="border-red-200 bg-red-50/70 backdrop-blur-sm dark:border-red-800/70 dark:bg-red-950/30">
                    <CardContent className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-100">
                        Failed to Load History
                      </h3>
                      <p className="mb-6 text-red-700 dark:text-red-300">
                        {error}
                      </p>
                      <Button
                        onClick={() => fetchHistory(currentPage)}
                        className="bg-red-600 text-white transition-all duration-300 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Empty State */}
              {!isLoading && !error && historyData.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/50 bg-white/70 backdrop-blur-sm">
                    <CardContent className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/60">
                        <History className="text-nutriscan-slate-500 dark:text-nutriscan-slate-400 h-8 w-8" />
                      </div>
                      <h3 className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 mb-2 text-xl font-semibold">
                        No Analysis History
                      </h3>
                      <p className="text-muted-foreground mx-auto mb-6 max-w-md">
                        You haven't analyzed any food items yet. Start by
                        uploading a food image for analysis.
                      </p>
                      <Button
                        asChild
                        size="lg"
                        className="bg-nutriscan-primary hover:bg-nutriscan-primary-hover text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <a href="/analyse">Start Analyzing</a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* History Data */}
              {!isLoading && !error && historyData.length > 0 && (
                <div>
                  <motion.div
                    className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {historyData.map((item) => (
                      <motion.div key={item._id}>
                        <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/50 group hover:border-primary/20 h-full bg-white/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="text-muted-foreground flex items-center space-x-2 rounded-full bg-slate-50 px-2 py-1 text-sm dark:bg-slate-800/50">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatDate(item.createdAt)}</span>
                              </div>
                              <div className="text-muted-foreground flex items-center space-x-2 rounded-full bg-slate-50 px-2 py-1 text-sm dark:bg-slate-800/50">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{formatTime(item.createdAt)}</span>
                              </div>
                            </div>
                            <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 group-hover:text-primary mt-3 text-lg transition-colors">
                              {item.result.predicted_food}
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-2">
                              <Heart className="text-nutriscan-accent-rose h-4 w-4" />
                              <span>
                                Condition:{" "}
                                <span className="font-medium">
                                  {getMedicalConditionLabel(
                                    item.medicalCondition,
                                  )}
                                </span>
                              </span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                <span className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-medium whitespace-nowrap">
                                  Nutrient Highlights:
                                </span>
                                <Badge
                                  variant="outline"
                                  className="bg-slate-50/50 font-medium dark:bg-slate-800/50"
                                >
                                  {item.result.nutrient_highlights}
                                </Badge>
                              </div>

                              <div>
                                <span className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-1.5 block text-sm font-medium">
                                  Recommendation:
                                </span>
                                <div
                                  className={`mt-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold ${getRecommendationColor(
                                    item.result.recommendation,
                                  )}`}
                                >
                                  {item.result.recommendation}
                                </div>
                              </div>

                              <div className="flex space-x-2 pt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedItem(item)}
                                  className="group-hover:border-primary/30 flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white transition-all duration-300"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={isDeleting === item._id}
                                      className="text-red-600 transition-all duration-300 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                                    >
                                      {isDeleting === item._id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-white/90 backdrop-blur-md dark:bg-slate-900/90">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Analysis
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        analysis? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-red-600 text-white transition-colors hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <motion.div
                      className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchHistory(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage || isLoading}
                        className="flex items-center transition-all hover:shadow-md"
                      >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex items-center space-x-1.5">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (
                              pagination.currentPage >=
                              pagination.totalPages - 2
                            ) {
                              pageNum = pagination.totalPages - 4 + i;
                            } else {
                              pageNum = pagination.currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  pageNum === pagination.currentPage
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => fetchHistory(pageNum)}
                                disabled={isLoading}
                                className={`h-9 w-9 p-0 transition-transform ${
                                  pageNum === pagination.currentPage
                                    ? "scale-110 shadow-md"
                                    : "hover:-translate-y-0.5 hover:shadow-sm"
                                }`}
                              >
                                {pageNum}
                              </Button>
                            );
                          },
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchHistory(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage || isLoading}
                        className="flex items-center transition-all hover:shadow-md"
                      >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Pagination Info */}
                  {pagination && !isLoading && !error && (
                    <div className="text-muted-foreground mt-4 text-center text-sm">
                      Showing {pagination.documentsInCurrentPage} of{" "}
                      {pagination.totalDocuments} analyses (Page{" "}
                      {pagination.currentPage} of {pagination.totalPages})
                    </div>
                  )}
                </div>
              )}

              {/* Detailed View Modal */}
              {selectedItem && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/60 p-4 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedItem(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="my-auto w-full max-w-2xl"
                  >
                    <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/95 mx-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-white/95 shadow-2xl backdrop-blur-md">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 text-xl">
                            Analysis Details
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedItem(null)}
                            className="h-8 w-8 rounded-full p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            ×
                          </Button>
                        </div>
                        <CardDescription className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(selectedItem.createdAt)}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(selectedItem.createdAt)}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 mb-2 text-xl font-semibold">
                              {selectedItem.result.predicted_food}
                            </h3>
                            <Badge
                              variant="outline"
                              className="bg-slate-50/50 dark:bg-slate-800/50"
                            >
                              Medical Condition:{" "}
                              {getMedicalConditionLabel(
                                selectedItem.medicalCondition,
                              )}
                            </Badge>
                          </div>

                          {/* Food Image */}
                          <div className="overflow-hidden rounded-lg">
                            <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-2 flex items-center font-medium">
                              <Info className="mr-1.5 h-4 w-4" />
                              Food Image
                            </h4>
                            <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                              <img
                                src={analysisService.getFoodImageUrl(
                                  selectedItem.foodImage.fileId,
                                )}
                                alt={selectedItem.result.predicted_food}
                                className="h-full w-full transform-gpu rounded-lg object-cover object-center transition-transform duration-500 hover:scale-105"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder-food.jpg";
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-2 flex items-center font-medium">
                                <Filter className="mr-1.5 h-4 w-4" />
                                Nutrient Highlights
                              </h4>
                              <Badge
                                variant="outline"
                                className="bg-slate-50/50 text-sm dark:bg-slate-800/50"
                              >
                                {selectedItem.result.nutrient_highlights}
                              </Badge>
                            </div>

                            <div>
                              <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-2 flex items-center font-medium">
                                <Info className="mr-1.5 h-4 w-4" />
                                Recommendation
                              </h4>
                              <div
                                className={`rounded-lg border px-3 py-2 ${getRecommendationColor(
                                  selectedItem.result.recommendation,
                                )}`}
                              >
                                <span className="font-semibold">
                                  {selectedItem.result.recommendation}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-2 flex items-center font-medium">
                              <Info className="mr-1.5 h-4 w-4" />
                              Alternative Suggestions
                            </h4>
                            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                              <p className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100">
                                {selectedItem.result.alternative_suggestion}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-2 flex items-center font-medium">
                              <AlertTriangle className="mr-1.5 h-4 w-4" />
                              Safety Information
                            </h4>
                            <div
                              className={`rounded-lg border px-3 py-3 ${
                                selectedItem.result.is_safe_for_condition
                                  ? "border-green-200 bg-green-50/80 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
                                  : "border-red-200 bg-red-50/80 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
                              }`}
                            >
                              <p className="flex items-center font-medium">
                                {selectedItem.result.is_safe_for_condition
                                  ? "✅ Safe"
                                  : "⚠️ Not Safe"}{" "}
                                for{" "}
                                {getMedicalConditionLabel(
                                  selectedItem.medicalCondition,
                                )}
                              </p>
                              <p className="border-opacity-20 mt-2 border-t border-current pt-2 text-sm">
                                {selectedItem.result.safety_message}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedItem(null)}
                              className="flex-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              Close
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="text-red-600 transition-all duration-300 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white/90 backdrop-blur-md dark:bg-slate-900/90">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Analysis
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this
                                    analysis? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      handleDelete(selectedItem._id);
                                      setSelectedItem(null);
                                    }}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
