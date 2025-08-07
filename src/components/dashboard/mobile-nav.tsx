"use client"

import Link from "next/link"
import {
  LayoutGrid,
  Wallet,
  Target,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  active?: boolean;
}

export const navItems: NavItem[] = [
  { href: "/", icon: LayoutGrid, label: "Dashboard", active: true },
  { href: "#", icon: Wallet, label: "Contas a Pagar", badge: 3 },
  { href: "#", icon: Target, label: "Metas" },
  { href: "#", icon: ShoppingCart, label: "Compras" },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label}>
            <div
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-md relative",
                (item.href === "/" && pathname === item.href) || (item.href !== "/" && pathname.startsWith(item.href))
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.badge && (
                 <Badge className="absolute -top-1 -right-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full p-1.5 text-xs">
                  {item.badge}
                </Badge>
              )}
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}
