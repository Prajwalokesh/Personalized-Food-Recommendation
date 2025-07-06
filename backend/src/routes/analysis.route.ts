import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import {
  deleteAnalysisHistory,
  getAnalysisHistory,
  getRecommendation,
} from "../controllers/analysis.controller";
import upload from "../config/multer";

const router = express.Router();

router.post(
  "/recommend",
  checkAuth,
  upload.single("foodImg"),
  getRecommendation,
);

router.get("/history", checkAuth, getAnalysisHistory);

router.delete("/history/:analysisId", checkAuth, deleteAnalysisHistory);

export default router;
