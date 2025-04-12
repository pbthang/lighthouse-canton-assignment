import type { Request, Response, NextFunction } from "express";
import { PositionsService } from "../services/positionsService.ts";

/**
 * Controller for handling positions-related HTTP requests
 */
export class PositionsController {
  private positionsService: PositionsService;

  constructor() {
    this.positionsService = new PositionsService();
  }

  /**
   * Get positions for a specific client
   */
  async getPositionsByClientId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { clientId = "" } = req.params;

      const positions = await this.positionsService.getPositionsByClientId(
        clientId
      );

      res.status(200).json({
        success: true,
        data: positions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add or update a position
   */
  async addOrUpdatePosition(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      const success = await this.positionsService.addOrUpdatePosition(
        symbol,
        quantity,
        costBasis,
        clientId
      );

      if (success) {
        res.status(200).json({
          success: true,
          message: "Position updated successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update position",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
