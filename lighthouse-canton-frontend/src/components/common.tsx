import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import {
  ArrowUpDown,
  ChevronsDownIcon,
  ChevronsUpIcon,
  MinusIcon,
} from "lucide-react";
import { currencyFormatter } from "@/lib/constants";

export function getSortingHeader<ColT>(
  label: string
): ColumnDef<ColT>["header"] {
  return ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };
}

export function getCurrencyCell(
  value: number,
  change: number | undefined = undefined
) {
  if (change === undefined) {
    return <span>{currencyFormatter.format(value)}</span>;
  }
  return (
    <div className="flex items-center gap-2">
      <span>{currencyFormatter.format(value)}</span>
      {change > 0 ? (
        <ChevronsUpIcon className="inline text-green-500 w-4" />
      ) : change < 0 ? (
        <ChevronsDownIcon className="inline text-red-500 w-4" />
      ) : (
        <MinusIcon className="inline h-4 w-4 text-gray-500" />
      )}
    </div>
  );
}
