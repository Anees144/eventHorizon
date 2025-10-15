'use client';

import { Calendar as CalendarIcon, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';

import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '../ui/card';

export default function EventFilters() {
  return (
    <Card className="z-10 shadow-lg">
        <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Select>
                        <SelectTrigger className="w-full pl-9">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category.toLowerCase()}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Location" className="pl-9" />
                </div>
                <div className="relative">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    'w-full justify-start text-left font-normal pl-9',
                                    !Date && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <span>Pick a date</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Find Events</Button>
            </div>
        </CardContent>
    </Card>
  );
}
