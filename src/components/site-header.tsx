import { IconExternalLink } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
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
            <span className="font-semibold">Ownership Token Index</span>
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
                      className="flex-row items-center gap-2"
                      href="https://github.com/aragon/ownership-token-index-framework/blob/develop/README.md"
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  }
                >
                  Framework <IconExternalLink className="size-4" />
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}
