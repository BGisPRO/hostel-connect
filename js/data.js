/**
 * HBTU RidePool - Seed Data & Configurations
 * Harcourt Butler Technical University, Kanpur
 * 
 * Verified campus locations and structured hostel directory.
 */

// Official HBTU Hostels Directory
const HBTU_HOSTELS = [
  // Boys' Hostels - West Campus
  { id: 'ramanujan_hostel', name: 'Ramanujan Hostel', campus: 'West Campus (Awadhpuri)', category: 'boys', pickupPoint: 'West Campus Main Gate / Hostel Quad', lat: 26.4950, lng: 80.3015 },
  { id: 'shridharacharya_hostel', name: 'Shridharacharya Hostel', campus: 'West Campus (Awadhpuri)', category: 'boys', pickupPoint: 'West Campus Gate 2 / Parking', lat: 26.4950, lng: 80.3015 },
  { id: 'abdul_kalam_hostel', name: 'Abdul Kalam Hostel', campus: 'West Campus (Awadhpuri)', category: 'boys', pickupPoint: 'West Campus Tech Complex Gate', lat: 26.4950, lng: 80.3015 },
  { id: 'visvesvaraya_hostel', name: 'Visvesvaraya Hostel', campus: 'West Campus (Awadhpuri)', category: 'boys', pickupPoint: 'Visvesvaraya Gate / Awadhpuri Road', lat: 26.4950, lng: 80.3015 },

  // Boys' Hostels - East Campus
  { id: 'raman_hostel', name: 'Raman Hostel', campus: 'East Campus (Nawabganj)', category: 'boys', pickupPoint: 'East Campus Sports Lawn / Admin Gate', lat: 26.4862, lng: 80.3160 },
  { id: 'vishwakarma_hostel', name: 'Vishwakarma Hostel', campus: 'East Campus (Nawabganj)', category: 'boys', pickupPoint: 'Workshop Area Gate, East Campus', lat: 26.4862, lng: 80.3160 },
  { id: 'ambedkar_hostel', name: 'Ambedkar Hostel', campus: 'East Campus (Nawabganj)', category: 'boys', pickupPoint: 'East Campus Main Gate, Nawabganj', lat: 26.4862, lng: 80.3160 },
  { id: 'aryabhatt_hostel', name: 'Aryabhatt Hostel', campus: 'East Campus (Nawabganj)', category: 'boys', pickupPoint: 'Central Library Gate, East Campus', lat: 26.4862, lng: 80.3160 },

  // Girls' Hostels - West Campus
  { id: 'alaknanda_hostel', name: 'Alaknanda Hostel', campus: 'West Campus (Awadhpuri)', category: 'girls', pickupPoint: 'Alaknanda Gate / Security Post', lat: 26.4950, lng: 80.3015 },
  { id: 'mandakini_hostel', name: 'Mandakini Hostel', campus: 'West Campus (Awadhpuri)', category: 'girls', pickupPoint: 'Mandakini Circle / West Campus Gate', lat: 26.4950, lng: 80.3015 },

  // Girls' Hostels - East Campus
  { id: 'gangotri_hostel', name: 'Gangotri Hostel', campus: 'East Campus (Nawabganj)', category: 'girls', pickupPoint: 'East Campus Security Gate, Nawabganj', lat: 26.4862, lng: 80.3160 },
  { id: 'bhagirathi_hostel', name: 'Bhagirathi Hostel', campus: 'East Campus (Nawabganj)', category: 'girls', pickupPoint: 'East Campus Girls Hostel Complex Gate', lat: 26.4862, lng: 80.3160 },
  { id: 'kaveri_hostel', name: 'Kaveri Hostel', campus: 'East Campus (Nawabganj)', category: 'girls', pickupPoint: 'East Campus Health Centre Side Gate', lat: 26.4862, lng: 80.3160 },
  { id: 'saraswati_hostel', name: 'Saraswati Hostel', campus: 'East Campus (Nawabganj)', category: 'girls', pickupPoint: 'East Campus Main Avenue Gate', lat: 26.4862, lng: 80.3160 }
];

