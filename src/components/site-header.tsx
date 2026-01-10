"use client"

import { useMemo, useRef, useState } from "react"
import { Link as NavLink } from "@tanstack/react-router"
import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"
import { Container } from "@/components/ui/container"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { SubmitTokenDialog } from "@/components/submit-token-dialog"
import { FRAMEWORK_BASE_URL } from "@/lib/framework"
import tokensData from "@/data/tokens.json"

interface Token {
  id: string
  name: string
  symbol: string
  icon?: string
}

const tokens: Token[] = tokensData.tokens as Token[]

function fuzzyMatch(query: string, target: string): boolean {
  let queryIndex = 0
  let targetIndex = 0
  const normalizedQuery = query.toLowerCase()
  const normalizedTarget = target.toLowerCase()

  while (queryIndex < normalizedQuery.length && targetIndex < normalizedTarget.length) {
    if (normalizedQuery[queryIndex] === normalizedTarget[targetIndex]) {
      queryIndex += 1
    }
    targetIndex += 1
  }

  return queryIndex === normalizedQuery.length
}

export function SiteHeader() {
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([])

  const filteredTokens = useMemo(() => {
    const query = searchQuery.trim()
    if (!query) return []

    return tokens.filter((token) => {
      const nameMatch = fuzzyMatch(query, token.name)
      const symbolMatch = fuzzyMatch(query, token.symbol)
      return nameMatch || symbolMatch
    })
  }, [searchQuery])

  const hasResults = filteredTokens.length > 0

  return (
    <header className="border-b bg-background">
      <Container className="flex h-16 items-center justify-between gap-12">
        <div className="flex items-center gap-x-12">
          {/* Logo */}
          <NavLink className="flex items-center gap-3 shrink-0" to="/">
            <img
              alt="Logo"
              className="size-8 rounded-lg object-cover"
              src="/logo-square.png"
            />
            <div className="flex items-center gap-1 text-base font-semibold leading-6">
              <span className="text-foreground">Token Ownership</span>
              <span className="text-muted-foreground">Analytics</span>
            </div>
          </NavLink>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink render={<NavLink to="/" />}>
                  Tokens
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href={FRAMEWORK_BASE_URL} isExternal />}
                >
                  Framework
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<NavLink to="/faq" />}>
                  FAQ
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="data-active:focus:bg-muted data-active:hover:bg-muted data-active:bg-muted/50 focus-visible:ring-ring/50 hover:bg-muted focus:bg-muted flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1">
                    More
                    <ChevronDownIcon className="ml-1 size-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>
                      <Link
                        className="flex w-full items-center"
                        href="https://blockworks.co/token-transparency"
                        isExternal
                      >
                        Blockworks
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search and Submit */}
        <div className="hidden items-center gap-4 shrink-0 lg:flex">
          {/* Search Input */}
          <div className="relative w-60">
            <SearchIcon className="absolute left-3 top-1/2 size-[10.67px] -translate-y-1/2 text-foreground" />
            <Input
              className="h-9 pl-9 pr-8 text-base shadow-sm"
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setHighlightedIndex(-1)
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && hasResults) {
                  event.preventDefault()
                  setHighlightedIndex(0)
                  resultRefs.current[0]?.focus()
                }
              }}
              placeholder="Search tokens"
              type="search"
              value={searchQuery}
            />
            <kbd className="absolute right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-sm bg-secondary text-xs text-muted-foreground">
              /
            </kbd>
            {searchQuery.trim().length > 0 ? (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 flex flex-col gap-1 rounded-xl border bg-background p-2 shadow-lg">
                {hasResults ? (
                  filteredTokens.map((token, index) => (
                    <NavLink
                      className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition hover:bg-muted data-[active=true]:bg-muted"
                      data-active={index === highlightedIndex}
                      key={token.id}
                      onClick={() => {
                        setSearchQuery("")
                        setHighlightedIndex(-1)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault()
                          const nextIndex = Math.min(
                            index + 1,
                            filteredTokens.length - 1,
                          )
                          setHighlightedIndex(nextIndex)
                          resultRefs.current[nextIndex]?.focus()
                        }
                        if (event.key === "ArrowUp") {
                          event.preventDefault()
                          const nextIndex = Math.max(index - 1, 0)
                          setHighlightedIndex(nextIndex)
                          resultRefs.current[nextIndex]?.focus()
                        }
                      }}
                      params={{ tokenId: token.id }}
                      ref={(node) => {
                        resultRefs.current[index] = node
                      }}
                      tabIndex={0}
                      to="/tokens/$tokenId"
                    >
                      <Avatar size="sm">
                        <AvatarImage alt={token.name} src={token.icon} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {token.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token.name}</span>
                        <span className="text-muted-foreground">
                          {token.symbol}
                        </span>
                      </div>
                    </NavLink>
                  ))
                ) : (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    No token found.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Submit Button */}
          <Button
            className="h-9 gap-1.5 shadow-sm"
            onClick={() => setSubmitDialogOpen(true)}
            size="sm"
            variant="outline"
          >
            <PlusIcon className="size-4" />
            Submit token
          </Button>
        </div>
      </Container>

      {/* Submit Token Dialog */}
      <SubmitTokenDialog
        onOpenChange={setSubmitDialogOpen}
        open={submitDialogOpen}
      />
    </header>
  )
}
