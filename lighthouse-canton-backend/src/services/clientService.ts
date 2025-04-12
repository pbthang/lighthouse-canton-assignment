import { db } from "../db/index.ts";
import {
  clientsTable,
  positionsTable,
  marketDataTable,
  marginTable,
} from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";
import { PositionsService } from "./positionsService.ts";
import { MarginService } from "./marginService.ts";
import { MAINTENANCE_MARGIN_RATE } from "../constants.ts";

/**
 * Service for handling client-related database operations
 */
export class ClientService {
  private marginService: MarginService;

  constructor() {
    this.marginService = new MarginService();
  }

  /**
   * Get all clients from the database
   * @returns Array of clients
   */
  async getAllClients() {
    const loanCTE = db.$with("loan").as(
      db
        .select({
          clientId: marginTable.clientId,
          loanAmount: sql<number>`SUM(${marginTable.loanBalance})`.as(
            "loanAmount"
          ),
        })
        .from(marginTable)
        .groupBy(marginTable.clientId)
    );

    const portfolioCTE = db.$with("portfolio").as(
      db
        .select({
          clientId: positionsTable.clientId,
          portfolioMarketValue:
            sql<number>`SUM(${positionsTable.quantity} * ${marketDataTable.price})`.as(
              "portfolioMarketValue"
            ),
          change:
            sql<number>`SUM(${positionsTable.quantity} * ${marketDataTable.change})`.as(
              "change"
            ),
        })
        .from(positionsTable)
        .leftJoin(
          marketDataTable,
          eq(positionsTable.symbol, marketDataTable.symbol)
        )
        .groupBy(positionsTable.clientId)
    );
    // get all clients from the database with portfolio market value, loan amount, net equity, and total margin requirement
    const clients = await db
      .with(loanCTE, portfolioCTE)
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
        portfolioMarketValue: portfolioCTE.portfolioMarketValue,
        marketValueChange: portfolioCTE.change,
        loanAmount: loanCTE.loanAmount,
        netEquity: sql<number>`${portfolioCTE.portfolioMarketValue} - ${loanCTE.loanAmount}`,
        totalMarginRequirement: sql<number>`${portfolioCTE.portfolioMarketValue} * ${MAINTENANCE_MARGIN_RATE}`,
        marginShortfall: sql<number>`${portfolioCTE.portfolioMarketValue} * ${MAINTENANCE_MARGIN_RATE} - (${portfolioCTE.portfolioMarketValue} - ${loanCTE.loanAmount})`,
        marginCallTriggered: sql<boolean>`${portfolioCTE.portfolioMarketValue} * ${MAINTENANCE_MARGIN_RATE} - (${portfolioCTE.portfolioMarketValue} - ${loanCTE.loanAmount}) > 0`,
      })
      .from(clientsTable)
      .leftJoin(loanCTE, eq(clientsTable.id, loanCTE.clientId))
      .leftJoin(portfolioCTE, eq(clientsTable.id, portfolioCTE.clientId));

    return clients;
  }

  /**
   * Get a specific client by ID
   * @param clientId - The ID of the client to retrieve
   * @returns The client if found, null otherwise
   */
  async getClientById(clientId: string) {
    const clients = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.id, clientId));

    if (clients.length === 0) {
      return null;
    }

    const client = clients[0];

    const marginData = await this.marginService.calculateMarginStatus(clientId);

    // Return enhanced client data
    return {
      ...client,
      portfolioMarketValue: marginData?.totalMarketValue,
      marketValueChange: marginData?.totalMarketValueChange,
      loanAmount: marginData?.loanBalance,
      netEquity: marginData?.netEquity,
      totalMarginRequirement: marginData?.marginRequirement,
      marginShortfall: marginData?.marginShortfall,
      marginCallTriggered: marginData?.marginCallTriggered,
    };
  }
}
