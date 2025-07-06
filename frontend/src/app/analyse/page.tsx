"use client";

import { useState } from "react";
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
  ImageIcon,
  CheckCircle,
  Heart,
  Brain,
  Activity,
  AlertCircle,
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
  const [validationErrors, setValidationErrors] = useState<{
    selectedCondition?: string;
    foodImage?: string;
  }>({});

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

  return (
    <ProtectedRoute>
      <div className="bg-background min-h-screen">
        <Navbar />

        {/* Analysis Section */}
        <section className="bg-background py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 space-y-4 text-center">
                <Badge
                  variant="secondary"
                  className="border-nutriscan-slate-200 bg-nutriscan-slate-100 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-800/50 mx-auto w-fit"
                >
                  <span className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 font-semibold">
                    🏥 Medical Analysis
                  </span>
                </Badge>
                <h1 className="text-nutriscan-slate-900 text-3xl font-bold md:text-4xl dark:text-white">
                  Analyze Your Food
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                  Upload a photo of your food and select your medical condition
                  to get personalized safety recommendations and alternative
                  suggestions.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Image Upload Card */}
                <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/50 bg-white">
                  <CardHeader>
                    <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 flex items-center">
                      <Camera className="text-nutriscan-primary dark:text-nutriscan-primary mr-2 h-5 w-5" />
                      Upload Food Image
                    </CardTitle>
                    <CardDescription>
                      Supported formats: JPG, PNG, WebP (Max 10MB)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div
                        className={`border-nutriscan-slate-300 bg-background hover:border-nutriscan-primary dark:border-nutriscan-slate-600 dark:hover:border-nutriscan-primary relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${validationErrors.foodImage ? "border-red-500 bg-red-50 dark:bg-red-900/10" : ""}`}
                      >
                        {selectedImage ? (
                          <div className="space-y-2">
                            <CheckCircle className="text-nutriscan-success mx-auto h-12 w-12" />
                            <p className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 font-semibold">
                              {selectedImage.name}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Image uploaded successfully (
                              {(selectedImage.size / 1024 / 1024).toFixed(2)}{" "}
                              MB)
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <ImageIcon className="text-nutriscan-slate-400 dark:text-nutriscan-slate-500 mx-auto h-12 w-12" />
                            <div>
                              <h3 className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 mb-2 text-lg font-semibold">
                                Drag & drop your food image here
                              </h3>
                              <p className="text-muted-foreground mb-4">
                                or click to browse files (Max 5MB)
                              </p>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleImageUpload}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </div>

                      {validationErrors.foodImage && (
                        <p className="flex items-center text-sm text-red-600">
                          <AlertCircle className="mr-1 h-4 w-4" />
                          {validationErrors.foodImage}
                        </p>
                      )}

                      {!selectedImage && (
                        <Button className="bg-nutriscan-primary hover:bg-nutriscan-primary-hover w-full text-white">
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Condition Selection */}
                <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/50 bg-white">
                  <CardHeader>
                    <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 flex items-center">
                      <Heart className="text-nutriscan-accent-rose dark:text-nutriscan-accent-rose mr-2 h-5 w-5" />
                      Medical Condition
                    </CardTitle>
                    <CardDescription>
                      Select your chronic disease or medical condition for
                      personalized recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="condition">
                          Chronic Disease/Medical Condition
                        </Label>
                        <Select
                          value={selectedCondition}
                          onValueChange={handleConditionChange}
                        >
                          <SelectTrigger
                            className={`w-full ${validationErrors.selectedCondition ? "border-red-500 focus:border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select your medical condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {MEDICAL_CONDITIONS.map((condition) => (
                              <SelectItem
                                key={condition.value}
                                value={condition.value}
                              >
                                {condition.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {validationErrors.selectedCondition && (
                          <p className="flex items-center text-sm text-red-600">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {validationErrors.selectedCondition}
                          </p>
                        )}
                      </div>

                      <div className="bg-nutriscan-slate-50 dark:bg-nutriscan-slate-800/30 space-y-2 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Activity className="text-nutriscan-primary h-4 w-4" />
                          <span className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-medium">
                            Why we need this information:
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Our AI analyzes how specific nutrients in your food
                          may affect your medical condition and provides
                          personalized safety recommendations.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analyze Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedImage || !selectedCondition || isAnalyzing}
                  className="bg-nutriscan-primary hover:bg-nutriscan-primary-hover px-8 py-3 text-lg text-white"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Analyze Food
                    </>
                  )}
                </Button>
              </div>

              {/* Analysis Results */}
              {analysisResult && (
                <Card className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 dark:bg-nutriscan-slate-900/50 mt-8 bg-white">
                  <CardHeader>
                    <CardTitle className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 flex items-center">
                      <CheckCircle className="text-nutriscan-success mr-2 h-5 w-5" />
                      Analysis Results
                    </CardTitle>
                    <CardDescription>
                      Based on your selected medical condition:{" "}
                      {
                        MEDICAL_CONDITIONS.find(
                          (c) => c.value === selectedCondition,
                        )?.label
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Uploaded Image */}
                      {analysisData?.foodImage && (
                        <div>
                          <Label className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-semibold">
                            Analyzed Food Image
                          </Label>
                          <div className="border-nutriscan-slate-200 dark:border-nutriscan-slate-700 mt-2 overflow-hidden rounded-lg border">
                            <img
                              src={analysisService.getFoodImageUrl(
                                analysisData.foodImage.fileId,
                              )}
                              alt={analysisData.foodImage.originalFileName}
                              className="mx-auto w-full max-w-xs rounded-lg object-cover"
                              onError={(e) => {
                                // Fallback to show the uploaded file preview
                                if (selectedImage) {
                                  e.currentTarget.src =
                                    URL.createObjectURL(selectedImage);
                                }
                              }}
                            />
                            <p className="text-nutriscan-slate-500 dark:text-nutriscan-slate-400 p-2 text-center text-xs">
                              {analysisData.foodImage.originalFileName}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Food Item */}
                      <div>
                        <Label className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-semibold">
                          Detected Food Item
                        </Label>
                        <p className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 text-lg font-medium">
                          {analysisResult.predicted_food}
                        </p>
                      </div>

                      {/* Nutrient Highlights */}
                      <div>
                        <Label className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-semibold">
                          Nutrient Information
                        </Label>
                        <p className="text-nutriscan-slate-600 dark:text-nutriscan-slate-400 mt-1">
                          {analysisResult.nutrient_highlights}
                        </p>
                      </div>

                      {/* Safety Status */}
                      <div>
                        <Label className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-semibold">
                          Safety Status
                        </Label>
                        <div
                          className={`mt-1 rounded-lg border px-3 py-2 ${
                            analysisResult.is_safe_for_condition
                              ? "border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          <span className="font-semibold">
                            {analysisResult.is_safe_for_condition
                              ? "Safe"
                              : "Caution Required"}
                          </span>
                        </div>
                      </div>

                      {/* Safety Message */}
                      <div>
                        <Label className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-semibold">
                          Safety Message
                        </Label>
                        <p className="text-nutriscan-slate-600 dark:text-nutriscan-slate-400 mt-1">
                          {analysisResult.safety_message}
                        </p>
                      </div>
                      {/* Recommendation */}
                      <div>
                        <Label className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-semibold">
                          Recommendation
                        </Label>
                        <p className="text-nutriscan-slate-600 dark:text-nutriscan-slate-400 mt-1">
                          {analysisResult.recommendation}
                        </p>
                      </div>

                      {/* Alternative Suggestions */}
                      <div>
                        <Label className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-semibold">
                          Alternative Suggestions
                        </Label>
                        <p className="text-nutriscan-slate-900 dark:text-nutriscan-slate-100 mt-1">
                          {analysisResult.alternative_suggestion}
                        </p>
                      </div>

                      {/* Message */}
                      <div>
                        <Label className="text-nutriscan-slate-700 dark:text-nutriscan-slate-300 text-sm font-semibold">
                          Analysis Message
                        </Label>
                        <p className="text-nutriscan-slate-600 dark:text-nutriscan-slate-400 mt-1">
                          {analysisResult.message}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedImage(null);
                            setSelectedCondition("");
                            setAnalysisResult(null);
                            setAnalysisData(null);
                          }}
                        >
                          Analyze Another
                        </Button>
                        <Button className="bg-nutriscan-primary hover:bg-nutriscan-primary-hover text-white">
                          Save to History
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {error && (
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      <p>{error}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
