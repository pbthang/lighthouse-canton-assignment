import type { Request, Response, NextFunction } from "express";
import { MarginService } from "../services/marginService.ts";

/**
 * Controller for handling margin-related HTTP requests
 */
export class MarginController {
  private marginService: MarginService;

  constructor() {
    this.marginService = new MarginService();
  }

  /**
   * Get margin status for a client
   */
  async getMarginStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: clientId = "" } = req.params;

      const marginStatus = await this.marginService.calculateMarginStatus(
        clientId
      );

      if (!marginStatus) {
        res.status(404).json({
          success: false,
          message: `Margin data for client ID ${clientId} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: marginStatus,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update loan balance for a client
   */
  async updateLoanBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { clientId = "" } = req.params;
      const { loanBalance } = req.body;

      if (loanBalance === undefined) {
        res.status(400).json({
          success: false,
          message: "Missing required field: loanBalance",
        });
        return;
      }

      const success = await this.marginService.updateLoanBalance(
        clientId,
        loanBalance
      );

      if (success) {
        res.status(200).json({
          success: true,
          message: "Loan balance updated successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update loan balance",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
