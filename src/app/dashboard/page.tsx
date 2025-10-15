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
import { format, formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
    const userEvents = events.filter(e => e.organizerId === user.id);

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
                       <Badge variant={new Date(event.date) > new Date() ? 'outline' : 'destructive'}>
                        {new Date(event.date) > new Date() ? `Upcoming in ${formatDistanceToNow(new Date(event.date))}` : 'Finished'}
                       </Badge>
                     </TableCell>
                     <TableCell className="hidden md:table-cell">
                       {format(new Date(event.date), 'MMM d, yyyy')}
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
