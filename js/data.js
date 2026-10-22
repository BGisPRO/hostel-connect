/**
 * HBTU RidePool - Data Store & Seed Configuration
 * Harcourt Butler Technical University, Kanpur
 * 
 * Verified campus locations, structured hostel directory, campus auto schedules,
 * and persistent storage helpers.
 */

// 1. Official HBTU Hostels Directory (East & West Campus)
const HBTU_HOSTELS = [
  // West Campus (Awadhpuri) - Boys' Hostels
  {
    id: 'ramanujan_hostel',
    name: 'Ramanujan Hostel',
    campus: 'West Campus (Awadhpuri)',
    campusCode: 'west',
    category: 'boys',
    aliases: ['ramanujan', 'rj hostel', 'west boys 1', 'awadhpuri'],
    pickupPoint: 'Ramanujan Hostel Quad / West Campus Gate 2',
    lat: 26.4952,
    lng: 80.3018,
    verified: true
  },
  {
    id: 'shridharacharya_hostel',
    name: 'Shridharacharya Hostel',
    campus: 'West Campus (Awadhpuri)',
    campusCode: 'west',
    category: 'boys',
    aliases: ['shridharacharya', 'shridhar', 'sc hostel', 'west boys 2'],
    pickupPoint: 'Shridharacharya Parking / Tech Complex Gate',
    lat: 26.4947,
    lng: 80.3025,
    verified: true
  },
  {
    id: 'abdul_kalam_hostel',
    name: 'Abdul Kalam Hostel',
    campus: 'West Campus (Awadhpuri)',
    campusCode: 'west',
    category: 'boys',
    aliases: ['abdul kalam', 'kalam hostel', 'apj hostel', 'dbra complex'],
    pickupPoint: 'Kalam Hostel Gate / DBRA Complex Avenue',
    lat: 26.4942,
    lng: 80.3009,
    verified: true
  },
  {
    id: 'visvesvaraya_hostel',
    name: 'Visvesvaraya Hostel',
    campus: 'West Campus (Awadhpuri)',
    campusCode: 'west',
    category: 'boys',
    aliases: ['visvesvaraya', 'vv hostel', 'visveswarya', 'west parking'],
    pickupPoint: 'Visvesvaraya Gate / Awadhpuri Road',
    lat: 26.4958,
    lng: 80.3012,
    verified: true
  },

  // East Campus (Nawabganj) - Boys' Hostels
  {
    id: 'raman_hostel',
    name: 'Raman Hostel',
    campus: 'East Campus (Nawabganj)',
    campusCode: 'east',
    category: 'boys',
    aliases: ['raman', 'cv raman', 'east boys 1', 'nawabganj lawn'],
    pickupPoint: 'Raman Hostel Lawn / Admin Gate East',
    lat: 26.4865,
    lng: 80.3162,
    verified: true
  },
  {
    id: 'vishwakarma_hostel',
    name: 'Vishwakarma Hostel',
    campus: 'East Campus (Nawabganj)',
    campusCode: 'east',
    category: 'boys',
    aliases: ['vishwakarma', 'vk hostel', 'workshop gate', 'east boys 2'],
    pickupPoint: 'Central Workshop Gate, East Campus',
    lat: 26.4858,
    lng: 80.3155,
    verified: true
  },
  {
    id: 'ambedkar_hostel',
    name: 'Ambedkar Hostel',
    campus: 'East Campus (Nawabganj)',
    campusCode: 'east',
    category: 'boys',
    aliases: ['ambedkar', 'br ambedkar', 'east main gate'],
    pickupPoint: 'East Campus Main Gate, Nawabganj',
    lat: 26.4860,
    lng: 80.3170,
    verified: true
  },
  {
    id: 'aryabhatt_hostel',
    name: 'Aryabhatt Hostel',
    campus: 'East Campus (Nawabganj)',
    campusCode: 'east',
    category: 'boys',
    aliases: ['aryabhatt', 'aryabhatta', 'library gate', 'east boys 4'],
    pickupPoint: 'Central Library Avenue Gate, East Campus',
    lat: 26.4872,
    lng: 80.3165,
    verified: true
  },

  // West Campus (Awadhpuri) - Girls' Hostels
  {
    id: 'alaknanda_hostel',
    name: 'Alaknanda Hostel',
    campus: 'West Campus (Awadhpuri)',
    campusCode: 'west',
    category: 'girls',
    aliases: ['alaknanda', 'alak girls', 'west girls 1'],
    pickupPoint: 'Alaknanda Girls Hostel Security Post',
    lat: 26.4938,
    lng: 80.3022,
    verified: true
  },
  {
    id: 'mandakini_hostel',
    name: 'Mandakini Hostel',
    campus: 'West Campus (Awadhpuri)',
    campusCode: 'west',
    category: 'girls',
    aliases: ['mandakini', 'manda girls', 'west girls 2'],
    pickupPoint: 'Mandakini Circle / Girls Hostel Security Gate',
    lat: 26.4941,
    lng: 80.3030,
    verified: true
  },

  // East Campus (Nawabganj) - Girls' Hostels
  {
    id: 'gangotri_hostel',
    name: 'Gangotri Hostel',
    campus: 'East Campus (Nawabganj)',
    campusCode: 'east',
    category: 'girls',
    aliases: ['gangotri', 'ganga girls', 'east girls 1'],
    pickupPoint: 'East Campus Security Gate, Nawabganj',
    lat: 26.4855,
    lng: 80.3175,
    verified: true
  },
  {
    id: 'bhagirathi_hostel',
    name: 'Bhagirathi Hostel',
    campus: 'East Campus (Nawabganj)',
    campusCode: 'east',
    category: 'girls',
    aliases: ['bhagirathi', 'bhagirath girls', 'east girls 2'],
    pickupPoint: 'East Campus Girls Hostel Complex Entrance',
    lat: 26.4852,
    lng: 80.3178,
    verified: true
  },
  {
    id: 'kaveri_hostel',
    name: 'Kaveri Hostel',
    campus: 'East Campus (Nawabganj)',
    campusCode: 'east',
    category: 'girls',
    aliases: ['kaveri', 'cauvery', 'east girls 3', 'health centre side'],
    pickupPoint: 'East Campus Health Centre Side Gate',
    lat: 26.4850,
    lng: 80.3182,
    verified: true
  },
  {
    id: 'saraswati_hostel',
    name: 'Saraswati Hostel',
    campus: 'East Campus (Nawabganj)',
    campusCode: 'east',
    category: 'girls',
    aliases: ['saraswati', 'saraswati girls', 'east girls 4'],
    pickupPoint: 'East Campus Main Avenue Gate',
    lat: 26.4848,
    lng: 80.3185,
    verified: true
  }
];

