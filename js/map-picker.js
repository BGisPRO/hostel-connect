/**
 * HBTU RidePool - Interactive Map Location Picker (Leaflet + OpenStreetMap)
 * Harcourt Butler Technical University, Kanpur
 * 
 * Complies with OpenStreetMap usage policy (attribution, rate limits, no API keys exposed).
 */

class HBTUMapPicker {
  constructor() {
    this.map = null;
    this.marker = null;
    this.activeCallback = null;
    this.activeCoords = { lat: 26.4950, lng: 80.3015 }; // Default West Campus
    this.activePlaceName = 'HBTU West Campus (Awadhpuri Gate)';
    this.geocodeTimeout = null;
    this.isGeocoding = false;
    this.lastGeocodeTime = 0;
    this.minGeocodeInterval = 1200; // 1.2s Nominatim rate limit
  }

  init() {
    const mapContainer = document.getElementById('leafletMapPicker');
    if (!mapContainer || typeof L === 'undefined') return;

    if (this.map) {
      this.map.invalidateSize();
      return;
    }

    // Initialize Leaflet Map centered on HBTU Kanpur
    this.map = L.map('leafletMapPicker', {
      center: [26.4910, 80.3080],
      zoom: 13,
      zoomControl: true
    });

    // OpenStreetMap standard tile layer with required attribution
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Custom Icon for Draggable Pin
    const pinIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="pin-marker-glow">
          <div class="pin-head">📍</div>
          <div class="pin-pulse"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 34]
    });

    // Create Draggable Pin Marker
    this.marker = L.marker([this.activeCoords.lat, this.activeCoords.lng], {
      draggable: true,
      icon: pinIcon
    }).addTo(this.map);

    // Drag events
    this.marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      this.onLocationSelected(pos.lat, pos.lng, true);
    });

    // Map Click to place marker
    this.map.on('click', (e) => {
      this.marker.setLatLng(e.latlng);
      this.onLocationSelected(e.latlng.lat, e.latlng.lng, true);
    });

    // Add preset verified campus markers
    this.addCampusPresetMarkers();

    // Bind modal UI controls
    this.bindUI();
  }

  addCampusPresetMarkers() {
    if (!this.map || typeof L === 'undefined') return;

    const keyPoints = [
      { name: '🏛️ HBTU West Campus (Awadhpuri)', lat: 26.4950, lng: 80.3015, desc: 'DBRA Gate & Boys/Girls Hostels' },
      { name: '🏛️ HBTU East Campus (Nawabganj)', lat: 26.4862, lng: 80.3160, desc: 'Central Library, Admin & Hostels' },
      { name: '🚆 Kanpur Central Station (CNB)', lat: 26.4539, lng: 80.3513, desc: 'Platform 1 / Cantt Taxi Stand' },
      { name: '✈️ Lucknow Airport (CCS / LKO)', lat: 26.7606, lng: 80.8893, desc: 'Terminal 3 Departures' },
      { name: '🛫 Kanpur Airport (Chakeri)', lat: 26.4410, lng: 80.4078, desc: 'Domestic Flights Terminal' },
      { name: '🛍️ Z-Square Mall (Civil Lines)', lat: 26.4710, lng: 80.3530, desc: 'Mall & Multiplex Pickup Gate' }
    ];

    keyPoints.forEach(pt => {
      const landmarkIcon = L.divIcon({
        className: 'landmark-map-dot',
        html: `<div class="landmark-dot-inner" title="${pt.name}"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const m = L.marker([pt.lat, pt.lng], { icon: landmarkIcon }).addTo(this.map);
      m.bindTooltip(`<strong>${pt.name}</strong><br><small>${pt.desc}</small>`, { direction: 'top', offset: [0, -6] });
      m.on('click', () => {
        this.marker.setLatLng([pt.lat, pt.lng]);
        this.map.panTo([pt.lat, pt.lng]);
        this.activeCoords = { lat: pt.lat, lng: pt.lng };
        this.activePlaceName = pt.name.replace(/^[^\s]+\s/, '');
        this.updateDisplayUI();
      });
    });
  }

  bindUI() {
    const searchInp = document.getElementById('mapSearchInput');
    const searchBtn = document.getElementById('btnMapSearchExecute');
    const confirmBtn = document.getElementById('btnConfirmMapLocation');
    const presetsContainer = document.getElementById('mapPresetChips');

    // Search on enter or button click
    searchBtn?.addEventListener('click', () => {
      if (searchInp && searchInp.value) this.searchLocation(searchInp.value.trim());
    });

    searchInp?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (searchInp.value) this.searchLocation(searchInp.value.trim());
      }
    });

    // Confirm button
    confirmBtn?.addEventListener('click', () => {
      if (typeof this.activeCallback === 'function') {
        this.activeCallback({
          placeName: this.activePlaceName,
          lat: this.activeCoords.lat,
          lng: this.activeCoords.lng,
          formattedCoords: `${this.activeCoords.lat.toFixed(4)}, ${this.activeCoords.lng.toFixed(4)}`
        });
      }
      this.close();
    });

    // Populate quick presets (West Campus, East Campus, Hostels, Kanpur Central)
    if (presetsContainer && typeof HBTU_HOSTELS !== 'undefined') {
      const topPresets = [
        { label: '🏛️ West Campus', lat: 26.4950, lng: 80.3015, name: 'HBTU West Campus (Awadhpuri)' },
        { label: '🏛️ East Campus', lat: 26.4862, lng: 80.3160, name: 'HBTU East Campus (Nawabganj)' },
        { label: '🏢 Ramanujan Hostel', lat: 26.4950, lng: 80.3015, name: 'Ramanujan Hostel, West Campus' },
        { label: '🛡️ Alaknanda Hostel', lat: 26.4950, lng: 80.3015, name: 'Alaknanda Hostel, West Campus' },
        { label: '🏢 Raman Hostel', lat: 26.4862, lng: 80.3160, name: 'Raman Hostel, East Campus' },
        { label: '🛡️ Gangotri Hostel', lat: 26.4862, lng: 80.3160, name: 'Gangotri Hostel, East Campus' },
        { label: '🚆 Kanpur Central', lat: 26.4539, lng: 80.3513, name: 'Kanpur Central Railway Station (CNB)' },
        { label: '✈️ Lucknow Airport', lat: 26.7606, lng: 80.8893, name: 'Lucknow Airport (CCS / LKO)' }
      ];

      presetsContainer.innerHTML = topPresets.map(p => `
        <button type="button" class="map-preset-chip" data-lat="${p.lat}" data-lng="${p.lng}" data-name="${p.name}">
          ${p.label}
        </button>
      `).join('');

      presetsContainer.querySelectorAll('.map-preset-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const lat = parseFloat(btn.getAttribute('data-lat'));
          const lng = parseFloat(btn.getAttribute('data-lng'));
          const name = btn.getAttribute('data-name');
          this.setCoordinates(lat, lng, name, true);
        });
      });
    }
  }

  setCoordinates(lat, lng, placeName = null, pan = true) {
    this.activeCoords = { lat, lng };
    if (placeName) {
      this.activePlaceName = placeName;
    }
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    }
    if (this.map && pan) {
      this.map.panTo([lat, lng]);
    }
    this.updateDisplayUI();
  }

  onLocationSelected(lat, lng, triggerGeocode = true) {
    this.activeCoords = { lat, lng };
    this.updateDisplayUI(true);

    if (triggerGeocode) {
      this.debouncedReverseGeocode(lat, lng);
    }
  }

  debouncedReverseGeocode(lat, lng) {
    clearTimeout(this.geocodeTimeout);

    const now = Date.now();
    const elapsed = now - this.lastGeocodeTime;
    const delay = elapsed < this.minGeocodeInterval ? (this.minGeocodeInterval - elapsed) : 300;

    const statusEl = document.getElementById('mapGeocodeStatus');
    if (statusEl) statusEl.textContent = 'Identifying place name via OpenStreetMap...';

    this.geocodeTimeout = setTimeout(() => {
      this.executeReverseGeocode(lat, lng);
    }, delay);
  }

  async executeReverseGeocode(lat, lng) {
    const statusEl = document.getElementById('mapGeocodeStatus');
    this.lastGeocodeTime = Date.now();

    // Check if close to known campus points first (0.003 deg ~ 300 meters)
    const known = this.findNearestKnownLandmark(lat, lng);
    if (known) {
      this.activePlaceName = known.name;
      this.updateDisplayUI();
      if (statusEl) statusEl.textContent = '📍 Campus landmark detected';
      return;
    }

    try {
      // Nominatim reverse geocode with proper User-Agent header
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('Geocoding status ' + res.status);
      const data = await res.json();

      if (data && data.display_name) {
        // Construct concise readable place name
        const parts = data.display_name.split(',');
        const shortName = parts.slice(0, 3).join(',').trim();
        this.activePlaceName = shortName;
        if (statusEl) statusEl.textContent = '✓ Location identified';
      } else {
        this.activePlaceName = `Selected Spot (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        if (statusEl) statusEl.textContent = 'Custom coordinates pin selected';
      }
    } catch (err) {
      console.warn('Nominatim reverse geocode fallback:', err);
      // Fallback gracefully without breaking UI
      const nearest = this.findNearestKnownLandmark(lat, lng, 0.05);
      if (nearest) {
        this.activePlaceName = `${nearest.name} Area (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      } else {
        this.activePlaceName = `Kanpur Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      }
      if (statusEl) statusEl.textContent = 'Pin coordinates set (Geocoding server busy/offline)';
    }

    this.updateDisplayUI();
  }

  async searchLocation(query) {
    const statusEl = document.getElementById('mapGeocodeStatus');
    if (statusEl) statusEl.textContent = `Searching "${query}"...`;

    // 1. Check local hostels and campus list first
    const qLower = query.toLowerCase();
    if (typeof HBTU_HOSTELS !== 'undefined') {
      const matchHostel = HBTU_HOSTELS.find(h => h.name.toLowerCase().includes(qLower));
      if (matchHostel) {
        this.setCoordinates(matchHostel.lat, matchHostel.lng, `${matchHostel.name}, ${matchHostel.campus}`, true);
        if (statusEl) statusEl.textContent = `✓ Found ${matchHostel.name}`;
        return;
      }
    }

    // 2. Query Nominatim with rate limiting
    try {
      const boundedQuery = query.includes('Kanpur') || query.includes('Lucknow') ? query : `${query}, Kanpur, Uttar Pradesh`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(boundedQuery)}&limit=1`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const results = await res.json();

      if (results && results.length > 0) {
        const item = results[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const nameParts = item.display_name.split(',');
        const shortName = nameParts.slice(0, 3).join(',').trim();
        this.setCoordinates(lat, lng, shortName, true);
        if (statusEl) statusEl.textContent = `✓ Found: ${shortName}`;
      } else {
        if (statusEl) statusEl.textContent = `No matches found for "${query}". Drag pin manually.`;
      }
    } catch (err) {
      if (statusEl) statusEl.textContent = `Search server busy. Drag marker on map.`;
    }
  }

  findNearestKnownLandmark(lat, lng, maxThreshold = 0.005) {
    const landmarks = [
      { name: 'HBTU West Campus (Awadhpuri)', lat: 26.4950, lng: 80.3015 },
      { name: 'HBTU East Campus (Nawabganj)', lat: 26.4862, lng: 80.3160 },
      { name: 'Kanpur Central Railway Station (CNB)', lat: 26.4539, lng: 80.3513 },
      { name: 'Rawatpur Railway Station', lat: 26.4890, lng: 80.2980 },
      { name: 'Z-Square Mall (Civil Lines)', lat: 26.4710, lng: 80.3530 },
      { name: 'Kanpur Airport (Chakeri)', lat: 26.4410, lng: 80.4078 },
      { name: 'Lucknow Airport (CCS / LKO)', lat: 26.7606, lng: 80.8893 }
    ];

    let closest = null;
    let minD = Infinity;

    for (const lm of landmarks) {
      const d = Math.sqrt(Math.pow(lat - lm.lat, 2) + Math.pow(lng - lm.lng, 2));
      if (d < minD && d <= maxThreshold) {
        minD = d;
        closest = lm;
      }
    }

    return closest;
  }

  updateDisplayUI(onlyCoords = false) {
    const coordsEl = document.getElementById('mapSelectedCoords');
    const placeEl = document.getElementById('mapSelectedPlaceName');

    if (coordsEl) {
      coordsEl.textContent = `${this.activeCoords.lat.toFixed(5)}° N, ${this.activeCoords.lng.toFixed(5)}° E`;
    }
    if (placeEl && !onlyCoords) {
      placeEl.textContent = this.activePlaceName || 'Selected Location';
    }
  }

  open(options = {}) {
    const modal = document.getElementById('mapPickerModal');
    if (!modal) return;

    this.activeCallback = options.onConfirm || null;
    const titleEl = document.getElementById('mapPickerModalTitle');
    if (titleEl && options.title) {
      titleEl.textContent = options.title;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Ensure Leaflet is loaded
    this.init();

    // Set initial coordinates if provided
    if (options.initialCoords) {
      this.setCoordinates(options.initialCoords.lat, options.initialCoords.lng, options.initialName, true);
    } else if (options.initialName) {
      this.searchLocation(options.initialName);
    }

    // Leaflet needs invalidateSize() after modal animation
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);
  }

  close() {
    const modal = document.getElementById('mapPickerModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// Global instance
window.HBTUMapPickerInstance = new HBTUMapPicker();