// Transit Hubs & Campuses
const HBTU_TRANSIT_HUBS = [
  { id: 'west_campus_gate', name: 'HBTU West Campus (Awadhpuri Gate)', category: 'campus', lat: 26.4950, lng: 80.3015 },
  { id: 'east_campus_gate', name: 'HBTU East Campus (Central Library Gate)', category: 'campus', lat: 26.4862, lng: 80.3160 },
  { id: 'kanpur_central', name: 'Kanpur Central Railway Station (CNB)', category: 'transit', lat: 26.4539, lng: 80.3513 },
  { id: 'lucknow_airport', name: 'Lucknow Airport (CCS / Amausi - LKO)', category: 'airport', lat: 26.7606, lng: 80.8893 },
  { id: 'kanpur_airport', name: 'Kanpur Airport (Chakeri - KNU)', category: 'airport', lat: 26.4410, lng: 80.4078 },
  { id: 'rawatpur_station', name: 'Rawatpur Railway Station', category: 'transit', lat: 26.4890, lng: 80.2980 },
  { id: 'jhakarkati_bus', name: 'Jhakarkati Inter-State Bus Stand', category: 'transit', lat: 26.4560, lng: 80.3390 },
  { id: 'z_square_mall', name: 'Z-Square Mall (Civil Lines)', category: 'hangout', lat: 26.4710, lng: 80.3530 },
  { id: 'swaroop_nagar', name: 'Swaroop Nagar / Rave 3', category: 'hangout', lat: 26.4780, lng: 80.3100 },
  { id: 'ganga_barrage', name: 'Ganga Barrage (Atal Ghat)', category: 'hangout', lat: 26.5050, lng: 80.3250 }
];

// Flat list for legacy support
const HBTU_LOCATIONS = [
  ...HBTU_TRANSIT_HUBS,
  ...HBTU_HOSTELS.map(h => ({
    id: h.id,
    name: `${h.name} (${h.campus.split(' ')[0]})`,
    type: 'hostel',
    landmark: h.pickupPoint,
    lat: h.lat,
    lng: h.lng
  }))
];

// Helper to generate categorized <optgroup> dropdown options
function generateLocationOptionsHTML(selectedName = '') {
  const boysHostels = HBTU_HOSTELS.filter(h => h.category === 'boys');
  const girlsHostels = HBTU_HOSTELS.filter(h => h.category === 'girls');

  return `
    <optgroup label="🏛️ HBTU Campus Gates">
      <option value="HBTU West Campus (Awadhpuri)" ${selectedName.includes('West Campus') ? 'selected' : ''}>HBTU West Campus (Awadhpuri Gate)</option>
      <option value="HBTU East Campus (Nawabganj)" ${selectedName.includes('East Campus') ? 'selected' : ''}>HBTU East Campus (Central Library Gate)</option>
    </optgroup>
    <optgroup label="🏢 Boys' Hostels">
      ${boysHostels.map(h => {
        const val = `${h.name} (${h.campus})`;
        return `<option value="${val}" ${selectedName === val ? 'selected' : ''}>${h.name} - ${h.campus.split(' ')[0]}</option>`;
      }).join('')}
    </optgroup>
    <optgroup label="🛡️ Girls' Hostels">
      ${girlsHostels.map(h => {
        const val = `${h.name} (${h.campus})`;
        return `<option value="${val}" ${selectedName === val ? 'selected' : ''}>${h.name} - ${h.campus.split(' ')[0]}</option>`;
      }).join('')}
    </optgroup>
    <optgroup label="✈️ Transit & City Hubs">
      <option value="Lucknow Airport (CCS / Amausi - LKO)" ${selectedName.includes('Lucknow') ? 'selected' : ''}>✈️ Lucknow Airport (CCS / LKO)</option>
      <option value="Kanpur Central Railway Station (CNB)" ${selectedName.includes('Kanpur Central') ? 'selected' : ''}>🚆 Kanpur Central Railway Station (CNB)</option>
      <option value="Kanpur Airport (Chakeri - KNU)" ${selectedName.includes('Chakeri') ? 'selected' : ''}>🛫 Kanpur Airport (Chakeri - KNU)</option>
      <option value="Rawatpur Railway Station" ${selectedName.includes('Rawatpur') ? 'selected' : ''}>🚆 Rawatpur Railway Station</option>
      <option value="Jhakarkati Inter-State Bus Stand" ${selectedName.includes('Jhakarkati') ? 'selected' : ''}>🚌 Jhakarkati Bus Stand</option>
      <option value="Z-Square Mall (Civil Lines)" ${selectedName.includes('Z-Square') ? 'selected' : ''}>🛍️ Z-Square Mall (Civil Lines)</option>
    </optgroup>
  `;
}

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

