import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarDays, MapPin } from 'lucide-react';

import type { Event } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} className="group block">
        <Card className="h-full overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-1">
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        data-ai-hint={event.imageHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{event.category}</Badge>
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
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                </div>
            </CardFooter>
        </Card>
    </Link>
  );
}
