'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rows } from 'lucide-react';

type CompareButtonProps = {
  compareList: string[];
};

export function CompareButton({ compareList }: CompareButtonProps) {
  if (compareList.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button asChild size="lg">
        <Link href={`/compare?ids=${compareList.join(',')}`}>
          <Rows className="mr-2 h-5 w-5" />
          Compare ({compareList.length})
        </Link>
      </Button>
    </div>
  );
}
