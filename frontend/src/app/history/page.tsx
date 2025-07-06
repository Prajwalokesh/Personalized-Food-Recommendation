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
} from "lucide-react";
import { analysisService } from "@/services/analysis";
import type { AnalysisHistoryItem, PaginationMeta } from "@/types/analysis";
import { MEDICAL_CONDITIONS } from "@/types/analysis";

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

  return (
    <ProtectedRoute>
      <div className="bg-background min-h-screen">
        <Navbar />

        <section className="bg-background py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 space-y-4 text-center">
                <Badge
                  variant="secondary"
                  className="border-nutriscan-slate-200 bg-nutriscan-slate-100 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-800/50 mx-auto w-fit"
                >
                  <span className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 font-semibold">
                    📜 Analysis History
                  </span>
                </Badge>
                <h1 className="text-nutriscan-slate-900 text-3xl font-bold md:text-4xl dark:text-white">
                  Your Food Analysis History
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                  Review your previous food analyses and track your health
                  journey. All your sessions are stored securely for your
                  reference.
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/50 bg-white">
                  <CardContent className="py-12 text-center">
                    <Loader2 className="text-nutriscan-slate-400 dark:text-nutriscan-slate-500 mx-auto mb-4 h-16 w-16 animate-spin" />
                    <h3 className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 mb-2 text-xl font-semibold">
                      Loading History...
                    </h3>
                    <p className="text-muted-foreground">
                      Please wait while we fetch your analysis history.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <Card className="border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/10">
                  <CardContent className="py-12 text-center">
                    <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                    <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-100">
                      Failed to Load History
                    </h3>
                    <p className="mb-6 text-red-700 dark:text-red-300">
                      {error}
                    </p>
                    <Button
                      onClick={() => fetchHistory(currentPage)}
                      variant="outline"
                      className="border-red-500 text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/20"
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Empty State */}
              {!isLoading && !error && historyData.length === 0 && (
                <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/50 bg-white">
                  <CardContent className="py-12 text-center">
                    <History className="text-nutriscan-slate-400 dark:text-nutriscan-slate-500 mx-auto mb-4 h-16 w-16" />
                    <h3 className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 mb-2 text-xl font-semibold">
                      No Analysis History
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't analyzed any food items yet. Start by
                      uploading a food image.
                    </p>
                    <Button
                      asChild
                      className="bg-nutriscan-primary hover:bg-nutriscan-primary-hover text-white"
                    >
                      <a href="/analyse">Start Analyzing</a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* History Data */}
              {!isLoading && !error && historyData.length > 0 && (
                <div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {historyData.map((item) => (
                      <Card
                        key={item._id}
                        className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/50 bg-white transition-shadow hover:shadow-lg"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(item.createdAt)}</span>
                            </div>
                          </div>
                          <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 text-lg">
                            {item.result.predicted_food}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <Heart className="text-nutriscan-accent-rose h-4 w-4" />
                            <span>
                              Condition:{" "}
                              {getMedicalConditionLabel(item.medicalCondition)}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <span className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-medium">
                                Nutrient Highlights:
                              </span>
                              <Badge variant="outline" className="ml-2">
                                {item.result.nutrient_highlights}
                              </Badge>
                            </div>

                            <div>
                              <span className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-medium">
                                Recommendation:
                              </span>
                              <div
                                className={`mt-1 rounded px-2 py-1 text-xs font-semibold ${getRecommendationColor(item.result.recommendation)}`}
                              >
                                {item.result.recommendation}
                              </div>
                            </div>

                            <div className="flex space-x-2 pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                                className="flex-1"
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
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                                  >
                                    {isDeleting === item._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
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
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(item._id)}
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
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchHistory(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage || isLoading}
                        className="flex items-center"
                      >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex items-center space-x-1">
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
                                className="h-8 w-8 p-0"
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
                        className="flex items-center"
                      >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/95 max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100">
                          Analysis Details
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedItem(null)}
                        >
                          ×
                        </Button>
                      </div>
                      <CardDescription>
                        {formatDate(selectedItem.createdAt)} at{" "}
                        {formatTime(selectedItem.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 mb-2 text-lg font-semibold">
                            {selectedItem.result.predicted_food}
                          </h3>
                          <p className="text-muted-foreground">
                            Medical Condition:{" "}
                            {getMedicalConditionLabel(
                              selectedItem.medicalCondition,
                            )}
                          </p>
                        </div>

                        {/* Food Image */}
                        <div>
                          <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-2 font-medium">
                            Food Image
                          </h4>
                          <img
                            src={analysisService.getFoodImageUrl(
                              selectedItem.foodImage.fileId,
                            )}
                            alt={selectedItem.result.predicted_food}
                            className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 w-full max-w-sm rounded-lg border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-food.jpg";
                            }}
                          />
                        </div>

                        <div>
                          <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-1 font-medium">
                            Nutrient Highlights
                          </h4>
                          <Badge variant="outline">
                            {selectedItem.result.nutrient_highlights}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-2 font-medium">
                            Recommendation
                          </h4>
                          <div
                            className={`rounded-lg border px-3 py-2 ${getRecommendationColor(selectedItem.result.recommendation)}`}
                          >
                            <span className="font-semibold">
                              {selectedItem.result.recommendation}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-2 font-medium">
                            Alternative Suggestions
                          </h4>
                          <p className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100">
                            {selectedItem.result.alternative_suggestion}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 mb-2 font-medium">
                            Safety Information
                          </h4>
                          <div
                            className={`rounded-lg border px-3 py-2 ${selectedItem.result.is_safe_for_condition ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300" : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"}`}
                          >
                            <p className="font-medium">
                              {selectedItem.result.is_safe_for_condition
                                ? "✅ Safe"
                                : "⚠️ Not Safe"}{" "}
                              for{" "}
                              {getMedicalConditionLabel(
                                selectedItem.medicalCondition,
                              )}
                            </p>
                            <p className="mt-1 text-sm">
                              {selectedItem.result.safety_message}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedItem(null)}
                            className="flex-1"
                          >
                            Close
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Analysis
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this analysis?
                                  This action cannot be undone.
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
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
