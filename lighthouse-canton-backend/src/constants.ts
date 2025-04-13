import process from "node:process";

export const MAINTENANCE_MARGIN_RATE = parseFloat(
  process.env.MAINTENANCE_MARGIN_RATE || "0.25"
);

export const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export const JWT_EXPIRATION = "1h";

export const AVAILABLE_SYMBOLS = ["AAPL", "QQQ", "TRP", "INFY"] as const;

export enum IntervalEnum {
  oneMin = "1min",
  fiveMin = "5min",
  fifteenMin = "15min",
  thirtyMin = "30min",
  fortyFiveMin = "45min",
  oneHour = "1h",
}

export const AVAILABLE_INTERVALS = Object.values(IntervalEnum) as string[];
