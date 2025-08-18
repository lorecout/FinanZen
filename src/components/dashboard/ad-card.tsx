
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

const AdCard = () => {
  return (
    <Card className="w-full bg-muted/50 border-dashed">
      <a 
        href="https://firebase.google.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block hover:bg-muted/80 transition-colors"
      >
        <CardContent className="p-4 flex items-center justify-center gap-4">
          <Megaphone className="h-6 w-6 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-semibold text-muted-foreground">Anúncio</p>
            <p className="text-xs text-muted-foreground">
              Construa apps incríveis com Firebase. Clique para saber mais!
            </p>
          </div>
        </CardContent>
      </a>
    </Card>
  );
};

export default AdCard;
