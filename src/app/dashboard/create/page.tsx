'use client';

import Link from "next/link"
import { useState } from "react"
import {
  ChevronLeft,
  PlusCircle,
  Upload,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { categories } from "@/lib/data"
import type { TicketTier, PromoCode } from "@/lib/types";


export default function CreateEventPage() {
  const [date, setDate] = useState<Date>()
  const [ticketTiers, setTicketTiers] = useState<Partial<TicketTier>[]>([
    { name: 'General Admission', type: 'paid', price: 25 },
    { name: 'VIP Access', type: 'paid', price: 75 },
    { name: 'Free Reservation', type: 'reservation', price: 0 },
  ]);
  const [promoCodes, setPromoCodes] = useState<Partial<PromoCode>[]>([
    { code: 'EARLYBIRD10', discountPercentage: 10 },
  ]);

  const addTier = () => {
    setTicketTiers([...ticketTiers, { name: '', type: 'paid', price: 0 }]);
  };

  const removeTier = (index: number) => {
    setTicketTiers(ticketTiers.filter((_, i) => i !== index));
  };
  
  const handleTierChange = (index: number, field: keyof TicketTier, value: any) => {
    const updatedTiers = [...ticketTiers];
    const tier = updatedTiers[index];
    if (tier) {
        (tier[field] as any) = value;
        if(field === 'type' && value !== 'paid') {
            tier.price = 0;
        }
    }
    setTicketTiers(updatedTiers);
  };
  
  const addPromoCode = () => {
    setPromoCodes([...promoCodes, { code: '', discountPercentage: 0 }]);
  };

  const removePromoCode = (index: number) => {
    setPromoCodes(promoCodes.filter((_, i) => i !== index));
  };

  const handlePromoCodeChange = (index: number, field: keyof PromoCode, value: any) => {
      const updatedPromoCodes = [...promoCodes];
      const promoCode = updatedPromoCodes[index];
      if (promoCode) {
        (promoCode[field] as any) = value;
      }
      setPromoCodes(updatedPromoCodes);
  };

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
        <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
            <Link href="/dashboard">
                <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
                Create New Event
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                Discard
                </Button>
                <Button size="sm">Save Event</Button>
            </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                    <CardDescription>
                    Fill in the basic information for your event.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Title</Label>
                        <Input
                        id="name"
                        type="text"
                        className="w-full"
                        defaultValue="Synthwave Night"
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description">Description (Simple)</Label>
                        <Textarea
                        id="description"
                        defaultValue="Dive into the retro-futuristic sounds of synthwave with top DJs."
                        className="min-h-24"
                        />
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="description-rich">Description (Rich Text)</Label>
                        <Textarea
                        id="description-rich"
                        defaultValue="<p>Join us for an electrifying night of retro-futuristic sounds. <strong>Synthwave Night</strong> brings together the best DJs in the genre for an unforgettable audio-visual experience.</p>"
                        className="min-h-32"
                        />
                    </div>
                    </div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>Ticket Tiers</CardTitle>
                    <CardDescription>
                    Define pricing levels and types for your event tickets.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Tier Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ticketTiers.map((tier, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-semibold">
                                    <Input 
                                        value={tier.name}
                                        onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Select 
                                        value={tier.type}
                                        onValueChange={(value) => handleTierChange(index, 'type', value)}
                                    >
                                        <SelectTrigger aria-label="Select type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="reservation">Reservation</SelectItem>
                                            <SelectItem value="donation">Donation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Label htmlFor={`price-${index}`} className="sr-only">Price</Label>
                                    <Input 
                                        id={`price-${index}`} 
                                        type="number" 
                                        value={tier.price}
                                        onChange={(e) => handleTierChange(index, 'price', parseFloat(e.target.value))}
                                        disabled={tier.type !== 'paid'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button aria-label="Delete" variant="outline" size="icon" onClick={() => removeTier(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                    <Button size="sm" variant="ghost" className="gap-1" onClick={addTier}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Tier
                    </Button>
                </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Promo Codes</CardTitle>
                        <CardDescription>
                        Create promotional codes to offer discounts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Discount (%)</TableHead>
                             <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {promoCodes.map((code, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input 
                                            value={code.code}
                                            onChange={(e) => handlePromoCodeChange(index, 'code', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            value={code.discountPercentage}
                                            onChange={(e) => handlePromoCodeChange(index, 'discountPercentage', parseInt(e.target.value))}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button aria-label="Delete" variant="outline" size="icon" onClick={() => removePromoCode(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                           ))}
                        </TableBody>
                        </Table>
                    </CardContent>
                     <CardFooter className="justify-center border-t p-4">
                        <Button size="sm" variant="ghost" className="gap-1" onClick={addPromoCode}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        Add Promo Code
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card>
                <CardHeader>
                    <CardTitle>Category & Date</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                        <SelectTrigger
                            id="category"
                            aria-label="Select category"
                        >
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-3">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="name">Location</Label>
                        <Input
                        id="location"
                        type="text"
                        className="w-full"
                        defaultValue="Cyber City, Neo-Tokyo"
                        />
                    </div>
                    </div>
                </CardContent>
                </Card>
                <Card
                className="overflow-hidden"
                >
                <CardHeader>
                    <CardTitle>Event Image</CardTitle>
                    <CardDescription>
                    Upload a high-quality image for your event.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                    <img
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        src="https://picsum.photos/seed/1/300/300"
                        width="300"
                    />
                    <div className="grid grid-cols-3 items-center gap-2">
                        <button>
                        <img
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src="https://picsum.photos/seed/11/84/84"
                            width="84"
                        />
                        </button>
                        <button>
                        <img
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src="https://picsum.photos/seed/12/84/84"
                            width="84"
                        />
                        </button>
                        <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                        </button>
                    </div>
                    </div>
                </CardContent>
                </Card>
            </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
                Discard
            </Button>
            <Button size="sm">Save Product</Button>
            </div>
        </div>
    </div>
  )
}
