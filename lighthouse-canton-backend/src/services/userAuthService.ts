import { userAuthTable } from "./../db/schema";
import bcrypt from "bcryptjs";
import { db } from "../db/index.ts";
import { eq, type InferSelectModel } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../constants.ts";

/**
 * Service for handling user authentication-related database operations
 */
export class UserAuthService {
  /**
   * Create a new user
   * @param username - The username of the user
   * @param password - The password of the user
   * @param role - The role of the user
   * @returns Created user object
   */
  async createUserAuth(username: string, password: string, role: string) {
    if (!username || !password || !role) {
      throw new Error("Username, password, and role are required");
    }

    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(userAuthTable)
      .where((user) => eq(user.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      role,
    };
    await db.insert(userAuthTable).values(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Login a user
   */
  async login(username: string, password: string) {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // Find the user by username
    const user = await db
      .select()
      .from(userAuthTable)
      .where((user) => eq(user.username, username))
      .limit(1);

    if (user.length < 1) {
      throw new Error("User not found");
    }

    const userData = user[0] as InferSelectModel<typeof userAuthTable>;

    const isMatch = await bcrypt.compare(password, userData?.password || "");
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ user: userData }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    const { password: _, ...userWithoutPassword } = userData;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Get current user by token in json
   */
  async getCurrentUser(token: string) {
    if (!token) {
      throw new Error("Token is required");
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (typeof decoded === "string") {
        throw new Error("Invalid token");
      }

      // Find the user by username
      const user = await db
        .select()
        .from(userAuthTable)
        .where((user) => eq(user.username, decoded.username))
        .limit(1);
      if (user.length < 1) {
        throw new Error("User not found");
      }
      const userData = user[0] as InferSelectModel<typeof userAuthTable>;
      const { password: _, ...userWithoutPassword } = userData;
      return userWithoutPassword;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
