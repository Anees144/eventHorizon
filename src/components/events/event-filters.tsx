'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Tag, X, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

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
import { useRouter, useSearchParams } from 'next/navigation';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

type EventFiltersProps = {
  onFilterChange: (filters: FilterState) => void;
};

export default function EventFilters({ onFilterChange }: EventFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState(searchParams.get('category') ?? 'all');
  const [location, setLocation] = useState(searchParams.get('location') ?? '');
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (from && to) {
      return { from: new Date(from), to: new Date(to) };
    }
    return undefined;
  });
  const [radius, setRadius] = useState(Number(searchParams.get('radius')) || 50);
  const [price, setPrice] = useState<number[]>([0, 500]);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    onFilterChange({
        category,
        location,
        date,
        search,
        radius,
        price,
    })
  }, [category, location, date, search, radius, price, onFilterChange]);

  const updateQueryParam = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== null && value !== 'all' && value.toString().length > 0) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    return params;
  }
  
  const updateDateQueryParams = (dateRange: DateRange | undefined) => {
    let params = new URLSearchParams(searchParams.toString());
    if (dateRange?.from) {
      params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
    } else {
      params.delete('from');
    }
    if (dateRange?.to) {
      params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
    } else {
      params.delete('to');
    }
    router.push(`?${params.toString()}`);
  };


  const handleCategoryChange = (value: string) => {
    setCategory(value);
    router.push(`?${updateQueryParam('category', value).toString()}`);
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    router.push(`?${updateQueryParam('location', value).toString()}`);
  }

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    updateDateQueryParams(selectedDate);
  }
  
  const handleRadiusChange = (value: number[]) => {
    setRadius(value[0]);
    router.push(`?${updateQueryParam('radius', value[0]).toString()}`);
  }
  
  const handlePriceChange = (value: number[]) => {
    setPrice(value);
    // Note: We are not updating URL for price for now to keep it clean.
  }

  const handleClearFilters = () => {
    setCategory('all');
    setLocation('');
    setDate(undefined);
    setRadius(50);
    setPrice([0, 500]);
    setSearch('');
    router.push('?');
  }

  return (
    <Card className="z-10 shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-4">
           <div className="space-y-1.5">
             <Label>Category</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category-select" className="w-full pl-9">
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
          </div>
          <div className="space-y-1.5">
             <Label>Location</Label>
             <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                  id="location-input"
                  placeholder="Location" 
                  className="pl-9"
                  value={location}
                  onChange={handleLocationChange}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal pl-9",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
           <div className="space-y-1.5 pt-1">
             <Label>Radius ({radius} km)</Label>
            <Slider defaultValue={[radius]} max={200} step={5} onValueChange={handleRadiusChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-[3fr_1fr]">
            <div className="space-y-1.5 pt-1">
                 <Label>Price Range (${price[0]} - ${price[1]})</Label>
                <Slider defaultValue={price} max={500} step={10} onValueChange={handlePriceChange} />
            </div>
            <Button variant="ghost" onClick={handleClearFilters} className="w-full text-muted-foreground">
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
            </Button>
        </div>

      </CardContent>
    </Card>
  );
}
