

'use client';

import Link from "next/link"
import { useState } from "react"
import {
  ChevronLeft,
  PlusCircle,
  Upload,
  Trash2,
  CalendarDays,
  MapPin,
  Ticket,
  Eye,
  Star,
  UserPlus,
  Youtube,
  Tag
} from "lucide-react"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import Image from "next/image"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { VideoEmbed } from "@/components/events/video-embed";


export default function CreateEventPage() {
  const [title, setTitle] = useState('Synthwave Night');
  const [description, setDescription] = useState('Dive into the retro-futuristic sounds of synthwave with top DJs.');
  const [richDescription, setRichDescription] = useState('<p>Join us for an electrifying night of retro-futuristic sounds. <strong>Synthwave Night</strong> brings together the best DJs in the genre for an unforgettable audio-visual experience.</p>');
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState('Cyber City, Neo-Tokyo');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/1/600/400');
  const [imageHint, setImageHint] = useState('music concert');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [tags, setTags] = useState('#synthwave, #80s, #retro, #music');

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [ticketTiers, setTicketTiers] = useState<Partial<TicketTier>[]>([
    { id: 't1-1', name: 'General Admission', type: 'paid', price: 25 },
    { id: 't1-2', name: 'VIP Access', type: 'paid', price: 75 },
  ]);
  const [promoCodes, setPromoCodes] = useState<Partial<PromoCode>[]>([
    { code: 'EARLYBIRD10', discountPercentage: 10 },
  ]);
  const [selectedTier, setSelectedTier] = useState<Partial<TicketTier> | null>(ticketTiers.length > 0 ? ticketTiers[0] : null);

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

  const getButtonText = () => {
    if (!selectedTier) return "Select a ticket";
    switch (selectedTier.type) {
      case 'paid':
        return `Checkout - $${selectedTier.price?.toFixed(2) || '0.00'}`;
      case 'reservation':
        return 'Reserve Spot';
      case 'donation':
        return 'Make a Donation';
      default:
        return 'Get Tickets';
    }
  }
  
  const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

  return (
    <div className="flex-1 items-start">
      <div className="flex items-center justify-between gap-4 pb-4">
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
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
            Discard
            </Button>
            <Button size="sm">Save Event</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-8">
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
                        placeholder="Event Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description">Description (Simple)</Label>
                        <Textarea
                        id="description"
                        placeholder="A short and catchy description."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-24"
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="rich-description">Description (Rich Text)</Label>
                        <Textarea
                        id="rich-description"
                        placeholder="Use rich text to describe your event in detail. You can use HTML tags like <p>, <strong>, <ul> etc."
                        value={richDescription}
                        onChange={(e) => setRichDescription(e.target.value)}
                        className="min-h-32"
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="video-url">Promotional Video</Label>
                        <div className="relative">
                        <Youtube className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="video-url"
                            type="url"
                            className="w-full pl-9"
                            placeholder="e.g. https://www.youtube.com/watch?v=..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="tags">Tags</Label>
                         <div className="relative">
                            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="tags"
                                type="text"
                                className="w-full pl-9"
                                placeholder="e.g. #synthwave, #80s, #retro"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Date, Venue & Category</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                 <div className="grid gap-3">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="grid gap-3">
                    <Label htmlFor="location">Venue / Location</Label>
                    <Input
                    id="location"
                    type="text"
                    className="w-full"
                    placeholder="e.g. Cyber City, Neo-Tokyo"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" aria-label="Select category">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                    </Select>
                </div>
                </div>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Ticket Tiers</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Tier Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ticketTiers.map((tier, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-semibold">
                                <Input value={tier.name} onChange={(e) => handleTierChange(index, 'name', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <Select value={tier.type} onValueChange={(value) => handleTierChange(index, 'type', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="reservation">Reservation</SelectItem>
                                        <SelectItem value="donation">Donation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Input type="number" value={tier.price} onChange={(e) => handleTierChange(index, 'price', parseFloat(e.target.value))} disabled={tier.type !== 'paid'}/>
                            </TableCell>
                            <TableCell>
                                <Button aria-label="Delete" variant="outline" size="icon" onClick={() => removeTier(index)}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="justify-center border-t p-4">
                <Button size="sm" variant="ghost" className="gap-1" onClick={addTier}><PlusCircle className="h-3.5 w-3.5" />Add Tier</Button>
            </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Promo Codes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount (%)</TableHead>
                         <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {promoCodes.map((code, index) => (
                            <TableRow key={index}>
                                <TableCell><Input value={code.code} onChange={(e) => handlePromoCodeChange(index, 'code', e.target.value)}/></TableCell>
                                <TableCell><Input type="number" value={code.discountPercentage} onChange={(e) => handlePromoCodeChange(index, 'discountPercentage', parseInt(e.target.value))}/></TableCell>
                                <TableCell><Button aria-label="Delete" variant="outline" size="icon" onClick={() => removePromoCode(index)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                            </TableRow>
                       ))}
                    </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter className="justify-center border-t p-4">
                    <Button size="sm" variant="ghost" className="gap-1" onClick={addPromoCode}><PlusCircle className="h-3.5 w-3.5" />Add Promo Code</Button>
                </CardFooter>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Event Banner & Gallery</CardTitle>
                    <CardDescription>
                        Upload a banner and gallery images for your event.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div>
                            <Label className="mb-2 block">Banner Image</Label>
                            <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border">
                                <Image
                                    alt="Event Banner"
                                    className="object-cover"
                                    fill
                                    src={imageUrl}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                             <Label>Gallery</Label>
                            <div className="grid grid-cols-4 items-center gap-2">
                                {['https://picsum.photos/seed/11/84/84', 'https://picsum.photos/seed/12/84/84', 'https://picsum.photos/seed/13/84/84'].map(src => (
                                    <button key={src} className="relative aspect-square w-full rounded-md overflow-hidden" onClick={() => setImageUrl(src.replace('/84/84','/600/400'))}>
                                        <Image alt="Gallery thumbnail" fill className="object-cover" src={src} />
                                    </button>
                                ))}
                                <Button variant="outline" className="flex aspect-square w-full items-center justify-center rounded-md border-dashed">
                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                    <span className="sr-only">Upload</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        {/* Preview Section */}
        <div className="space-y-8 sticky top-24 self-start">
            <h2 className="font-headline text-2xl font-bold">Live Preview</h2>
            <div className="relative h-[250px] w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint={imageHint}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="container relative flex h-full flex-col items-start justify-end px-4 py-6 text-primary-foreground md:px-6">
                <Badge variant="secondary" className="mb-2 bg-secondary/80 text-secondary-foreground">{category}</Badge>
                <h1 className="font-headline text-4xl font-bold tracking-tighter">
                  {title}
                </h1>
              </div>
            </div>

            <div className="p-4 md:p-6 grid gap-8">
              <div>
                <h2 className="font-headline text-xl font-bold">About this event</h2>
                 {videoUrl && <VideoEmbed url={videoUrl} className="mt-4" />}
                <div
                  className="prose prose-sm mt-4 max-w-none text-foreground/90"
                  dangerouslySetInnerHTML={{ __html: richDescription }}
                />
                 <div className="mt-4 flex flex-wrap gap-2">
                    {tagList.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                    <CardHeader>
                    <CardTitle className="font-headline text-base">Date and Time</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{date ? format(date, 'EEEE, MMMM d, yyyy') : 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{location}</span>
                    </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center gap-2"><Ticket /> Get Your Tickets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup defaultValue={ticketTiers[0]?.id} onValueChange={(id) => setSelectedTier(ticketTiers.find(t => t.id === id) || null)}>
                            {ticketTiers.map(tier => (
                                <div key={tier?.id} className="flex items-center justify-between">
                                    <Label htmlFor={tier?.id} className="flex items-center gap-3 cursor-pointer">
                                        <RadioGroupItem value={tier?.id || ''} id={tier?.id} />
                                        <div className="grid gap-0.5">
                                            <span className="font-semibold">{tier?.name}</span>
                                             {tier?.type === 'donation' && <span className="text-xs text-muted-foreground">Pay what you want</span>}
                                             {tier?.type === 'reservation' && <span className="text-xs text-muted-foreground">Free reservation</span>}
                                        </div>
                                    </Label>
                                    {tier?.type === 'paid' && <span className="font-semibold">${tier?.price?.toFixed(2)}</span>}
                                </div>
                            ))}
                        </RadioGroup>
                        
                        {selectedTier?.type === 'donation' && (
                            <div className="grid gap-2">
                                <Label htmlFor='donation-amount-preview'>Donation Amount</Label>
                                <Input id="donation-amount-preview" type="number" placeholder="Enter amount" />
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
        </div>
      </div>
    </div>
  )
}
