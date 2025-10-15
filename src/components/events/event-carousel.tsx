
'use client';

import type { Event } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { EventCard } from './event-card';

type EventCarouselProps = {
  events: Event[];
  onCompareChange: (eventId: string, isSelected: boolean) => void;
  compareList: string[];
};

export function EventCarousel({ events, onCompareChange, compareList }: EventCarouselProps) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {events.map((event) => (
          <CarouselItem key={event.id} className="basis-full pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="p-1">
              <EventCard 
                event={event} 
                onCompareChange={onCompareChange}
                isComparing={compareList.includes(event.id)}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </Carousel>
  );
}
