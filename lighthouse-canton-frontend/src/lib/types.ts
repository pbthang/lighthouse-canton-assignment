import { ColumnDef } from "@tanstack/react-table";

// Client types
export interface Client {
  id: string;
  name: string;
  portfolioMarketValue: number;
  marketValueChange: number;
  loanAmount: number;
  netEquity: number;
  totalMarginRequirement: number;
  marginShortfall: number;
  marginCallTriggered: boolean;
}

export interface AllClientsResponse {
  success: boolean;
  data: Client[];
}

export interface ClientResponse {
  success: boolean;
  data: Client;
}

export interface Position {
  symbol: string;
  quantity: number;
  costBasis: number;
  currentPrice: number;
  change: number;
  marketValue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PositionResponse {
  success: boolean;
  data: Position[];
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface TimeSeriesData {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    mic_code: string;
    type: string;
  };
  values: {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }[];
}

export interface UserAuth {
  id: string;
  username: string;
  role: string;
}

export interface UserAuthResponse {
  token: string;
  user: UserAuth;
}
