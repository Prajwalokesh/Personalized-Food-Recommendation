import mongoose from "mongoose";

export interface FoodImageBase {
  originalFileName: string;
  fileId: string;
  filename: string;
  userId: mongoose.Schema.Types.ObjectId;
  imageEndPoint: string;
  createdAt: Date;
}

// For instance methods
export interface FoodImageDocument extends mongoose.Document, FoodImageBase {}

// For static methods
export interface FoodImageModel extends mongoose.Model<FoodImageDocument> {}
