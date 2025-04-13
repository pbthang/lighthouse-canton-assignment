import { TimeSeriesData } from "@/lib/types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function TimeSeriesMetaDataCard({ data }: { data: TimeSeriesData["meta"] }) {
  return (
    <Card className="h-fit p-4 mb-4 gap-2 w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Meta Data for {data.symbol}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* grid 2 cols */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Interval:</span>
            <span className="text-sm text-muted-foreground">
              {data.interval}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Currency:</span>
            <span className="text-sm text-muted-foreground">
              {data.currency}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Timezone:</span>
            <span className="text-sm text-muted-foreground">
              {data.exchange_timezone}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Type:</span>
            <span className="text-sm text-muted-foreground">{data.type}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">MIC Code:</span>
            <span className="text-sm text-muted-foreground">
              {data.mic_code}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Exchange:</span>
            <span className="text-sm text-muted-foreground">
              {data.exchange}
            </span>
          </div>
        </div>
        <div className="flex mt-4 text-sm text-muted-foreground">
          Last updated at: {new Date().toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

export default TimeSeriesMetaDataCard;
