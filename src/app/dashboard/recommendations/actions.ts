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
        return { recommendedEvents: null, error: "User profile not found. Please complete your profile first." };
    }
    
    const userProfileData = userDocSnap.data() as UserProfile;

    if (!userProfileData.interests || userProfileData.interests.length === 0) {
        return { recommendedEvents: null, error: "Please add some interests to your profile to get recommendations."}
    }

    const userProfile = `The user's name is ${userProfileData.name} and they are interested in the following categories: ${userProfileData.interests.join(', ')}.`;
    const availableEvents = allEvents.map(event => `- ${event.title}: ${event.description} (Category: ${event.category})`).join('\n');

    const result = await recommendEventsBasedOnUserInterest({
      userProfile,
      availableEvents,
    });
    
    const recommendedTitles = result.recommendedEvents;

    const recommendedEvents = allEvents.filter(event => recommendedTitles.some(title => event.title.includes(title)));

    return { recommendedEvents, error: null };
  } catch (error) {
    console.error(error);
    return { recommendedEvents: null, error: 'Failed to get recommendations. Please try again later.' };
  }
}
