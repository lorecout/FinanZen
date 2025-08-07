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
  badge?: number;
  active?: boolean;
}

export const navItems: NavItem[] = [
  { href: "/", icon: LayoutGrid, label: "Dashboard", active: true },
  { href: "#", icon: Wallet, label: "Contas a Pagar", badge: 3 },
  { href: "#", icon: Target, label: "Metas" },
  { href: "#", icon: ShoppingCart, label: "Compras" },
]
