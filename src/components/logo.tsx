import { Wallet } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Wallet className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold font-headline">FinanZen</span>
    </Link>
  );
};

export default Logo;
