import cron from "node-cron";
import axios from "axios";
import { db } from "../db/index.ts";
import { marginTable, marketDataTable, positionsTable } from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";
import process from "node:process";
import { PositionsService } from "../services/positionsService.ts";
import { MarginService } from "../services/marginService.ts";
import { AVAILABLE_SYMBOLS, MAINTENANCE_MARGIN_RATE } from "../constants.ts";

// Stock symbols to fetch
const apiKey = process.env.TWELVEDATA_API_KEY || "demo";
const TWELVEDATA_API_URL =
  process.env.TWELVEDATA_API_URL || "https://api.twelvedata.com/";

// Function to fetch stock price from TwelveData
async function fetchStockPrice(symbol: string): Promise<number | null> {
  try {
    const response = await axios.get(`${TWELVEDATA_API_URL}/price`, {
      params: {
        symbol,
        apikey: apiKey,
      },
    });

    if (response.data && response.data.price) {
      return parseFloat(response.data.price);
    }

    console.error(`Failed to fetch price for ${symbol}:`, response.data);
    return null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

// Function to update market data in the database
async function updateMarketData(symbol: string, price: number): Promise<void> {
  try {
    // Check if the symbol already exists in the database
    const existingData = await db
      .select()
      .from(marketDataTable)
      .where(eq(marketDataTable.symbol, symbol));

    if (existingData.length > 0) {
      const change = price - (existingData[0]?.price || 0);

      // Update existing record
      await db
        .update(marketDataTable)
        .set({ price, change })
        .where(eq(marketDataTable.symbol, symbol));
    } else {
      // Insert new record
      await db.insert(marketDataTable).values({
        symbol,
        price,
        change: 0,
      });
    }
  } catch (error) {
    console.error(`Error updating market data for ${symbol}:`, error);
  }
}

// Function to fetch and update all stock prices
async function fetchAndUpdateAllPrices(): Promise<void> {
  console.log("Fetching latest stock prices...");

  for (const symbol of AVAILABLE_SYMBOLS) {
    const price = await fetchStockPrice(symbol);
    if (price !== null) {
      await updateMarketData(symbol, price);
    }
  }
}

async function updateMarginRequirementForAllClients(): Promise<void> {
  try {
    const portfolioMarketValueCTE = db.$with("portfolioMarketValue").as(
      db
        .select({
          clientId: positionsTable.clientId,
          portfolioMarketValue:
            sql<number>`SUM(${positionsTable.quantity} * ${marketDataTable.price})`.as(
              "portfolioMarketValue"
            ),
        })
        .from(positionsTable)
        .leftJoin(
          marketDataTable,
          eq(positionsTable.symbol, marketDataTable.symbol)
        )
        .groupBy(positionsTable.clientId)
    );

    await db
      .with(portfolioMarketValueCTE)
      .update(marginTable)
      .set({
        marginRequirement: sql`${portfolioMarketValueCTE.portfolioMarketValue} * ${MAINTENANCE_MARGIN_RATE}`,
      })
      .from(portfolioMarketValueCTE)
      .where(eq(marginTable.clientId, portfolioMarketValueCTE.clientId));
    console.log("Updated margin requirement for all clients");
  } catch (error) {
    console.error("Error updating margin requirement for all clients:", error);
  }
}

// Initialize the cron job
export function initMarketDataCron(): void {
  // Run every 5 seconds
  cron.schedule(
    "*/5 * * * * *",
    async () => {
      await fetchAndUpdateAllPrices();
      await updateMarginRequirementForAllClients();
    },
    {
      name: "market-data-cron",
    }
  );

  console.log("Market data cron job initialized to run every 5 seconds");
}
