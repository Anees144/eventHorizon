import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { events } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EventFilters from '@/components/events/event-filters';
import { MainHeader } from '@/components/layout/main-header';
import { EventCard } from '@/components/events/event-card';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainHeader />
      <main className="flex-1">
        <section className="relative h-[400px] w-full">
           <Image
            src="https://picsum.photos/seed/hero/1600/400"
            alt="Hero background"
            fill
            className="object-cover"
            data-ai-hint="vibrant event"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="container px-4 md:px-6">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Discover Your Next Experience
              </h1>
              <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
                Explore thousands of events from concerts to conferences. Your next adventure awaits.
              </p>
            </div>
          </div>
        </section>

        <div className="container -mt-16 px-4 md:px-6">
          <EventFilters />
        </div>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:px-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t bg-card">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Event Horizon. &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
