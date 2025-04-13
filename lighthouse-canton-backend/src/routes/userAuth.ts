import { Router } from "express";
import { UserAuthController } from "../controllers/userAuthController";

const router = Router();
const userAuthController = new UserAuthController();

// Route for user registration
router.post("/register", (req, res, next) =>
  userAuthController.register(req, res, next)
);

// Route for user login
router.post("/login", (req, res, next) =>
  userAuthController.login(req, res, next)
);

// Route for getting the current user
router.get("/me", (req, res, next) =>
  userAuthController.getCurrentUser(req, res, next)
);

export default router;
