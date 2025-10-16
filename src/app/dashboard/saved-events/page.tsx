
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Event, UserProfile } from '@/lib/types';
import { EventCard } from '@/components/events/event-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEvents } from '@/lib/events';

export default function SavedEventsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
        setLoadingEvents(true);
        const events = await getEvents();
        setAllEvents(events);
        setLoadingEvents(false);
    }
    fetchEvents();
  }, []);

  const userProfileRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userProfileRef);

  const savedEvents = userProfile?.savedEvents
    ? allEvents.filter((event) => userProfile.savedEvents?.includes(event.id))
    : [];
    
  const isLoading = isLoadingProfile || loadingEvents;

  return (
    <div className="container mx-auto py-8">
       <Card>
        <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
                <Bookmark className="h-8 w-8" />
                Saved Events
            </CardTitle>
            <CardDescription>
                Your personal collection of events you don't want to miss.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading && (
                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-4 rounded-lg border p-4">
                            <div className="h-40 animate-pulse rounded-md bg-muted" />
                            <div className="space-y-2">
                                <div className="h-4 w-2/3 animate-pulse bg-muted" />
                                <div className="h-4 w-full animate-pulse bg-muted" />
                                <div className="h-4 w-full animate-pulse bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!isLoading && savedEvents.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {savedEvents.map((event) => (
                        <EventCard key={event.id} event={event} onCompareChange={()=>{}} isComparing={false} />
                    ))}
                </div>
            )}
            {!isLoading && savedEvents.length === 0 && (
                <div className="py-20 text-center text-muted-foreground">
                    <Bookmark className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">No Saved Events Yet</h3>
                    <p className="mt-2 text-sm">
                        Click the bookmark icon on any event to save it here for later.
                    </p>
                </div>
            )}
        </CardContent>
       </Card>
    </div>
  );
}
