import { AVAILABLE_INTERVALS } from "./../constants";
import type { Request, Response, NextFunction } from "express";
import { MarketDataService } from "../services/marketDataService.ts";
import axios from "axios";
import { IntervalEnum } from "../constants.ts";

const TWELVEDATA_API_URL =
  process.env.TWELVEDATA_API_URL || "https://api.twelvedata.com/";

const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY || "demo";

/**
 * Controller for handling market data-related HTTP requests
 */
export class MarketDataController {
  private marketDataService: MarketDataService;

  constructor() {
    this.marketDataService = new MarketDataService();
  }

  /**
   * Get all market data
   */
  async getAllMarketData(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const marketData = await this.marketDataService.getAllMarketData();
      res.status(200).json({
        success: true,
        data: marketData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get market data for a specific symbol
   */
  async getMarketDataBySymbol(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { symbol = "" } = req.params;

      const marketData = await this.marketDataService.getMarketDataBySymbol(
        symbol
      );

      if (!marketData) {
        res.status(404).json({
          success: false,
          message: `Market data for symbol ${symbol} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: marketData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch time series data for a specific symbol on a specific date with an interval
   */
  async getTimeSeriesData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { symbol = "" } = req.params;
      const { date = "" } = req.query;
      const { interval = IntervalEnum.oneHour } = req.query;

      if (!symbol || !date) {
        res.status(400).json({
          success: false,
          message: "Symbol and date are required",
        });
        return;
      }
      if (!interval || !AVAILABLE_INTERVALS.includes(interval as string)) {
        res.status(400).json({
          success: false,
          message: `Interval must be one of the following: ${AVAILABLE_INTERVALS.join(
            ", "
          )}`,
        });
        return;
      }

      // Fetch from external API
      const response = await axios.get(`${TWELVEDATA_API_URL}/time_series`, {
        params: {
          symbol,
          interval,
          date,
          apikey: process.env.TWELVEDATA_API_KEY,
        },
      });

      const timeSeriesData = response.data;

      if (!timeSeriesData) {
        res.status(404).json({
          success: false,
          message: `Time series data for symbol ${symbol} not found`,
        });
        return;
      }

      res.status(200).json(timeSeriesData);
    } catch (error) {
      next(error);
    }
  }
}
