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
    },
    {
        id: '7',
        title: 'Indie Rock Fest',
        description: 'Discover your new favorite indie bands at this day-long festival.',
        richDescription: '<p><strong>Indie Rock Fest</strong> is a celebration of independent music. Featuring three stages and over 20 bands, it\'s a full day of great tunes, food trucks, and good vibes.</p>',
        imageUrl: getImage('music concert').imageUrl,
        imageHint: 'music concert',
        category: 'Music',
        date: '2024-09-21T14:00:00.000Z',
        location: 'Greenfield Park, Austin',
        organizer: 'SoundWave Events',
        organizerId: 'user-1',
        ticketTiers: [
            { id: 't7-1', name: 'Early Bird', price: 40 },
            { id: 't7-2', name: 'General Admission', price: 60 },
        ]
    },
    {
        id: '8',
        title: 'Future of Web3',
        description: 'A deep dive into the decentralized web, blockchain, and NFTs.',
        richDescription: '<p>Join the brightest minds in decentralized technology at the <strong>Future of Web3</strong> conference. We will cover everything from DeFi to DAOs and the new creator economy.</p>',
        imageUrl: getImage('tech conference').imageUrl,
        imageHint: 'tech conference',
        category: 'Technology',
        date: '2024-11-12T09:00:00.000Z',
        location: 'Virtual Event',
        organizer: 'CryptoCon',
        organizerId: 'user-2',
        ticketTiers: [
            { id: 't8-1', name: 'Virtual Pass', price: 50 },
            { id: 't8-2', name: 'VIP Virtual Pass', price: 150 },
        ]
    },
    {
        id: '9',
        title: 'Night at the Theater: Hamlet',
        description: 'A modern interpretation of Shakespeare\'s classic tragedy.',
        richDescription: '<p>Experience <strong>Hamlet</strong> like never before. This production brings Shakespeare\'s timeless story of revenge, madness, and moral corruption into the 21st century with a powerful and minimalist aesthetic.</p>',
        imageUrl: getImage('theater show').imageUrl,
        imageHint: 'theater show',
        category: 'Art',
        date: '2024-08-22T19:30:00.000Z',
        location: 'The Grand Stage, New York',
        organizer: 'Modern Bard Company',
        organizerId: 'user-3',
        ticketTiers: [
            { id: 't9-1', name: 'Balcony', price: 45 },
            { id: 't9-2', name: 'Orchestra', price: 85 },
        ]
    },
    {
        id: '10',
        title: 'Championship Finals',
        description: 'Witness the climax of the season in this epic basketball showdown.',
        richDescription: '<p>The <strong>Championship Finals</strong> are here! The top two teams battle it out for glory. Expect a high-energy game with dazzling plays and a roaring crowd. Don\'t miss the action!</p>',
        imageUrl: getImage('sports game').imageUrl,
        imageHint: 'sports game',
        category: 'Sports',
        date: '2024-09-14T18:00:00.000Z',
        location: 'The Arena, Los Angeles',
        organizer: 'National Basketball League',
        organizerId: 'user-4',
        ticketTiers: [
            { id: 't10-1', name: 'Upper Bowl', price: 80 },
            { id: 't10-2', name: 'Lower Bowl', price: 250 },
            { id: 't10-3', name: 'Courtside', price: 1500 },
        ]
    },
    {
        id: '11',
        title: 'Park Cleanup & Picnic',
        description: 'Join us to beautify our local park and enjoy a community picnic afterwards.',
        richDescription: '<p>Let\'s make a difference together! At the <strong>Park Cleanup & Picnic</strong>, we\'ll spend the morning cleaning up our beloved community park. Afterwards, we\'ll celebrate our hard work with a free picnic for all volunteers.</p>',
        imageUrl: getImage('community meetup').imageUrl,
        imageHint: 'community meetup',
        category: 'Community',
        date: '2024-08-17T09:00:00.000Z',
        location: 'Central Park, Springfield',
        organizer: 'Springfield Action Committee',
        organizerId: 'user-1',
        ticketTiers: [
            { id: 't11-1', name: 'Volunteer (Free)', price: 0 },
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
