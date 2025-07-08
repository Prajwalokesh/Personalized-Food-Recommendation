import path from "node:path";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod/v4";
import { foodItemMap } from "../constants/foods";
import { sendError, sendSuccess } from "../utils/sendResponse";
import {
  deleteAnalysisParamsSchema,
  historyQuerySchema,
  recommendationSchema,
} from "../schema/analysis.schema";
import Analysis from "../models/Analysis.model";
import FoodImage from "../models/FoodImage.model";
import FormData from "form-data";

export async function getRecommendation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { success, data, error } = recommendationSchema.safeParse(req.body);

  if (!success) {
    return sendError(
      res,
      "Invalid request!",
      z.flattenError(error).fieldErrors,
      400,
    );
  }

  const { selectedCondition } = data;
  const file = req.file;

  if (!file) {
    return sendError(
      res,
      "Food Image is needed",
      "No Image of Food is given!",
      404,
    );
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const formData = new FormData();

    formData.append(
      "file",
      fsSync.createReadStream(`./src/uploads/${file.filename}`),
    );
    formData.append("medical_condition", selectedCondition || "diabetes");

    const response = await axios.post(
      `${process.env.MODEL_BASE_URL}/predict-health`,
      formData,
      { headers: formData.getHeaders() },
    );
    const {
      predicted_class,
      nutrient_highlights,
      recommendation,
      alternative_suggestion,
      is_safe_for_condition,
      safety_message,
      message,
    } = response.data;

    const savedFile = await FoodImage.insertOne(
      {
        originalFileName: file.originalname,
        fileId: path.parse(file.filename).name,
        userId: req.userId,
      },
      { session: mongoSession },
    );
    const analysisRecord = await Analysis.insertOne(
      {
        userId: req.userId,
        foodImage: savedFile._id,
        medicalCondition: selectedCondition,
        result: {
          predicted_food: foodItemMap[predicted_class],
          nutrient_highlights,
          recommendation,
          alternative_suggestion,
          is_safe_for_condition,
          safety_message,
          message,
        },
      },
      { session: mongoSession },
    );

    const responseData = {
      medicalCondition: analysisRecord.medicalCondition,
      foodImage: {
        originalFileName: savedFile.originalFileName,
        imageEndpoint: savedFile.imageEndPoint,
        fileId: savedFile.fileId,
        createdAt: savedFile.createdAt,
      },
      result: analysisRecord.result,
    };

    await mongoSession.commitTransaction();

    return sendSuccess(res, "Image saved successfully!", responseData, 201);
  } catch (error) {
    await mongoSession.abortTransaction();
    await fs.rm(`./src/uploads/${file.filename}`);
    return next(error);
  }
}

export async function getAnalysisHistory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { success, data, error } = historyQuerySchema.safeParse(req.query);

    if (!success) {
      return sendError(
        res,
        "Invalid query parameters",
        z.flattenError(error).fieldErrors,
        400,
      );
    }

    const { page, limit, sortBy, sortOrder } = data;
    const skip = (page - 1) * limit;
    const validatedLimit = Math.min(limit, 50);
    const sortOptions: any = {};

    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const totalDocuments = await Analysis.countDocuments({
      userId: req.userId,
    });

    const totalPages = Math.ceil(totalDocuments / validatedLimit);
    const histories = await Analysis.find({ userId: req.userId })
      .sort(sortOptions)
      .skip(skip)
      .limit(validatedLimit)
      .populate("foodImage", "-__v")
      .select("-__v")
      .lean();

    const pagination = {
      currentPage: page,
      totalPages,
      totalDocuments,
      limit: validatedLimit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      skip,
      documentsInCurrentPage: histories.length,
    };

    const responseData = {
      histories,
      pagination,
    };

    return sendSuccess(res, "All Your Analysis Sessions", responseData, 200);
  } catch (error) {
    return next(error);
  }
}
export async function deleteAnalysisHistory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { success, data, error } = deleteAnalysisParamsSchema.safeParse(
    req.params,
  );

  if (!success) {
    return sendError(
      res,
      "Invalid request!",
      z.flattenError(error).fieldErrors,
      400,
    );
  }

  const { analysisId } = data;
  const mongoSession = await mongoose.startSession();

  try {
    mongoSession.startTransaction();

    const analysisRecord = await Analysis.findByIdAndDelete(analysisId);

    if (!analysisRecord) {
      return sendError(
        res,
        "No Such records found to delete!",
        "No such records",
        404,
      );
    }

    const foodImage = await FoodImage.findByIdAndDelete(
      analysisRecord.foodImage,
    );

    if (!foodImage) {
      return sendError(
        res,
        "No Such records found to delete!",
        "No such records",
        404,
      );
    }

    await fs.rm(`./src/uploads/${foodImage.filename}`);
    await mongoSession.commitTransaction();

    return sendSuccess(res, "Analysis Record Deleted Successfully!", null, 200);
  } catch (error) {
    await mongoSession.abortTransaction();
    return next(error);
  }
}
