import { Link } from "@tanstack/react-router"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link className="flex items-center gap-2" to="/">
            <Avatar>
              <AvatarImage className="size-8 rounded-lg" src="/aragon.jpg" />
              <AvatarFallback>AG</AvatarFallback>
            </Avatar>
            <span className="font-semibold">
              Token Ownership <span className="font-normal">Analytics</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <Button render={<Link to="/" />} size="sm" variant="ghost">
              Tokens
            </Button>
            <Button size="sm" variant="ghost">
              Framework
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button size="sm" variant="ghost" />}
              >
                More
                <ChevronDownIcon className="ml-1 size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>API</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
