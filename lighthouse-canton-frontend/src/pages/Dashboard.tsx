import TimeSeriesCandlestickChart from "@/components/TimeSeriesCandlestickChart";
import TimeSeriesMetaDataCard from "@/components/TimeSeriesMetaDataCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_SYMBOLS, VITE_REACT_APP_API_URL } from "@/lib/constants";
import { TimeSeriesData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const Dashboard: React.FC = () => {
  const [symbol, setSymbol] = React.useState<string>("");
  const [date, setDate] = React.useState(new Date());
  const [interval, setInterval] = React.useState<string>("1h");

  const {
    data: timeSeriesData = {
      meta: {
        symbol: "",
        interval: "",
        currency: "",
        exchange_timezone: "",
        exchange: "",
        mic_code: "",
        type: "",
      },
      values: [],
    } as TimeSeriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "timeSeriesData",
      symbol,
      date.toISOString().split("T")[0],
      interval,
    ],
    queryFn: fetchTimeSeriesData,
    enabled: !!symbol && !!date,
    retry: false,
  });

  console.log("Time Series Data:", timeSeriesData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Market Historical Data</h1>
      <p className="text-sm text-muted-foreground mb-4">
        View historical market data for a specific symbol, date, and interval.
      </p>
      <div className="w-fit flex gap-2 mt-8">
        <Select
          onValueChange={(value) => setSymbol(value)}
          defaultValue={symbol}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Symbol" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Symbols</SelectLabel>
              {AVAILABLE_SYMBOLS.map((symbol) => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="mb-4 w-fit"
          placeholder="Select date"
          min={"2023-01-01"}
          max={new Date().toISOString().split("T")[0]}
        />
        <Select
          onValueChange={(value) => setInterval(value)}
          defaultValue={interval}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Intervals</SelectLabel>
              <SelectItem value="5min">5 Minutes</SelectItem>
              <SelectItem value="15min">15 Minutes</SelectItem>
              <SelectItem value="30min">30 Minutes</SelectItem>
              <SelectItem value="45min">45 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : error instanceof Error ? (
        <div className="text-muted-foreground">{error.message}</div>
      ) : symbol && date && interval ? (
        <div>
          <TimeSeriesMetaDataCard data={timeSeriesData.meta} />
          <TimeSeriesCandlestickChart
            timeSeriesData={timeSeriesData}
            symbol={symbol}
            date={date}
            interval={interval}
          />
        </div>
      ) : (
        <div className="text-muted-foreground">
          Please select a symbol, date, and interval to view the data.
        </div>
      )}
    </div>
  );
};

const fetchTimeSeriesData = async ({
  queryKey,
}: {
  queryKey: (string | undefined)[];
}) => {
  const [, symbol, date, interval] = queryKey;
  if (!symbol || !date || !interval) {
    throw new Error("Symbol, date, and interval are required");
  }
  const response = await axios.get(
    `${VITE_REACT_APP_API_URL}/market-data/time-series/${symbol}`,
    {
      params: {
        date: date,
        interval: interval,
      },
    }
  );
  if (!response) {
    throw new Error("Network response was not ok");
  }
  const data = await response.data;
  if (!data) {
    throw new Error("Data not found");
  }
  if (data.status === "error") {
    throw new Error(data.message);
  }
  return data as TimeSeriesData;
};

export default Dashboard;
