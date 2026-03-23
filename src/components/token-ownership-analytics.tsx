"use client"

import { Link, useNavigate } from "@tanstack/react-router"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowRightIcon,
  ChevronsUpDownIcon,
  FilterIcon,
  NetworkIcon,
} from "lucide-react"
import { useMemo, useState } from "react"
import { HeroHeader } from "@/components/hero-header"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { PageWrapper } from "@/components/page-wrapper"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeEvaluation } from "@/components/ui/badge-evaluation"
import { Container } from "@/components/ui/container"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type EnrichedToken, useMarketData } from "@/hooks/use-market-data"
import { useTokens } from "@/hooks/use-tokens"
import { getTokenOwnershipScore } from "@/lib/scoring"
import { formatUnixTimestamp, truncateAddress } from "@/lib/utils"

function formatMarketCap(value?: number): string {
  if (value == null) return "—"
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: Type parameters required by @tanstack/react-table
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string
    cellClassName?: string
  }
}

// Custom filled icons to match Figma design
// function IconBubble({ className }: { className?: string }) {
//   return (
//     <svg
//       aria-label="Message bubble"
//       className={className}
//       fill="none"
//       height="16"
//       role="img"
//       stroke="currentColor"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       viewBox="0 0 24 24"
//       width="16"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
//     </svg>
//   )
// }

// Metric pill component for consistent styling
// interface MetricPillProps {
//   value: number
//   icon: React.ReactNode
//   className?: string
// }

// function MetricPill({ value, icon, className }: MetricPillProps) {
//   return (
//     <div
//       className={cn(
//         "inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2",
//         className
//       )}
//     >
//       <span className="text-base">{value}</span>
//       {icon}
//     </div>
//   )
// }

// Column definitions
const columns: ColumnDef<EnrichedToken>[] = [
  {
    accessorKey: "name",
    meta: {
      headerClassName: "w-full",
      cellClassName: "w-full",
    },
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
          <span className="text-muted-foreground hidden sm:block">
            {row.original.symbol !== row.original.name
              ? row.original.symbol
              : truncateAddress(row.original.address)}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "ownershipScore",
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-2.5 font-medium text-sm hover:text-foreground/80"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        type="button"
      >
        Ownership score
        <ChevronsUpDownIcon className="size-4" />
      </button>
    ),
    accessorFn: (row) => {
      const score = getTokenOwnershipScore(row.id)
      return score.total > 0 ? score.percentage : -1
    },
    cell: ({ row }) => {
      const score = getTokenOwnershipScore(row.original.id)
      return (
        <HoverCard>
          <HoverCardTrigger
            className="cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <BadgeEvaluation passing={score.passing} total={score.total} />
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-72 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">{row.original.name}</span>
              <span className="text-xs text-muted-foreground">
                {truncateAddress(row.original.address)}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {score.metrics.map((m) => (
                <div
                  className="flex items-center justify-between"
                  key={m.metricId}
                >
                  <span className="text-sm">{m.metricName}</span>
                  <BadgeEvaluation
                    evaluated={m.evaluated}
                    passing={m.passing}
                    total={m.total}
                  />
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      )
    },
  },
  {
    accessorKey: "marketCap",
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
        Market Cap
        <ChevronsUpDownIcon className="size-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-foreground tabular-nums">
        {formatMarketCap(row.original.marketCap)}
      </span>
    ),
  },
  {
    accessorKey: "lastUpdated",
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
        Report updated
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

function TokenDataTable({ data }: { data: EnrichedToken[] }) {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([
    { id: "marketCap", desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState("")
  const [networkFilter, setNetworkFilter] = useState<string>("")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const networks = useMemo(() => {
    const set = new Set(data.map((t) => t.network))
    return Array.from(set).sort()
  }, [data])

  const filteredData = useMemo(() => {
    if (!networkFilter) return data
    return data.filter(
      (t) => t.network.toLowerCase() === networkFilter.toLowerCase()
    )
  }, [data, networkFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase()
      const { name, symbol } = row.original
      return (
        name.toLowerCase().includes(search) ||
        symbol.toLowerCase().includes(search)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4 grow pt-6 pb-6 md:pt-12 md:pb-10">
      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-xs w-full">
          <FilterIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Filter by tokens"
            value={globalFilter}
          />
        </div>
        <Select
          onValueChange={(value) => setNetworkFilter(value as string)}
          value={networkFilter}
        >
          <SelectTrigger>
            <NetworkIcon className="size-4 text-muted-foreground" />
            <SelectValue placeholder="All networks" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="">All networks</SelectItem>
            {networks.map((network) => {
              const label = network.charAt(0).toUpperCase() + network.slice(1)
              return (
                <SelectItem key={network} value={label}>
                  {label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
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
  const rawTokens = useTokens()
  const { tokens } = useMarketData(rawTokens)
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

      <TestimonialsSection />

      <NewsletterSignup />
    </PageWrapper>
  )
}
