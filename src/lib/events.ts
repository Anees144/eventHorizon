
'use client';

import { collection, addDoc, getDocs, getFirestore, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Event } from './types';
import { initialEvents } from './data';

const { firestore } = initializeFirebase();
const eventsCollection = collection(firestore, 'events');

export async function createEvent(eventData: Omit<Event, 'id' | 'date'> & { date: Date | undefined }): Promise<string> {
    if (!eventData.organizerId) {
        throw new Error("User must be logged in to create an event.");
    }

    const dataToSave: { [key: string]: any } = {
        title: eventData.title,
        description: eventData.description,
        richDescription: eventData.richDescription,
        category: eventData.category,
        location: eventData.location,
        imageUrl: eventData.imageUrl,
        imageHint: eventData.imageHint,
        visibility: eventData.visibility,
        date: eventData.date ? eventData.date.toISOString() : new Date().toISOString(),
        ticketTiers: eventData.ticketTiers,
        promoCodes: eventData.promoCodes,
        organizerId: eventData.organizerId,
        organizer: eventData.organizer,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
    };
    
    if (eventData.videoUrl && eventData.videoUrl.trim() !== '') {
      dataToSave.videoUrl = eventData.videoUrl;
    }
    
    if (eventData.tags && eventData.tags.length > 0) {
      dataToSave.tags = eventData.tags;
    }


    const docRef = await addDoc(eventsCollection, dataToSave);
    return docRef.id;
}


export async function getEvents(): Promise<Event[]> {
  const snapshot = await getDocs(query(eventsCollection, orderBy('date', 'asc')));
  
  if (snapshot.empty) {
    console.log("No events found in Firestore, seeding initial data...");
    await seedInitialEvents();
    const seededSnapshot = await getDocs(query(eventsCollection, orderBy('date', 'asc')));
    return processSnapshot(seededSnapshot);
  }
  
  return processSnapshot(snapshot);
}


export async function getEventById(id: string): Promise<Event | null> {
    const docRef = doc(firestore, 'events', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const eventData = {
            ...data,
            id: docSnap.id,
        } as Event;
        
        // Ensure date is an ISO string
        const dateValue = data.date;
        if (dateValue && typeof dateValue.toDate === 'function') {
            eventData.date = dateValue.toDate().toISOString();
        } else if (dateValue instanceof Date) {
            eventData.date = dateValue.toISOString();
        } else {
            eventData.date = dateValue;
        }

        return eventData;
    } else {
        return null;
    }
}


export async function getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    const q = query(eventsCollection, where('organizerId', '==', organizerId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return processSnapshot(snapshot);
}

function processSnapshot(snapshot: any): Event[] {
    return snapshot.docs.map((doc: any) => {
        const data = doc.data();
        const dateValue = data.date;
        let isoDate: string;

        if (dateValue && typeof dateValue.toDate === 'function') {
            // It's a Firestore Timestamp
            isoDate = dateValue.toDate().toISOString();
        } else if (typeof dateValue === 'string') {
            // It's already an ISO string
            isoDate = dateValue;
        } else if (dateValue instanceof Date) {
            // It's a JavaScript Date object
            isoDate = dateValue.toISOString();
        } else {
            // Fallback for unexpected types
            isoDate = new Date().toISOString();
        }

        return {
            ...data,
            id: doc.id,
            date: isoDate,
        } as Event;
    });
}

// Seeding function
export async function seedInitialEvents() {
    const promises = initialEvents.map(event => {
        // Since we are creating a new object, we can safely remove the 'id' property
        const { id, ...eventData } = event;
        // The initial data already has dates as ISO strings, so no conversion needed here.
        return addDoc(eventsCollection, eventData);
    });
    await Promise.all(promises);
}
