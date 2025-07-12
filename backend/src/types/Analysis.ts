import mongoose from "mongoose";

export interface AnalysisBase {
  userId: mongoose.Schema.Types.ObjectId;
  foodImage: mongoose.Schema.Types.ObjectId;
  medicalCondition: string;
  result: {
    predicted_food: string;
    health_analysis: string;
    safety_message: string;
    message: string;
  };
  createdAt: Date;
}

// For instance methods
export interface AnalysisDocument extends mongoose.Document, AnalysisBase {}

// For static methods
export interface AnalysisModel extends mongoose.Model<AnalysisDocument> {}
