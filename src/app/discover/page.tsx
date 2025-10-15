
'use client';

import { useState, useEffect } from 'react';
import type { Event, FilterState } from '@/lib/types';
import { getEvents } from '@/lib/events';
import { EventCarousel } from '@/components/events/event-carousel';
import { categories } from '@/lib/data';
import EventFilters from '@/components/events/event-filters';
import { getDistance } from '@/lib/utils';
import { EventCard } from '@/components/events/event-card';
import { MainHeader } from '@/components/layout/main-header';
import { CompareButton } from '@/components/events/compare-button';

export default function DiscoverPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    location: '',
    date: undefined,
    search: '',
    radius: 50,
    price: [0, 500],
  });
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const events = await getEvents();
        setAllEvents(events);
        setFilteredEvents(events); // Initially, show all events
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    let newFilteredEvents = allEvents;

    // Category
    if (filters.category !== 'all') {
      newFilteredEvents = newFilteredEvents.filter(
        (e) => e.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    // Search
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        newFilteredEvents = newFilteredEvents.filter(e => 
            e.title.toLowerCase().includes(searchLower) ||
            e.description.toLowerCase().includes(searchLower) ||
            e.organizer.toLowerCase().includes(searchLower) ||
            e.category.toLowerCase().includes(searchLower)
        );
    }
    // Date
    if (filters.date?.from) {
        newFilteredEvents = newFilteredEvents.filter(e => {
            const eventDate = new Date(e.date as string);
            if (filters.date?.to) {
                return eventDate >= filters.date.from! && eventDate <= filters.date.to;
            }
            return eventDate.toDateString() === filters.date.from!.toDateString();
        });
    }

    setFilteredEvents(newFilteredEvents);
  }, [filters, allEvents]);


  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  const handleCompareChange = (eventId: string, isSelected: boolean) => {
    setCompareList(prev => 
        isSelected ? [...prev, eventId] : prev.filter(id => id !== eventId)
    );
  };

  const upcomingEvents = filteredEvents.filter(e => new Date(e.date as string) >= new Date());

  const groupedEvents = categories.map(category => ({
    category,
    events: upcomingEvents.filter(event => event.category === category),
  })).filter(group => group.events.length > 0);


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <MainHeader />
      <main className="flex-1">
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="space-y-4 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Discover Your Next Experience
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                From concerts to conferences, find what's happening near you.
              </p>
            </div>
          </div>
        </section>
        
        <section className="container -mt-8">
            <EventFilters onFilterChange={handleFilterChange} />
        </section>

        {loading ? (
          <div className="container py-12 text-center">Loading events...</div>
        ) : (
          <section className="container py-12 space-y-12">
            {groupedEvents.length > 0 ? (
                groupedEvents.map(({ category, events }) => (
                <div key={category}>
                  <h2 className="font-headline text-3xl font-bold mb-6">{category}</h2>
                  <EventCarousel events={events} onCompareChange={handleCompareChange} compareList={compareList} />
                </div>
              ))
            ) : (
                 <div className="text-center py-20">
                    <h2 className="text-2xl font-bold font-headline">No Events Found</h2>
                    <p className="text-muted-foreground mt-2">Try adjusting your filters to find more events.</p>
                </div>
            )}
          </section>
        )}
        <CompareButton compareList={compareList} />
      </main>
    </div>
  );
}

