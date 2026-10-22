/**
 * HBTU CabPool - Smart Cab & Transit Engine
 * Minimalist Direct Booking & Auto-Take Link Builder for Uber, Rapido & Ola
 */

// Accurate GPS Coordinates for HBTU & Transit Hubs
const HBTU_GEO_COORDINATES = {
  west_campus: { lat: 26.4950, lng: 80.3015, name: 'HBTU West Campus Gate', address: 'Awadhpuri, Rawatpur, Kanpur' },
  east_campus: { lat: 26.4862, lng: 80.3160, name: 'HBTU East Campus Library', address: 'Nawabganj, Kanpur' },
  lucknow_airport: { lat: 26.7606, lng: 80.8893, name: 'Lucknow Airport (LKO) Terminal 3', address: 'Amausi, Lucknow' },
  kanpur_central: { lat: 26.4539, lng: 80.3513, name: 'Kanpur Central Railway Station (CNB)', address: 'Cantt Side Platform 1, Kanpur' },
  kanpur_airport: { lat: 26.4410, lng: 80.4078, name: 'Kanpur Airport (Chakeri - KNU)', address: 'Chakeri, Kanpur' },
  rawatpur: { lat: 26.4890, lng: 80.2980, name: 'Rawatpur Station', address: 'Rawatpur, Kanpur' },
  z_square: { lat: 26.4710, lng: 80.3530, name: 'Z-Square Mall', address: 'Civil Lines, Kanpur' },
  jhakarkati: { lat: 26.4560, lng: 80.3390, name: 'Jhakarkati Bus Terminal', address: 'GT Road, Kanpur' }
};

const CAB_SERVICES = [
  {
    id: 'rapido',
    name: 'Rapido',
    type: 'Cab / Auto',
    icon: '🟡',
    color: '#facc15',
    btnClass: 'btn-rapido',
    baseMultiplier: 0.88,
    eta: '3 mins',
    buildLink: (from, to) => {
      const p = HBTUCabEngine.resolveCoords(from);
      const d = HBTUCabEngine.resolveCoords(to);
      return `https://www.rapido.bike/?pickup_lat=${p.lat}&pickup_lng=${p.lng}&pickup_address=${encodeURIComponent(p.name)}&drop_lat=${d.lat}&drop_lng=${d.lng}&drop_address=${encodeURIComponent(d.name)}`;
    }
  },
  {
    id: 'uber',
    name: 'Uber',
    type: 'Uber Go / Auto',
    icon: '⬛',
    color: '#ffffff',
    btnClass: 'btn-uber',
    baseMultiplier: 1.0,
    eta: '4 mins',
    buildLink: (from, to) => {
      const p = HBTUCabEngine.resolveCoords(from);
      const d = HBTUCabEngine.resolveCoords(to);
      return `https://m.uber.com/ul/?action=setPickup&client_id=hbtu_pool&pickup[latitude]=${p.lat}&pickup[longitude]=${p.lng}&pickup[nickname]=${encodeURIComponent(p.name)}&dropoff[latitude]=${d.lat}&dropoff[longitude]=${d.lng}&dropoff[nickname]=${encodeURIComponent(d.name)}`;
    }
  },
  {
    id: 'ola',
    name: 'Ola',
    type: 'Mini / Prime',
    icon: '🟢',
    color: '#10b981',
    btnClass: 'btn-ola',
    baseMultiplier: 0.95,
    eta: '5 mins',
    buildLink: (from, to) => {
      const p = HBTUCabEngine.resolveCoords(from);
      const d = HBTUCabEngine.resolveCoords(to);
      return `https://book.olacabs.com/?lat=${p.lat}&lng=${p.lng}&drop_lat=${d.lat}&drop_lng=${d.lng}&pickup_name=${encodeURIComponent(p.name)}&drop_name=${encodeURIComponent(d.name)}`;
    }
  },
  {
    id: 'campus_auto',
    name: 'Campus Auto',
    type: 'Shared Rickshaw',
    icon: '🛺',
    color: '#38bdf8',
    btnClass: 'btn-cyan',
    baseMultiplier: 0.45,
    eta: 'Instant',
    buildLink: () => '#campus-auto'
  }
];

