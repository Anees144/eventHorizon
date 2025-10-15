import type { Event, User } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (hint: string) => {
    return PlaceHolderImages.find(img => img.imageHint.includes(hint)) || PlaceHolderImages[0];
}

export const user: User = {
    id: 'user-1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatarUrl: getImage('user avatar').imageUrl,
    avatarHint: getImage('user avatar').imageHint,
    interests: ['Music', 'Technology', 'Art']
};

export const events: Event[] = [
    {
        id: '1',
        title: 'Synthwave Night',
        description: 'Dive into the retro-futuristic sounds of synthwave with top DJs.',
        richDescription: '<p>Join us for an electrifying night of retro-futuristic sounds. <strong>Synthwave Night</strong> brings together the best DJs in the genre for an unforgettable audio-visual experience. Expect neon lights, classic arcade games, and a dance floor that won\'t quit.</p><p>Dress in your best 80s attire and get ready to travel back to the future.</p>',
        imageUrl: getImage('music concert').imageUrl,
        imageHint: getImage('music concert').imageHint,
        category: 'Music',
        date: '2024-08-15T20:00:00.000Z',
        location: 'Cyber City, Neo-Tokyo',
        organizer: 'RetroWave Productions',
        organizerId: 'user-1',
        ticketTiers: [
            { id: 't1-1', name: 'General Admission', price: 25 },
            { id: 't1-2', name: 'VIP Access', price: 75 },
        ]
    },
    {
        id: '2',
        title: 'AI Innovators Summit 2024',
        description: 'Explore the future of Artificial Intelligence with industry leaders.',
        richDescription: '<p>The <strong>AI Innovators Summit</strong> is a premier event for developers, researchers, and entrepreneurs in the AI space. This year, we focus on the impact of generative AI on creativity and business.</p><ul><li>Keynotes from industry pioneers</li><li>Hands-on workshops</li><li>Networking sessions</li></ul>',
        imageUrl: getImage('tech conference').imageUrl,
        imageHint: getImage('tech conference').imageHint,
        category: 'Technology',
        date: '2024-09-10T09:00:00.000Z',
        location: 'Innovation Hall, Silicon Valley',
        organizer: 'TechForward',
        organizerId: 'user-2',
        ticketTiers: [
            { id: 't2-1', name: 'Student Pass', price: 100 },
            { id: 't2-2', name: 'Full Access', price: 400 },
            { id: 't2-3', name: 'Corporate Pass', price: 1200 },
        ]
    },
    {
        id: '3',
        title: 'Colors of Tomorrow',
        description: 'An immersive art exhibition showcasing digital and traditional media.',
        richDescription: '<p><strong>Colors of Tomorrow</strong> is an art exhibition that blurs the lines between the physical and digital worlds. Featuring works from over 30 international artists, this gallery explores themes of nature, identity, and the future.</p><p>Interactive installations and VR experiences will be available.</p>',
        imageUrl: getImage('art exhibition').imageUrl,
        imageHint: getImage('art exhibition').imageHint,
        category: 'Art',
        date: '2024-07-20T10:00:00.000Z',
        location: 'The Modern Gallery, Paris',
        organizer: 'ArtConnect',
        organizerId: 'user-3',
        ticketTiers: [
            { id: 't3-1', name: 'Single Entry', price: 15 },
        ]
    },
    {
        id: '4',
        title: 'Global Bites Festival',
        description: 'Taste the world in one place. A festival for all food lovers.',
        richDescription: '<p>Embark on a culinary journey at the <strong>Global Bites Festival</strong>. With over 50 food trucks and stalls, you can savor dishes from every corner of the globe. Live music and family-friendly activities make this a perfect day out.</p>',
        imageUrl: getImage('food festival').imageUrl,
        imageHint: getImage('food festival').imageHint,
        category: 'Food',
        date: '2024-08-03T11:00:00.000Z',
        location: 'Waterfront Park, New York',
        organizer: 'TasteMakers Inc.',
        organizerId: 'user-1',
        ticketTiers: [
            { id: 't4-1', name: 'Entry', price: 10 },
            { id: 't4-2', name: 'Tasting Passport', price: 50 },
        ]
    },
    {
        id: '5',
        title: 'The Startup Pitch Battle',
        description: 'Watch the next generation of entrepreneurs compete for funding.',
        richDescription: '<p>The annual <strong>Startup Pitch Battle</strong> is back! Witness the most innovative startups pitch their ideas to a panel of venture capitalists. The winner takes home a grand prize to kickstart their business. A must-attend for aspiring entrepreneurs and investors.</p>',
        imageUrl: getImage('business seminar').imageUrl,
        imageHint: getImage('business seminar').imageHint,
        category: 'Business',
        date: '2024-10-05T18:00:00.000Z',
        location: 'The Enterprise Hub, London',
        organizer: 'Innovate UK',
        organizerId: 'user-2',
        ticketTiers: [
            { id: 't5-1', name: 'Spectator', price: 20 },
            { id: 't5-2', name: 'Investor Access', price: 150 },
        ]
    },
    {
        id: '6',
        title: 'Mindfulness & Yoga Retreat',
        description: 'A weekend of peace, meditation, and rejuvenation.',
        richDescription: '<p>Escape the hustle and bustle with our <strong>Mindfulness & Yoga Retreat</strong>. Set in the serene countryside, this weekend retreat offers guided meditation, vinyasa flow yoga, and workshops on mindful living. All levels welcome.</p>',
        imageUrl: getImage('yoga workshop').imageUrl,
        imageHint: getImage('yoga workshop').imageHint,
        category: 'Wellness',
        date: '2024-09-27T16:00:00.000Z',
        location: 'Serenity Gardens, Bali',
        organizer: 'ZenLife',
        organizerId: 'user-3',
        ticketTiers: [
            { id: 't6-1', name: 'All-Inclusive Weekend', price: 500 },
        ]
    }
];

export const categories = [
    'Music',
    'Technology',
    'Art',
    'Food',
    'Business',
    'Wellness',
    'Sports',
    'Community'
];