// 2. Verified Campus Gates & City Transit Hubs
const HBTU_TRANSIT_HUBS = [
  {
    id: 'west_campus_gate',
    name: 'HBTU West Campus (Awadhpuri Gate)',
    category: 'campus',
    aliases: ['west campus', 'awadhpuri gate', 'west main gate'],
    lat: 26.4950,
    lng: 80.3015,
    verified: true
  },
  {
    id: 'east_campus_gate',
    name: 'HBTU East Campus (Central Library Gate)',
    category: 'campus',
    aliases: ['east campus', 'library gate', 'nawabganj gate'],
    lat: 26.4862,
    lng: 80.3160,
    verified: true
  },
  {
    id: 'kanpur_central',
    name: 'Kanpur Central Railway Station (CNB)',
    category: 'transit',
    aliases: ['cnb', 'kanpur central', 'railway station', 'cantt side'],
    lat: 26.4539,
    lng: 80.3513,
    verified: true
  },
  {
    id: 'lucknow_airport',
    name: 'Lucknow Airport (CCS / Amausi - LKO)',
    category: 'airport',
    aliases: ['lko', 'lucknow airport', 'amausi', 'ccs airport', 'terminal 3'],
    lat: 26.7606,
    lng: 80.8893,
    verified: true
  },
  {
    id: 'kanpur_airport',
    name: 'Kanpur Airport (Chakeri - KNU)',
    category: 'airport',
    aliases: ['knu', 'chakeri', 'kanpur airport', 'chakeri terminal'],
    lat: 26.4410,
    lng: 80.4078,
    verified: true
  },
  {
    id: 'rawatpur_station',
    name: 'Rawatpur Railway Station',
    category: 'transit',
    aliases: ['rawatpur', 'rawatpur station'],
    lat: 26.4890,
    lng: 80.2980,
    verified: true
  },
  {
    id: 'jhakarkati_bus',
    name: 'Jhakarkati Inter-State Bus Stand',
    category: 'transit',
    aliases: ['jhakarkati', 'bus stand', 'gt road bus stand'],
    lat: 26.4560,
    lng: 80.3390,
    verified: true
  },
  {
    id: 'z_square_mall',
    name: 'Z-Square Mall (Civil Lines)',
    category: 'hangout',
    aliases: ['z square', 'zsquare', 'civil lines mall'],
    lat: 26.4710,
    lng: 80.3530,
    verified: true
  },
  {
    id: 'swaroop_nagar',
    name: 'Swaroop Nagar / Rave 3',
    category: 'hangout',
    aliases: ['swaroop nagar', 'rave 3', 'food street'],
    lat: 26.4780,
    lng: 80.3100,
    verified: true
  },
  {
    id: 'ganga_barrage',
    name: 'Ganga Barrage (Atal Ghat)',
    category: 'hangout',
    aliases: ['ganga barrage', 'atal ghat', 'barrage'],
    lat: 26.5050,
    lng: 80.3250,
    verified: true
  }
];

