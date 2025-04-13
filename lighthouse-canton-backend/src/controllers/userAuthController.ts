import type { Request, Response, NextFunction } from "express";
import { UserAuthService } from "../services/userAuthService.ts";

/**
 * Controller for handling user authentication-related HTTP requests
 */
export class UserAuthController {
  private userAuthService: UserAuthService;

  constructor() {
    this.userAuthService = new UserAuthService();
  }

  /**
   * Register a new user
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
        res.status(400).json({
          success: false,
          message: "Username, password, and role are required",
        });
        return;
      }

      const user = await this.userAuthService.createUserAuth(
        username,
        password,
        role
      );
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login a user
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
        return;
      }
      const result = await this.userAuthService.login(username, password);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get the current user based on the token
   */
  async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        res.status(401).json({ error: "Access denied" });
        return;
      }
      const user = await this.userAuthService.getCurrentUser(token);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
