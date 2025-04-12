import { currencyFormatter } from "@/lib/constants";
import { Card, CardContent } from "./ui/card";
import { TriangleAlertIcon } from "lucide-react";

function MarginOverviewCard(props: {
  marginRequirement: number;
  marginShortfall: number;
  marginCallTriggered: boolean;
}) {
  return (
    <Card className="w-full">
      <CardContent className="grid grid-cols-1 h-full gap-4">
        <div className="col-span-2">
          <h3 className="text-sm text-muted-foreground">Margin Requirement</h3>
          <p className="text-xl font-bold flex items-center gap-2">
            {currencyFormatter.format(props.marginRequirement)}
          </p>
        </div>
        <div className="">
          <h3 className="text-sm text-muted-foreground">Margin Shortfall</h3>
          <p className="text-xl font-bold flex items-center gap-2">
            <span>{currencyFormatter.format(props.marginShortfall)}</span>
            {props.marginCallTriggered && (
              <TriangleAlertIcon className="inline h-4 w-4 text-red-500" />
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default MarginOverviewCard;
