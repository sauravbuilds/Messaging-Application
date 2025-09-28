import express from "express";
import { connectifyAi } from "../lib/connectifyAi.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/connectifyAi", protectedRoute, connectifyAi);

export default router;