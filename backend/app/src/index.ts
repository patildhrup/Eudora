import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import auditRoutes from "./routes/audit.routes";
import leadRoutes from "./routes/lead.routes";
import { generateSummary } from "./controllers/audit.controller";
import { strictLimiter } from "./middleware/rate-limit.middleware";
import { errorHandler } from "./middleware/error.middleware";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and utility middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP for dev convenience with next rewrites
}));
app.use(cors({
  origin: "*", // Safe for API-only server in dev/prod with rewrites
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(morgan("dev"));

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/audit", auditRoutes);
app.use("/api/leads", leadRoutes);
app.post("/api/summary", strictLimiter, generateSummary);

// Global Error Handler
app.use(errorHandler);

// Start listening
app.listen(PORT, () => {
  console.log(`Eudora Express Backend running on http://localhost:${PORT}`);
});
