import { Router } from "express";
import { createAudit, getAuditBySlug, generateSummary } from "../controllers/audit.controller";
import { standardLimiter, strictLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

router.post("/", standardLimiter, createAudit);
router.get("/:slug", getAuditBySlug);
router.post("/summary", strictLimiter, generateSummary);

export default router;
