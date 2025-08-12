import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import planRoutes from "./routes/plan.js";
import executeRoutes from "./routes/execute.js";
import { errorHandler } from "./middleware/errorHandler.js";

/**
 * Create and configure the Express application.
 * Includes CORS, JSON parser, routes, and Swagger documentation.
 */
// PUBLIC_INTERFACE
export async function createApp() {
  /** Construct an Express app wired with routes and middlewares. */
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN || "*";
  app.use(
    cors({
      origin: corsOrigin === "*" ? true : corsOrigin,
      credentials: false,
    })
  );
  app.use(express.json());

  // Health check
  app.get("/healthz", (_req, res) => {
    res.json({ status: "ok" });
  });

  // API docs
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Route registration
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/plan", planRoutes);
  app.use("/api/execute", executeRoutes);

  // Error handler
  app.use(errorHandler);

  return app;
}
