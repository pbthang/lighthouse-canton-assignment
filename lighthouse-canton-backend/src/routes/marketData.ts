import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db/index.ts";
import { marketDataTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/market-data - Get latest market data for all symbols
router.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const marketData = await db.select().from(marketDataTable);
      res.status(200).json({
        success: true,
        data: marketData,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/market-data/:symbol - Get latest market data for specific symbol
router.get(
  "/:symbol",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { symbol } = req.params;

      const marketData = await db
        .select()
        .from(marketDataTable)
        .where(eq(marketDataTable.symbol, symbol as string));

      if (marketData.length === 0) {
        res.status(404).json({
          success: false,
          message: `Market data for symbol ${symbol} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: marketData[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