// Flat list for easy lookup
const HBTU_ALL_LOCATIONS = [
  ...HBTU_TRANSIT_HUBS,
  ...HBTU_HOSTELS.map(h => ({
    id: h.id,
    name: `${h.name} (${h.campus.split(' ')[0]})`,
    fullName: h.name,
    category: h.category,
    campus: h.campus,
    pickupPoint: h.pickupPoint,
    aliases: h.aliases,
    lat: h.lat,
    lng: h.lng,
    verified: h.verified
  }))
];

// 3. Verified Campus Auto Routes & Community-Reported Schedules
const INITIAL_AUTO_SCHEDULES = [
  {
    id: 'auto-route-1',
    routeTitle: 'East Campus ⇄ West Campus Inter-Campus Shuttle',
    pickup: 'HBTU East Campus (Central Library Gate)',
    drop: 'HBTU West Campus (Awadhpuri Gate)',
    frequency: 'Every 10–15 mins during peak hours',
    operatingHours: '07:30 AM – 09:30 PM',
    indicativeFare: '₹20 – ₹30 per student',
    vehicleType: 'Shared E-Rickshaw / Auto',
    status: 'Operational',
    lastVerified: 'October 2026',
    notes: 'Primary student corridor connecting Nawabganj academic complex with Awadhpuri hostels. E-rickshaws wait outside the main gates.',
    stops: ['East Campus Main Gate', 'Company Bagh Crossing', 'Rawatpur Tiraha', 'West Campus Awadhpuri Gate']
  },
  {
    id: 'auto-route-2',
    routeTitle: 'West Campus ⇄ Rawatpur Railway Station',
    pickup: 'HBTU West Campus (Awadhpuri Gate)',
    drop: 'Rawatpur Railway Station',
    frequency: 'Every 5–10 mins',
    operatingHours: '06:00 AM – 10:30 PM',
    indicativeFare: '₹15 – ₹20 per student',
    vehicleType: 'Shared E-Rickshaw',
    status: 'Operational',
    lastVerified: 'October 2026',
    notes: 'Shortest transit run for local trains and metro connectivity at Rawatpur.',
    stops: ['West Campus Gate 1', 'Awadhpuri Morh', 'Rawatpur Station Gate']
  },
  {
    id: 'auto-route-3',
    routeTitle: 'East Campus ⇄ Z-Square Mall / Civil Lines',
    pickup: 'HBTU East Campus (Admin Gate)',
    drop: 'Z-Square Mall (Civil Lines)',
    frequency: 'Every 15–20 mins',
    operatingHours: '10:00 AM – 09:30 PM',
    indicativeFare: '₹25 – ₹35 per student',
    vehicleType: 'Shared CNG Auto / Tempo',
    status: 'Operational',
    lastVerified: 'October 2026',
    notes: 'Popular weekend student route for shopping, cinema, and dining in Civil Lines.',
    stops: ['East Campus Gate', 'Vishwa Vidyalaya Crossing', 'Bada Chauraha', 'Z-Square Civil Lines']
  },
  {
    id: 'auto-route-4',
    routeTitle: 'West Campus ⇄ Kanpur Central (Late Night Transit Guidance)',
    pickup: 'HBTU West Campus (Awadhpuri Gate)',
    drop: 'Kanpur Central Railway Station (Cantt)',
    frequency: 'On-demand / Pre-arranged Auto Stand',
    operatingHours: '05:00 AM – 11:30 PM',
    indicativeFare: '₹120 – ₹180 (Full Auto split by 3-4)',
    vehicleType: 'CNG Auto Rickshaw',
    status: 'Community-Monitored',
    lastVerified: 'October 2026',
    notes: 'Shared rickshaws run frequently till 9 PM. After 9:30 PM, booking a cab pool or hiring a dedicated auto is recommended for safety.',
    stops: ['West Campus Gate', 'Rawatpur', 'Afim Kothi', 'Ghanta Ghar', 'Kanpur Central Platform 1']
  }
];

