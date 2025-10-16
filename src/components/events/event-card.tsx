
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { CalendarDays, MapPin, Bookmark, BookmarkCheck } from 'lucide-react';

import type { Event, UserProfile } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '../ui/button';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

type EventCardProps = {
  event: Event;
  onCompareChange: (eventId: string, isSelected: boolean) => void;
  isComparing: boolean;
};

export function EventCard({ event, onCompareChange, isComparing }: EventCardProps) {
  const [formattedDate, setFormattedDate] = useState('');
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const isSaved = userProfile?.savedEvents?.includes(event.id) || false;

  useEffect(() => {
    setFormattedDate(format(parseISO(event.date as string), 'MMM d, yyyy'));
  }, [event.date]);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !firestore) return;

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
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const checkbox = e.currentTarget.querySelector('button[role="checkbox"]') as HTMLButtonElement | null;
    checkbox?.click();
  };

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0 relative">
          <div className="relative h-48 w-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              data-ai-hint={event.imageHint}
            />
          </div>
          {user && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleSaveToggle}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2">
            {event.category}
          </Badge>
          <CardTitle className="font-headline text-lg leading-tight">
            {event.title}
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            {event.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
           <div 
            className="flex items-center space-x-2 mt-2 cursor-pointer w-full"
            onClick={handleCompareClick}
          >
            <Checkbox 
                id={`compare-${event.id}`}
                checked={isComparing}
                onCheckedChange={(checked) => onCompareChange(event.id, !!checked)}
            />
            <Label htmlFor={`compare-${event.id}`} className="text-sm font-medium leading-none cursor-pointer">
              Compare
            </Label>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
