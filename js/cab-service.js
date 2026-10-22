/**
 * HBTU RidePool - Transit Engine & Cab Deep-Link Builder
 * Harcourt Butler Technical University, Kanpur
 * 
 * Accurately resolves GPS coordinates for hostels & hubs, computes realistic road distances,
 * builds verified deep-links for Uber, Ola, Rapido and Google Maps, and handles fair fare splitting.
 */

// Core Verified Coordinates Map
const HBTU_GEO_COORDINATES = {
  west_campus: { lat: 26.4950, lng: 80.3015, name: 'HBTU West Campus (Awadhpuri Gate)', address: 'Awadhpuri, Rawatpur, Kanpur' },
  east_campus: { lat: 26.4862, lng: 80.3160, name: 'HBTU East Campus (Central Library Gate)', address: 'Nawabganj, Kanpur' },
  lucknow_airport: { lat: 26.7606, lng: 80.8893, name: 'Lucknow Airport (CCS / Amausi - LKO)', address: 'Amausi, Lucknow' },
  kanpur_central: { lat: 26.4539, lng: 80.3513, name: 'Kanpur Central Railway Station (CNB)', address: 'Cantt Side Platform 1, Kanpur' },
  kanpur_airport: { lat: 26.4410, lng: 80.4078, name: 'Kanpur Airport (Chakeri - KNU)', address: 'Chakeri Domestic Terminal, Kanpur' },
  rawatpur: { lat: 26.4890, lng: 80.2980, name: 'Rawatpur Railway Station', address: 'Rawatpur, Kanpur' },
  z_square: { lat: 26.4710, lng: 80.3530, name: 'Z-Square Mall (Civil Lines)', address: '16/113 MG Road, Civil Lines, Kanpur' },
  swaroop_nagar: { lat: 26.4780, lng: 80.3100, name: 'Swaroop Nagar / Rave 3', address: 'Swaroop Nagar, Kanpur' },
  ganga_barrage: { lat: 26.5050, lng: 80.3250, name: 'Ganga Barrage (Atal Ghat)', address: 'Nawabganj Ganga Ghat, Kanpur' },
  jhakarkati: { lat: 26.4560, lng: 80.3390, name: 'Jhakarkati Inter-State Bus Stand', address: 'GT Road, Kanpur' }
};

const CAB_SERVICES = [
  {
    id: 'uber',
    name: 'Uber',
    type: 'Uber Go / Auto / Intercity',
    icon: '⬛',
    color: '#000000',
    badgeClass: 'badge-uber',
    btnClass: 'btn-uber',
    baseMultiplier: 1.0,
    typicalArrival: '3–6 mins',
    disclaimer: 'Opens pickup & destination in Uber. Ride must be confirmed in the Uber app.',
    buildLink: (from, to) => {
      const p = HBTUCabEngine.resolveCoords(from);
      const d = HBTUCabEngine.resolveCoords(to);
      return `https://m.uber.com/ul/?action=setPickup&client_id=hbtu_pool&pickup[latitude]=${p.lat}&pickup[longitude]=${p.lng}&pickup[nickname]=${encodeURIComponent(p.name)}&dropoff[latitude]=${d.lat}&dropoff[longitude]=${d.lng}&dropoff[nickname]=${encodeURIComponent(d.name)}`;
    }
  },
  {
    id: 'ola',
    name: 'Ola',
    type: 'Mini / Prime / Auto',
    icon: '🟢',
    color: '#10b981',
    badgeClass: 'badge-ola',
    btnClass: 'btn-ola',
    baseMultiplier: 0.95,
    typicalArrival: '4–7 mins',
    disclaimer: 'Opens Ola web/app with pre-filled locations. Confirm ride within Ola.',
    buildLink: (from, to) => {
      const p = HBTUCabEngine.resolveCoords(from);
      const d = HBTUCabEngine.resolveCoords(to);
      return `https://book.olacabs.com/?lat=${p.lat}&lng=${p.lng}&drop_lat=${d.lat}&drop_lng=${d.lng}&pickup_name=${encodeURIComponent(p.name)}&drop_name=${encodeURIComponent(d.name)}`;
    }
  },
  {
    id: 'rapido',
    name: 'Rapido',
    type: 'Cab Economy / Auto',
    icon: '🟡',
    color: '#facc15',
    badgeClass: 'badge-rapido',
    btnClass: 'btn-rapido',
    baseMultiplier: 0.88,
    typicalArrival: '2–5 mins',
    disclaimer: 'Opens Rapido booking portal with selected coordinates.',
    buildLink: (from, to) => {
      const p = HBTUCabEngine.resolveCoords(from);
      const d = HBTUCabEngine.resolveCoords(to);
      return `https://www.rapido.bike/?pickup_lat=${p.lat}&pickup_lng=${p.lng}&pickup_address=${encodeURIComponent(p.name)}&drop_lat=${d.lat}&drop_lng=${d.lng}&drop_address=${encodeURIComponent(d.name)}`;
    }
  },
  {
    id: 'campus_auto',
    name: 'Campus Auto',
    type: 'Shared Electric Shuttle',
    icon: '🛺',
    color: '#0d9488',
    badgeClass: 'badge-teal',
    btnClass: 'btn-teal',
    baseMultiplier: 0.40,
    typicalArrival: 'At Campus Gate',
    disclaimer: 'Board directly at West Awadhpuri Gate or East Central Library Gate.',
    buildLink: () => '#campus-auto'
  }
];

