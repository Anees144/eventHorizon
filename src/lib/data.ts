
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
        latitude: 35.6895,
        longitude: 139.6917,
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
        latitude: 37.4013,
        longitude: -122.122,
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
        latitude: 48.8566,
        longitude: 2.3522,
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
        latitude: 40.7128,
        longitude: -74.0060,
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
        latitude: 51.5074,
        longitude: -0.1278,
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
        latitude: -8.3405,
        longitude: 115.0920,
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
        latitude: 30.2672,
        longitude: -97.7431,
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
        latitude: 34.0522,
        longitude: -118.2437,
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
        latitude: 40.758,
        longitude: -73.9855,
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
        latitude: 34.043,
        longitude: -118.2673,
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
        latitude: 39.7817,
        longitude: -89.6501,
        organizer: 'Springfield Action Committee',
        organizerId: 'user-1',
        ticketTiers: [
            { id: 't11-1', name: 'Volunteer (Free)', price: 0 },
        ]
    },
    {
        id: '12',
        title: 'E-Sports Grand Finals',
        description: 'The world\'s best gamers compete for the championship title.',
        richDescription: '<p>Feel the hype at the <strong>E-Sports Grand Finals</strong>! Watch pro players display incredible skill and strategy in the most popular competitive games. Live commentary, merchandise, and more.</p>',
        imageUrl: getImage('tech conference').imageUrl,
        imageHint: 'tech conference',
        category: 'Technology',
        date: '2024-09-28T12:00:00Z',
        location: 'Seoul e-Stadium, South Korea',
        latitude: 37.505,
        longitude: 127.075,
        organizer: 'Global Gaming League',
        organizerId: 'user-2',
        ticketTiers: [
            { id: 't12-1', name: 'Floor Seats', price: 50 },
            { id: 't12-2', name: 'Stadium Seating', price: 30 }
        ]
    },
    {
        id: '13',
        title: 'Jazz Under the Stars',
        description: 'An open-air jazz concert featuring local and international artists.',
        richDescription: '<p>Relax to the smooth sounds of <strong>Jazz Under the Stars</strong>. This magical evening features a lineup of talented jazz musicians in a beautiful outdoor amphitheater. Bring a blanket and enjoy the show.</p>',
        imageUrl: getImage('music concert').imageUrl,
        imageHint: 'music concert',
        category: 'Music',
        date: '2024-08-30T19:00:00Z',
        location: 'Moonlight Amphitheater, Chicago',
        latitude: 41.8781,
        longitude: -87.6298,
        organizer: 'Chicago Jazz Society',
        organizerId: 'user-1',
        ticketTiers: [
            { id: 't13-1', name: 'Lawn Seating', price: 25 },
            { id: 't13-2', name: 'Reserved Chair', price: 45 }
        ]
    },
    {
        id: '14',
        title: 'Street Art Tour',
        description: 'A walking tour of the city\'s most vibrant street art and murals.',
        richDescription: '<p>Discover the hidden artistic gems of the city on our <strong>Street Art Tour</strong>. A local artist will guide you through alleys and streets, explaining the stories and techniques behind the incredible murals.</p>',
        imageUrl: getImage('art exhibition').imageUrl,
        imageHint: 'art exhibition',
        category: 'Art',
        date: '2024-09-07T14:00:00Z',
        location: 'Shoreditch, London',
        latitude: 51.5229,
        longitude: -0.0754,
        organizer: 'Urban Canvas Tours',
        organizerId: 'user-3',
        ticketTiers: [
            { id: 't14-1', name: 'Adult', price: 20 },
            { id: 't14-2', name: 'Student', price: 15 }
        ]
    },
    {
        id: '15',
        title: 'Gourmet Chocolate Making',
        description: 'Learn the art of chocolate making from a master chocolatier.',
        richDescription: '<p>Indulge your sweet tooth and learn a new skill at our <strong>Gourmet Chocolate Making</strong> workshop. You\'ll learn tempering, molding, and flavoring techniques to create your own delicious confections to take home.</p>',
        imageUrl: getImage('food festival').imageUrl,
        imageHint: 'food festival',
        category: 'Food',
        date: '2024-10-12T13:00:00Z',
        location: 'The Cocoa Bean, Brussels',
        latitude: 50.8503,
        longitude: 4.3517,
        organizer: 'Belgian Chocolate School',
        organizerId: 'user-1',
        ticketTiers: [
            { id: 't15-1', name: 'Workshop Fee', price: 80 }
        ]
    },
    {
        id: '16',
        title: 'Women in Leadership Conference',
        description: 'An empowering conference for women in the business world.',
        richDescription: '<p>The <strong>Women in Leadership Conference</strong> brings together leaders, entrepreneurs, and executives to share their stories, insights, and strategies for success. Network with peers and get inspired to take your career to the next level.</p>',
        imageUrl: getImage('business seminar').imageUrl,
        imageHint: 'business seminar',
        category: 'Business',
        date: '2024-11-08T09:00:00Z',
        location: 'Metropolitan Conference Center, NYC',
        latitude: 40.7549,
        longitude: -73.984,
        organizer: 'LeadHers Network',
        organizerId: 'user-2',
        ticketTiers: [
            { id: 't16-1', name: 'Early Bird', price: 250 },
            { id: 't16-2', name: 'General Admission', price: 350 }
        ]
    },
    {
        id: '17',
        title: 'Digital Detox Weekend',
        description: 'Disconnect to reconnect. A weekend getaway without screens.',
        richDescription: '<p>Join our <strong>Digital Detox Weekend</strong> to unplug from technology and reconnect with yourself, others, and nature. Activities include hiking, campfires, journaling, and group discussions. All phones and devices will be securely stored for the duration.</p>',
        imageUrl: getImage('yoga workshop').imageUrl,
        imageHint: 'yoga workshop',
        category: 'Wellness',
        date: '2024-08-23T18:00:00Z',
        location: 'Redwood National Park, California',
        latitude: 41.2132,
        longitude: -124.0046,
        organizer: 'The Unplugged Movement',
        organizerId: 'user-3',
        ticketTiers: [
            { id: 't17-1', name: 'Shared Cabin', price: 300 },
            { id: 't17-2', name: 'Private Cabin', price: 450 }
        ]
    },
    {
        id: '18',
        title: 'Beach Volleyball Tournament',
        description: 'Sun, sand, and spikes! A friendly beach volleyball competition.',
        richDescription: '<p>Get your team together for our annual <strong>Beach Volleyball Tournament</strong>. All skill levels are welcome, from beginners to seasoned players. Prizes for the winning team and a beach party to follow.</p>',
        imageUrl: getImage('sports game').imageUrl,
        imageHint: 'sports game',
        category: 'Sports',
        date: '2024-07-27T10:00:00Z',
        location: 'Santa Monica Beach, CA',
        latitude: 34.0194,
        longitude: -118.4912,
        organizer: 'SoCal Sports League',
        organizerId: 'user-4',
        ticketTiers: [
            { id: 't18-1', name: 'Team Registration (4 players)', price: 100 }
        ]
    },
    {
        id: '19',
        title: 'Neighborhood Watch Meeting',
        description: 'Discuss community safety and initiatives with your neighbors.',
        richDescription: '<p>Join your neighbors for the monthly <strong>Neighborhood Watch Meeting</strong>. We will discuss recent activity, crime prevention tips, and upcoming community events. Your participation is key to a safer neighborhood for everyone.</p>',
        imageUrl: getImage('community meetup').imageUrl,
        imageHint: 'community meetup',
        category: 'Community',
        date: '2024-08-05T19:00:00Z',
        location: 'Community Hall, Maplewood',
        latitude: 40.7303,
        longitude: -74.2757,
        organizer: 'Maplewood Safety Alliance',
        organizerId: 'user-1',
        ticketTiers: [
            { id: 't19-1', name: 'Attendance', price: 0 }
        ]
    },
    {
        id: '20',
        title: 'Laugh Riot Comedy Night',
        description: 'Get ready for a night of non-stop laughter with the city\'s best comedians.',
        richDescription: '<p><strong>Laugh Riot Comedy Night</strong> is your weekly dose of humor. Featuring a lineup of up-and-coming talent and seasoned pros, this is the perfect way to unwind and have a good time.</p>',
        imageUrl: getImage('comedy night').imageUrl,
        imageHint: 'comedy night',
        category: 'Art',
        date: '2024-10-18T20:00:00.000Z',
        location: 'The Funny Bone, Chicago',
        latitude: 41.8781,
        longitude: -87.6298,
        organizer: 'Comedy Central',
        organizerId: 'user-4',
        ticketTiers: [
            { id: 't20-1', name: 'General Admission', price: 20 }
        ]
    },
    {
        id: '21',
        title: 'An Evening with the Author',
        description: 'Join a bestselling author for a reading and Q&A session for their new novel.',
        richDescription: '<p>Don\'t miss <strong>An Evening with the Author</strong>, a special event featuring a reading from a new critically acclaimed novel, followed by an intimate Q&A session and book signing. A wonderful opportunity for book lovers to connect with a favorite writer.</p>',
        imageUrl: getImage('book reading').imageUrl,
        imageHint: 'book reading',
        category: 'Art',
        date: '2024-11-01T19:00:00.000Z',
        location: 'City Library, San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        organizer: 'Readers Hub',
        organizerId: 'user-3',
        ticketTiers: [
            { id: 't21-1', name: 'Free Entry', price: 0 }
        ]
    },
    {
        id: '22',
        title: 'Run for a Cause 5K',
        description: 'Lace up your running shoes for a charity 5K run to support local shelters.',
        richDescription: '<p>The annual <strong>Run for a Cause 5K</strong> is a fantastic way to get active while supporting a great cause. All proceeds from the race will go directly to supporting local homeless shelters. Runners and walkers of all ages and abilities are welcome.</p>',
        imageUrl: getImage('charity run').imageUrl,
        imageHint: 'charity run',
        category: 'Community',
        date: '2024-09-22T09:00:00.000Z',
        location: 'Lakeside Path, Toronto',
        latitude: 43.6532,
        longitude: -79.3832,
        organizer: 'Toronto Cares Foundation',
        organizerId: 'user-1',
        ticketTiers: [
            { id: 't22-1', name: 'Runner Registration', price: 30 }
        ]
    },
    {
        id: '23',
        title: 'Indie Film Festival',
        description: 'A showcase of groundbreaking independent films from around the world.',
        richDescription: '<p>The <strong>Indie Film Festival</strong> is back for its 10th year, celebrating the art of storytelling through film. Join us for a week of screenings, filmmaker panels, and networking events. Discover the next generation of cinematic talent.</p>',
        imageUrl: getImage('theater show').imageUrl,
        imageHint: 'theater show',
        category: 'Art',
        date: '2024-10-25T17:00:00.000Z',
        location: 'The Indieplex, Austin',
        latitude: 30.2672,
        longitude: -97.7431,
        organizer: 'Film Enthusiasts Society',
        organizerId: 'user-3',
        ticketTiers: [
            { id: 't23-1', name: 'Day Pass', price: 40 },
            { id: 't23-2', name: 'Full Festival Pass', price: 150 }
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
