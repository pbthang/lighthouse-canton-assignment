import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db/index.ts";
import { marginTable, positionsTable, marketDataTable } from "../db/schema.ts";
import { eq, and } from "drizzle-orm";

const router = Router();

// GET /api/margin-status/:clientId - Calculate and return margin status
router.get(
  "/status/:clientId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId } = req.params;

      // Get margin data for the client
      const marginData = await db
        .select()
        .from(marginTable)
        .where(eq(marginTable.clientId, clientId as string));

      if (marginData.length === 0) {
        res.status(404).json({
          success: false,
          message: `Margin data for client ID ${clientId} not found`,
        });
        return;
      }

      const margin = marginData[0];

      // Get positions for the client
      const positions = await db
        .select()
        .from(positionsTable)
        .where(eq(positionsTable.clientId, clientId as string));

      // Calculate total market value of positions
      let totalMarketValue = 0;

      for (const position of positions) {
        const marketData = await db
          .select()
          .from(marketDataTable)
          .where(eq(marketDataTable.symbol, position.symbol as string));

        if (marketData.length > 0) {
          const currentPrice = Number(marketData[0].price);
          totalMarketValue += currentPrice * position.quantity;
        }
      }

      // Calculate margin status
      const loanBalance = Number(margin.loanBalance);
      const marginRequirement = Number(margin.marginRequirement);
      const availableMargin = totalMarketValue - marginRequirement;
      const excessMargin = availableMargin - loanBalance;

      res.status(200).json({
        success: true,
        data: {
          clientId,
          loanBalance,
          marginRequirement,
          totalMarketValue,
          availableMargin,
          excessMargin,
          marginUtilization:
            loanBalance > 0 ? (loanBalance / availableMargin) * 100 : 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/loans/:clientId - Update loan amount for a client
router.post(
  "/loans/:clientId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.params;
      const { loanBalance } = req.body;

      if (loanBalance === undefined) {
        res.status(400).json({
          success: false,
          message: "Missing required field: loanBalance",
        });
        return;
      }

      // Check if margin record exists
      const marginData = await db
        .select()
        .from(marginTable)
        .where(eq(marginTable.clientId, clientId as string));

      if (marginData.length > 0) {
        // Update existing margin record
        await db
          .update(marginTable)
          .set({
            loanBalance: loanBalance.toString(),
          })
          .where(eq(marginTable.clientId, clientId as string));

        res.status(200).json({
          success: true,
          message: "Loan balance updated successfully",
        });
      } else {
        // Create new margin record
        await db.insert(marginTable).values({
          clientId: clientId as string,
          loanBalance: loanBalance.toString(),
          marginRequirement: "0", // Default value
        });

        res.status(201).json({
          success: true,
          message: "Margin record created successfully",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