class HBTUCabEngine {
  /**
   * Resolves a string or object into guaranteed coordinates and place name
   */
  static resolveCoords(str) {
    if (!str) return HBTU_GEO_COORDINATES.west_campus;
    if (typeof str === 'object' && str.lat && str.lng) {
      return {
        lat: parseFloat(str.lat),
        lng: parseFloat(str.lng),
        name: str.name || str.placeName || 'Selected Location'
      };
    }

    const lower = String(str).toLowerCase().trim();

    // 1. Search in structured hostels list
    if (typeof HBTU_HOSTELS !== 'undefined') {
      const matchedHostel = HBTU_HOSTELS.find(h => {
        if (lower.includes(h.name.toLowerCase())) return true;
        if (h.aliases && h.aliases.some(a => lower.includes(a))) return true;
        return false;
      });

      if (matchedHostel) {
        return {
          lat: matchedHostel.lat,
          lng: matchedHostel.lng,
          name: `${matchedHostel.name} (${matchedHostel.campus.split(' ')[0]})`
        };
      }
    }

    // 2. Search in transit hubs
    if (typeof HBTU_TRANSIT_HUBS !== 'undefined') {
      const matchedHub = HBTU_TRANSIT_HUBS.find(hub => {
        if (lower.includes(hub.name.toLowerCase())) return true;
        if (hub.aliases && hub.aliases.some(a => lower.includes(a))) return true;
        return false;
      });

      if (matchedHub) {
        return {
          lat: matchedHub.lat,
          lng: matchedHub.lng,
          name: matchedHub.name
        };
      }
    }

    // 3. Keyword matching fallbacks
    if (lower.includes('lucknow') || lower.includes('amausi') || lower.includes('lko')) return HBTU_GEO_COORDINATES.lucknow_airport;
    if (lower.includes('central') || lower.includes('cnb') || lower.includes('station')) return HBTU_GEO_COORDINATES.kanpur_central;
    if (lower.includes('chakeri') || lower.includes('knu')) return HBTU_GEO_COORDINATES.kanpur_airport;
    if (lower.includes('z-square') || lower.includes('civil lines')) return HBTU_GEO_COORDINATES.z_square;
    if (lower.includes('swaroop') || lower.includes('rave 3')) return HBTU_GEO_COORDINATES.swaroop_nagar;
    if (lower.includes('barrage') || lower.includes('atal ghat')) return HBTU_GEO_COORDINATES.ganga_barrage;
    if (lower.includes('rawatpur')) return HBTU_GEO_COORDINATES.rawatpur;
    if (lower.includes('jhakarkati')) return HBTU_GEO_COORDINATES.jhakarkati;
    if (lower.includes('east') || lower.includes('nawabganj') || lower.includes('library')) return HBTU_GEO_COORDINATES.east_campus;

    return HBTU_GEO_COORDINATES.west_campus;
  }

  /**
   * Computes accurate Haversine distance with real-world city route factor (~1.30)
   */
  static getDistanceKm(fromStr, toStr) {
    const f = this.resolveCoords(fromStr);
    const t = this.resolveCoords(toStr);

    const R = 6371; // Earth radius in km
    const dLat = (t.lat - f.lat) * Math.PI / 180;
    const dLon = (t.lng - f.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(f.lat * Math.PI / 180) * Math.cos(t.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // City road factor
    const roadKm = Math.round(R * c * 1.30);
    return Math.max(2, roadKm);
  }

  /**
   * Generates indicative commercial cab tariffs for comparisons
   */
  static getCabOptions(fromStr, toStr) {
    const distKm = this.getDistanceKm(fromStr, toStr);

    // Realistic Kanpur Base Fare model
    let base = 60 + (distKm * 18);
    if (distKm > 40) base += 350; // Highway toll & intercity surcharge (e.g. Lucknow corridor)
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

  /**
   * Generates Google Maps directions link
   */
  static getGoogleMapsLink(fromStr, toStr) {
    const p = this.resolveCoords(fromStr);
    const d = this.resolveCoords(toStr);
    return `https://www.google.com/maps/dir/?api=1&origin=${p.lat},${p.lng}&destination=${d.lat},${d.lng}`;
  }

  /**
   * Transparent fare calculation rule
   */
  static calculateFareSplit(totalFare, totalSeats) {
    const fare = parseInt(totalFare, 10) || 0;
    const seats = Math.max(1, parseInt(totalSeats, 10) || 4);
    const perPerson = Math.ceil(fare / seats);
    return {
      totalFare: fare,
      totalSeats: seats,
      farePerPerson: perPerson,
      formulaExplanation: `₹${fare} total divided equally among ${seats} seats (including ride creator) = ₹${perPerson} per student.`
    };
  }

  /**
   * Generates dynamic UPI Intent string and QR code
   */
  static generateUPILink(upiId, payeeName, amount, rideId) {
    const cleanUpi = (upiId || 'hbtu.cabpool@okaxis').trim();
    const cleanName = encodeURIComponent(payeeName || 'HBTU Student');
    const note = encodeURIComponent(`HBTU RidePool #${rideId || 'Pool'}`);
    const upiUri = `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${amount}&cu=INR&tn=${note}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(upiUri)}`;

    return {
      upiUri,
      qrUrl,
      amount,
      upiId: cleanUpi,
      payeeName: payeeName || 'HBTU Host'
    };
  }
}

// Global exports
window.HBTU_GEO_COORDINATES = HBTU_GEO_COORDINATES;
window.CAB_SERVICES = CAB_SERVICES;
window.HBTUCabEngine = HBTUCabEngine;
