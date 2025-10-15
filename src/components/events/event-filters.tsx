
'use client';

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
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

type EventFiltersProps = {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
};

export default function EventFilters({ filters, onFilterChange, onClearFilters }: EventFiltersProps) {

  const handleCategoryChange = (value: string) => {
    onFilterChange({ category: value });
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ location: e.target.value });
  }

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    onFilterChange({ date: selectedDate });
  }
  
  const handleRadiusChange = (value: number[]) => {
    onFilterChange({ radius: value[0] });
  }
  
  const handlePriceChange = (value: number[]) => {
    onFilterChange({ price: value });
  }

  return (
    <Card className="z-10 shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-4">
           <div className="space-y-1.5">
             <Label>Category</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Select value={filters.category} onValueChange={handleCategoryChange}>
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
                  value={filters.location}
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
                    !filters.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  {filters.date?.from ? (
                    filters.date.to ? (
                      <>
                        {format(filters.date.from, "LLL dd, y")} -{" "}
                        {format(filters.date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.date.from, "LLL dd, y")
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
                  defaultMonth={filters.date?.from}
                  selected={filters.date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
           <div className="space-y-1.5 pt-1">
             <Label>Radius ({filters.radius} km)</Label>
            <Slider defaultValue={[filters.radius]} max={200} step={5} onValueChange={handleRadiusChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-[3fr_1fr]">
            <div className="space-y-1.5 pt-1">
                 <Label>Price Range (${filters.price[0]} - ${filters.price[1]})</Label>
                <Slider defaultValue={filters.price} max={500} step={10} onValueChange={handlePriceChange} />
            </div>
            <Button variant="ghost" onClick={onClearFilters} className="w-full text-muted-foreground">
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
            </Button>
        </div>

      </CardContent>
    </Card>
  );
}
