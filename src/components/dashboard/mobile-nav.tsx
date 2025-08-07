
"use client"

import {
  LayoutGrid,
  Wallet,
  Target,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number | null;
}

export const getNavItems = (pendingBillsCount?: number): NavItem[] => [
  { href: "/", icon: LayoutGrid, label: "Dashboard" },
  { href: "/contas-a-pagar", icon: Wallet, label: "Contas a Pagar", badge: pendingBillsCount },
  { href: "#", icon: Target, label: "Metas" },
  { href: "#", icon: ShoppingCart, label: "Compras" },
]

    