"use client"

import Link from "next/link"
import {
  LayoutGrid,
  Wallet,
  Target,
  ShoppingCart,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "#", icon: LayoutGrid, label: "Dashboard" },
  { href: "#", icon: Wallet, label: "Contas" },
  { href: "#", icon: Target, label: "Metas" },
  { href: "#", icon: ShoppingCart, label: "Compras" },
]

export default function MobileNav() {
  const pathname = usePathname()

  // For now, we'll consider the root as the active path for the dashboard.
  const isActive = (href: string) => href === "#" && pathname === "/"

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label}>
            <div
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-md",
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}
