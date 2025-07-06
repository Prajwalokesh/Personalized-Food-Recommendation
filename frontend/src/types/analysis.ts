export interface AnalysisResult {
  predicted_food: string;
  nutrient_highlights: string;
  recommendation: string;
  alternative_suggestion: string;
  is_safe_for_condition: boolean;
  safety_message: string;
  message: string;
}

export interface FoodImageData {
  originalFileName: string;
  imageEndpoint: string;
  fileId: string;
  createdAt: string;
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  data: {
    medicalCondition: string;
    foodImage: FoodImageData;
    result: AnalysisResult;
  };
}

export interface AnalysisRequest {
  selectedCondition: string;
  foodImg: File;
}

// History-related types
export interface HistoryFoodImage {
  _id: string;
  originalFileName: string;
  fileId: string;
  userId: string;
  createdAt: string;
}

export interface AnalysisHistoryItem {
  _id: string;
  userId: string;
  foodImage: HistoryFoodImage;
  medicalCondition: string;
  result: AnalysisResult;
  createdAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalDocuments: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  skip: number;
  documentsInCurrentPage: number;
}

export interface AnalysisHistoryResponse {
  success: boolean;
  message: string;
  data: {
    histories: AnalysisHistoryItem[];
    pagination: PaginationMeta;
  };
}

// Medical conditions enum/type
export type MedicalCondition =
  | "diabetes"
  | "hypertension"
  | "heart_disease"
  | "obesity"
  | "kidney_disease"
  | "allergies"
  | "none";

export const MEDICAL_CONDITIONS: { value: MedicalCondition; label: string }[] =
  [
    { value: "diabetes", label: "Diabetes" },
    { value: "hypertension", label: "Hypertension (High Blood Pressure)" },
    { value: "heart_disease", label: "Heart Disease" },
    { value: "obesity", label: "Obesity" },
    { value: "kidney_disease", label: "Kidney Disease" },
    { value: "allergies", label: "Food Allergies" },
    { value: "none", label: "No Medical Conditions" },
  ];
