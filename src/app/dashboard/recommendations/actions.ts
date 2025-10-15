'use server';

import { recommendEventsBasedOnUserInterest } from '@/ai/flows/recommend-events-based-on-user-interest';
import type { Event, UserProfile } from '@/lib/types';
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { initializeFirebase } from '@/firebase';


export async function getRecommendedEventsAction(allEvents: Event[]): Promise<{ recommendedEvents: Event[] | null; error: string | null; }> {
  try {
    const { auth, firestore } = initializeFirebase();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        return { recommendedEvents: null, error: "You must be logged in to get recommendations."}
    }
    
    const userDocRef = doc(firestore, 'users', currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        return { recommendedEvents: null, error: "User profile not found." };
    }
    
    const userProfileData = userDocSnap.data() as UserProfile;

    const userProfile = `The user's name is ${userProfileData.name} and they are interested in the following categories: ${userProfileData.interests.join(', ')}.`;
    const availableEvents = allEvents.map(event => `- ${event.title}: ${event.description} (Category: ${event.category})`).join('\n');

    const result = await recommendEventsBasedOnUserInterest({
      userProfile,
      availableEvents,
    });
    
    // This is a simplified parsing logic. A more robust solution would
    // involve a more structured output from the AI model.
    const recommendedTitles = result.recommendedEvents
        .split('\n')
        .map(line => line.replace(/^-/,'').trim().split(':')[0]);

    const recommendedEvents = allEvents.filter(event => recommendedTitles.some(title => event.title.includes(title)));

    return { recommendedEvents, error: null };
  } catch (error) {
    console.error(error);
    return { recommendedEvents: null, error: 'Failed to get recommendations. Please try again later.' };
  }
}
