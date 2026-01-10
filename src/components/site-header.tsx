import { Link } from "@tanstack/react-router"
import { ChevronDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { FRAMEWORK_BASE_URL } from "@/lib/framework"

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-12 px-4 lg:px-12">
        {/* Logo */}
        <Link className="flex items-center gap-3 shrink-0" to="/">
          <img
            alt="Logo"
            className="size-8 rounded-lg object-cover"
            src="/logo-square.png"
          />
          <div className="flex items-center gap-1 text-base font-semibold leading-6">
            <span className="text-foreground">Token Ownership</span>
            <span className="text-muted-foreground">Analytics</span>
          </div>
        </Link>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink render={<Link to="/" />}>
                Tokens
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={
                  <a
                    href={FRAMEWORK_BASE_URL}
                    rel="noopener noreferrer"
                    target="_blank"
                  />
                }
              >
                Framework{" "}
                <span className="inline-block translate-y-[-2px] text-[13px]">
                  ↗
                </span>
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
                    <a
                      className="flex w-full items-center"
                      href="https://blockworks.co/token-transparency"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Blockworks{" "}
                      <span className="inline-block translate-y-[-2px] text-[13px] ml-2">
                        ↗
                      </span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
