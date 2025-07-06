import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import { sendError, sendSuccess } from "../utils/sendResponse";
import Session from "../models/Session.model";
import { loginSchema } from "../schema/auth.schema";
import { z } from "zod/v4";

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { success, data, error } = loginSchema.safeParse(req.body);

    if (!success) {
      return sendError(
        res,
        "Invalid credentials",
        z.flattenError(error).fieldErrors,
        400,
      );
    }

    const { email, password } = data;
    const existingUser = await User.findByEmail(email);

    if (!existingUser) {
      return sendError(
        res,
        "Either the email or password is incorrect",
        "Invalid Credentials",
        401,
      );
    }

    const isPasswordMatch = await existingUser.comparePassword(password);
    if (!isPasswordMatch) {
      return sendError(
        res,
        "Either the email or password is incorrect",
        "Invalid Credentials",
        401,
      );
    }

    const session = await Session.create({ userId: existingUser._id });

    res.cookie("sid", session.id, {
      httpOnly: true,
      signed: true,
      maxAge: Number(process.env.SESSION_EXPIRY_TIME_IN_SECONDS) * 1000,
    });

    return sendSuccess(res, "Logged In Successfully!", undefined, 200);
  } catch (error) {
    return next(error);
  }
}

export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { sid } = req.signedCookies;
    await Session.findByIdAndDelete(sid);
    res.clearCookie("sid");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
