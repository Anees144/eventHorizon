
'use client';

import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { CalendarDays, MapPin, User, MessageSquare, Ticket, Bookmark, BookmarkCheck, Eye, Star, UserPlus } from 'lucide-react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import { getEventById } from '@/lib/events';
import { MainHeader } from '@/components/layout/main-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import type { TicketTier, UserProfile, Event } from '@/lib/types';
import { CalendarButton } from '@/components/events/calendar-button';
import { ShareButton } from '@/components/events/share-button';
import { VideoEmbed } from '@/components/events/video-embed';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  
  const [formattedDate, setFormattedDate] = useState('');
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [popularity, setPopularity] = useState({ views: 0, saves: 0, registrations: 0 });


  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const isSaved = userProfile?.savedEvents?.includes(event?.id || '') || false;

  useEffect(() => {
    async function fetchEvent() {
        setLoadingEvent(true);
        const eventData = await getEventById(eventId);
        if (eventData) {
            setEvent(eventData);
            const eventDate = parseISO(eventData.date as string);
            setFormattedDate(format(eventDate, 'EEEE, MMMM d, yyyy'));
            if(eventData.ticketTiers.length > 0) {
                setSelectedTier(eventData.ticketTiers[0]);
            }
             // Mock data for popularity, delayed to client-side
            setPopularity({
                views: Math.floor(Math.random() * 5000) + 1000,
                saves: Math.floor(Math.random() * 500) + 50,
                registrations: Math.floor(Math.random() * 800) + 100,
            });
        }
        setLoadingEvent(false);
    }
    fetchEvent();
  }, [eventId]);

  const handleSaveToggle = async () => {
    if (!user || !firestore || !event) return;

    const userDocRef = doc(firestore, 'users', user.uid);
    if (isSaved) {
      await updateDoc(userDocRef, {
        savedEvents: arrayRemove(event.id),
      });
    } else {
      await updateDoc(userDocRef, {
        savedEvents: arrayUnion(event.id),
      });
    }
  };

  const handleTierChange = (tierId: string) => {
    const tier = event?.ticketTiers.find(t => t.id === tierId);
    setSelectedTier(tier || null);
  }

  const getButtonText = () => {
    if (!selectedTier) return "Select a ticket";
    switch (selectedTier.type) {
      case 'paid':
        return `Checkout - $${selectedTier.price.toFixed(2)}`;
      case 'reservation':
        return 'Reserve Spot';
      case 'donation':
        return 'Make a Donation';
      default:
        return 'Get Tickets';
    }
  }

  if (loadingEvent) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <MainHeader />
        <main className="flex-1">
          <Skeleton className="h-[300px] md:h-[500px] w-full" />
          <div className="container py-12 md:py-16">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!event) {
    notFound();
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainHeader />
      <main className="flex-1">
        <section className="relative h-[300px] md:h-[500px] w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint={event.imageHint}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="container relative flex h-full flex-col items-start justify-end px-4 py-8 md:py-12 text-primary-foreground">
            <div className="flex w-full flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2 bg-secondary/80 text-secondary-foreground">{event.category}</Badge>
                <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
                  {event.title}
                </h1>
              </div>
              {user && (
                <Button variant="secondary" size="lg" onClick={handleSaveToggle} className="w-full md:w-auto">
                  {isSaved ? <BookmarkCheck className="mr-2 h-5 w-5"/> : <Bookmark className="mr-2 h-5 w-5" />}
                  {isSaved ? 'Saved' : 'Save Event'}
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container grid gap-12 px-4 md:grid-cols-3 md:px-6">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="font-headline text-2xl md:text-3xl font-bold">About this event</h2>
                {event.videoUrl && <VideoEmbed url={event.videoUrl} className="mt-6" />}
                <div
                  className="prose prose-lg mt-6 max-w-none text-foreground/90"
                  dangerouslySetInnerHTML={{ __html: event.richDescription }}
                />
                {event.tags && event.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {event.tags.map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                )}
              </div>
            </div>
            <div className="space-y-6 lg:sticky top-24 self-start">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Date and Time</CardTitle>
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
                  <CardTitle className="font-headline text-lg">Organizer</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-5 w-5" />
                  <Link href={`/organizer/${event.organizerId}`} className="hover:underline text-primary">
                    {event.organizer}
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Popularity</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center justify-center gap-1 rounded-md bg-muted p-2">
                        <Eye className="h-5 w-5 text-muted-foreground" />
                        <span className="font-bold text-lg">{popularity.views.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">Views</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 rounded-md bg-muted p-2">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <span className="font-bold text-lg">{popularity.saves.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">Saves</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 rounded-md bg-muted p-2">
                        <UserPlus className="h-5 w-5 text-muted-foreground" />
                        <span className="font-bold text-lg">{popularity.registrations.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">Registrations</span>
                    </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Share & Sync</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                    <CalendarButton event={event} />
                    <ShareButton event={event} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Event Forum</CardTitle>
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
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Ticket /> Get Your Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <RadioGroup defaultValue={event.ticketTiers[0]?.id} onValueChange={handleTierChange}>
                        {event.ticketTiers.map(tier => (
                            <div key={tier.id} className="flex items-center justify-between">
                                <Label htmlFor={tier.id} className="flex items-center gap-3 cursor-pointer">
                                    <RadioGroupItem value={tier.id} id={tier.id} />
                                    <div className="grid gap-0.5">
                                        <span className="font-semibold">{tier.name}</span>
                                         {tier.type === 'donation' && <span className="text-xs text-muted-foreground">Pay what you want</span>}
                                         {tier.type === 'reservation' && <span className="text-xs text-muted-foreground">Free reservation</span>}
                                    </div>
                                </Label>
                                {tier.type === 'paid' && <span className="font-semibold">${tier.price.toFixed(2)}</span>}
                            </div>
                        ))}
                    </RadioGroup>
                    
                    {selectedTier?.type === 'donation' && (
                        <div className="grid gap-2">
                            <Label htmlFor='donation-amount'>Donation Amount</Label>
                            <Input id="donation-amount" type="number" placeholder="Enter amount" />
                        </div>
                    )}
                    
                    <Separator />
                    <div className="flex gap-2">
                        <Input placeholder="Promo Code" />
                        <Button variant="secondary">Apply</Button>
                    </div>
                    <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!selectedTier}>
                        {getButtonText()}
                    </Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
