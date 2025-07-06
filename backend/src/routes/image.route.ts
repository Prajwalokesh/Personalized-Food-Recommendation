import express from "express";
import { getFoodImage } from "../controllers/image.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:fileId", checkAuth, getFoodImage);

export default router;
