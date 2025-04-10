import cron from "node-cron";
import axios from "axios";
import { db } from "../db/index.ts";
import { marketDataTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

// Stock symbols to fetch
const SYMBOLS = ["AAPL", "QQQ", "TRP", "INFY"];

// Function to fetch stock price from TwelveData
async function fetchStockPrice(symbol: string): Promise<number | null> {
  try {
    const apiKey = process.env.TWELVEDATA_API_KEY || "demo";
    if (!apiKey) {
      console.error(
        "TWELVEDATA_API_KEY is not defined in environment variables"
      );
      return null;
    }

    const response = await axios.get(`https://api.twelvedata.com/price`, {
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
      // Update existing record
      await db
        .update(marketDataTable)
        .set({ price: price.toString(), updatedAt: new Date() })
        .where(eq(marketDataTable.symbol, symbol));

      console.log(`Updated price for ${symbol}: ${price}`);
    } else {
      // Insert new record
      await db.insert(marketDataTable).values({
        symbol,
        price: price.toString(),
      });

      console.log(`Inserted new price for ${symbol}: ${price}`);
    }
  } catch (error) {
    console.error(`Error updating market data for ${symbol}:`, error);
  }
}

// Function to fetch and update all stock prices
async function fetchAndUpdateAllPrices(): Promise<void> {
  console.log("Fetching latest stock prices...");

  for (const symbol of SYMBOLS) {
    const price = await fetchStockPrice(symbol);
    if (price !== null) {
      await updateMarketData(symbol, price);
    }
  }
}

// Initialize the cron job
export function initMarketDataCron(): void {
  // Run every 5 seconds
  cron.schedule(
    "*/5 * * * * *",
    async () => {
      await fetchAndUpdateAllPrices();
    },
    {
      name: "market-data-cron",
    }
  );

  console.log("Market data cron job initialized to run every 5 seconds");
}
