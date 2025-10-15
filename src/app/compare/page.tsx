'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainHeader } from '@/components/layout/main-header';
import { events } from '@/lib/data';
import type { Event } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];
  const comparedEvents: Event[] = events.filter((event) => ids.includes(event.id));

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Event Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {comparedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comparedEvents.map((event) => (
                    <Card key={event.id} className="flex flex-col">
                      <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover rounded-t-lg"
                            data-ai-hint={event.imageHint}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <Badge variant="secondary" className="mb-2 w-fit">{event.category}</Badge>
                        <CardTitle className="font-headline text-lg leading-tight">{event.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2 flex-grow">{event.description}</p>
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>{format(parseISO(event.date), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            <span>
                              {event.ticketTiers.length > 0
                                ? `$${Math.min(...event.ticketTiers.filter(t => t.type === 'paid').map(t => t.price))}` + (event.ticketTiers.some(t => t.type !== 'paid') ? ' onwards' : '')
                                : 'Free'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <div className="p-4 pt-0">
                        <Button asChild className="w-full">
                            <Link href={`/events/${event.id}`}>View Event</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>No events selected for comparison.</p>
                  <p>Go back to the homepage and check the "Compare" box on some events.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function ComparePage() {
    return (
        <Suspense fallback={<div>Loading comparison...</div>}>
            <ComparePageContent />
        </Suspense>
    )
}
