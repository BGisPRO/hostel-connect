/**
 * HBTU RidePool - Seed Data & Configurations
 * Harcourt Butler Technical University, Kanpur
 */

const HBTU_LOCATIONS = [
  { id: 'east_campus', name: 'HBTU East Campus (Nawabganj)', type: 'campus', landmark: 'Main Gate / Central Library' },
  { id: 'west_campus', name: 'HBTU West Campus (Awadhpuri)', type: 'campus', landmark: 'DBRA Hostel / New Complex Gate' },
  { id: 'kanpur_central', name: 'Kanpur Central Railway Station (CNB)', type: 'transit', landmark: 'Platform 1 / Cantt Side' },
  { id: 'lucknow_airport', name: 'Lucknow Airport (CCS / Amausi - LKO)', type: 'airport', landmark: 'Terminal 2 / 3 Departures' },
  { id: 'kanpur_airport', name: 'Kanpur Airport (Chakeri - KNU)', type: 'airport', landmark: 'Departure Terminal' },
  { id: 'rawatpur_station', name: 'Rawatpur Railway Station', type: 'transit', landmark: 'Main Booking Hall' },
  { id: 'jhakarkati_bus', name: 'Jhakarkati Inter-State Bus Stand', type: 'transit', landmark: 'Platform Gate 2' },
  { id: 'z_square_mall', name: 'Z-Square Mall (Civil Lines)', type: 'hangout', landmark: 'Bada Chauraha Entrance' },
  { id: 'swaroop_nagar', name: 'Swaroop Nagar / Rave 3', type: 'hangout', landmark: 'Food Street / Multiplex' },
  { id: 'ganga_barrage', name: 'Ganga Barrage (Atal Ghat)', type: 'hangout', landmark: 'Viewpoint Gate' }
];

const EMERGENCY_CONTACTS = [
  { name: 'HBTU West Campus Proctorial Board', phone: '+91 512 2534001', desc: 'Chief Proctor Office, West Campus' },
  { name: 'HBTU East Campus Security Control', phone: '+91 512 2534005', desc: 'East Gate Security Room' },
  { name: 'UP Women Power Line', phone: '1090', desc: '24x7 Toll-Free Women Helpline' },
  { name: 'UP Police Emergency Response', phone: '112', desc: 'National Emergency Response Support' },
  { name: 'Kanpur Central GRP Station', phone: '+91 512 2321200', desc: 'Railway Police Kanpur Central' },
  { name: 'HBTU Ambulance & Medical Dispensary', phone: '+91 512 2534015', desc: 'Health Centre, East Campus' }
];

const VEHICLE_TYPES = [
  { id: 'sedan', name: 'Sedan (Dzire / Etios)', seats: 4, icon: '🚗' },
  { id: 'suv', name: 'SUV / MUV (Ertiga / Innova)', seats: 6, icon: '🚙' },
  { id: 'mini', name: 'Hatchback / Mini (WagonR / i10)', seats: 4, icon: '🚕' },
  { id: 'auto', name: 'Campus Auto / E-Rickshaw (Shared)', seats: 4, icon: '🛺' }
];

// Helper to get formatted date string for today and upcoming days
function getDateOffset(days = 0, hours = 0, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  d.setMinutes(minutes);
  return d.toISOString();
}

