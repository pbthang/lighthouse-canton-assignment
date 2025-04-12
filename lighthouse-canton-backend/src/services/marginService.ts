import { db } from "../db/index.ts";
import { marginTable, positionsTable, marketDataTable } from "../db/schema.ts";
import { eq, and, sql } from "drizzle-orm";
import { PositionsService } from "./positionsService.ts";
import { MAINTENANCE_MARGIN_RATE } from "../constants.ts";
/**
 * Service for handling margin-related database operations
 */
export class MarginService {
  private positionsService: PositionsService;

  constructor() {
    this.positionsService = new PositionsService();
  }

  /**
   * Get margin data for a specific client
   * @param clientId - The ID of the client
   * @returns The margin data if found, null otherwise
   */
  async getMarginData(clientId: string) {
    const marginData = await db
      .select()
      .from(marginTable)
      .where(eq(marginTable.clientId, clientId));

    return marginData.length > 0 ? marginData[0] : null;
  }

  /**
   * Calculate margin status for a client
   * @param clientId - The ID of the client
   * @returns Object containing margin status information
   */
  async calculateMarginStatus(clientId: string) {
    // Get margin data for the client
    const margin = await this.getMarginData(clientId);

    if (!margin) {
      return null;
    }

    // Calculate total market value of positions
    const marketValueResp = await this.positionsService.getPortfolioMarketValue(
      clientId
    );
    const totalMarketValue = marketValueResp?.marketValue || 0;
    const totalChange = marketValueResp?.change || 0;

    // Calculate margin status
    const loanBalance = margin.loanBalance;
    const marginRequirement = totalMarketValue * MAINTENANCE_MARGIN_RATE;
    const netEquity = totalMarketValue - loanBalance;
    const marginShortfall = marginRequirement - netEquity;

    return {
      clientId,
      loanBalance,
      marginRequirement,
      totalMarketValue,
      totalMarketValueChange: totalChange,
      netEquity,
      marginShortfall,
      marginCallTriggered: marginShortfall > 0,
    };
  }

  /**
   * Update loan balance for a client
   * @param clientId - The ID of the client
   * @param loanBalance - The new loan balance
   * @returns True if successful, false otherwise
   */
  async updateLoanBalance(clientId: string, loanBalance: number) {
    // Check if margin record exists
    const marginData = await db
      .select()
      .from(marginTable)
      .where(eq(marginTable.clientId, clientId));

    if (marginData.length > 0) {
      // Update existing margin record
      await db
        .update(marginTable)
        .set({
          loanBalance: loanBalance,
        })
        .where(eq(marginTable.clientId, clientId));

      return true;
    } else {
      // Create new margin record
      await db.insert(marginTable).values({
        clientId: clientId,
        loanBalance: loanBalance,
        marginRequirement: 0, // Default value
      });

      return true;
    }
  }
}
