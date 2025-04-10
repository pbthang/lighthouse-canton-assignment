import express, { Request, Response, NextFunction } from "express";
import { db } from "../db/index.ts";
import { clientsTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

const router = express.Router();

// GET /api/clients - Get all clients
router.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clients = await db.select().from(clientsTable);
      res.status(200).json({
        success: true,
        data: clients,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/clients/:clientId - Get specific client details
router.get(
  "/:clientId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.params;

      const clients = await db
        .select()
        .from(clientsTable)
        .where(eq(clientsTable.id, clientId as string));

      if (clients.length === 0) {
        res.status(404).json({
          success: false,
          message: `Client with ID ${clientId} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: clients[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
