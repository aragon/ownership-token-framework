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
import { HeroHeader } from "@/components/hero-header"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { PageWrapper } from "@/components/page-wrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Container } from "@/components/ui/container"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTokens } from "@/hooks/use-tokens"
import { cn, formatUnixTimestamp, truncateAddress } from "@/lib/utils"

// Types
interface Token {
  id: string
  name: string
  symbol: string
  address: string
  icon?: string
  evidenceEntries: number
  positive: number
  neutral: number
  atRisk: number
  lastUpdated: number
  network: string
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string
    cellClassName?: string
  }
}

// Custom filled icons to match Figma design
function IconBubble({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}

function IconCircleArrowUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="m16 12-4-4-4 4"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 16V8"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function IconCircleDot({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" fill="white" r="2" />
    </svg>
  )
}

function IconCircleArrowDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="M12 8v8"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="m8 12 4 4 4-4"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

// Metric pill component for consistent styling
interface MetricPillProps {
  value: number
  icon: React.ReactNode
  className?: string
}

function MetricPill({ value, icon, className }: MetricPillProps) {
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2",
        className
      )}
    >
      <span className="text-base">{value}</span>
      {icon}
    </div>
  )
}

// Column definitions
const columns: ColumnDef<Token>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="pl-12">
        <button
          className="inline-flex items-center gap-2.5 font-medium text-sm hover:text-foreground/80"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          type="button"
        >
          Token name
          <ChevronsUpDownIcon className="size-4" />
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage alt={row.original.name} src={row.original.icon} />
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {row.original.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2.5">
          <span className="font-medium text-base">{row.original.name}</span>
          <span className="text-muted-foreground text-base">
            {row.original.symbol !== row.original.name
              ? row.original.symbol
              : truncateAddress(row.original.address)}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "evidenceEntries",
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
    },
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-2.5 font-medium text-sm hover:text-foreground/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        type="button"
      >
        Evidence entries
        <ChevronsUpDownIcon className="size-4" />
      </button>
    ),
    cell: ({ row }) => (
      <MetricPill
        icon={<IconBubble className="size-4" />}
        value={row.original.evidenceEntries}
      />
    ),
  },
  {
    accessorKey: "positive",
    meta: {
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
    },
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-2.5 font-medium text-sm hover:text-foreground/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        type="button"
      >
        Positive
        <ChevronsUpDownIcon className="size-4" />
      </button>
    ),
    cell: ({ row }) => (
      <MetricPill
        icon={<IconCircleArrowUp className="size-4 text-green-500" />}
        value={row.original.positive}
      />
    ),
  },
  {
    accessorKey: "neutral",
    meta: {
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
    },
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-2.5 font-medium text-sm hover:text-foreground/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        type="button"
      >
        Neutral
        <ChevronsUpDownIcon className="size-4" />
      </button>
    ),
    cell: ({ row }) => (
      <MetricPill
        icon={<IconCircleDot className="size-4 text-neutral-400" />}
        value={row.original.neutral}
      />
    ),
  },
  {
    accessorKey: "atRisk",
    meta: {
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
    },
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-2.5 font-medium text-sm hover:text-foreground/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        type="button"
      >
        At risk
        <ChevronsUpDownIcon className="size-4" />
      </button>
    ),
    cell: ({ row }) => (
      <MetricPill
        icon={<IconCircleArrowDown className="size-4 text-red-500" />}
        value={row.original.atRisk}
      />
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-2.5 font-medium text-sm hover:text-foreground/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        type="button"
      >
        Last updated
        <ChevronsUpDownIcon className="size-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatUnixTimestamp(row.original.lastUpdated)}
      </span>
    ),
  },
  {
    id: "actions",
    meta: {
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
    },
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Link
          className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"
          params={{ tokenId: row.original.id }}
          to="/tokens/$tokenId"
        >
          <ArrowRightIcon className="size-6" />
        </Link>
      </div>
    ),
  },
]

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
    <div className="space-y-4 pt-6 pb-10 md:pt-12 md:pb-20 grow">
      <div className="overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className={header.column.columnDef.meta?.headerClassName}
                    key={header.id}
                  >
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
                    <TableCell
                      className={cell.column.columnDef.meta?.cellClassName}
                      key={cell.id}
                    >
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
  const tokens = useTokens() as Token[]
  return (
    <PageWrapper className="flex flex-col">
      {/* White background section with Hero Header */}
      <HeroHeader />

      {/* Gray background section */}
      <div className="bg-muted/50 flex-1">
        <Container>
          <TokenDataTable data={tokens} />
        </Container>
      </div>

      <NewsletterSignup />
    </PageWrapper>
  )
}
