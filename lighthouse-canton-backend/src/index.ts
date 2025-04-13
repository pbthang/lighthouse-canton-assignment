import express, {
  type Request,
  type Response,
  type NextFunction,
  type Express,
} from "express";
import process from "node:process";
import "dotenv/config";
import { createServer } from "http";
import morgan from "morgan";

// Import routes
import marketDataRoutes from "./routes/marketData.ts";
import clientsRoutes from "./routes/clients.ts";
import positionsRoutes from "./routes/positions.ts";
import marginRoutes from "./routes/margin.ts";
import userAuthRoutes from "./routes/userAuth.ts";

// Import cron job
import { initMarketDataCron } from "./cron/marketDataCron.ts";
import { verifyRole, verifyToken } from "./middlewares/authMiddleware.ts";
import cors from "cors";

const app: Express = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// use cors middleware
app.use(
  cors({
    origin: "*",
    methods: ["*"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev")); // Logging middleware

const port = process.env.PORT || 8080;

// Health check route
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

// API routes (public)
app.use("/api/auth", userAuthRoutes);

// API routes (protected)
app.use("/api/market-data", verifyToken, verifyRole("admin"), marketDataRoutes);
app.use("/api/clients", verifyToken, verifyRole("admin"), clientsRoutes);
app.use("/api/positions", verifyToken, verifyRole("admin"), positionsRoutes);
app.use("/api/margin", verifyToken, verifyRole("admin"), marginRoutes);

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
});
