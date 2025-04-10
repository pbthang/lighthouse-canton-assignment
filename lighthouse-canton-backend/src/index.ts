import express, { Request, Response, NextFunction, Express } from "express";
import process from "node:process";
import "dotenv/config";
import { createServer } from "http";

// Import routes
import marketDataRoutes from "./routes/marketData.ts";
import clientsRoutes from "./routes/clients.ts";
import positionsRoutes from "./routes/positions.ts";
import marginRoutes from "./routes/margin.ts";

// Import cron job
import { initMarketDataCron } from "./cron/marketDataCron.ts";

const app: Express = express();
const httpServer = createServer(app);

app.use(express.json());

const port = process.env.PORT || 8080;

// Root route
app.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      message: "Hurray!! we create our first server on bun js",
      success: true,
    });
  } catch (error: unknown) {
    next(new Error((error as Error).message));
  }
});

// API routes
app.use("/api/market-data", marketDataRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/positions", positionsRoutes);
app.use("/api/margin", marginRoutes);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

httpServer.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);

  // Initialize the market data cron job
  initMarketDataCron();
});
