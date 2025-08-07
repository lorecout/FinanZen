
"use client"

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
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

type WelcomeTourProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
};

const tourSteps = [
  {
    title: "Bem-vindo(a) ao FinanZen!",
    description: "Seu novo assistente financeiro inteligente. Vamos fazer um tour rápido pelas principais funcionalidades.",
    image: "/tour-1.png",
    alt: "Tela de boas-vindas do FinanZen",
    hint: "welcome screen app"
  },
  {
    title: "Adicione Transações com IA",
    description: "No Dashboard, use a caixa de texto para adicionar despesas ou receitas. Nossa IA entende o que você digita e organiza tudo para você.",
    image: "/tour-2.png",
    alt: "Demonstração da adição de transação com IA",
    hint: "AI transaction input"
  },
  {
    title: "Organize-se com Facilidade",
    description: "Use o menu de navegação para acessar e gerenciar suas Contas, Metas de economia e sua Lista de Compras.",
    image: "/tour-3.png",
    alt: "Menu de navegação do aplicativo",
    hint: "app navigation menu"
  },
  {
    title: "Explore e Personalize",
    description: "Acesse as Configurações para personalizar o tema e conhecer nossos planos Premium para ter acesso a insights exclusivos. Você está pronto para começar!",
    image: "/tour-4.png",
    alt: "Tela de configurações do aplicativo",
    hint: "app settings page"
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
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {tourSteps.map((step, index) => (
              <CarouselItem key={index}>
                <div className="p-6 flex flex-col items-center text-center">
                   <div className="mb-4">
                     <Logo />
                   </div>
                   <Card className="w-full aspect-video overflow-hidden mb-4 border-dashed">
                    <CardContent className='p-0'>
                       <Image
                          src={`https://placehold.co/400x225.png?text=${encodeURIComponent(step.title)}`}
                          alt={step.alt}
                          width={400}
                          height={225}
                          className="object-cover"
                          data-ai-hint={step.hint}
                        />
                    </CardContent>
                   </Card>
                  <DialogHeader>
                    <DialogTitle className='text-xl font-headline'>{step.title}</DialogTitle>
                    <DialogDescription>{step.description}</DialogDescription>
                  </DialogHeader>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='absolute left-1/2 -translate-x-1/2 bottom-20'>
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
        <DialogFooter className="flex-row justify-between w-full p-6 pt-0">
           <Button variant="ghost" onClick={handleClose}>
            Pular
          </Button>
          <div className='flex items-center gap-2'>
              {tourSteps.map((_, i) => (
                <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${i === current ? 'bg-primary' : 'bg-muted'}`}
                />
                ))}
          </div>
          <Button onClick={isLastStep ? handleClose : () => api?.scrollNext()}>
            {isLastStep ? "Concluir" : "Próximo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
