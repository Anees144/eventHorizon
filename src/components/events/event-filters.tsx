'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Search, Tag, X } from 'lucide-react';
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
import type { FilterState } from '@/lib/types';

type EventFiltersProps = {
  onFilterChange: (filters: FilterState) => void;
};

export default function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    onFilterChange({
        category,
        location,
        date: date ?? null,
    })
  }, [category, location, date, onFilterChange]);
  
  const handleClearFilters = () => {
    setCategory('all');
    setLocation('');
    setDate(undefined);
  }

  return (
    <Card className="z-10 shadow-lg">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_auto_auto]">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full pl-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
            <Input 
                placeholder="Location" 
                className="pl-9"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal pl-9',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Find Events
          </Button>
           <Button variant="ghost" onClick={handleClearFilters} className="w-full text-muted-foreground md:w-auto">
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
