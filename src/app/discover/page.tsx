
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Event, FilterState } from '@/lib/types';
import { getEvents } from '@/lib/events';
import { EventCarousel } from '@/components/events/event-carousel';
import { categories } from '@/lib/data';
import EventFilters from '@/components/events/event-filters';
import { getDistance } from '@/lib/utils';
import { EventCard } from '@/components/events/event-card';
import { MainHeader } from '@/components/layout/main-header';
import { CompareButton } from '@/components/events/compare-button';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

function DiscoverPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    return {
      category: searchParams.get('category') ?? 'all',
      location: searchParams.get('location') ?? '',
      date: from ? { from: new Date(from), to: to ? new Date(to) : undefined } : undefined,
      search: searchParams.get('search') ?? '',
      radius: Number(searchParams.get('radius')) || 50,
      price: [0, 500],
    };
  });
  
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const events = await getEvents();
        setAllEvents(events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const updateQueryString = useCallback((name: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== null && value !== 'all' && value.toString().length > 0) {
      params.set(name, String(value));
    } else {
      params.delete(name);
    }
    router.push(`/discover?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const updateDateQueryParams = useCallback((dateRange: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (dateRange?.from) {
      params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
    } else {
      params.delete('from');
    }
    if (dateRange?.to) {
      params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
    } else {
      params.delete('to');
    }
    router.push(`/discover?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);


  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    if (newFilters.category !== undefined) updateQueryString('category', newFilters.category);
    if (newFilters.location !== undefined) updateQueryString('location', newFilters.location);
    if (newFilters.radius !== undefined) updateQueryString('radius', newFilters.radius);
    if (newFilters.search !== undefined) updateQueryString('search', newFilters.search);
    if (newFilters.date !== undefined) updateDateQueryParams(newFilters.date);

  }, [filters, updateQueryString, updateDateQueryParams]);

  const handleClearFilters = useCallback(() => {
    const defaultFilters = {
        category: 'all',
        location: '',
        date: undefined,
        search: '',
        radius: 50,
        price: [0, 500],
    };
    setFilters(defaultFilters);
    router.push('/discover', { scroll: false });
  }, [router]);


  useEffect(() => {
    let newFilteredEvents = allEvents;

    if (filters.category !== 'all') {
      newFilteredEvents = newFilteredEvents.filter(
        (e) => e.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        newFilteredEvents = newFilteredEvents.filter(e => 
            e.title.toLowerCase().includes(searchLower) ||
            e.description.toLowerCase().includes(searchLower) ||
            e.organizer.toLowerCase().includes(searchLower) ||
            e.category.toLowerCase().includes(searchLower)
        );
    }
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
            <EventFilters 
              filters={filters}
              onFilterChange={handleFilterChange} 
              onClearFilters={handleClearFilters}
            />
        </section>

        {loading ? (
          <div className="container py-12 space-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-8 w-1/4 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                     <div key={j} className="space-y-4 rounded-lg">
                        <Skeleton className="h-40 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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


export default function DiscoverPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DiscoverPageContent />
        </Suspense>
    )
}