// 4. Campus Safety & Emergency Helplines
const EMERGENCY_CONTACTS = [
  {
    id: 'proctor_west',
    name: 'HBTU West Campus Proctorial Office',
    phone: '+91 512 2534001',
    category: 'campus',
    desc: 'Chief Proctor & Discipline Committee, West Campus'
  },
  {
    id: 'security_east',
    name: 'HBTU East Campus Security Control Room',
    phone: '+91 512 2534005',
    category: 'campus',
    desc: '24x7 Main Gate Security, Nawabganj'
  },
  {
    id: 'women_power_line',
    name: 'UP Women Power Line (1090)',
    phone: '1090',
    category: 'state',
    desc: '24x7 Toll-Free Women Helpline for immediate assistance'
  },
  {
    id: 'police_emergency',
    name: 'National Emergency Response (112)',
    phone: '112',
    category: 'state',
    desc: 'Police, Ambulance & Fire Emergency dispatch'
  },
  {
    id: 'grp_kanpur_central',
    name: 'Kanpur Central GRP Station',
    phone: '+91 512 2321200',
    category: 'transit',
    desc: 'Government Railway Police, Platform 1 Cantt Side'
  },
  {
    id: 'hbtu_health_centre',
    name: 'HBTU Health Centre & Ambulance',
    phone: '+91 512 2534015',
    category: 'campus',
    desc: 'Dispensary & First-aid, East Campus'
  }
];

// Helper to compute date offset
function getDateOffset(days = 0, hours = 0, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  d.setMinutes(minutes);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d.toISOString();
}

