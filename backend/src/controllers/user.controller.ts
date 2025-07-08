import { NextFunction, Request, Response } from "express";
import { z } from "zod/v4";
import { sendError, sendSuccess } from "../utils/sendResponse";
import { registerSchema } from "../schema/user.schema";
import User from "../models/User.model";

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { success, data, error } = registerSchema.safeParse(req.body);

    if (!success) {
      return sendError(
        res,
        "Invalid credentials",
        z.flattenError(error).fieldErrors,
        400,
      );
    }

    const { firstName, lastName, username, email, password } = data;

    await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    return sendSuccess(
      res,
      "Registered User Successfully",
      { email, username },
      201,
    );
  } catch (error: any) {
    if (error.code === 121) {
      return sendError(
        res,
        error.message,
        "Invalid input, please enter valid details",
        400,
      );
    } else if (error.code === 11000) {
      console.log(error);

      if (error.keyValue.email) {
        return sendError(
          res,
          "A user with this email address already exists. Please try logging in or use a different email.",
          "This email already exists",
          409,
        );
      }

      if (error.keyValue.username) {
        return sendError(
          res,
          "A user with this username already exists. Please use another username.",
          "This username already exists",
          409,
        );
      }
    }

    return next(error);
  }
}

export async function getMyProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await User.findById(req.userId)
      .select("firstName lastName email username")
      .lean();
    return sendSuccess(res, "Found the user!", user, 200);
  } catch (error) {
    return next(error);
  }
}
