import { NextFunction, Request, Response } from "express";
import FoodImage from "../models/FoodImage.model";
import { sendError } from "../utils/sendResponse";

export async function getFoodImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const fileId = req.params.fileId;
    const foodImageFile = await FoodImage.findOne({
      fileId,
      userId: req.userId,
    });

    if (!foodImageFile) {
      return sendError(
        res,
        "Cannot find the image you are looking for!",
        "Food Image Not Found",
        404,
      );
    }

    const filePath = `${process.cwd()}/src/uploads/${foodImageFile.filename}`;
    return res.sendFile(filePath, (err) => {
      if (!res.headersSent && err) {
        return sendError(res, "File not found", "Food Image not found!", 404);
      }
    });
  } catch (error) {
    return next(error);
  }
}
