import mongoose from "mongoose";

export interface AnalysisBase {
  userId: mongoose.Schema.Types.ObjectId;
  foodImage: mongoose.Schema.Types.ObjectId;
  medicalCondition: string;
  result: {
    predicted_food: string;
    nutrient_highlights: string;
    recommendation: string;
    alternative_suggestion: string;
    is_safe_for_condition: boolean;
    safety_message: string;
    message: string;
  };
  createdAt: Date;
}

// For instance methods
export interface AnalysisDocument extends mongoose.Document, AnalysisBase {}

// For static methods
export interface AnalysisModel extends mongoose.Model<AnalysisDocument> {}
