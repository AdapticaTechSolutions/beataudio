import type { Service, EventType, Package, PortfolioItem, Booking } from './types';
import { LightIcon, SoundIcon, LedWallIcon, TrussIcon, SmokeIcon, ProjectorIcon } from './components/icons';

export const SERVICES: Service[] = [
  { name: 'Lighting', icon: LightIcon },
  { name: 'Sound Systems', icon: SoundIcon },
  { name: 'LED Walls', icon: LedWallIcon },
  { name: 'Trusses & Rigging', icon: TrussIcon },
  { name: 'Smoke & Effects', icon: SmokeIcon },
  { name: 'Projectors', icon: ProjectorIcon },
];

export const EVENT_TYPES: EventType[] = [
  { name: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 1/571175692_1398540528938547_5239243637261797162_n.jpg' },
  { name: 'Corporate', image: '/photos/Corporate/TASKUS.jpg' },
  { name: 'Kiddie Parties', image: '/photos/Kiddie/565710449_1392539449538655_6346928700467358881_n.jpg' },
  { name: 'Debuts', image: '/photos/Wedding/Tagaytay/Wedding 2/571154389_1395347699257830_3254642409205276693_n.jpg' },
  { name: 'Festivals', image: '/photos/Wedding/Tagaytay/October/573622897_1401393865319880_3446976281434024146_n.jpg' },
  { name: 'Live Bands', image: '/photos/Wedding/Tagaytay/Wedding 2/570250651_1395348172591116_5351188878399276855_n.jpg' },
];

export const PACKAGES: Package[] = [
  {
    name: 'Elegant Wedding Package',
    description: 'Breathtaking lights and crystal-clear audio for your special day.',
    priceRange: '₱25,000 - ₱50,000',
    inclusions: ['Full Venue Uplighting', 'Pro DJ Sound System', 'Wireless Microphones', 'Gobo Projector'],
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1770&auto=format&fit=crop',
    badge: 'Most Popular',
  },
  {
    name: 'Corporate Summit Pro',
    description: 'Professional AV setup for seamless presentations and conferences.',
    priceRange: '₱30,000 - ₱70,000',
    inclusions: ['Large LED Wall', 'Podium Microphones', 'Stage Lighting', 'Live Feed Camera'],
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1770&auto=format=fit',
  },
  {
    name: 'Kids Party Fun Pack',
    description: 'Colorful lights and fun effects to make their party unforgettable.',
    priceRange: '₱10,000 - ₱20,000',
    inclusions: ['Disco Lights', 'Bubble Machine', 'Portable Sound System', 'Cartoon Projections'],
    image: 'https://images.unsplash.com/photo-1619223631257-2a543f3957a2?q=80&w=1770&auto=format&fit=crop',
  },
   {
    name: 'Debutante\'s Dream',
    description: 'A magical atmosphere for a once-in-a-lifetime celebration.',
    priceRange: '₱20,000 - ₱45,000',
    inclusions: ['Fairy Lights Canopy', 'Spotlight for Grand Entrance', 'Premium Sound System', 'Smoke Effects'],
    image: 'https://images.unsplash.com/photo-1523567459345-56b0b001041b?q=80&w=1770&auto=format&fit=crop',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
    { id: 1, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 1/571175692_1398540528938547_5239243637261797162_n.jpg', title: 'Elegant Evening Reception' },
    { id: 2, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 1/571343221_1398540378938562_4804558161343445364_n.jpg', title: 'Lakeside Ceremony' },
    { id: 3, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 1/571239228_1398539608938639_5615871225237358023_n.jpg', title: 'Floral Ceiling Spectacle' },
    { id: 4, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 1/573525482_1398541242271809_8857528343959349941_n.jpg', title: 'Rose-Tinted Celebration' },
    { id: 5, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 1/569190349_1398533622272571_6387164445008568536_n.jpg', title: 'Pathway to "I Do"' },
    { id: 6, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 2/571154389_1395347699257830_3254642409205276693_n.jpg', title: 'Garden Vows' },
    { id: 7, category: 'Corporate', image: '/photos/Corporate/TASKUS.jpg', title: 'Corporate Event Setup' },
    { id: 8, category: 'Corporate', image: '/photos/Corporate/554774392_1366822978776969_3458899789158193104_n.jpg', title: 'High-View Corporate Event' },
    { id: 9, category: 'Corporate', image: '/photos/Corporate/554188310_1366822812110319_7352187058478460481_n.jpg', title: 'Classic Ballroom Setup' },
    { id: 10, category: 'Live Bands', image: '/photos/Wedding/Tagaytay/Wedding 2/570250651_1395348172591116_5351188878399276855_n.jpg', title: 'Soft Lit Stage' },
    { id: 11, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 2/568775426_1395348662591067_1388472842652633311_n.jpg', title: 'Elegant Drapery & Lighting' },
    { id: 12, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 2/569310757_1395348402591093_7165084743174816910_n.jpg', title: 'Warm Tones Reception' },
    { id: 13, category: 'Corporate', image: '/photos/Corporate/DIY.jpg', title: 'Modern LED Wall Display' },
    { id: 14, category: 'Live Bands', image: '/photos/Wedding/Tagaytay/Wedding 2/568655746_1395347612591172_2117730640444248211_n.jpg', title: 'Intimate Band Performance' },
    { id: 15, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 2/567240387_1395347349257865_8244837411615044519_n.jpg', title: 'Enchanted Garden Reception' },
    { id: 16, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 2/568164250_1395346919257908_7751972092828492659_n.jpg', title: 'Villa D\'Este Inspired' },
    { id: 17, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 2/570437085_1395345445924722_7175793438673996209_n.jpg', title: 'Twilight Venue Exterior' },
    { id: 18, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 2/571050044_1395346465924620_3062624052752788155_n.jpg', title: 'Spotlight First Dance' },
    { id: 19, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 3/566346895_1395328839259716_2568452331279666395_n.jpg', title: 'Close-up First Dance' },
    { id: 20, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 3/569030639_1395328929259707_6367007965090801324_n.jpg', title: 'Rustic Table Setting' },
    { id: 21, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 4/568270153_1392554479537152_4463934185701473312_n.jpg', title: 'Festival of Lights' },
    { id: 22, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 5/561291662_1389891853136748_2208693110410241464_n.jpg', title: 'Grand Floral Entrance' },
    { id: 23, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 5/564255461_1389891643136769_4179142090729678898_n.jpg', title: 'Fairytale Couple Pose' },
    { id: 24, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 5/564715407_1389891806470086_5157033140664998217_n.jpg', title: 'Mystical Vows' },
    { id: 25, category: 'Weddings', image: '/photos/Wedding/Tagaytay/Wedding 5/566222613_1389891719803428_956226495934094206_n.jpg', title: 'Romantic Evening' },
    { id: 26, category: 'Weddings', image: '/photos/Wedding/Tagaytay/October/571781810_1401393801986553_4053237702877315144_n.jpg', title: 'October Celebration' },
    { id: 27, category: 'Weddings', image: '/photos/Wedding/Tagaytay/October/573558414_1401393828653217_1075294042907875376_n.jpg', title: 'Autumn Wedding' },
    { id: 28, category: 'Weddings', image: '/photos/Wedding/Tagaytay/October/573622897_1401393865319880_3446976281434024146_n.jpg', title: 'Tagaytay Views' },
    { id: 29, category: 'Weddings', image: '/photos/Wedding/Nuke Taal Wedding/565202926_1388785003247433_3442356210091897347_n.jpg', title: 'Taal Wedding' },
    { id: 30, category: 'Weddings', image: '/photos/Wedding/Nuke Taal Wedding/565355056_1388785063247427_290853763046603463_n.jpg', title: 'Taal Reception' },
    { id: 31, category: 'Kiddie Parties', image: '/photos/Kiddie/565710449_1392539449538655_6346928700467358881_n.jpg', title: 'Kids Party Fun' },
    { id: 32, category: 'Kiddie Parties', image: '/photos/Kiddie/569020151_1398540568938543_7968483978465314141_n.jpg', title: 'Children Celebration' },
];

export const BOOKINGS: Booking[] = [
  { 
    id: 'BA-2025-1001', 
    customerName: 'John Doe', 
    contactNumber: '09171234567',
    email: 'john@example.com',
    eventDate: '2024-10-26', 
    eventType: 'Wedding', 
    venue: 'Manila Hotel',
    ceremonyVenue: 'San Agustin Church',
    guestCount: 150,
    services: ['Lights', 'Sounds', 'LED Wall'],
    totalAmount: 45000,
    status: 'Confirmed' 
  },
  { 
    id: 'BA-2025-1002', 
    customerName: 'Jane Smith', 
    contactNumber: '09181234567',
    email: 'jane@example.com',
    eventDate: '2024-11-05', 
    eventType: 'Corporate', 
    venue: 'SMX Convention Center',
    guestCount: 500,
    services: ['Lights', 'Sounds', 'LED Wall', 'Live Feed'],
    totalAmount: 75000,
    status: 'Confirmed' 
  },
  { 
    id: 'BA-2025-1003', 
    customerName: 'Alice Johnson', 
    contactNumber: '09191234567',
    email: 'alice@example.com',
    eventDate: '2024-12-01', 
    eventType: 'Kiddie Party', 
    venue: 'Shakeys Quezon Ave',
    guestCount: 50,
    services: ['Lights', 'Sounds', 'Bubbles'],
    totalAmount: 15000,
    status: 'Inquiry' 
  },
  { 
    id: 'BA-2025-1004', 
    customerName: 'Sarah Martinez', 
    contactNumber: '09201234567',
    email: 'sarah@example.com',
    eventDate: '2025-01-20', 
    eventType: 'Wedding', 
    venue: 'Tagaytay Highlands',
    guestCount: 200,
    services: ['Lights', 'Sounds'],
    totalAmount: 35000,
    status: 'QuoteSent' 
  },
];