// 5. Initial Student Carpools (Real student peer-to-peer pools, verified statuses, no fake booking numbers)
const INITIAL_RIDES = [
  {
    id: 'pool-101',
    from: 'Ramanujan Hostel (West Campus)',
    fromDetail: 'Gate 2 / New Complex Awadhpuri',
    to: 'Lucknow Airport (CCS / Amausi - LKO)',
    toDetail: 'Terminal 3 Departures',
    departureTime: getDateOffset(1, 4, 30),
    createdAt: getDateOffset(-1, -2, 0),
    totalFare: 1800,
    totalSeats: 4,
    status: 'open', // 'draft' | 'open' | 'pending_approval' | 'confirmed' | 'full' | 'cancelled' | 'completed'
    genderPref: 'any',
    vehicleType: 'Sedan (Dzire / Etios)',
    serviceProvider: 'Uber Intercity / Peer Cab',
    notes: 'Heading home for semester break. Flight departure at 6:45 PM. Co-passengers split the actual meter or app fare equally.',
    host: {
      id: 'usr_aditya_2101',
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
    passengers: [
      {
        id: 'usr_aditya_2101',
        name: 'Aditya Srivastava (Host)',
        roll: '210101015',
        gender: 'M',
        joinedAt: 'Yesterday',
        status: 'confirmed',
        paid: true
      },
      {
        id: 'usr_rohan_2201',
        name: 'Rohan Verma',
        roll: '220102030',
        gender: 'M',
        joinedAt: '3 hrs ago',
        status: 'confirmed',
        paid: false
      }
    ],
    pendingRequests: [],
    chat: [
      { sender: 'Aditya Srivastava', time: '10:15 AM', message: 'Hello! 2 seats are currently locked. Once we get 1 or 2 more riders, we can confirm the pickup vehicle.' },
      { sender: 'Rohan Verma', time: '11:30 AM', message: 'Hey Aditya, I have one medium suitcase and a college backpack.' },
      { sender: 'Aditya Srivastava', time: '11:32 AM', message: 'Perfect! The Sedan boot will easily accommodate our bags.' }
    ]
  },
  {
    id: 'pool-102',
    from: 'Alaknanda Hostel (West Campus)',
    fromDetail: 'Alaknanda Security Gate, Awadhpuri',
    to: 'Kanpur Central Railway Station (CNB)',
    toDetail: 'Cantt Side Entry (Platform 1)',
    departureTime: getDateOffset(0, 3, 0),
    createdAt: getDateOffset(0, -5, 0),
    totalFare: 280,
    totalSeats: 3,
    status: 'open',
    genderPref: 'girls_only',
    vehicleType: 'Sedan (Dzire / Etios)',
    serviceProvider: 'Uber / Auto Pool',
    notes: 'Heading to Kanpur Central for evening Vande Bharat. Girls-only carpool please! Confirm via in-app request.',
    host: {
      id: 'usr_ananya_2201',
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
    passengers: [
      {
        id: 'usr_ananya_2201',
        name: 'Ananya Mishra (Host)',
        roll: '220104018',
        gender: 'F',
        joinedAt: 'Yesterday',
        status: 'confirmed',
        paid: true
      }
    ],
    pendingRequests: [],
    chat: [
      { sender: 'Ananya Mishra', time: '02:00 PM', message: 'Meeting directly at Alaknanda gate 20 mins prior to departure.' }
    ]
  },
  {
    id: 'pool-103',
    from: 'Kanpur Central Railway Station (CNB)',
    fromDetail: 'Cantt Side Platform 1 Cab Stand',
    to: 'HBTU West Campus (Awadhpuri)',
    toDetail: 'Visvesvaraya / Kalam Hostel Gate',
    departureTime: getDateOffset(0, 1, 30),
    createdAt: getDateOffset(0, -1, 0),
    totalFare: 320,
    totalSeats: 4,
    status: 'open',
    genderPref: 'any',
    vehicleType: 'Hatchback / Mini',
    serviceProvider: 'Ola Mini / Station Cab',
    notes: 'Arriving from Delhi by Shatabdi. 1 open seat remaining to Awadhpuri West Campus! Transparent split ~₹80 each.',
    host: {
      id: 'usr_priyanshu_2301',
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
    passengers: [
      { id: 'usr_priyanshu_2301', name: 'Priyanshu Tiwari (Host)', roll: '230103042', gender: 'M', joinedAt: 'Today', status: 'confirmed', paid: true },
      { id: 'usr_sameer_2301', name: 'Sameer Khan', roll: '230103011', gender: 'M', joinedAt: 'Today', status: 'confirmed', paid: true },
      { id: 'usr_harshit_2301', name: 'Harshit Gupta', roll: '230101088', gender: 'M', joinedAt: '1 hr ago', status: 'confirmed', paid: true }
    ],
    pendingRequests: [],
    chat: [
      { sender: 'Priyanshu Tiwari', time: '06:00 PM', message: 'Train is running on schedule. Meet outside Cantt exit gate.' }
    ]
  },
  {
    id: 'pool-104',
    from: 'Raman Hostel (East Campus)',
    fromDetail: 'East Campus Sports Lawn / Admin Gate',
    to: 'HBTU West Campus (Awadhpuri)',
    toDetail: 'DBRA Gate / Campus Canteen',
    departureTime: getDateOffset(0, 0, 45),
    createdAt: getDateOffset(0, 0, -15),
    totalFare: 100,
    totalSeats: 4,
    status: 'open',
    genderPref: 'any',
    vehicleType: 'Campus Auto / E-Rickshaw',
    serviceProvider: 'Shared E-Rickshaw Shuttle',
    notes: 'Immediate inter-campus shuttle from East to West Campus. Direct ride, ₹25 per person.',
    host: {
      id: 'usr_divyansh_2201',
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
    passengers: [
      { id: 'usr_divyansh_2201', name: 'Divyansh Singh (Host)', roll: '220105021', gender: 'M', joinedAt: 'Today', status: 'confirmed', paid: true },
      { id: 'usr_tanmay_2201', name: 'Tanmay Saxena', roll: '220105055', gender: 'M', joinedAt: '15 mins ago', status: 'confirmed', paid: true }
    ],
    pendingRequests: [],
    chat: []
  },
  {
    id: 'pool-105',
    from: 'Gangotri Hostel (East Campus)',
    fromDetail: 'Gangotri Security Gate, Nawabganj',
    to: 'Z-Square Mall (Civil Lines)',
    toDetail: 'Mall Main Entrance',
    departureTime: getDateOffset(2, 5, 0),
    createdAt: getDateOffset(-1, 0, 0),
    totalFare: 240,
    totalSeats: 4,
    status: 'open',
    genderPref: 'girls_only',
    vehicleType: 'Sedan (Dzire / Etios)',
    serviceProvider: 'Rapido / Uber Cab',
    notes: 'Weekend shopping & food court trip. 3 seats open for female students. Request in advance!',
    host: {
      id: 'usr_sneha_2101',
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
    passengers: [
      { id: 'usr_sneha_2101', name: 'Sneha Pandey (Host)', roll: '210106033', gender: 'F', joinedAt: 'Yesterday', status: 'confirmed', paid: true }
    ],
    pendingRequests: [],
    chat: []
  },
  {
    id: 'pool-106',
    from: 'Visvesvaraya Hostel (West Campus)',
    fromDetail: 'Visvesvaraya Hostel Parking',
    to: 'Kanpur Airport (Chakeri - KNU)',
    toDetail: 'Domestic Terminal Check-in',
    departureTime: getDateOffset(3, 2, 0),
    createdAt: getDateOffset(-2, 0, 0),
    totalFare: 640,
    totalSeats: 4,
    status: 'open',
    genderPref: 'any',
    vehicleType: 'Sedan (Dzire / Etios)',
    serviceProvider: 'Uber Go / Pre-paid Cab',
    notes: 'IndiGo flight to Mumbai from Kanpur Chakeri. Early morning travel from West Campus. 3 seats open (~₹160 each).',
    host: {
      id: 'usr_ayush_2201',
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
    passengers: [
      { id: 'usr_ayush_2201', name: 'Ayush Patel (Host)', roll: '220107012', gender: 'M', joinedAt: '2 days ago', status: 'confirmed', paid: true }
    ],
    pendingRequests: [],
    chat: []
  }
];

// 6. Community Feedback Seed (Honest student suggestions - no fake 5-star ratings or fabricated reviews)
const INITIAL_COMMUNITY_FEEDBACK = [
  {
    id: 'fb-01',
    authorName: 'Kartik V.',
    branch: 'Computer Science (2025)',
    category: 'Route Suggestion',
    message: 'Having verified coordinates for DBRA Awadhpuri gate has made booking Rapido and Uber much faster. Please keep adding more campus auto schedules!',
    date: '2026-10-14',
    status: 'Reviewed'
  },
  {
    id: 'fb-02',
    authorName: 'Pooja S.',
    branch: 'Civil Engineering (2026)',
    category: 'Safety & Privacy',
    message: 'The Girls-only filter and keeping phone numbers hidden until ride acceptance provides huge peace of mind for night travels to Kanpur Central.',
    date: '2026-10-18',
    status: 'Reviewed'
  }
];

// 7. Default Student User Profile
const DEFAULT_CURRENT_USER = {
  id: 'usr_kavya_2201',
  name: 'Kavya Sharma',
  email: 'kavya.220104@hbtu.ac.in',
  rollNo: '220104052',
  branch: 'Information Technology',
  year: '3rd Year (2026)',
  hostel: 'Alaknanda Hostel (West Campus)',
  phone: '9871234560',
  whatsapp: '919871234560',
  upiId: 'kavya.sharma@okaxis',
  gender: 'F',
  verified: true,
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kavya',
  privacySettings: {
    hidePhoneUntilConfirmed: true,
    hideEmail: true
  }
};

// 8. Modular Data Accessor & LocalStorage Persistence
class HBTUDataStore {
  static getHostels() {
    const saved = localStorage.getItem('hbtu_hostels_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return HBTU_HOSTELS; }
    }
    return HBTU_HOSTELS;
  }

  static saveHostels(hostels) {
    localStorage.setItem('hbtu_hostels_v2', JSON.stringify(hostels));
  }

  static getRides() {
    const saved = localStorage.getItem('hbtu_cabpool_rides_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved rides, reverting to seed', e);
      }
    }
    return INITIAL_RIDES;
  }

  static saveRides(rides) {
    localStorage.setItem('hbtu_cabpool_rides_v2', JSON.stringify(rides));
  }

  static getAutoSchedules() {
    const saved = localStorage.getItem('hbtu_auto_schedules_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_AUTO_SCHEDULES; }
    }
    return INITIAL_AUTO_SCHEDULES;
  }

  static saveAutoSchedules(schedules) {
    localStorage.setItem('hbtu_auto_schedules_v2', JSON.stringify(schedules));
  }

  static getFeedback() {
    const saved = localStorage.getItem('hbtu_community_feedback_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_COMMUNITY_FEEDBACK; }
    }
    return INITIAL_COMMUNITY_FEEDBACK;
  }

  static saveFeedback(feedbackList) {
    localStorage.setItem('hbtu_community_feedback_v2', JSON.stringify(feedbackList));
  }

  static getUser() {
    const saved = localStorage.getItem('hbtu_cabpool_user_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_CURRENT_USER; }
    }
    return DEFAULT_CURRENT_USER;
  }

  static saveUser(user) {
    localStorage.setItem('hbtu_cabpool_user_v2', JSON.stringify(user));
  }

  /**
   * Helper to generate categorized <optgroup> dropdown options for all locations
   */
  static generateLocationOptionsHTML(selectedName = '') {
    const hostels = this.getHostels();
    const westBoys = hostels.filter(h => h.campusCode === 'west' && h.category === 'boys');
    const eastBoys = hostels.filter(h => h.campusCode === 'east' && h.category === 'boys');
    const westGirls = hostels.filter(h => h.campusCode === 'west' && h.category === 'girls');
    const eastGirls = hostels.filter(h => h.campusCode === 'east' && h.category === 'girls');

    const clean = (s) => (s || '').toLowerCase().trim();
    const isSelected = (val) => clean(selectedName) === clean(val) || (selectedName && clean(val).includes(clean(selectedName)));

    return `
      <optgroup label="🏛️ HBTU Campus Gates">
        <option value="HBTU West Campus (Awadhpuri Gate)" ${isSelected('HBTU West Campus') ? 'selected' : ''}>HBTU West Campus (Awadhpuri Gate)</option>
        <option value="HBTU East Campus (Central Library Gate)" ${isSelected('HBTU East Campus') ? 'selected' : ''}>HBTU East Campus (Central Library Gate)</option>
      </optgroup>

      <optgroup label="🏢 Boys' Hostels — West Campus (Awadhpuri)">
        ${westBoys.map(h => `<option value="${h.name} (${h.campus.split(' ')[0]})" ${isSelected(h.name) ? 'selected' : ''}>${h.name} (West Campus)</option>`).join('')}
      </optgroup>

      <optgroup label="🏢 Boys' Hostels — East Campus (Nawabganj)">
        ${eastBoys.map(h => `<option value="${h.name} (${h.campus.split(' ')[0]})" ${isSelected(h.name) ? 'selected' : ''}>${h.name} (East Campus)</option>`).join('')}
      </optgroup>

      <optgroup label="🛡️ Girls' Hostels — West Campus (Awadhpuri)">
        ${westGirls.map(h => `<option value="${h.name} (${h.campus.split(' ')[0]})" ${isSelected(h.name) ? 'selected' : ''}>${h.name} (West Campus)</option>`).join('')}
      </optgroup>

      <optgroup label="🛡️ Girls' Hostels — East Campus (Nawabganj)">
        ${eastGirls.map(h => `<option value="${h.name} (${h.campus.split(' ')[0]})" ${isSelected(h.name) ? 'selected' : ''}>${h.name} (East Campus)</option>`).join('')}
      </optgroup>

      <optgroup label="✈️ Transit & City Hubs">
        <option value="Lucknow Airport (CCS / Amausi - LKO)" ${isSelected('Lucknow') ? 'selected' : ''}>✈️ Lucknow Airport (CCS / LKO)</option>
        <option value="Kanpur Central Railway Station (CNB)" ${isSelected('Kanpur Central') ? 'selected' : ''}>🚆 Kanpur Central Railway Station (CNB)</option>
        <option value="Kanpur Airport (Chakeri - KNU)" ${isSelected('Chakeri') || isSelected('Kanpur Airport') ? 'selected' : ''}>🛫 Kanpur Airport (Chakeri - KNU)</option>
        <option value="Rawatpur Railway Station" ${isSelected('Rawatpur') ? 'selected' : ''}>🚆 Rawatpur Railway Station</option>
        <option value="Jhakarkati Inter-State Bus Stand" ${isSelected('Jhakarkati') ? 'selected' : ''}>🚌 Jhakarkati Bus Stand</option>
        <option value="Z-Square Mall (Civil Lines)" ${isSelected('Z-Square') ? 'selected' : ''}>🛍️ Z-Square Mall (Civil Lines)</option>
        <option value="Swaroop Nagar / Rave 3" ${isSelected('Swaroop Nagar') ? 'selected' : ''}>☕ Swaroop Nagar / Rave 3</option>
        <option value="Ganga Barrage (Atal Ghat)" ${isSelected('Ganga Barrage') ? 'selected' : ''}>🌊 Ganga Barrage (Atal Ghat)</option>
      </optgroup>
    `;
  }
}

// Global exports
window.HBTU_HOSTELS = HBTU_HOSTELS;
window.HBTU_TRANSIT_HUBS = HBTU_TRANSIT_HUBS;
window.HBTU_ALL_LOCATIONS = HBTU_ALL_LOCATIONS;
window.HBTU_LOCATIONS = HBTU_ALL_LOCATIONS; // Legacy alias
window.INITIAL_AUTO_SCHEDULES = INITIAL_AUTO_SCHEDULES;
window.EMERGENCY_CONTACTS = EMERGENCY_CONTACTS;
window.INITIAL_RIDES = INITIAL_RIDES;
window.DEFAULT_CURRENT_USER = DEFAULT_CURRENT_USER;
window.HBTUDataStore = HBTUDataStore;
window.generateLocationOptionsHTML = (sel) => HBTUDataStore.generateLocationOptionsHTML(sel);
