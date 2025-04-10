import { db } from "./index.ts";
import {
  clientsTable,
  positionsTable,
  marginTable,
  marketDataTable,
} from "./schema.ts";
import process from "node:process";

async function cleanup() {
  try {
    // Delete in reverse order of dependencies to respect foreign key constraints
    await db.delete(marginTable);
    await db.delete(positionsTable);
    await db.delete(clientsTable);
    await db.delete(marketDataTable);
    console.log("✅ Tables cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing tables:", error);
    throw error;
  }
}

async function seed() {
  try {
    // Clear existing data first
    await cleanup();

    // Create mock clients
    const clientIds = await Promise.all([
      db
        .insert(clientsTable)
        .values({
          name: "John Smith",
        })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({
          name: "Sarah Johnson",
        })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({
          name: "Michael Chen",
        })
        .returning({ id: clientsTable.id }),
    ]);

    // Create mock market data
    const marketData = [
      {
        symbol: "AAPL",
        price: "175.50",
      },
      {
        symbol: "QQQ",
        price: "425.75",
      },
      {
        symbol: "TRP",
        price: "450.25",
      },
      {
        symbol: "INFY",
        price: "165.00",
      },
    ];

    await Promise.all(
      marketData.map((data) => db.insert(marketDataTable).values(data))
    );

    // Create mock positions for each client
    const positions = [
      // John Smith's positions
      {
        symbol: "AAPL",
        quantity: 100,
        costBasis: "150.25",
        clientId: clientIds[0][0].id,
      },
      {
        symbol: "QQQ",
        quantity: 50,
        costBasis: "300.00",
        clientId: clientIds[0][0].id,
      },
      // Sarah Johnson's positions
      {
        symbol: "TRP",
        quantity: 25,
        costBasis: "275.50",
        clientId: clientIds[1][0].id,
      },
      {
        symbol: "INFY",
        quantity: 30,
        costBasis: "100.00",
        clientId: clientIds[1][0].id,
      },
      // Michael Chen's positions
      {
        symbol: "QQQ",
        quantity: 75,
        costBasis: "350.00",
        clientId: clientIds[2][0].id,
      },
      {
        symbol: "AAPL",
        quantity: 40,
        costBasis: "175.75",
        clientId: clientIds[2][0].id,
      },
    ];

    await Promise.all(
      positions.map((position) => db.insert(positionsTable).values(position))
    );

    // Create mock margin data for each client
    const marginData = [
      {
        clientId: clientIds[0][0].id,
        loanBalance: "25000.00",
        marginRequirement: "15000.00",
      },
      {
        clientId: clientIds[1][0].id,
        loanBalance: "50000.00",
        marginRequirement: "30000.00",
      },
      {
        clientId: clientIds[2][0].id,
        loanBalance: "35000.00",
        marginRequirement: "20000.00",
      },
    ];

    await Promise.all(
      marginData.map((margin) => db.insert(marginTable).values(margin))
    );

    console.log("✅ Seed data inserted successfully");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Execute the seed function
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
