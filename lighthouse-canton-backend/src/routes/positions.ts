import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db/index.ts";
import { positionsTable, marketDataTable } from "../db/schema.ts";
import { eq, and } from "drizzle-orm";

const router = Router();

// GET /api/positions/:clientId - Get positions for a specific client
router.get(
  "/:clientId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId } = req.params;

      const positions = await db
        .select()
        .from(positionsTable)
        .where(eq(positionsTable.clientId, clientId as string));

      // Get current market prices for each position
      const positionsWithPrices = await Promise.all(
        positions.map(async (position) => {
          const marketData = await db
            .select()
            .from(marketDataTable)
            .where(eq(marketDataTable.symbol, position.symbol as string));

          const currentPrice = marketData.length > 0 ? marketData[0].price : 0;
          const marketValue = Number(currentPrice) * position.quantity;
          const unrealizedPnL =
            marketValue - Number(position.costBasis) * position.quantity;

          return {
            ...position,
            currentPrice,
            marketValue,
            unrealizedPnL,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: positionsWithPrices,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/positions - Add or update a position
router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { symbol, quantity, costBasis, clientId } = req.body;

      if (
        !symbol ||
        quantity === undefined ||
        costBasis === undefined ||
        !clientId
      ) {
        res.status(400).json({
          success: false,
          message:
            "Missing required fields: symbol, quantity, costBasis, clientId",
        });
        return;
      }

      // Check if position already exists
      const existingPositions = await db
        .select()
        .from(positionsTable)
        .where(
          and(
            eq(positionsTable.symbol, symbol as string),
            eq(positionsTable.clientId, clientId as string)
          )
        );

      if (existingPositions.length > 0) {
        // Update existing position
        await db
          .update(positionsTable)
          .set({
            quantity,
            costBasis,
          })
          .where(
            and(
              eq(positionsTable.symbol, symbol as string),
              eq(positionsTable.clientId, clientId as string)
            )
          );

        res.status(200).json({
          success: true,
          message: "Position updated successfully",
        });
      } else {
        // Create new position
        await db.insert(positionsTable).values({
          symbol,
          quantity,
          costBasis,
          clientId,
        });

        res.status(201).json({
          success: true,
          message: "Position created successfully",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
