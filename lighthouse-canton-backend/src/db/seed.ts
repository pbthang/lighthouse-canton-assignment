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
        .values({ name: "John Smith" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Sarah Johnson" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Michael Chen" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Emily Davis" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "David Brown" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Sophia Wilson" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "James Taylor" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Olivia Martinez" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Liam Anderson" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Emma Thomas" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Noah Jackson" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Ava White" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "William Harris" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Isabella Clark" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Mason Lewis" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Mia Robinson" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Lucas Walker" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Charlotte Hall" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Ethan Allen" })
        .returning({ id: clientsTable.id }),
      db
        .insert(clientsTable)
        .values({ name: "Amelia Young" })
        .returning({ id: clientsTable.id }),
    ]);

    if (clientIds.length < 20) {
      throw new Error("Failed to create mock clients");
    }
    console.log("✅ Mock clients created successfully");

    // Create mock market data
    const marketData = [
      {
        symbol: "AAPL",
        price: 175.5,
      },
      {
        symbol: "QQQ",
        price: 425.75,
      },
      {
        symbol: "TRP",
        price: 450.25,
      },
      {
        symbol: "INFY",
        price: 165.0,
      },
    ];

    await Promise.all(
      marketData.map((data) => db.insert(marketDataTable).values(data))
    );

    // Create mock positions for each client
    const positions = [
      {
        symbol: "AAPL",
        quantity: 100,
        costBasis: 150.25,
        clientId: clientIds[0][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 50,
        costBasis: 300.0,
        clientId: clientIds[0][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 20,
        costBasis: 250.0,
        clientId: clientIds[0][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 10,
        costBasis: 120.0,
        clientId: clientIds[0][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 25,
        costBasis: 275.5,
        clientId: clientIds[1][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 30,
        costBasis: 100.0,
        clientId: clientIds[1][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 60,
        costBasis: 160.0,
        clientId: clientIds[1][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 20,
        costBasis: 320.0,
        clientId: clientIds[1][0]?.id || "",
      },
      // Michael Chen's positions
      {
        symbol: "QQQ",
        quantity: 75,
        costBasis: 350.0,
        clientId: clientIds[2][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 40,
        costBasis: 175.75,
        clientId: clientIds[2][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 30,
        costBasis: 300.0,
        clientId: clientIds[2][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 15,
        costBasis: 130.0,
        clientId: clientIds[2][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 60,
        costBasis: 400.0,
        clientId: clientIds[3][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 20,
        costBasis: 120.0,
        clientId: clientIds[3][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 90,
        costBasis: 170.0,
        clientId: clientIds[3][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 80,
        costBasis: 400.0,
        clientId: clientIds[3][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 80,
        costBasis: 160.0,
        clientId: clientIds[4][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 45,
        costBasis: 310.0,
        clientId: clientIds[4][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 50,
        costBasis: 320.0,
        clientId: clientIds[4][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 25,
        costBasis: 135.0,
        clientId: clientIds[4][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 35,
        costBasis: 290.0,
        clientId: clientIds[5][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 50,
        costBasis: 140.0,
        clientId: clientIds[5][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 40,
        costBasis: 165.0,
        clientId: clientIds[5][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 25,
        costBasis: 330.0,
        clientId: clientIds[5][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 55,
        costBasis: 175.0,
        clientId: clientIds[6][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 65,
        costBasis: 370.0,
        clientId: clientIds[6][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 40,
        costBasis: 300.0,
        clientId: clientIds[7][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 45,
        costBasis: 130.0,
        clientId: clientIds[7][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 50,
        costBasis: 160.0,
        clientId: clientIds[7][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 55,
        costBasis: 340.0,
        clientId: clientIds[7][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 60,
        costBasis: 310.0,
        clientId: clientIds[8][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 30,
        costBasis: 125.0,
        clientId: clientIds[8][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 55,
        costBasis: 165.0,
        clientId: clientIds[8][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 35,
        costBasis: 330.0,
        clientId: clientIds[8][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 50,
        costBasis: 310.0,
        clientId: clientIds[9][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 25,
        costBasis: 125.0,
        clientId: clientIds[9][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 45,
        costBasis: 155.0,
        clientId: clientIds[9][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 30,
        costBasis: 310.0,
        clientId: clientIds[9][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 70,
        costBasis: 340.0,
        clientId: clientIds[10][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 60,
        costBasis: 150.0,
        clientId: clientIds[10][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 70,
        costBasis: 180.0,
        clientId: clientIds[10][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 40,
        costBasis: 340.0,
        clientId: clientIds[10][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 45,
        costBasis: 320.0,
        clientId: clientIds[11][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 35,
        costBasis: 135.0,
        clientId: clientIds[11][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 80,
        costBasis: 190.0,
        clientId: clientIds[11][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 50,
        costBasis: 360.0,
        clientId: clientIds[11][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 55,
        costBasis: 330.0,
        clientId: clientIds[12][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 45,
        costBasis: 145.0,
        clientId: clientIds[12][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 60,
        costBasis: 170.0,
        clientId: clientIds[12][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 50,
        costBasis: 350.0,
        clientId: clientIds[12][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 55,
        costBasis: 330.0,
        clientId: clientIds[13][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 40,
        costBasis: 140.0,
        clientId: clientIds[13][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 70,
        costBasis: 185.0,
        clientId: clientIds[13][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 60,
        costBasis: 370.0,
        clientId: clientIds[13][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 65,
        costBasis: 340.0,
        clientId: clientIds[14][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 50,
        costBasis: 150.0,
        clientId: clientIds[14][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 65,
        costBasis: 185.0,
        clientId: clientIds[14][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 55,
        costBasis: 360.0,
        clientId: clientIds[14][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 30,
        costBasis: 280.0,
        clientId: clientIds[15][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 20,
        costBasis: 120.0,
        clientId: clientIds[15][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 75,
        costBasis: 190.0,
        clientId: clientIds[16][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 60,
        costBasis: 370.0,
        clientId: clientIds[16][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 35,
        costBasis: 290.0,
        clientId: clientIds[17][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 25,
        costBasis: 125.0,
        clientId: clientIds[17][0]?.id || "",
      },
      {
        symbol: "AAPL",
        quantity: 85,
        costBasis: 200.0,
        clientId: clientIds[18][0]?.id || "",
      },
      {
        symbol: "QQQ",
        quantity: 70,
        costBasis: 380.0,
        clientId: clientIds[18][0]?.id || "",
      },
      {
        symbol: "TRP",
        quantity: 40,
        costBasis: 300.0,
        clientId: clientIds[19][0]?.id || "",
      },
      {
        symbol: "INFY",
        quantity: 30,
        costBasis: 130.0,
        clientId: clientIds[19][0]?.id || "",
      },
    ];

    await Promise.all(
      positions.map((position) => db.insert(positionsTable).values(position))
    );

    // Create mock margin data for each client
    const marginData = [
      {
        clientId: clientIds[0][0]?.id || "",
        loanBalance: 30000.0,
        marginRequirement: 20000.0,
      },
      {
        clientId: clientIds[1][0]?.id || "",
        loanBalance: 25000.0,
        marginRequirement: 30000.0,
      },
      {
        clientId: clientIds[2][0]?.id || "",
        loanBalance: 17000.0,
        marginRequirement: 30000.0,
      },
      {
        clientId: clientIds[3][0]?.id || "",
        loanBalance: 18000.0,
        marginRequirement: 35000.0,
      },
      {
        clientId: clientIds[4][0]?.id || "",
        loanBalance: 30000.0,
        marginRequirement: 50000.0,
      },
      {
        clientId: clientIds[5][0]?.id || "",
        loanBalance: 24000.0,
        marginRequirement: 45000.0,
      },
      {
        clientId: clientIds[6][0]?.id || "",
        loanBalance: 30000.0,
        marginRequirement: 35000.0,
      },
      {
        clientId: clientIds[7][0]?.id || "",
        loanBalance: 40000.0,
        marginRequirement: 40000.0,
      },
      {
        clientId: clientIds[8][0]?.id || "",
        loanBalance: 9000.0,
        marginRequirement: 35000.0,
      },
      {
        clientId: clientIds[9][0]?.id || "",
        loanBalance: 22000.0,
        marginRequirement: 40000.0,
      },
      {
        clientId: clientIds[10][0]?.id || "",
        loanBalance: 33000.0,
        marginRequirement: 32000.0,
      },
      {
        clientId: clientIds[11][0]?.id || "",
        loanBalance: 40000.0,
        marginRequirement: 20000.0,
      },
      {
        clientId: clientIds[12][0]?.id || "",
        loanBalance: 45000.0,
        marginRequirement: 25000.0,
      },
      {
        clientId: clientIds[13][0]?.id || "",
        loanBalance: 50000.0,
        marginRequirement: 30000.0,
      },
      {
        clientId: clientIds[14][0]?.id || "",
        loanBalance: 35000.0,
        marginRequirement: 20000.0,
      },
      {
        clientId: clientIds[15][0]?.id || "",
        loanBalance: 25000.0,
        marginRequirement: 15000.0,
      },
      {
        clientId: clientIds[16][0]?.id || "",
        loanBalance: 30000.0,
        marginRequirement: 20000.0,
      },
      {
        clientId: clientIds[17][0]?.id || "",
        loanBalance: 18000.0,
        marginRequirement: 25000.0,
      },
      {
        clientId: clientIds[18][0]?.id || "",
        loanBalance: 17000.0,
        marginRequirement: 30000.0,
      },
      {
        clientId: clientIds[19][0]?.id || "",
        loanBalance: 50000.0,
        marginRequirement: 35000.0,
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
