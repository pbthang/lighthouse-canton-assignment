import { db } from "../db/index.ts";
import { positionsTable, marketDataTable } from "../db/schema.ts";
import { eq, and, sql } from "drizzle-orm";

/**
 * Service for handling positions-related database operations
 */
export class PositionsService {
  /**
   * Get positions for a specific client
   * @param clientId - The ID of the client
   * @returns Array of positions with market data
   */
  async getPositionsByClientId(clientId: string) {
    const data = await db
      .select()
      .from(positionsTable)
      .leftJoin(
        marketDataTable,
        eq(positionsTable.symbol, marketDataTable.symbol)
      )
      .where(eq(positionsTable.clientId, clientId));

    // Map positions to include price
    const positionsWithPrices = data.map((x) => ({
      symbol: x.positions.symbol,
      quantity: x.positions.quantity,
      costBasis: x.positions.costBasis,
      currentPrice: x.market_data?.price ?? 0,
      change: x.market_data?.change ?? 0,
      marketValue: x.market_data?.price
        ? x.positions.quantity * x.market_data.price
        : 0,
      createdAt: x.positions.createdAt,
      updatedAt: x.positions.updatedAt,
    }));

    return positionsWithPrices;
  }

  async getPortfolioMarketValue(clientId: string) {
    const portfolioMarketValue = await db
      .select({
        marketValue: sql<number>`SUM(${positionsTable.quantity} * ${marketDataTable.price})`,
        change: sql<number>`SUM(${positionsTable.quantity} * ${marketDataTable.change})`,
      })
      .from(positionsTable)
      .leftJoin(
        marketDataTable,
        eq(positionsTable.symbol, marketDataTable.symbol)
      )
      .where(eq(positionsTable.clientId, clientId));

    return portfolioMarketValue.length > 0
      ? portfolioMarketValue[0]
      : { marketValue: 0, change: 0 };
  }

  /**
   * Add or update a position
   * @param symbol - The symbol of the position
   * @param quantity - The quantity of the position
   * @param costBasis - The cost basis of the position
   * @param clientId - The ID of the client
   * @returns True if successful, false otherwise
   */
  async addOrUpdatePosition(
    symbol: string,
    quantity: number,
    costBasis: number,
    clientId: string
  ) {
    // Check if position already exists
    const existingPositions = await db
      .select()
      .from(positionsTable)
      .where(
        and(
          eq(positionsTable.symbol, symbol),
          eq(positionsTable.clientId, clientId)
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
            eq(positionsTable.symbol, symbol),
            eq(positionsTable.clientId, clientId)
          )
        );

      return true;
    } else {
      // Create new position
      await db.insert(positionsTable).values({
        symbol,
        quantity,
        costBasis,
        clientId,
      });

      return true;
    }
  }
}