class HBTUCabEngine {
  static resolveCoords(str) {
    if (!str) return HBTU_GEO_COORDINATES.west_campus;
    if (typeof str === 'object' && str.lat && str.lng) return str;
    const lower = str.toLowerCase();

    // Check structured hostel records
    if (typeof HBTU_HOSTELS !== 'undefined') {
      const h = HBTU_HOSTELS.find(hostel => lower.includes(hostel.name.toLowerCase()) || lower.includes(hostel.id));
      if (h) {
        return h.campus.includes('West') ? HBTU_GEO_COORDINATES.west_campus : HBTU_GEO_COORDINATES.east_campus;
      }
    }

    if (lower.includes('west') || lower.includes('dbra') || lower.includes('ramanujan') || lower.includes('shridharacharya') || lower.includes('kalam') || lower.includes('visvesvaraya') || lower.includes('alaknanda') || lower.includes('mandakini')) {
      return HBTU_GEO_COORDINATES.west_campus;
    }
    if (lower.includes('east') || lower.includes('nawabganj') || lower.includes('library') || lower.includes('raman') || lower.includes('vishwakarma') || lower.includes('ambedkar') || lower.includes('aryabhatt') || lower.includes('gangotri') || lower.includes('bhagirathi') || lower.includes('kaveri') || lower.includes('saraswati')) {
      return HBTU_GEO_COORDINATES.east_campus;
    }
    if (lower.includes('lucknow') || lower.includes('amausi') || lower.includes('lko')) return HBTU_GEO_COORDINATES.lucknow_airport;
    if (lower.includes('central') || lower.includes('cnb') || lower.includes('station')) return HBTU_GEO_COORDINATES.kanpur_central;
    if (lower.includes('chakeri') || lower.includes('knu')) return HBTU_GEO_COORDINATES.kanpur_airport;
    if (lower.includes('z-square') || lower.includes('civil lines')) return HBTU_GEO_COORDINATES.z_square;
    if (lower.includes('rawatpur')) return HBTU_GEO_COORDINATES.rawatpur;
    if (lower.includes('jhakarkati')) return HBTU_GEO_COORDINATES.jhakarkati;

    return HBTU_GEO_COORDINATES.west_campus;
  }

  static getDistanceKm(fromStr, toStr) {
    const f = this.resolveCoords(fromStr);
    const t = this.resolveCoords(toStr);

    const R = 6371;
    const dLat = (t.lat - f.lat) * Math.PI / 180;
    const dLon = (t.lng - f.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(f.lat * Math.PI / 180) * Math.cos(t.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(3, Math.round(R * c * 1.35));
  }

  static getCabOptions(fromStr, toStr) {
    const distKm = this.getDistanceKm(fromStr, toStr);

    let base = 60 + (distKm * 18);
    if (distKm > 40) base += 350; // Toll / intercity fee
    base = Math.round(base / 10) * 10;

    return CAB_SERVICES.map(s => {
      const soloFare = Math.round((base * s.baseMultiplier) / 10) * 10;
      const split4 = Math.ceil(soloFare / 4);
      const link = s.buildLink(fromStr, toStr);

      return {
        ...s,
        distKm,
        soloFare,
        split4,
        link
      };
    });
  }

  static generateUPILink(upiId, payeeName, amount, rideId) {
    const cleanUpi = (upiId || 'hbtu.cabpool@okaxis').trim();
    const cleanName = encodeURIComponent(payeeName || 'HBTU Host');
    const note = encodeURIComponent(`HBTU CabPool Split #${rideId || 'Ride'}`);
    const upiUri = `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${amount}&cu=INR&tn=${note}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`;

    return { upiUri, qrUrl, amount, upiId: cleanUpi };
  }
}

window.HBTUCabEngine = HBTUCabEngine;
window.CAB_SERVICES = CAB_SERVICES;
