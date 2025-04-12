import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { compactNumberFormatter, percentageFormatter } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

const chartConfig = {
  portfolioMarketValue: {
    label: "Total Value",
  },
  netEquity: {
    label: "Net Equity",
    color: "#299d8f",
  },
  loanAmount: {
    label: "Loan Amount",
    color: "#f87315",
  },
} satisfies ChartConfig;

export function PortfolioPieChart(props: {
  className?: ClassValue;
  loanAmount: number | undefined;
  netEquity: number | undefined;
}) {
  const { loanAmount = 0, netEquity = 0 } = props;

  const chartData = [
    { segment: "netEquity", value: netEquity, fill: "#299d8f" },
    { segment: "loanAmount", value: loanAmount, fill: "#f87315" },
  ];

  return (
    <Card className={cn("w-full", props.className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] min-w-3xs"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => {
                    return (
                      <>
                        <div
                          className={cn(
                            "h-2.5 w-2.5 shrink-0 rounded-[2px]",
                            `bg-[var(--color-${name})]`
                          )}
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {percentageFormatter.format(
                            (value as number) / (netEquity + loanAmount)
                          )}
                        </div>
                      </>
                    );
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="segment"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {`$${compactNumberFormatter.format(
                            netEquity + loanAmount
                          )}`}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {"Total Value"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="segment" />}
              className="flex gap-6"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
