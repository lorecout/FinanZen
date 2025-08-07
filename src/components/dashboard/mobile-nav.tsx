
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Wallet,
  Target,
  ShoppingCart,
  Plus,
  type LucideIcon,
} from "lucide-react"
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const getNavItems = (): NavItem[] => [
  { href: "/", icon: LayoutGrid, label: "Dashboard" },
  { href: "/contas-a-pagar", icon: Wallet, label: "Contas" },
  // Placeholder for the add button
  { href: "/#add-transaction", icon: Plus, label: "Adicionar" },
  { href: "/metas", icon: Target, label: "Metas" },
  { href: "/compras", icon: ShoppingCart, label: "Compras" },
]

export default function MobileNav() {
    const pathname = usePathname();
    const navItems = getNavItems();

    const handleAddClick = () => {
        const addTransactionSection = document.getElementById('add-transaction-form');
        if(addTransactionSection) {
            addTransactionSection.scrollIntoView({ behavior: 'smooth' });
        }
    }


    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
            <div className="grid h-full grid-cols-5 max-w-lg mx-auto font-medium">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    if (item.label === 'Adicionar') {
                        return (
                             <div key={item.label} className="inline-flex flex-col items-center justify-center -mt-8">
                                <Button
                                    size="icon"
                                    className="w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                                    onClick={handleAddClick}
                                    aria-label="Adicionar Transação"
                                >
                                    <Plus className="h-6 w-6" />
                                </Button>
                            </div>
                        )
                    }

                    return (
                        <Link key={item.label} href={item.href} className={cn("inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 group", {
                            "text-primary": isActive,
                            "text-muted-foreground": !isActive
                        })}>
                             <item.icon className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
