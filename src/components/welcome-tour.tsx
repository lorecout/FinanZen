
"use client"

import React, { useState, useCallback } from 'react';
import type { EmblaCarouselType } from 'embla-carousel-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from './ui/button';
import Logo from './logo';
import { Card, CardContent } from './ui/card';
import { Sparkles, LayoutGrid, Wallet, Settings, Target, ShoppingCart, Lightbulb, type LucideIcon } from 'lucide-react';

type WelcomeTourProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
};

type TourStep = {
    icon: LucideIcon;
    title: string;
    description: string;
}

const tourSteps: TourStep[] = [
  {
    icon: Sparkles,
    title: "Adicione Transações com IA",
    description: "No Dashboard, use a caixa de texto para adicionar despesas ou receitas. Nossa IA entende o que você digita e organiza tudo para você."
  },
  {
    icon: LayoutGrid,
    title: "Navegue com Facilidade",
    description: "Use o menu de navegação para acessar e gerenciar suas Contas, Metas de economia e sua Lista de Compras, tudo em um só lugar."
  },
  {
    icon: Lightbulb,
    title: "Receba Insights Inteligentes",
    description: "Assine o plano Premium para que nossa IA analise suas finanças e ofereça dicas valiosas para você economizar e atingir seus objetivos mais rápido."
  },
  {
    icon: Settings,
    title: "Explore e Personalize",
    description: "Acesse as Configurações para personalizar a aparência do aplicativo e gerenciar seu plano. Você está pronto para começar!"
  }
];

export default function WelcomeTour({ open, onOpenChange, onComplete }: WelcomeTourProps) {
  const [api, setApi] = useState<EmblaCarouselType | undefined>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setCurrent(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);
  
  const handleClose = () => {
    onComplete();
    onOpenChange(false);
  }

  const isLastStep = current === tourSteps.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="p-6 flex flex-col items-center text-center">
             <div className="mb-4">
               <Logo />
             </div>
              <DialogHeader className='mb-4'>
                <DialogTitle className='text-xl font-headline'>Bem-vindo(a) ao FinanZen!</DialogTitle>
                <DialogDescription>Seu novo assistente financeiro inteligente. Vamos fazer um tour rápido.</DialogDescription>
              </DialogHeader>
        </div>
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {tourSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                     <CarouselItem key={index}>
                        <div className="p-6 pt-0 text-center">
                            <Card className="w-full h-36 flex flex-col items-center justify-center border-dashed mb-4">
                                <CardContent className='p-0 flex flex-col items-center justify-center gap-2'>
                                    <Icon className="w-12 h-12 text-primary/80" />
                                </CardContent>
                            </Card>
                            <DialogHeader>
                                <DialogTitle className='text-lg font-headline'>{step.title}</DialogTitle>
                                <DialogDescription>{step.description}</DialogDescription>
                            </DialogHeader>
                        </div>
                    </CarouselItem>
                )
            })}
          </CarouselContent>
           <div className='absolute left-1/2 -translate-x-1/2 bottom-[100px] hidden sm:block'>
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>

        <DialogFooter className="flex-row justify-between w-full items-center p-6 pt-0 border-t">
           <Button variant="ghost" onClick={handleClose}>
            Pular
          </Button>
          <div className='flex items-center gap-2'>
              {tourSteps.map((_, i) => (
                <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all ${i === current ? 'bg-primary scale-125' : 'bg-muted'}`}
                />
                ))}
          </div>
          <Button onClick={isLastStep ? handleClose : () => api?.scrollNext()}>
            {isLastStep ? "Começar!" : "Próximo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
