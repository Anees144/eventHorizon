'use server';

import { recommendEventsBasedOnUserInterest } from '@/ai/flows/recommend-events-based-on-user-interest';
import { events, user } from '@/lib/data';
import type { Event } from '@/lib/types';

export async function getRecommendedEventsAction(): Promise<{ recommendedEvents: Event[] | null; error: string | null; }> {
  try {
    const userProfile = `The user's name is ${user.name} and they are interested in the following categories: ${user.interests.join(', ')}.`;
    const availableEvents = events.map(event => `- ${event.title}: ${event.description} (Category: ${event.category})`).join('\n');

    const result = await recommendEventsBasedOnUserInterest({
      userProfile,
      availableEvents,
    });
    
    // This is a simplified parsing logic. A more robust solution would
    // involve a more structured output from the AI model.
    const recommendedTitles = result.recommendedEvents
        .split('\n')
        .map(line => line.replace(/^-/,'').trim().split(':')[0]);

    const recommendedEvents = events.filter(event => recommendedTitles.some(title => event.title.includes(title)));

    return { recommendedEvents, error: null };
  } catch (error) {
    console.error(error);
    return { recommendedEvents: null, error: 'Failed to get recommendations. Please try again later.' };
  }
}
