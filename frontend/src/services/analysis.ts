import axiosInstance from "@/lib/axios";
import type {
  AnalysisResponse,
  MedicalCondition,
  AnalysisHistoryResponse,
} from "@/types/analysis";
import { handleBackendValidationError } from "@/lib/validation";

export const analysisService = {
  // Submit food image for analysis
  analyzeFood: async (
    foodImage: File,
    medicalCondition: MedicalCondition,
  ): Promise<AnalysisResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", foodImage);
      formData.append("selectedCondition", medicalCondition);

      const response = await axiosInstance.post<AnalysisResponse>(
        "/analysis/recommend",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      const errorMessage = handleBackendValidationError(error);
      throw new Error(errorMessage);
    }
  },

  // Get food image by file ID
  getFoodImageUrl: (fileId: string): string => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/image/${fileId}`;
  },

  // Get analysis history with pagination
  getAnalysisHistory: async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
  ): Promise<AnalysisHistoryResponse> => {
    try {
      const response = await axiosInstance.get<AnalysisHistoryResponse>(
        "/analysis/history",
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = handleBackendValidationError(error);
      throw new Error(errorMessage);
    }
  },

  // Delete analysis history
  deleteAnalysis: async (
    analysisId: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.delete<{
        success: boolean;
        message: string;
      }>(`/analysis/history/${analysisId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = handleBackendValidationError(error);
      throw new Error(errorMessage);
    }
  },
};
