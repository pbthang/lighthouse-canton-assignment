import { Router } from "express";
import { MarginController } from "../controllers/marginController.ts";

const router = Router();
const marginController = new MarginController();

// GET /api/margin/:clientId - Calculate and return margin status
router.get(
  "/:clientId",
  marginController.getMarginStatus.bind(marginController)
);

// POST /api/margin/loans/:clientId - Update loan amount for a client
router.post(
  "/loans/:clientId",
  marginController.updateLoanBalance.bind(marginController)
);

export default router;
