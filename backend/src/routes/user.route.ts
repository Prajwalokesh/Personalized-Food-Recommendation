import express from "express";
import { getMyProfile, registerUser } from "../controllers/user.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.get("/me", checkAuth, getMyProfile);

export default router;
