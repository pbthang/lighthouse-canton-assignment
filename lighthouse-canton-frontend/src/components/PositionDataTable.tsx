import { DataTableProps, Position, PositionResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { getCurrencyCell, getSortingHeader } from "./common";
import { useState } from "react";

function PositionDataTable({ clientId }: { clientId: string | undefined }) {
  const {
    data: positionData = { success: false, data: [] } as PositionResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["positions", clientId],
    queryFn: fetchPositionData,
    enabled: !!clientId,
    retry: false,
    refetchInterval: 5000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) {
    console.error("Error fetching position data:", error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={positionData.data} />
    </div>
  );
}

export const columns: ColumnDef<Position>[] = [
  {
    accessorKey: "symbol",
    header: getSortingHeader("Symbol"),
  },
  {
    accessorKey: "quantity",
    header: getSortingHeader("Quantity"),
  },
  {
    accessorKey: "costBasis",
    header: getSortingHeader("Cost Basis"),
    cell: ({ getValue }) => {
      return getCurrencyCell(getValue<number>());
    },
  },
  {
    accessorKey: "currentPrice",
    header: getSortingHeader("Current Price"),
    cell: ({ getValue, row }) => {
      return getCurrencyCell(getValue<number>(), row.original.change);
    },
  },
  {
    accessorKey: "marketValue",
    header: getSortingHeader("Total Market Value"),
    cell: ({ getValue }) => {
      return getCurrencyCell(getValue<number>());
    },
  },
];

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const fetchPositionData = async ({
  queryKey,
}: {
  queryKey: (string | undefined)[];
}) => {
  const [, clientId] = queryKey;
  if (!clientId) {
    throw new Error("Client ID is required");
  }
  const VITE_REACT_APP_API_URL =
    import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8080/api";
  const response = await axios.get(
    `${VITE_REACT_APP_API_URL}/positions/${clientId}`
  );
  return response.data;
};

export default PositionDataTable;
