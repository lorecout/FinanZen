
"use client"

import {
  LayoutGrid,
  Wallet,
  Target,
  ShoppingCart,
  Plus,
  Settings,
  type LucideIcon,
  Replace,
  BookUser,
} from "lucide-react"
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import AiTransactionForm from "./ai-transaction-form";
import { useAuth } from "@/hooks/use-auth";

export type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
}

export const getNavItems = (): NavItem[] => [
  { id: "dashboard", href: "/", icon: LayoutGrid, label: "Principal" },
  { id: "bills", href: "/#", icon: Wallet, label: "Transações" }, // Changed to transações
  // Placeholder for the add button
  { id: "add", href: "/#add-transaction", icon: Plus, label: "Adicionar" },
  { id: "goals", href: "/#", icon: Target, label: "Planejamento" }, // Changed to Planejamento
  { id: "settings", href: "/configuracoes", icon: BookUser, label: "Mais" }, // Changed to "Mais"
]

type MobileNavProps = {
    activeView: string;
    setActiveView: (view: string) => void;
}

function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const { refreshData, addBill } = useAuth();
  
  const handleSuccess = () => {
    refreshData();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <div className="inline-flex flex-col items-center justify-center -mt-8">
              <Button
                  size="icon"
                  className="w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                  aria-label="Adicionar Transação"
              >
                  <Plus className="h-6 w-6" />
              </Button>
          </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
          <DialogDescription>
            Use a IA para adicionar despesas ou receitas de forma rápida e segura.
          </DialogDescription>
        </DialogHeader>
        <AiTransactionForm onAddTransaction={handleSuccess} addBill={addBill} />
      </DialogContent>
    </Dialog>
  )
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
        } else {
           setActiveView('dashboard');
        }
    }


    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
            <div className="grid h-full grid-cols-5 max-w-lg mx-auto font-medium">
                {navItems.map((item) => {
                    const isActive = activeView === item.id;
                    if (item.id === 'add') {
                        return (
                           <AddTransactionDialog key={item.id} />
                        )
                    }

                    if(item.id === 'bills') {
                        // For now, this button reloads the page to show all transactions
                         return (
                            <button 
                            key={item.id} 
                            onClick={() => window.location.reload()}
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
                    }
                    
                     if(item.id === 'settings') {
                         return (
                            <Link href="/configuracoes" key={item.id} className={cn("inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 group focus:outline-none", {
                                "text-primary": isActive,
                                "text-muted-foreground": !isActive
                            })}>
                                 <item.icon className="w-5 h-5 mb-1" />
                                <span className="text-xs font-medium">
                                    {item.label}
                                </span>
                            </Link>
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
