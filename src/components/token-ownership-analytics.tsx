"use client"

import { Link, useNavigate } from "@tanstack/react-router"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowRightIcon, ChevronsUpDownIcon } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PageWrapper } from "@/components/page-wrapper"
import { Container } from "@/components/ui/container"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import tokensData from "@/data/tokens.json"

// Types
interface Token {
  id: string
  name: string
  address: string
  icon?: string
  evidenceEntries: number
  positive: number
  neutral: number
  atRisk: number
  lastUpdated: string
  network: string
}

// Get tokens from JSON data
const tokens: Token[] = tokensData.tokens as Token[]

// Utility to truncate address
// function truncateAddress(address: string): string {
//   if (address.includes("...")) return address
//   return `${address.slice(0, 6)}...${address.slice(-4)}`
// }

// Column definitions
const columns: ColumnDef<Token>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        Token name
        <ChevronsUpDownIcon className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarImage alt={row.original.name} src={row.original.icon} />
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {row.original.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-muted-foreground">{row.original.address}</span>
        </div>
      </div>
    ),
  },
  // {
  //   accessorKey: "evidenceEntries",
  //   header: ({ column }) => (
  //     <Button
  //       className="h-auto p-0 font-medium hover:bg-transparent"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       variant="ghost"
  //     >
  //       Evidence entries
  //       <ChevronsUpDownIcon className="ml-1 size-3.5" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-1.5">
  //       <span>{row.original.evidenceEntries}</span>
  //       <IconBubble className="size-4 text-muted-foreground" />
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "positive",
  //   header: ({ column }) => (
  //     <Button
  //       className="h-auto p-0 font-medium hover:bg-transparent"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       variant="ghost"
  //     >
  //       Positive
  //       <ChevronsUpDownIcon className="ml-1 size-3.5" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-1.5">
  //       <span>{row.original.positive}</span>
  //       <IconCircleArrowUpFilled className="size-4 text-green-500" />
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "neutral",
  //   header: ({ column }) => (
  //     <Button
  //       className="h-auto p-0 font-medium hover:bg-transparent"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       variant="ghost"
  //     >
  //       Neutral
  //       <ChevronsUpDownIcon className="ml-1 size-3.5" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-1.5">
  //       <span>{row.original.neutral}</span>
  //       <IconCircleDotFilled className="size-4 text-gray-400" />
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "atRisk",
  //   header: ({ column }) => (
  //     <Button
  //       className="h-auto p-0 font-medium hover:bg-transparent"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       variant="ghost"
  //     >
  //       At risk
  //       <ChevronsUpDownIcon className="ml-1 size-3.5" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-1.5">
  //       <span>{row.original.atRisk}</span>
  //       <IconCircleArrowDownFilled className="size-4 text-red-500" />
  //     </div>
  //   ),
  // },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => (
      <Button
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        Last updated
        <ChevronsUpDownIcon className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.lastUpdated}</span>
    ),
  },
  {
    id: "actions",

    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          className="size-8"
          render={
            <Link params={{ tokenId: row.original.id }} to="/tokens/$tokenId" />
          }
          size="icon"
          variant="ghost"
        >
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    ),
  },
]

// Hero Section
function HeroSection() {
  return (
    <section className="flex flex-col gap-y-4 py-8 lg:py-12">
      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
        Ownership Token Index
      </h1>
      <p className="max-w-[1024px] text-muted-foreground">
        A standardized, open-source disclosure framework for token investors
        helps clarify the value a token provides in terms of ownership. By
        utilizing this framework, you can identify the metrics and criteria that
        matter most to you and your investments. Improved analytics and clearer
        ownership lead to smarter investment decisions.
      </p>
    </section>
  )
}

function TokenDataTable({ data }: { data: Token[] }) {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4 pt-12 grow">
      <div className="overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  className="cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                  onClick={() =>
                    navigate({
                      to: "/tokens/$tokenId",
                      params: { tokenId: row.original.id },
                    })
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
            value={`${table.getState().pagination.pageSize}`}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <div className="flex items-center gap-1">
            <Button
              className="size-8"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
              size="icon"
              variant="outline"
            >
              <ChevronsLeftIcon className="size-4" />
            </Button>
            <Button
              className="size-8"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="icon"
              variant="outline"
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <Button
              className="size-8"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="icon"
              variant="outline"
            >
              <ChevronRightIcon className="size-4" />
            </Button>
            <Button
              className="size-8"
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              size="icon"
              variant="outline"
            >
              <ChevronsRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  )
}

// Main Component
export default function TokenOwnershipAnalytics() {
  return (
    <PageWrapper className="flex flex-col">
      {/* White background section */}
      <div className="bg-background">
        <Container>
          <HeroSection />
        </Container>
      </div>

      {/* Gray background section */}
      <div className="bg-muted/50 flex-1">
        <Container>
          <TokenDataTable data={tokens} />
        </Container>
      </div>
    </PageWrapper>
  )
}
