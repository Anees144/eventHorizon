
'use client';
import Link from "next/link"
import {
  ArrowUpRight,
  CalendarClock,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { events, user } from "@/lib/data"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type EventWithFormattedDate = typeof events[0] & {
    formattedDate: string;
    formattedDistance: string;
    isUpcoming: boolean;
};

function DashboardPageContent() {
    const searchParams = useSearchParams();
    const [userEvents, setUserEvents] = useState<EventWithFormattedDate[]>([]);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');

    useEffect(() => {
        setSearchTerm(searchParams.get('search') ?? '');
    }, [searchParams]);

    useEffect(() => {
        const searchLower = searchTerm.toLowerCase();
        const processedEvents = events
            .filter(e => e.organizerId === user.id)
            .filter(e => {
                if (!searchTerm) return true;
                return e.title.toLowerCase().includes(searchLower) ||
                       e.description.toLowerCase().includes(searchLower);
            })
            .map(event => {
                const eventDate = parseISO(event.date);
                return {
                    ...event,
                    formattedDate: format(eventDate, 'MMM d, yyyy'),
                    isUpcoming: eventDate > new Date(),
                    formattedDistance: formatDistanceToNow(eventDate),
                };
            });
        setUserEvents(processedEvents);
    }, [searchTerm]);


  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tickets Sold
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+5</div>
              <p className="text-xs text-muted-foreground">
                +2 since last month
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Your event history
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
            <CardDescription>
              A list of events you are organizing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userEvents.map(event => (
                     <TableRow key={event.id}>
                     <TableCell>
                       <div className="font-medium">{event.title}</div>
                       <div className="hidden text-sm text-muted-foreground md:inline">
                         {event.location}
                       </div>
                     </TableCell>
                     <TableCell>
                       <Badge variant={event.isUpcoming ? 'outline' : 'destructive'}>
                        {event.isUpcoming ? `Upcoming in ${event.formattedDistance}` : 'Finished'}
                       </Badge>
                     </TableCell>
                     <TableCell className="hidden md:table-cell">
                       {event.formattedDate}
                     </TableCell>
                     <TableCell className="text-right">$2,500.00</TableCell>
                   </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPageContent />
    </Suspense>
  )
}
