import { Router } from "express";
import { PositionsController } from "../controllers/positionsController.ts";

const router = Router();
const positionsController = new PositionsController();

// GET /api/positions/:clientId - Get positions for a specific client
router.get(
  "/:clientId",
  positionsController.getPositionsByClientId.bind(positionsController)
);

// POST /api/positions - Add or update a position
router.post(
  "/",
  positionsController.addOrUpdatePosition.bind(positionsController)
);

export default router;
