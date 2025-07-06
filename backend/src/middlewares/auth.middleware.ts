import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/sendResponse";
import Session from "../models/Session.model";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { sid } = req.signedCookies;
  if (!sid) return sendError(res, "Not Logged In", undefined, 401);

  const session = await Session.findById(sid);
  if (!session) {
    res.clearCookie("sid");
    return sendError(res, "Not Logged In", undefined, 401);
  }

  req.userId = session.userId.toString();
  next();
}
