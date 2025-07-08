import path from "node:path";
import mongoose from "mongoose";
import { FoodImageDocument, FoodImageModel } from "../types/FoodImage";

const foodImageSchema = new mongoose.Schema<FoodImageDocument, FoodImageModel>(
  {
    originalFileName: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    virtuals: {
      imageEndPoint: {
        get(this: FoodImageDocument): string {
          return `/api/image/${this.fileId}`;
        },
      },
      filename: {
        get(this: FoodImageDocument): string {
          const extension = path.extname(this.originalFileName);
          return `${this.fileId}${extension}`;
        },
      },
    },
  },
);

const FoodImage = mongoose.model("FoodImage", foodImageSchema);
export default FoodImage;
