import { currencyFormatter } from "@/lib/constants";
import { Card, CardContent } from "./ui/card";
import { ChevronsDownIcon, ChevronsUpIcon, MinusIcon } from "lucide-react";

function PortfolioOverviewCard(props: {
  portfolioMarketValue: number;
  marketValueChange: number;
  netEquity: number;
  loanAmount: number;
}) {
  return (
    <Card className="w-full">
      <CardContent className="grid grid-cols-2 h-full gap-4">
        <div className="col-span-2">
          <h3 className="text-sm text-muted-foreground">
            Portfolio Market Value
          </h3>
          <p className="text-xl font-bold flex items-center gap-1">
            <span>{currencyFormatter.format(props.portfolioMarketValue)}</span>
            {props.marketValueChange > 0 ? (
              <ChevronsUpIcon className="inline h-4 w-4 text-green-500" />
            ) : props.marketValueChange < 0 ? (
              <ChevronsDownIcon className="inline h-4 w-4 text-red-500" />
            ) : (
              <MinusIcon className="inline h-4 w-4 text-gray-500" />
            )}
          </p>
        </div>
        <div className="">
          <h3 className="text-sm text-muted-foreground">Net Equity</h3>
          <p className="text-xl font-bold">
            {currencyFormatter.format(props.netEquity)}
          </p>
        </div>
        <div className="">
          <h3 className="text-sm text-muted-foreground">Loan Amount</h3>
          <p className="text-xl font-bold">
            {currencyFormatter.format(props.loanAmount)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PortfolioOverviewCard;
