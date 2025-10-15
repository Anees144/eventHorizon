

'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Sparkles, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { DateRange } from 'react-day-picker';

import { events } from '@/lib/data';
import { EventCard } from '@/components/events/event-card';
import EventFilters from '@/components/events/event-filters';
import { MainHeader } from '@/components/layout/main-header';
import type { FilterState, Event } from '@/lib/types';
import { getDistance } from '@/lib/utils';
import { getRecommendedEventsAction } from './dashboard/recommendations/actions';
import { Button } from '@/components/ui/button';
import { EventCarousel } from '@/components/events/event-carousel';
import { CompareButton } from '@/components/events/compare-button';


function EventList({ onCompareChange, compareList }: { onCompareChange: (eventId: string, isSelected: boolean) => void; compareList: string[] }) {
  const searchParams = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') ?? 'all',
    location: searchParams.get('location') ?? '',
    date: (() => {
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        if (from && to) return { from: new Date(from), to: new Date(to) };
        if (from) return { from: new Date(from), to: undefined };
        return undefined;
    })(),
    search: searchParams.get('search') ?? '',
    radius: Number(searchParams.get('radius')) || 50,
    price: [0, 500],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          // Fallback or default location if user denies permission
          setUserLocation({ lat: 40.7128, lon: -74.0060 }); // Default to NYC
        }
      );
    } else {
        // Fallback for old browsers
        setUserLocation({ lat: 40.7128, lon: -74.0060 }); // Default to NYC
    }
  }, []);

  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    let dateRange: DateRange | undefined = undefined;
    if (from) {
        dateRange = { from: new Date(from), to: to ? new Date(to) : undefined };
    }

    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') ?? 'all',
      location: searchParams.get('location') ?? '',
      date: dateRange,
      search: searchParams.get('search') ?? '',
      radius: Number(searchParams.get('radius')) || 50,
    }));
  }, [searchParams]);

  useEffect(() => {
    const newFilteredEvents = events.filter((event) => {
      const eventDate = event.date ? new Date(event.date) : null;

      const searchLower = filters.search.toLowerCase();
      if (
        filters.search &&
        !event.title.toLowerCase().includes(searchLower) &&
        !event.description.toLowerCase().includes(searchLower) &&
        !event.organizer.toLowerCase().includes(searchLower) &&
        !event.location.toLowerCase().includes(searchLower)
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
      
      if (filters.date?.from) {
          if (!eventDate) return false;
          const fromDate = new Date(filters.date.from);
          fromDate.setHours(0,0,0,0);
          // Don't filter out past events
          // if (eventDate < fromDate) return false; 
          if (filters.date.to) {
              const toDate = new Date(filters.date.to);
              toDate.setHours(23,59,59,999);
              if (eventDate > toDate) return false;
          }
      }


      if (userLocation && event.latitude && event.longitude) {
          const distance = getDistance(userLocation.lat, userLocation.lon, event.latitude, event.longitude);
          if(distance > filters.radius) {
              return false;
          }
      }
      
      const maxPrice = event.ticketTiers.reduce((max, tier) => tier.type === 'paid' ? Math.max(max, tier.price) : max, 0);
      if (maxPrice < filters.price[0] || maxPrice > filters.price[1]) {
          if(filters.price[1] < 500 || filters.price[0] > 0) // only filter if user has changed price
            return false;
      }

      return true;
    });
    setFilteredEvents(newFilteredEvents);
  }, [filters, userLocation]);


  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:px-6">
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onCompareChange={onCompareChange}
            isComparing={compareList.includes(event.id)}
          />
        ))
      ) : (
        <div className="col-span-full text-center text-muted-foreground py-10">
          <p>No events match your criteria.</p>
          <p>Try expanding your search radius or clearing some filters.</p>
        </div>
      )}
    </div>
  );
}

function HomePageContent() {
    const [filters, setFilters] = useState<FilterState>({
        category: 'all',
        location: '',
        date: undefined,
        search: '',
        radius: 50,
        price: [0, 500],
    });
    const [recommendedEvents, setRecommendedEvents] = useState<Event[] | null>(null);
    const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
    const [trendingEvents] = useState<Event[]>(() => events.slice(0, 5));
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [compareList, setCompareList] = useState<string[]>([]);

    const handleCompareChange = (eventId: string, isSelected: boolean) => {
        setCompareList(prev => 
            isSelected ? [...prev, eventId] : prev.filter(id => id !== eventId)
        );
    };

    useEffect(() => {
        getRecommendedEventsAction().then(result => {
            if (result.recommendedEvents) {
                setRecommendedEvents(result.recommendedEvents);
            }
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                () => {
                    setUserLocation({ lat: 40.7128, lon: -74.0060 }); // Default to NYC
                }
            );
        } else {
            setUserLocation({ lat: 40.7128, lon: -74.0060 }); // Default to NYC
        }
    }, []);

    useEffect(() => {
        if (userLocation) {
            const nearby = events.filter(event => {
                if (event.latitude && event.longitude) {
                    const distance = getDistance(userLocation.lat, userLocation.lon, event.latitude, event.longitude);
                    return distance < 50; // 50km radius for nearby
                }
                return false;
            });
            setNearbyEvents(nearby);
        }
    }, [userLocation]);


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
                
                <section className="py-12 md:py-24 lg:py-32 space-y-16">
                    {/* Trending Events Section */}
                    <div>
                        <div className="container mb-8 flex items-center justify-between">
                            <h2 className="font-headline text-3xl font-bold flex items-center gap-2"><TrendingUp /> Trending Events</h2>
                            <Button variant="ghost" asChild>
                                <Link href="/?search=">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </div>
                        <EventCarousel 
                            events={trendingEvents} 
                            onCompareChange={handleCompareChange}
                            compareList={compareList}
                        />
                    </div>

                    {/* Nearby Events Section */}
                    {nearbyEvents.length > 0 && (
                        <div>
                            <div className="container mb-8 flex items-center justify-between">
                                <h2 className="font-headline text-3xl font-bold flex items-center gap-2"><MapPin/> Nearby You</h2>
                                <Button variant="ghost" asChild>
                                <Link href="/?radius=25">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                            <EventCarousel 
                                events={nearbyEvents} 
                                onCompareChange={handleCompareChange}
                                compareList={compareList}
                            />
                        </div>
                    )}

                    {/* Recommended Events Section */}
                    {recommendedEvents && recommendedEvents.length > 0 && (
                        <div>
                            <div className="container mb-8 flex items-center justify-between">
                                 <h2 className="font-headline text-3xl font-bold flex items-center gap-2"><Sparkles/> For You</h2>
                                 <Button variant="ghost" asChild>
                                    <Link href="/dashboard/recommendations">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                           <EventCarousel 
                                events={recommendedEvents} 
                                onCompareChange={handleCompareChange}
                                compareList={compareList}
                            />
                        </div>
                    )}

                </section>
                
                 <section className="py-12 md:py-24 lg:py-32 border-t">
                    <div className="container mb-8">
                        <h2 className="font-headline text-3xl font-bold">All Events</h2>
                    </div>
                    <EventList onCompareChange={handleCompareChange} compareList={compareList} />
                </section>

            </main>
            {compareList.length > 0 && <CompareButton compareList={compareList} />}
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
