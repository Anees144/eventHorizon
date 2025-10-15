'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { events } from '@/lib/data';
import { EventCard } from '@/components/events/event-card';
import EventFilters from '@/components/events/event-filters';
import { MainHeader } from '@/components/layout/main-header';
import type { FilterState, Event } from '@/lib/types';

function EventList() {
  const searchParams = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') ?? 'all',
    location: searchParams.get('location') ?? '',
    date: searchParams.get('date') ? new Date(searchParams.get('date')!) : null,
    search: searchParams.get('search') ?? '',
  });

  useEffect(() => {
    setFilters({
      category: searchParams.get('category') ?? 'all',
      location: searchParams.get('location') ?? '',
      date: searchParams.get('date') ? new Date(searchParams.get('date')!) : null,
      search: searchParams.get('search') ?? '',
    });
  }, [searchParams]);

  useEffect(() => {
    const newFilteredEvents = events.filter((event) => {
      const searchLower = filters.search.toLowerCase();
      if (
        filters.search &&
        !event.title.toLowerCase().includes(searchLower) &&
        !event.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
      if (filters.category !== 'all' && event.category.toLowerCase() !== filters.category) {
        return false;
      }
      if (
        filters.location &&
        !event.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
      if (filters.date) {
          const eventDate = new Date(event.date);
          const filterDate = filters.date;
          if (eventDate.getFullYear() !== filterDate.getFullYear() ||
              eventDate.getMonth() !== filterDate.getMonth() ||
              eventDate.getDate() !== filterDate.getDate()) {
              return false;
          }
      }
      return true;
    });
    setFilteredEvents(newFilteredEvents);
  }, [filters]);


  return (
    <div className="container grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:px-6">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function HomePageContent() {
  // This state is now managed inside EventList based on searchParams
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    location: '',
    date: null,
    search: '',
  });

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
                Explore thousands of events from concerts to conferences. Your
                next adventure awaits.
              </p>
            </div>
          </div>
        </section>

        <div className="container -mt-16 px-4 md:px-6">
          <EventFilters onFilterChange={setFilters} />
        </div>

        <section className="py-12 md:py-24 lg:py-32">
          <EventList />
        </section>
      </main>
      <footer className="border-t bg-card">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Event Horizon. &copy; {new Date().getFullYear()} All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}
