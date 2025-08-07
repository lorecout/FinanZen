
"use client"

import {
  LayoutGrid,
  Wallet,
  Target,
  ShoppingCart,
  Plus,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from "next/link";

export type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
}

export const getNavItems = (): NavItem[] => [
  { id: "dashboard", href: "/", icon: LayoutGrid, label: "Dashboard" },
  { id: "bills", href: "/#", icon: Wallet, label: "Contas" },
  // Placeholder for the add button
  { id: "add", href: "/#add-transaction", icon: Plus, label: "Adicionar" },
  { id: "goals", href: "/#", icon: Target, label: "Metas" },
  { id: "shopping", href: "/#", icon: ShoppingCart, label: "Compras" },
  // Hidden from mobile nav, but used for sidebar
  { id: "settings", href: "/configuracoes", icon: Settings, label: "Configurações" },
]

type MobileNavProps = {
    activeView: string;
    setActiveView: (view: string) => void;
}

export default function MobileNav({ activeView, setActiveView }: MobileNavProps) {
    const navItems = getNavItems();

    const handleAddClick = () => {
        const addTransactionSection = document.getElementById('add-transaction-form');
        if(addTransactionSection) {
            setActiveView('dashboard');
            // Timeout to allow the view to render before scrolling
            setTimeout(() => {
                addTransactionSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }


    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
            <div className="grid h-full grid-cols-5 max-w-lg mx-auto font-medium">
                {navItems.filter(i => i.id !== 'settings').map((item) => {
                    const isActive = activeView === item.id;
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
                        <button 
                          key={item.id} 
                          onClick={() => setActiveView(item.id)}
                          className={cn("inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 group focus:outline-none", {
                            "text-primary": isActive,
                            "text-muted-foreground": !isActive
                          })}
                        >
                             <item.icon className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
