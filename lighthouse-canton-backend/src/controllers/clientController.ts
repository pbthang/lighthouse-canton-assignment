import type { Request, Response, NextFunction } from "express";
import { ClientService } from "../services/clientService.ts";

/**
 * Controller for handling client-related HTTP requests
 */
export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  /**
   * Get all clients
   */
  async getAllClients(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const clients = await this.clientService.getAllClients();
      res.status(200).json({
        success: true,
        data: clients,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific client by ID
   */
  async getClientById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { clientId = "" } = req.params;
      const client = await this.clientService.getClientById(clientId);

      if (!client) {
        res.status(404).json({
          success: false,
          message: `Client with ID ${clientId} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }
}
