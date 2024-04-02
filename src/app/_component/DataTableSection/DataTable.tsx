"use client";

import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
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
import { Info } from "@/app/_component/DataTableSection/Column";
import ColumnFilter from "@/app/_component/DataTableSection/ColumnFilter";
import SearchInput from "@/app/_component/DataTableSection/SearchInput";
import RemoveButton from "@/app/_component/DataTableSection/RemoveButton";
import InitializeButton from "@/app/_component/DataTableSection/InitializeButton";

interface Props {
  data: Info[];
  columns: ColumnDef<Info>[];
}

export default function DataTable({ data, columns }: Props) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <SearchInput />
        <div className="flex ml-auto gap-2">
          <InitializeButton />
          <ColumnFilter table={table} />
        </div>
      </div>
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
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const rowRenderer = () => {
                  // @ts-ignore
                  if (row.original === "loading") {
                    return (
                      <TableCell colSpan={columns.length} className="h-24">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-8 w-8 animate-spin"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      </TableCell>
                    );
                  }
                  if (typeof row.original === "string") {
                    return (
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="flex justify-center">
                          캐릭터명을 확인해주세요. 인식된 캐릭터명:{" "}
                          <strong className="ml-1 mr-2">{row.original}</strong>
                          <RemoveButton name={row.original} />
                        </div>
                      </TableCell>
                    );
                  }
                  return row
                    .getVisibleCells()
                    .map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ));
                };
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {rowRenderer()}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  캐릭터명을 검색/인식 해주세요.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