const INITIAL_RIDES = [
  {
    id: 'ride-101',
    from: 'HBTU West Campus (Awadhpuri)',
    fromDetail: 'Gate 2, Outside DBRA Hostel',
    to: 'Lucknow Airport (CCS / Amausi - LKO)',
    toDetail: 'Terminal 3 Departures',
    departureTime: getDateOffset(1, 4, 30), // Tomorrow afternoon
    totalFare: 1800,
    totalSeats: 4,
    bookedSeats: 2,
    genderPref: 'any',
    vehicleType: 'Sedan (Dzire / Etios)',
    bookingMode: 'auto_book_on_full', // 'already_booked', 'auto_book_on_full', 'campus_auto'
    serviceProvider: 'Uber Intercity',
    driverDetails: null, // Populates once booked
    luggageSpace: 'Heavy (Suitcases allowed)',
    ac: true,
    host: {
      name: 'Aditya Srivastava',
      branch: 'Computer Science & Engineering',
      year: 'Final Year (2025)',
      phone: '9876543210',
      whatsapp: '919876543210',
      upiId: 'aditya.2101@okaxis',
      rollNo: '210101015',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aditya'
    },
    notes: 'Heading home for mid-term break. Flight at 6:45 PM. Will trigger 1-tap Uber Intercity booking once all 4 seats are locked!',
    passengers: [
      { name: 'Aditya Srivastava (Host)', roll: '210101015', gender: 'M', joinedAt: 'Yesterday', paid: true },
      { name: 'Rohan Verma', roll: '220102030', gender: 'M', joinedAt: '3 hrs ago', paid: false }
    ],
    chat: [
      { sender: 'Aditya Srivastava', time: '10:15 AM', message: 'Hey guys, I have linked the Uber Intercity deep-route. As soon as we get 4 riders, I will hit dispatch!' },
      { sender: 'Rohan Verma', time: '11:30 AM', message: 'Awesome Aditya! I have one medium trolley bag, will it fit?' },
      { sender: 'Aditya Srivastava', time: '11:32 AM', message: 'Yes easily! The Sedan boot has ample space for 3 trolleys.' }
    ]
  },
  {
    id: 'ride-102',
    from: 'HBTU East Campus (Nawabganj)',
    fromDetail: 'Near Central Library & Admin Block',
    to: 'Kanpur Central Railway Station (CNB)',
    toDetail: 'Cantt Side Entry (Platform 1)',
    departureTime: getDateOffset(0, 3, 0), // Today evening
    totalFare: 280,
    totalSeats: 3,
    bookedSeats: 1,
    genderPref: 'girls_only',
    vehicleType: 'Sedan (Dzire / Etios)',
    bookingMode: 'already_booked',
    serviceProvider: 'Uber Go',
    driverDetails: {
      driverName: 'Mohd. Aslam',
      driverPhone: '+91 9415082194',
      vehicleModel: 'Maruti Suzuki Dzire (White)',
      plateNumber: 'UP 78 EZ 4821',
      otp: '6192',
      status: 'Driver Confirmed for 5:15 PM'
    },
    luggageSpace: 'Standard (1 trolley + backpack)',
    ac: true,
    host: {
      name: 'Ananya Mishra',
      branch: 'Information Technology',
      year: '3rd Year (2026)',
      phone: '9839012345',
      whatsapp: '919839012345',
      upiId: 'ananya.mishra@paytm',
      rollNo: '220104018',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya'
    },
    notes: 'Already booked Uber Go! Driver is arriving at 5:15 PM at East Campus Library. Catching Vande Bharat train. Girls only please.',
    passengers: [
      { name: 'Ananya Mishra (Host)', roll: '220104018', gender: 'F', joinedAt: 'Yesterday', paid: true }
    ],
    chat: [
      { sender: 'Ananya Mishra', time: '02:00 PM', message: 'Uber driver details and plate number UP 78 EZ 4821 are already live in the app card. Hop in!' }
    ]
  },
  {
    id: 'ride-103',
    from: 'Kanpur Central Railway Station (CNB)',
    fromDetail: 'City Side Exit (Platform 9 / Ghanta Ghar side)',
    to: 'HBTU West Campus (Awadhpuri)',
    toDetail: 'Alaknanda / Mandakini Girls Hostel',
    departureTime: getDateOffset(0, 1, 15), // Coming in 1 hour
    totalFare: 320,
    totalSeats: 4,
    bookedSeats: 3,
    genderPref: 'any',
    vehicleType: 'Hatchback / Mini',
    bookingMode: 'auto_book_on_full',
    serviceProvider: 'Ola Mini',
    driverDetails: null,
    luggageSpace: 'Heavy (Weekend luggage)',
    ac: true,
    host: {
      name: 'Priyanshu Tiwari',
      branch: 'Chemical Engineering',
      year: '2nd Year (2027)',
      phone: '9123456780',
      whatsapp: '919123456780',
      upiId: 'priyanshu.tiwari@ybl',
      rollNo: '230103042',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priyanshu'
    },
    notes: 'Just arriving from New Delhi by Shatabdi. 1 seat left to West Campus! Splitting ₹80 each.',
    passengers: [
      { name: 'Priyanshu Tiwari (Host)', roll: '230103042', gender: 'M', joinedAt: 'Today', paid: true },
      { name: 'Sameer Khan', roll: '230103011', gender: 'M', joinedAt: 'Today', paid: true },
      { name: 'Harshit Gupta', roll: '230101088', gender: 'M', joinedAt: '1 hr ago', paid: true }
    ],
    chat: [
      { sender: 'Priyanshu Tiwari', time: '06:00 PM', message: 'Train is on time at Platform 1. Meet at Cantt taxi stand.' },
      { sender: 'Sameer Khan', time: '06:05 PM', message: 'I am on coach B3, will be there in 5 minutes!' }
    ]
  },
  {
    id: 'ride-104',
    from: 'HBTU East Campus (Nawabganj)',
    fromDetail: 'Mechanical Workshop Gate',
    to: 'HBTU West Campus (Awadhpuri)',
    toDetail: 'New Academic Block / Canteen',
    departureTime: getDateOffset(0, 0, 45), // In 45 mins
    totalFare: 120,
    totalSeats: 4,
    bookedSeats: 2,
    genderPref: 'any',
    vehicleType: 'Campus Auto / E-Rickshaw',
    bookingMode: 'campus_auto',
    serviceProvider: 'Shared E-Rickshaw Stand',
    driverDetails: {
      driverName: 'Ramu Auto Driver',
      driverPhone: '+91 9792019921',
      vehicleModel: 'Green E-Rickshaw',
      plateNumber: 'UP 78 ER 1022',
      otp: null,
      status: 'Waiting at East Campus Gate'
    },
    luggageSpace: 'Light (College Bags only)',
    ac: false,
    host: {
      name: 'Divyansh Singh',
      branch: 'Mechanical Engineering',
      year: '3rd Year (2026)',
      phone: '9450123456',
      whatsapp: '919450123456',
      upiId: 'divyansh.singh@oksbi',
      rollNo: '220105021',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Divyansh'
    },
    notes: 'Direct E-Rickshaw shuttle to West Campus. Only ₹30 per head via UPI!',
    passengers: [
      { name: 'Divyansh Singh (Host)', roll: '220105021', gender: 'M', joinedAt: 'Today', paid: true },
      { name: 'Tanmay Saxena', roll: '220105055', gender: 'M', joinedAt: '15 mins ago', paid: true }
    ],
    chat: [
      { sender: 'Divyansh Singh', time: '01:10 PM', message: 'Auto is parked near East Campus juice corner. Leaving by 1:30 PM.' }
    ]
  },
  {
    id: 'ride-105',
    from: 'HBTU West Campus (Awadhpuri)',
    fromDetail: 'Visvesvaraya Hostel Parking',
    to: 'Z-Square Mall (Civil Lines)',
    toDetail: 'Main Entry / INOX Box Office',
    departureTime: getDateOffset(2, 5, 0),
    totalFare: 240,
    totalSeats: 4,
    bookedSeats: 1,
    genderPref: 'any',
    vehicleType: 'Sedan (Dzire / Etios)',
    bookingMode: 'auto_book_on_full',
    serviceProvider: 'Rapido Cab',
    driverDetails: null,
    luggageSpace: 'Light (Shopping only)',
    ac: true,
    host: {
      name: 'Sneha Pandey',
      branch: 'Electronics Engineering',
      year: 'Final Year (2025)',
      phone: '9918234567',
      whatsapp: '919918234567',
      upiId: 'sneha.pandey@paytm',
      rollNo: '210106033',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sneha'
    },
    notes: 'Saturday movie & shopping trip to Z-Square Mall. Booking Rapido/Uber when 4 join.',
    passengers: [
      { name: 'Sneha Pandey (Host)', roll: '210106033', gender: 'F', joinedAt: '2 days ago', paid: true }
    ],
    chat: []
  },
  {
    id: 'ride-106',
    from: 'HBTU West Campus (Awadhpuri)',
    fromDetail: 'Raman Hostel Lawn',
    to: 'Kanpur Airport (Chakeri - KNU)',
    toDetail: 'Check-in Gates',
    departureTime: getDateOffset(3, 2, 0),
    totalFare: 650,
    totalSeats: 4,
    bookedSeats: 1,
    genderPref: 'any',
    vehicleType: 'Sedan (Dzire / Etios)',
    bookingMode: 'auto_book_on_full',
    serviceProvider: 'Uber Go',
    driverDetails: null,
    luggageSpace: 'Heavy (Flight Trolley allowed)',
    ac: true,
    host: {
      name: 'Ayush Patel',
      branch: 'Electrical Engineering',
      year: '3rd Year (2026)',
      phone: '9889123400',
      whatsapp: '919889123400',
      upiId: 'ayush.patel@okaxis',
      rollNo: '220107012',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ayush'
    },
    notes: 'IndiGo flight to Mumbai from Kanpur Chakeri Airport. Cab split makes it under ₹170 each.',
    passengers: [
      { name: 'Ayush Patel (Host)', roll: '220107012', gender: 'M', joinedAt: '3 days ago', paid: true }
    ],
    chat: []
  }
];

const DEFAULT_CURRENT_USER = {
  name: 'Kavya Sharma',
  email: 'kavya.220104@hbtu.ac.in',
  rollNo: '220104052',
  branch: 'Information Technology',
  year: '3rd Year (2026)',
  hostel: 'Alaknanda Girls Hostel, West Campus',
  phone: '9871234560',
  whatsapp: '919871234560',
  upiId: 'kavya.sharma@okaxis',
  gender: 'F',
  verified: true,
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kavya'
};
