import {
  integer,
  doublePrecision,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const clientsTable = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Define relations for clients table
export const clientsRelations = relations(clientsTable, ({ many, one }) => ({
  positions: many(positionsTable),
  margin: one(marginTable),
}));

export const positionsTable = pgTable(
  "positions",
  {
    symbol: varchar({ length: 255 }).references(() => marketDataTable.symbol),
    quantity: integer().notNull().default(0),
    costBasis: doublePrecision().notNull().default(0),
    clientId: uuid("client_id").references(() => clientsTable.id),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.symbol, t.clientId] })]
);

// Define relations for positions table
export const positionsRelations = relations(positionsTable, ({ one }) => ({
  client: one(clientsTable, {
    fields: [positionsTable.clientId],
    references: [clientsTable.id],
  }),
  marketData: one(marketDataTable, {
    fields: [positionsTable.symbol],
    references: [marketDataTable.symbol],
  }),
}));

export const tendencyEnum = pgEnum("tendency", ["UP", "DOWN", "FLAT"]);

export const marketDataTable = pgTable(
  "market_data",
  {
    symbol: varchar({ length: 255 }),
    price: doublePrecision().notNull().default(0),
    change: doublePrecision().notNull().default(0),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.symbol] })]
);

// Define relations for market data table
export const marketDataRelations = relations(marketDataTable, ({ many }) => ({
  positions: many(positionsTable),
}));

export const marginTable = pgTable("margin", {
  clientId: uuid("client_id")
    .references(() => clientsTable.id)
    .primaryKey(),
  loanBalance: doublePrecision().notNull().default(0),
  marginRequirement: doublePrecision().notNull().default(0),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Define relations for margin table
export const marginRelations = relations(marginTable, ({ one }) => ({
  client: one(clientsTable, {
    fields: [marginTable.clientId],
    references: [clientsTable.id],
  }),
}));
