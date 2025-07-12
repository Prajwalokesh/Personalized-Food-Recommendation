import mongoose from "mongoose";
import { AnalysisDocument, AnalysisModel } from "../types/Analysis";

const analysisSchema = new mongoose.Schema<AnalysisDocument, AnalysisModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodImage",
      required: true,
    },
    medicalCondition: {
      type: String,
      required: true,
    },
    result: {
      predicted_food: { type: String, required: true },
      health_analysis: { type: String, required: true },
      safety_message: { type: String, required: true },
      message: { type: String, required: true },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: "throw",
  },
);

const Analysis = mongoose.model<AnalysisDocument, AnalysisModel>(
  "Analysis",
  analysisSchema,
);
export default Analysis;
