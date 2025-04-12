import express from "express";
import { ClientController } from "../controllers/clientController.ts";

const router = express.Router();
const clientController = new ClientController();

// GET /api/clients - Get all clients
router.get("/", clientController.getAllClients.bind(clientController));

// GET /api/clients/:clientId - Get specific client details
router.get("/:clientId", clientController.getClientById.bind(clientController));

export default router;
