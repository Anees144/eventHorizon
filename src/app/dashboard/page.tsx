'use client';
import Link from "next/link"
import {
  ArrowUpRight,
  CalendarClock,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

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
import { format, formatDistanceToNow, parseISO } from "date-fns"
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Event } from "@/lib/types";
import { getEventsByOrganizer } from "@/lib/events";
import { useUser } from "@/firebase";

type EventWithFormattedDate = Event & {
    formattedDate: string;
    formattedDistance: string;
    isUpcoming: boolean;
};

const revenueData = [
    { month: "Jan", revenue: 4500 },
    { month: "Feb", revenue: 4200 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 3800 },
    { month: "May", revenue: 6200 },
    { month: "Jun", revenue: 5800 },
];

function DashboardPageContent() {
    const searchParams = useSearchParams();
    const { user, isUserLoading } = useUser();
    const [userEvents, setUserEvents] = useState<EventWithFormattedDate[]>([]);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSearchTerm(searchParams.get('search') ?? '');
    }, [searchParams]);

    useEffect(() => {
        async function fetchUserEvents() {
            if (user) {
                setLoading(true);
                const eventsFromDb = await getEventsByOrganizer(user.uid);
                
                const searchLower = searchTerm.toLowerCase();
                const processedEvents = eventsFromDb
                    .filter(e => {
                        if (!searchTerm) return true;
                        return e.title.toLowerCase().includes(searchLower) ||
                               e.description.toLowerCase().includes(searchLower) ||
                               e.organizer.toLowerCase().includes(searchLower);
                    })
                    .map(event => {
                        const eventDate = parseISO(event.date as string);
                        return {
                            ...event,
                            formattedDate: format(eventDate, 'MMM d, yyyy'),
                            isUpcoming: eventDate > new Date(),
                            formattedDistance: formatDistanceToNow(eventDate, { addSuffix: true }),
                        };
                    });
                setUserEvents(processedEvents);
                setLoading(false);
            } else if (!isUserLoading) {
                setLoading(false);
            }
        }
        fetchUserEvents();
    }, [searchTerm, user, isUserLoading]);

    const { totalRevenue, ticketsSold, activeEventsCount } = useMemo(() => {
        let revenue = 0;
        let tickets = 0;
        let active = 0;
        
        userEvents.forEach(event => {
            const eventRevenue = event.ticketTiers.reduce((acc, tier) => acc + tier.price * 50, 0); // Assume 50 tickets sold per tier
            const eventTickets = event.ticketTiers.length * 50;
            revenue += eventRevenue;
            tickets += eventTickets;
            if (event.isUpcoming) {
                active++;
            }
        });
        return {
            totalRevenue: revenue,
            ticketsSold: tickets,
            activeEventsCount: active
        };
    }, [userEvents]);

    if (loading) {
        return <div>Loading dashboard...</div>
    }


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
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From all your events
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
              <div className="text-2xl font-bold">+{ticketsSold.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all events
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{activeEventsCount}</div>
              <p className="text-xs text-muted-foreground">
                Your upcoming events
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
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
                        <Badge variant={event.isUpcoming ? 'outline' : 'secondary'}>
                            {event.isUpcoming ? `Upcoming ${event.formattedDistance}` : 'Finished'}
                        </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        {event.formattedDate}
                        </TableCell>
                        <TableCell className="text-right">${(event.ticketTiers.reduce((acc, tier) => acc + tier.price * 50, 0)).toLocaleString()}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>A summary of your earnings over the past 6 months.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
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
