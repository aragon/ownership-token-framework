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
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  CircleArrowDownIcon,
  CircleArrowUpIcon,
  CircleIcon,
  FilterIcon,
  MessageSquareIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"
import * as React from "react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import tokensData from "@/data/tokens.json"
import { cn } from "@/lib/utils"

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
function truncateAddress(address: string): string {
  if (address.includes("...")) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

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
  {
    accessorKey: "evidenceEntries",
    header: ({ column }) => (
      <Button
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        Evidence entries
        <ChevronsUpDownIcon className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span>{row.original.evidenceEntries}</span>
        <MessageSquareIcon className="size-4 text-muted-foreground" />
      </div>
    ),
  },
  {
    accessorKey: "positive",
    header: ({ column }) => (
      <Button
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        Positive
        <ChevronsUpDownIcon className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span>{row.original.positive}</span>
        <CircleArrowUpIcon className="size-4 text-green-500" />
      </div>
    ),
  },
  {
    accessorKey: "neutral",
    header: ({ column }) => (
      <Button
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        Neutral
        <ChevronsUpDownIcon className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span>{row.original.neutral}</span>
        <CircleIcon className="size-4 text-gray-400" />
      </div>
    ),
  },
  {
    accessorKey: "atRisk",
    header: ({ column }) => (
      <Button
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        At risk
        <ChevronsUpDownIcon className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span>{row.original.atRisk}</span>
        <CircleArrowDownIcon className="size-4 text-red-500" />
      </div>
    ),
  },
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
      <Button
        className="size-8"
        render={<Link to="/tokens/$tokenId" params={{ tokenId: row.original.id }} />}
        size="icon"
        variant="ghost"
      >
        <ArrowRightIcon className="size-4" />
      </Button>
    ),
  },
]

// Hero Section
function HeroSection() {
  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
        Token ownership analytics
      </h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        A standardized, open-source disclosure framework for token investors
        helps clarify the value a token provides in terms of ownership. By
        utilizing this framework, you can identify the metrics and criteria that
        matter most to you and your investments. Improved analytics and clearer
        ownership lead to smarter investment decisions.
      </p>
    </section>
  )
}

// Stats Cards
function StatsCards() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Total tokens analysed</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">1,420</p>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Total framework metrics</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">24</p>
        <a
          className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline"
          href="#"
        >
          Learn more
          <ArrowRightIcon className="ml-1 size-3" />
        </a>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Total framework criterias
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">56</p>
        <a
          className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline"
          href="#"
        >
          Learn more
          <ArrowRightIcon className="ml-1 size-3" />
        </a>
      </div>
    </div>
  )
}

// Filter Bar
function FilterBar({
  filterValue,
  onFilterChange,
  network,
  onNetworkChange,
}: {
  filterValue: string
  onFilterChange: (value: string) => void
  network: string
  onNetworkChange: (value: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative">
        <FilterIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="w-64 pl-8"
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Filter by tokens"
          value={filterValue}
        />
      </div>
      <Select
        onValueChange={(value) => onNetworkChange(value ?? "")}
        value={network}
      >
        <SelectTrigger className="w-40">
          <SettingsIcon className="mr-2 size-4" />
          <SelectValue>{(value) => value || "All networks"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All networks">All networks</SelectItem>
          <SelectItem value="ethereum">Ethereum</SelectItem>
          <SelectItem value="base">Base</SelectItem>
          <SelectItem value="arbitrum">Arbitrum</SelectItem>
          <SelectItem value="optimism">Optimism</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// Token Data Table
function TokenDataTable({ data }: { data: Token[] }) {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [filterValue, setFilterValue] = useState("")
  const [network, setNetwork] = useState("All networks")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const filteredData = React.useMemo(() => {
    let filtered = data
    if (filterValue) {
      filtered = filtered.filter(
        (token) =>
          token.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          token.address.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (network !== "All networks") {
      filtered = filtered.filter((token) => token.network === network)
    }
    return filtered
  }, [data, filterValue, network])

  const table = useReactTable({
    data: filteredData,
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
    <div className="space-y-4">
      <FilterBar
        filterValue={filterValue}
        network={network}
        onFilterChange={setFilterValue}
        onNetworkChange={setNetwork}
      />

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
                    navigate({ to: "/tokens/$tokenId", params: { tokenId: row.original.id } })
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

      {/* Pagination */}
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
      </div>
    </div>
  )
}

// Main Component
export default function TokenOwnershipAnalytics() {
  return (
    <main className="min-h-screen">
      {/* White background section */}
      <div className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
          <HeroSection />
          <StatsCards />
        </div>
      </div>

      {/* Gray background section */}
      <div className="bg-muted/50 pb-12">
        <div className="mx-auto max-w-7xl px-4 pt-6 lg:px-6">
          <TokenDataTable data={tokens} />
        </div>
      </div>
    </main>
  )
}
