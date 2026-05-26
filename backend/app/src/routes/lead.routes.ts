import { Router } from "express";
import { createLead } from "../controllers/lead.controller";
import { strictLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

router.post("/", strictLimiter, createLead);

export default router;
