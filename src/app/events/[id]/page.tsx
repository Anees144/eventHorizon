
'use client';

import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { CalendarDays, MapPin, User, Tag, MessageSquare } from 'lucide-react';
import { notFound, Link } from 'next/navigation';

import { events } from '@/lib/data';
import { MainHeader } from '@/components/layout/main-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

type EventPageProps = {
  params: {
    id: string;
  };
};

export default function EventPage({ params }: EventPageProps) {
  const event = events.find((e) => e.id === params.id);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (event) {
      const eventDate = parseISO(event.date);
      setFormattedDate(format(eventDate, 'EEEE, MMMM d, yyyy'));
    }
  }, [event]);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainHeader />
      <main className="flex-1">
        <section className="relative h-[500px] w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint={event.imageHint}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="container relative flex h-full flex-col items-start justify-end px-4 py-12 text-primary-foreground md:px-6">
            <Badge variant="secondary" className="mb-2 bg-secondary/80 text-secondary-foreground">{event.category}</Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              {event.title}
            </h1>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container grid gap-12 px-4 md:grid-cols-3 md:px-6">
            <div className="md:col-span-2">
              <h2 className="font-headline text-2xl font-bold">About this event</h2>
              <div
                className="prose prose-lg mt-4 max-w-none text-foreground/90"
                dangerouslySetInnerHTML={{ __html: event.richDescription }}
              />
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Date and Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Organizer</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-5 w-5" />
                  <span>{event.organizer}</span>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Event Forum</CardTitle>
                </CardHeader>
                <CardContent>
                   <Button asChild className="w-full">
                    <Link href={`/events/${event.id}/forum`}>
                      <MessageSquare className="mr-2 h-4 w-4" /> Join Discussion
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Get Your Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <RadioGroup defaultValue={event.ticketTiers[0].id}>
                        {event.ticketTiers.map(tier => (
                            <div key={tier.id} className="flex items-center justify-between">
                                <Label htmlFor={tier.id} className="flex items-center gap-3 cursor-pointer">
                                    <RadioGroupItem value={tier.id} id={tier.id} />
                                    {tier.name}
                                </Label>
                                <span className="font-semibold">${tier.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </RadioGroup>
                    <Separator />
                    <div className="flex gap-2">
                        <Input placeholder="Promo Code" />
                        <Button variant="secondary">Apply</Button>
                    </div>
                    <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Checkout</Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
