import { Router } from "express";
import { MarketDataController } from "../controllers/marketDataController.ts";

const router = Router();
const marketDataController = new MarketDataController();

// GET /api/market-data - Get latest market data for all symbols
router.get(
  "/",
  marketDataController.getAllMarketData.bind(marketDataController)
);

// GET /api/market-data/:symbol - Get latest market data for specific symbol
router.get(
  "/:symbol",
  marketDataController.getMarketDataBySymbol.bind(marketDataController)
);

// GET /api/market-data/time-series/:symbol?date=YYYY-MM-DD - Get historical market data for specific symbol
router.get(
  "/time-series/:symbol",
  marketDataController.getTimeSeriesData.bind(marketDataController)
);

export default router;
