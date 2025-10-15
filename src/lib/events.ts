
'use client';

import { collection, addDoc, serverTimestamp, getDocs, getFirestore, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
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
        date: eventData.date ? new Date(eventData.date) : serverTimestamp(),
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
            date: data.date.toDate().toISOString(), // Convert Firestore Timestamp to ISO string
        } as Event;
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
        return {
            ...data,
            id: doc.id,
            // Convert Firestore Timestamp to ISO string to ensure serializability
            date: data.date?.toDate ? data.date.toDate().toISOString() : new Date().toISOString(),
        } as Event;
    });
}

// Seeding function
export async function seedInitialEvents() {
    const promises = initialEvents.map(event => {
        // Since we are creating a new object, we can safely remove the 'id' property
        const { id, ...eventData } = event;
        return addDoc(eventsCollection, {
            ...eventData,
            date: new Date(eventData.date)
        });
    });
    await Promise.all(promises);
}
