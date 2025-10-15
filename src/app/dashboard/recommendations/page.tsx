'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getRecommendedEventsAction from './actions';
import { EventCard } from '@/components/events/event-card';
import type { Event } from '@/lib/types';
import { getEvents } from '@/lib/events';

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Event[] | null>(null);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setLoading(true);
    setRecommendations(null);
    try {
      const allEvents = await getEvents();
      const result = await getRecommendedEventsAction(allEvents);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        setRecommendations(result.recommendedEvents);
      }
    } catch(e) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch events for recommendations.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Find Your Next Event</CardTitle>
          <CardDescription>
            Let our AI assistant recommend events based on your interests.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Button onClick={handleGetRecommendations} disabled={loading} size="lg">
            <Sparkles className="mr-2 h-5 w-5" />
            {loading ? 'Thinking...' : 'Get Recommendations'}
          </Button>

          {loading && (
            <div className="grid w-full grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4 rounded-lg border p-4">
                    <div className="h-40 animate-pulse rounded-md bg-muted" />
                    <div className="space-y-2">
                        <div className="h-4 w-2/3 animate-pulse bg-muted" />
                        <div className="h-4 w-full animate-pulse bg-muted" />
                        <div className="h-4 w-full animate-pulse bg-muted" />
                    </div>
                </div>
              ))}
            </div>
          )}
          
          {recommendations && recommendations.length > 0 && (
            <div className="w-full pt-8">
                <h2 className="mb-6 text-center font-headline text-2xl font-semibold">Here are some events you might like:</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendations.map((event) => (
                        <EventCard key={event.id} event={event} onCompareChange={() => {}} isComparing={false} />
                    ))}
                </div>
            </div>
          )}

          {recommendations && recommendations.length === 0 && !loading && (
             <div className="pt-8 text-center text-muted-foreground">
                <p>We couldn't find any recommendations right now. Try expanding your interests!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