function getDateOffset(days = 0, hours = 0, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  d.setMinutes(minutes);
  return d.toISOString();
}

// Initial Student Carpools (Cleaned: no fake bookings, true student carpool coordination)
const INITIAL_RIDES = [
  {
    id: 'pool-101',
    from: 'Ramanujan Hostel (West Campus)',
    fromDetail: 'Gate 2 / New Complex Awadhpuri',
    to: 'Lucknow Airport (CCS / Amausi - LKO)',
    toDetail: 'Terminal 3 Departures',
    departureTime: getDateOffset(1, 4, 30), // Tomorrow afternoon
    totalFare: 1800,
    totalSeats: 4,
    bookedSeats: 2,
    genderPref: 'any',
    vehicleType: 'Sedan (Dzire / Etios)',
    serviceProvider: 'Uber Intercity (1-Tap Dispatch)',
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
    notes: 'Heading home for mid-term break. Flight at 6:45 PM. Co-riders will split total fare once all 4 seats lock!',
    passengers: [
      { name: 'Aditya Srivastava (Host)', roll: '210101015', gender: 'M', joinedAt: 'Yesterday', paid: true },
      { name: 'Rohan Verma', roll: '220102030', gender: 'M', joinedAt: '3 hrs ago', paid: false }
    ],
    chat: [
      { sender: 'Aditya Srivastava', time: '10:15 AM', message: 'Hey guys, once all 4 seats are locked, I will trigger 1-tap Uber Intercity dispatch.' },
      { sender: 'Rohan Verma', time: '11:30 AM', message: 'Awesome Aditya! I have one medium trolley bag, will it fit?' },
      { sender: 'Aditya Srivastava', time: '11:32 AM', message: 'Yes easily! The Sedan boot has ample space for 3 trolleys.' }
    ]
  },
  {
    id: 'pool-102',
    from: 'Alaknanda Hostel (West Campus)',
    fromDetail: 'Alaknanda Girls Hostel Security Gate',
    to: 'Kanpur Central Railway Station (CNB)',
    toDetail: 'Cantt Side Entry (Platform 1)',
    departureTime: getDateOffset(0, 3, 0), // Today evening
    totalFare: 280,
    totalSeats: 3,
    bookedSeats: 1,
    genderPref: 'girls_only',
    vehicleType: 'Sedan (Dzire / Etios)',
    serviceProvider: 'Uber Go (1-Tap Dispatch)',
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
    notes: 'Heading to Kanpur Central for Vande Bharat train. Girls only carpool please!',
    passengers: [
      { name: 'Ananya Mishra (Host)', roll: '220104018', gender: 'F', joinedAt: 'Yesterday', paid: true }
    ],
    chat: [
      { sender: 'Ananya Mishra', time: '02:00 PM', message: 'Meeting directly at Alaknanda gate by 5:00 PM.' }
    ]
  },
  {
    id: 'pool-103',
    from: 'Kanpur Central Railway Station (CNB)',
    fromDetail: 'Cantt Side Taxi Stand, Platform 1',
    to: 'HBTU West Campus (Awadhpuri)',
    toDetail: 'Visvesvaraya / Kalam Hostel',
    departureTime: getDateOffset(0, 1, 15), // Coming in 1 hour
    totalFare: 320,
    totalSeats: 4,
    bookedSeats: 3,
    genderPref: 'any',
    vehicleType: 'Hatchback / Mini',
    serviceProvider: 'Ola Mini (1-Tap Dispatch)',
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
    notes: 'Arriving from Delhi by Shatabdi. 1 seat open to West Campus! ₹80 each.',
    passengers: [
      { name: 'Priyanshu Tiwari (Host)', roll: '230103042', gender: 'M', joinedAt: 'Today', paid: true },
      { name: 'Sameer Khan', roll: '230103011', gender: 'M', joinedAt: 'Today', paid: true },
      { name: 'Harshit Gupta', roll: '230101088', gender: 'M', joinedAt: '1 hr ago', paid: true }
    ],
    chat: [
      { sender: 'Priyanshu Tiwari', time: '06:00 PM', message: 'Train is on time at Platform 1. Meet at Cantt taxi stand.' }
    ]
  },
  {
    id: 'pool-104',
    from: 'Raman Hostel (East Campus)',
    fromDetail: 'East Campus Sports Lawn / Admin Gate',
    to: 'HBTU West Campus (Awadhpuri)',
    toDetail: 'DBRA Gate / Campus Canteen',
    departureTime: getDateOffset(0, 0, 45), // In 45 mins
    totalFare: 120,
    totalSeats: 4,
    bookedSeats: 2,
    genderPref: 'any',
    vehicleType: 'Campus Auto / E-Rickshaw',
    serviceProvider: 'Gate Auto Stand (Shared)',
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
    notes: 'Direct E-Rickshaw shuttle from East Campus to West Campus. Only ₹30 per head via UPI!',
    passengers: [
      { name: 'Divyansh Singh (Host)', roll: '220105021', gender: 'M', joinedAt: 'Today', paid: true },
      { name: 'Tanmay Saxena', roll: '220105055', gender: 'M', joinedAt: '15 mins ago', paid: true }
    ],
    chat: []
  },
  {
    id: 'pool-105',
    from: 'Gangotri Hostel (East Campus)',
    fromDetail: 'Gangotri Hostel Gate, Nawabganj',
    to: 'Z-Square Mall (Civil Lines)',
    toDetail: 'Main Entrance / Food Court',
    departureTime: getDateOffset(2, 5, 0),
    totalFare: 240,
    totalSeats: 4,
    bookedSeats: 1,
    genderPref: 'girls_only',
    vehicleType: 'Sedan (Dzire / Etios)',
    serviceProvider: 'Rapido / Uber Go',
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
    notes: 'Saturday movie & shopping trip to Z-Square Mall. Booking Uber/Rapido when 4 join. Girls only.',
    passengers: [
      { name: 'Sneha Pandey (Host)', roll: '210106033', gender: 'F', joinedAt: '2 days ago', paid: true }
    ],
    chat: []
  },
  {
    id: 'pool-106',
    from: 'Visvesvaraya Hostel (West Campus)',
    fromDetail: 'Visvesvaraya Hostel Parking',
    to: 'Kanpur Airport (Chakeri - KNU)',
    toDetail: 'Departure Terminal Check-in',
    departureTime: getDateOffset(3, 2, 0),
    totalFare: 650,
    totalSeats: 4,
    bookedSeats: 1,
    genderPref: 'any',
    vehicleType: 'Sedan (Dzire / Etios)',
    serviceProvider: 'Uber Go (1-Tap Dispatch)',
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
    notes: 'IndiGo flight to Mumbai from Kanpur Chakeri Airport. Cab split makes it ~₹160 each.',
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
  hostel: 'Alaknanda Hostel (West Campus)',
  phone: '9871234560',
  whatsapp: '919871234560',
  upiId: 'kavya.sharma@okaxis',
  gender: 'F',
  verified: true,
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kavya'
};
