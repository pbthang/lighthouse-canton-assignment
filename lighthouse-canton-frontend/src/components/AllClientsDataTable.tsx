import { Client, DataTableProps } from "@/lib/types";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ChevronDown, EyeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { throttle } from "@/lib/utils";
import { NavLink } from "react-router";
import { Popover, PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Card, CardContent, CardHeader } from "./ui/card";
import { currencyFormatter } from "@/lib/constants";
import { Switch } from "./ui/switch";
import { getCurrencyCell, getSortingHeader } from "./common";

function AllClientsDataTable({ clients = [] }: { clients: Client[] }) {
  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={clients} />
    </div>
  );
}

const columns: ColumnDef<Client>[] = [
  {
    id: "view",
    cell: ({ row }) => (
      <Button variant="link" className="w-full" asChild>
        <NavLink to={`/${row.original.id}`}>
          <EyeIcon className="h-4 w-4" />
        </NavLink>
      </Button>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: getSortingHeader("Client"),
  },
  {
    accessorKey: "loanAmount",
    header: getSortingHeader("Loan"),
    cell: ({ getValue }) => `${currencyFormatter.format(getValue<number>())}`,
  },
  {
    accessorKey: "portfolioMarketValue",
    header: getSortingHeader("Portfolio Market Value"),
    cell: ({ getValue, row }) =>
      getCurrencyCell(getValue<number>(), row.original.marketValueChange),
  },
  {
    accessorKey: "netEquity",
    header: getSortingHeader("Net Equity"),
    cell: ({ getValue }) => getCurrencyCell(getValue<number>()),
  },
  {
    accessorKey: "totalMarginRequirement",
    header: getSortingHeader("Margin Requirement"),
    cell: ({ getValue }) => getCurrencyCell(getValue<number>()),
  },
  {
    accessorKey: "marginShortfall",
    header: getSortingHeader("Margin Shortfall"),
    cell: ({ getValue }) => getCurrencyCell(getValue<number>()),
  },
  {
    accessorKey: "marginCallTriggered",
    header: getSortingHeader("Margin Call"),
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <div className="text-red-500">‼️ Margin call ‼️</div>
      ) : (
        <div className="opacity-50">None</div>
      ),
  },
];

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const handleSearch = throttle((value: string) => {
    table.getColumn("clientName")?.setFilterValue(value);
  }, 200);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div>
      <div className="flex gap-4 justify-start py-4">
        <Input
          placeholder="Search by client name..."
          value={
            (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleSearch(event.target.value)
          }
          className="max-w-sm"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="">
              Columns <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-50">
            <Card className="my-2 gap-2">
              <CardHeader className="text-sm">
                Toggle column visibility
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <div
                        key={column.id}
                        className="flex items-center space-x-2"
                      >
                        <Switch
                          id={`column-${column.id}-visible`}
                          className=""
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        />
                        <label
                          htmlFor={`column-${column.id}-visible`}
                          className="text-sm"
                        >
                          {(
                            column.id.charAt(0).toUpperCase() +
                            column.id.slice(1)
                          ).replace(/([A-Z])/g, " $1")}
                        </label>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AllClientsDataTable;
