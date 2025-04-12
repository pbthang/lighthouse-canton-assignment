import { db } from "../db/index.ts";
import { marketDataTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

/**
 * Service for handling market data-related database operations
 */
export class MarketDataService {
  /**
   * Get all market data
   * @returns Array of market data
   */
  async getAllMarketData() {
    return await db.select().from(marketDataTable);
  }

  /**
   * Get market data for a specific symbol
   * @param symbol - The symbol to retrieve market data for
   * @returns The market data if found, null otherwise
   */
  async getMarketDataBySymbol(symbol: string) {
    const marketData = await db
      .select()
      .from(marketDataTable)
      .where(eq(marketDataTable.symbol, symbol));

    return marketData.length > 0 ? marketData[0] : null;
  }
}
