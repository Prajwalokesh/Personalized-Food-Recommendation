// Package Import
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

// Custom methods Import
import { ApiError } from "./utils/ApiError";
import { sendError, sendSuccess } from "./utils/sendResponse";
import { connectDB } from "./config/db";

// Routers Import
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import analysisRouter from "./routes/analysis.route";
import imageRouter from "./routes/image.route";

// Adding attributes to the Express Request Object
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const PORT = process.env.PORT || 4000;
const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.get("/api/health", (_req: Request, res: Response) => {
  return sendSuccess(res, "Health OK!", undefined, 200);
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/analysis", analysisRouter);
app.use("/api/image", imageRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError && err.isOperational) {
    return sendError(res, err.message, err.message, err.statusCode);
  }
  console.error("❌ Unexpected Error:", err);
  return sendError(
    res,
    "Internal Server Error",
    process.env.NODE_ENV === "development" && err instanceof Error
      ? err.stack
      : undefined,
    500,
  );
});

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
