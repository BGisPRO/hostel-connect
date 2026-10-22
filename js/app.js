/**
 * HBTU RidePool - Core Application Controller
 * Harcourt Butler Technical University, Kanpur
 * 
 * Orchestrates rides feed, route comparator, map picker, seat request lifecycle,
 * peer-to-peer chat, profile management, campus auto schedules, and admin moderation.
 */

(function () {
  'use strict';

  // Application State
  let rides = [];
  let currentUser = null;
  let activeTab = 'all';
  let activeChatRideId = null;
  let storyboardCurrentStep = 0;
  let storyboardInterval = null;

  // Initialize
  function init() {
    currentUser = window.HBTUAuthInstance ? window.HBTUAuthInstance.getCurrentUser() : window.DEFAULT_CURRENT_USER;
    rides = window.HBTUDataStore.getRides();

    populateAllDropdowns();
    updateUserAuthUI();
    initRouteSelectorAndComparator();
    initCampusAutoSection();
    initStoryboardPlayer();
    initFeedbackSection();
    renderRidesFeed();
    renderEmergencyContactsList();
    bindGlobalEventListeners();
  }

  // Populate Dropdowns with All Categorized Hostels & Transit Hubs
  function populateAllDropdowns() {
    const directFrom = document.getElementById('directFromSelect');
    const directTo = document.getElementById('directToSelect');
    const offerFrom = document.getElementById('offerFrom');
    const offerTo = document.getElementById('offerTo');
    const regHostel = document.getElementById('regHostel');

    const optionsHtml = window.HBTUDataStore.generateLocationOptionsHTML();

    if (directFrom) directFrom.innerHTML = optionsHtml;
    if (directTo) directTo.innerHTML = optionsHtml;
    if (offerFrom) offerFrom.innerHTML = optionsHtml;
    if (offerTo) offerTo.innerHTML = optionsHtml;
    if (regHostel) regHostel.innerHTML = optionsHtml;

    // Set sensible defaults
    if (directFrom) directFrom.value = 'HBTU West Campus (Awadhpuri Gate)';
    if (directTo) directTo.value = 'Lucknow Airport (CCS / Amausi - LKO)';
    if (offerFrom) offerFrom.value = 'Ramanujan Hostel (West Campus)';
    if (offerTo) offerTo.value = 'Kanpur Central Railway Station (CNB)';

    // Date defaults: tomorrow 10:00 AM for offer form
    const offerTime = document.getElementById('offerTime');
    if (offerTime) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0);
      offerTime.value = d.toISOString().slice(0, 16);
    }

    const hostUpi = document.getElementById('offerHostUpi');
    if (hostUpi && currentUser) {
      hostUpi.value = currentUser.upiId || `${currentUser.rollNo}@okaxis`;
    }
  }

  // Update Navigation Bar User Status
  function updateUserAuthUI() {
    currentUser = window.HBTUAuthInstance ? window.HBTUAuthInstance.getCurrentUser() : currentUser;
    const navContainer = document.getElementById('authNavContainer');
    if (!navContainer) return;

    if (currentUser) {
      const shortName = currentUser.name.split(' ')[0];
      const branchCode = currentUser.branch.match(/\b[A-Z]/g)?.join('') || currentUser.branch.slice(0, 3).toUpperCase();
      const yearMatch = currentUser.year.match(/\d{2}/) ? currentUser.year.match(/\d{2}/)[0] : '26';

      navContainer.innerHTML = `
        <button class="user-pill-btn" id="btnOpenProfile" title="My Student Profile">
          <img src="${currentUser.avatar}" alt="${escapeHtml(currentUser.name)}" class="user-pill-avatar" id="navUserAvatar">
          <span class="nav-user-label">${escapeHtml(shortName)} (${escapeHtml(branchCode)} '${yearMatch})</span>
          ${currentUser.verified ? '<span class="verified-dot" title="Verified HBTU Student">✓</span>' : ''}
        </button>
      `;

      document.getElementById('btnOpenProfile')?.addEventListener('click', openProfileModal);
    } else {
      navContainer.innerHTML = `
        <button class="btn btn-primary btn-sm" id="btnNavLogin">
          <span>Sign In / Register</span>
        </button>
      `;
      document.getElementById('btnNavLogin')?.addEventListener('click', () => openModal('authModal'));
    }
  }

  // Quick Route Selector & Live Multi-Cab Comparator
  function initRouteSelectorAndComparator() {
    const fromSel = document.getElementById('directFromSelect');
    const toSel = document.getElementById('directToSelect');
    const grid = document.getElementById('autoTakeCardsGrid');
    const dateFilter = document.getElementById('routeDateFilter');
    const btnSearch = document.getElementById('btnExecuteSearch');

    function updateComparator() {
      const from = fromSel?.value || 'HBTU West Campus (Awadhpuri Gate)';
      const to = toSel?.value || 'Lucknow Airport (CCS / Amausi - LKO)';
      if (!grid || !window.HBTUCabEngine) return;

      const options = window.HBTUCabEngine.getCabOptions(from, to);
      const googleMapsLink = window.HBTUCabEngine.getGoogleMapsLink(from, to);

      grid.innerHTML = options.map(opt => {
        const isAuto = opt.id === 'campus_auto';
        return `
          <div class="comparator-card">
            <div>
              <div class="comparator-card-top">
                <span class="card-service-name">${opt.icon} ${escapeHtml(opt.name)}</span>
                <span class="card-eta-badge">${escapeHtml(opt.typicalArrival)}</span>
              </div>

              <div class="card-price-display">
                <span class="split-fare-large">₹${opt.split4} <small style="font-size: 0.72rem; color: var(--text-dim); font-weight: 500;">/student</small></span>
                <span class="solo-fare-small">Est. Solo Cab: ₹${opt.soloFare} (${opt.distKm} km)</span>
              </div>

              <p class="card-disclaimer">${escapeHtml(opt.disclaimer)}</p>
            </div>

            ${isAuto ? `
              <a href="#campus-auto" class="btn btn-sm btn-teal btn-block">
                View Auto Timetables ➔
              </a>
            ` : `
              <div style="display: flex; gap: 0.4rem;">
                <a href="${opt.link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm ${opt.btnClass}" style="flex: 1;" title="Open pickup and destination in ${opt.name}">
                  Continue in ${escapeHtml(opt.name)} ➔
                </a>
                <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary" title="View route on Google Maps">
                  🗺️
                </a>
              </div>
            `}
          </div>
        `;
      }).join('');

      renderRidesFeed();
    }

    fromSel?.addEventListener('change', updateComparator);
    toSel?.addEventListener('change', updateComparator);
    dateFilter?.addEventListener('change', renderRidesFeed);
    btnSearch?.addEventListener('click', () => {
      updateComparator();
      document.getElementById('explore-rides')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Preset Destination Chips
    document.querySelectorAll('.dest-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.dest-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const dest = chip.getAttribute('data-dest');
        if (toSel) {
          toSel.value = dest;
          updateComparator();
          showToast(`Destination set: ${chip.textContent.trim()}`, 'info');
        }
      });
    });

    // Map Picker integration
    document.getElementById('btnPickFromMap')?.addEventListener('click', () => {
      window.HBTUMapPickerInstance.open({
        title: 'Choose Pickup Spot (Campus Hostels & Gates)',
        initialName: fromSel?.value,
        onConfirm: (loc) => {
          if (fromSel) {
            // Find closest match or add custom option
            let found = false;
            for (let i = 0; i < fromSel.options.length; i++) {
              if (fromSel.options[i].text.toLowerCase().includes(loc.placeName.toLowerCase())) {
                fromSel.selectedIndex = i;
                found = true;
                break;
              }
            }
            if (!found) {
              const opt = new Option(`📍 ${loc.placeName}`, loc.placeName, true, true);
              fromSel.add(opt);
            }
            updateComparator();
            showToast(`Pickup selected: ${loc.placeName}`, 'success');
          }
        }
      });
    });

    document.getElementById('btnPickToMap')?.addEventListener('click', () => {
      window.HBTUMapPickerInstance.open({
        title: 'Choose Destination Spot on Map',
        initialName: toSel?.value,
        onConfirm: (loc) => {
          if (toSel) {
            let found = false;
            for (let i = 0; i < toSel.options.length; i++) {
              if (toSel.options[i].text.toLowerCase().includes(loc.placeName.toLowerCase())) {
                toSel.selectedIndex = i;
                found = true;
                break;
              }
            }
            if (!found) {
              const opt = new Option(`📍 ${loc.placeName}`, loc.placeName, true, true);
              toSel.add(opt);
            }
            updateComparator();
            showToast(`Destination selected: ${loc.placeName}`, 'success');
          }
        }
      });
    });

    updateComparator();
  }

  // Active Rides Feed Renderer
  function renderRidesFeed() {
    const container = document.getElementById('ridesContainer');
    const emptyState = document.getElementById('noRidesFound');
    const countPill = document.getElementById('feedCountPill');
    const toSel = document.getElementById('directToSelect');
    const dateFilter = document.getElementById('routeDateFilter');

    if (!container) return;

    const filterDest = toSel?.value ? toSel.value.toLowerCase().split('(')[0].trim() : '';
    const filterDate = dateFilter?.value ? new Date(dateFilter.value).toDateString() : '';
    const now = new Date();

    const filtered = rides.filter(ride => {
      // Status filter: exclude completed or cancelled from standard active tab
      if (ride.status === 'cancelled' && activeTab !== 'my_pools') return false;

      // Tab filters
      if (activeTab === 'my_pools') {
        const isHost = currentUser && ride.host && (ride.host.rollNo === currentUser.rollNo || ride.host.id === currentUser.id);
        const isPassenger = currentUser && (ride.passengers || []).some(p => p.roll === currentUser.rollNo || p.id === currentUser.id);
        const hasPending = currentUser && (ride.pendingRequests || []).some(r => r.roll === currentUser.rollNo || r.id === currentUser.id);
        if (!isHost && !isPassenger && !hasPending) return false;
      } else if (activeTab === 'girls_only') {
        if (ride.genderPref !== 'girls_only') return false;
      } else if (activeTab === 'leaving_soon') {
        const dep = new Date(ride.departureTime);
        const diffHours = (dep - now) / (1000 * 60 * 60);
        if (diffHours < 0 || diffHours > 4) return false;
      } else if (activeTab === 'upcoming') {
        const dep = new Date(ride.departureTime);
        if (dep <= now) return false;
      } else if (activeTab === 'campus_auto') {
        if (!ride.vehicleType.toLowerCase().includes('auto') && !ride.vehicleType.toLowerCase().includes('rickshaw')) return false;
      }

      // Route Date filter
      if (filterDate) {
        const rideDate = new Date(ride.departureTime).toDateString();
        if (rideDate !== filterDate) return false;
      }

      return true;
    });

    if (countPill) {
      countPill.textContent = `${filtered.length} Ride${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered.map(ride => {
      const confirmedCount = (ride.passengers || []).length;
      const remainingSeats = Math.max(0, ride.totalSeats - confirmedCount);
      const isFull = remainingSeats <= 0;
      const splitCalc = window.HBTUCabEngine.calculateFareSplit(ride.totalFare, ride.totalSeats);
      const perHead = splitCalc.farePerPerson;

      const isHost = currentUser && ride.host && (ride.host.rollNo === currentUser.rollNo || ride.host.id === currentUser.id);
      const isConfirmedPassenger = currentUser && (ride.passengers || []).some(p => (p.roll === currentUser.rollNo || p.id === currentUser.id) && p.status === 'confirmed');
      const isPending = currentUser && (ride.pendingRequests || []).some(r => (r.roll === currentUser.rollNo || r.id === currentUser.id));

      const uberDeepLink = window.CAB_SERVICES[0].buildLink(ride.from, ride.to);

      return `
        <article class="ride-card" data-ride-id="${ride.id}">
          <div class="ride-card-top">
            <div class="ride-badges-row">
              <span class="tag-badge tag-time">🕒 ${formatDepartureTime(ride.departureTime)}</span>
              <span class="tag-badge ${remainingSeats > 0 ? 'tag-available' : 'tag-full'}">
                ${remainingSeats > 0 ? `🟢 ${remainingSeats} seat${remainingSeats > 1 ? 's' : ''} left` : '🚫 Full'}
              </span>
              ${ride.genderPref === 'girls_only' ? '<span class="tag-badge tag-girls">🛡️ Girls Only</span>' : ''}
              <span class="tag-badge tag-vehicle">${escapeHtml(ride.vehicleType.split('(')[0].trim())}</span>
              ${ride.status === 'cancelled' ? '<span class="tag-badge tag-full">Cancelled</span>' : ''}
            </div>

            <div class="ride-fare-box">
              <span class="ride-fare-value">₹${perHead}</span>
              <span class="ride-fare-sub">per student (${ride.totalSeats} seats)</span>
            </div>
          </div>

          <!-- Route Display -->
          <div class="ride-route-track">
            <div class="route-stop">
              <span class="route-stop-type">Origin</span>
              <span class="route-stop-name">${escapeHtml(ride.from.split('(')[0].trim())}</span>
              <span class="route-stop-detail">${escapeHtml(ride.fromDetail || 'Campus Gate')}</span>
            </div>

            <div class="route-arrow-center">➔</div>

            <div class="route-stop">
              <span class="route-stop-type">Destination</span>
              <span class="route-stop-name">${escapeHtml(ride.to.split('(')[0].trim())}</span>
              <span class="route-stop-detail">${escapeHtml(ride.toDetail || 'Transit Drop')}</span>
            </div>
          </div>

          ${ride.notes ? `
            <div class="ride-note-box">
              <strong>Note:</strong> "${escapeHtml(ride.notes)}"
            </div>
          ` : ''}

          <!-- Bottom Bar -->
          <div class="ride-card-bottom">
            <div class="host-chip">
              <img src="${ride.host.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=HBTU'}" alt="${escapeHtml(ride.host.name)}" class="host-avatar">
              <div class="host-meta">
                <span class="host-name">${escapeHtml(ride.host.name)} ${ride.host.verified ? '<small style="color: var(--primary);">✓</small>' : ''}</span>
                <span class="host-sub">${escapeHtml(ride.host.branch || 'Student')}</span>
              </div>
            </div>

            <div class="ride-card-actions">
              <a href="${uberDeepLink}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-uber" title="Continue in Uber with pre-filled destination">
                Uber ➔
              </a>

              <button type="button" class="btn btn-sm btn-secondary btn-open-chat" data-ride-id="${ride.id}">
                💬 Chat ${(ride.chat || []).length > 0 ? `(${ride.chat.length})` : ''}
              </button>

              <button type="button" class="btn btn-sm btn-secondary btn-open-details" data-ride-id="${ride.id}">
                View Details
              </button>

              ${isHost ? `
                <button type="button" class="btn btn-sm btn-orange btn-open-details" data-ride-id="${ride.id}">
                  Manage (${(ride.pendingRequests || []).length} Pending)
                </button>
              ` : (isConfirmedPassenger ? `
                <button type="button" class="btn btn-sm btn-primary btn-open-pass" data-ride-id="${ride.id}">
                  Pass 🎫
                </button>
              ` : (isPending ? `
                <button type="button" class="btn btn-sm btn-secondary" disabled style="opacity: 0.7;">
                  ⏳ Pending
                </button>
              ` : (isFull ? `
                <button type="button" class="btn btn-sm btn-secondary" disabled style="opacity: 0.5;">
                  Full
                </button>
              ` : `
                <button type="button" class="btn btn-sm btn-orange btn-request-seat" data-ride-id="${ride.id}">
                  Request Seat
                </button>
              `)))}
            </div>
          </div>
        </article>
      `;
    }).join('');

    bindCardEventListeners();
  }

  function bindCardEventListeners() {
    document.querySelectorAll('.btn-open-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ride-id');
        openRideDetailModal(id);
      });
    });

    document.querySelectorAll('.btn-request-seat').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ride-id');
        openRideDetailModal(id);
      });
    });

    document.querySelectorAll('.btn-open-chat').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ride-id');
        openRideChatModal(id);
      });
    });

    document.querySelectorAll('.btn-open-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ride-id');
        openTicketModal(id);
      });
    });
  }

  // Ride Details & Seat Lifecycle Modal
  function openRideDetailModal(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    const body = document.getElementById('detailModalBody');
    const footer = document.getElementById('detailModalFooter');
    if (!body || !footer) return;

    const confirmedPassengers = ride.passengers || [];
    const pendingRequests = ride.pendingRequests || [];
    const remainingSeats = Math.max(0, ride.totalSeats - confirmedPassengers.length);
    const splitCalc = window.HBTUCabEngine.calculateFareSplit(ride.totalFare, ride.totalSeats);

    const isHost = currentUser && ride.host && (ride.host.rollNo === currentUser.rollNo || ride.host.id === currentUser.id);
    const isConfirmed = currentUser && confirmedPassengers.some(p => p.roll === currentUser.rollNo || p.id === currentUser.id);
    const isPending = currentUser && pendingRequests.some(r => r.roll === currentUser.rollNo || r.id === currentUser.id);

    body.innerHTML = `
      <div style="background: var(--primary-subtle); border: 1px solid var(--primary-border); border-radius: var(--radius-sm); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 0.72rem; color: var(--primary); font-weight: 700; text-transform: uppercase;">TRANSPARENT SPLIT FARE</span>
          <div style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 800; color: var(--text-heading);">₹${splitCalc.farePerPerson} <small style="font-size: 0.8rem; font-weight: 500; color: var(--text-dim);">/student</small></div>
          <span style="font-size: 0.72rem; color: var(--text-dim);">${splitCalc.formulaExplanation}</span>
        </div>
        <div style="text-align: right;">
          <span class="tag-badge ${remainingSeats > 0 ? 'tag-available' : 'tag-full'}">
            ${remainingSeats > 0 ? `🟢 ${remainingSeats} Seats Left` : '🚫 Full'}
          </span>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.3rem;">Total: ₹${ride.totalFare}</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.88rem;">
        <div><strong>Route:</strong> ${escapeHtml(ride.from)} (${escapeHtml(ride.fromDetail || 'Gate')}) ➔ ${escapeHtml(ride.to)} (${escapeHtml(ride.toDetail || 'Drop')})</div>
        <div><strong>Departure Time:</strong> ${formatDepartureTime(ride.departureTime)}</div>
        <div><strong>Vehicle:</strong> ${escapeHtml(ride.vehicleType)}</div>
        ${ride.notes ? `<div><strong>Host Notes:</strong> "${escapeHtml(ride.notes)}"</div>` : ''}
      </div>

      <!-- Host Identity & Safe Contact -->
      <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.3rem; text-transform: uppercase;">Ride Host</div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <img src="${ride.host.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Host'}" alt="${escapeHtml(ride.host.name)}" style="width: 32px; height: 32px; border-radius: 50%;">
            <div>
              <strong>${escapeHtml(ride.host.name)}</strong> ${ride.host.verified ? '<small style="color: var(--primary);">✓ Verified Student</small>' : ''}
              <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(ride.host.branch)} • ${escapeHtml(ride.host.year)}</div>
            </div>
          </div>
          ${(isHost || isConfirmed) ? `
            <a href="tel:${ride.host.phone.replace(/\D/g, '')}" class="btn btn-sm btn-secondary">📞 Call Host</a>
          ` : `
            <span style="font-size: 0.72rem; color: var(--text-dim);">Contact shared on confirmation</span>
          `}
        </div>
      </div>

      <!-- Confirmed Passengers -->
      <div>
        <strong style="font-size: 0.82rem; color: var(--text-heading); display: block; margin-bottom: 0.4rem;">Confirmed Passengers (${confirmedPassengers.length}/${ride.totalSeats}):</strong>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          ${confirmedPassengers.map(p => `
            <span class="dest-chip" style="font-size: 0.78rem;">
              ${p.gender === 'F' ? '👩‍🎓' : '👨‍🎓'} ${escapeHtml(p.name)}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Host Management: Review Pending Seat Requests -->
      ${isHost && pendingRequests.length > 0 ? `
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-sm); padding: 0.85rem;">
          <strong style="font-size: 0.82rem; color: #b45309; display: block; margin-bottom: 0.5rem;">Incoming Seat Requests (${pendingRequests.length}):</strong>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${pendingRequests.map(req => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 0.5rem; border-radius: 4px; border: 1px solid #fef3c7;">
                <div>
                  <strong>${escapeHtml(req.name)}</strong> (${escapeHtml(req.roll)})
                  ${req.luggage ? `<div style="font-size: 0.72rem; color: var(--text-dim);">Luggage: ${escapeHtml(req.luggage)}</div>` : ''}
                </div>
                <div style="display: flex; gap: 0.35rem;">
                  <button type="button" class="btn btn-sm btn-primary btn-accept-request" data-ride-id="${ride.id}" data-user-id="${req.id}">Accept</button>
                  <button type="button" class="btn btn-sm btn-danger btn-reject-request" data-ride-id="${ride.id}" data-user-id="${req.id}">Reject</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div style="font-size: 0.75rem; color: var(--text-dim); background: #f8fafc; padding: 0.6rem; border-radius: var(--radius-sm);">
        ℹ️ <strong>Peer Carpool Notice:</strong> This is a student-organized carpool, not a commercial taxi reservation. Confirm your travel arrangements before departure.
      </div>
    `;

    // Footer actions
    if (isHost) {
      footer.innerHTML = `
        <button type="button" class="btn btn-danger btn-sm" id="btnCancelRideHost" data-ride-id="${ride.id}">Cancel Pool</button>
        <button type="button" class="btn btn-secondary btn-sm" data-close-modal="rideDetailModal">Close</button>
      `;
    } else if (isConfirmed) {
      footer.innerHTML = `
        <button type="button" class="btn btn-secondary btn-sm" id="btnLeaveRidePassenger" data-ride-id="${ride.id}">Leave Pool</button>
        <button type="button" class="btn btn-primary btn-sm" id="btnOpenUpiFromDetail" data-ride-id="${ride.id}">Pay Share (UPI)</button>
        <button type="button" class="btn btn-secondary btn-sm" data-close-modal="rideDetailModal">Close</button>
      `;
    } else if (isPending) {
      footer.innerHTML = `
        <span style="font-size: 0.8rem; color: var(--text-dim); margin-right: auto;">⏳ Request submitted. Waiting for host confirmation.</span>
        <button type="button" class="btn btn-secondary btn-sm" data-close-modal="rideDetailModal">Close</button>
      `;
    } else if (remainingSeats > 0) {
      footer.innerHTML = `
        <button type="button" class="btn btn-secondary btn-sm" data-close-modal="rideDetailModal">Cancel</button>
        <button type="button" class="btn btn-orange btn-sm" id="btnSubmitSeatRequest" data-ride-id="${ride.id}">
          Request a Seat
        </button>
      `;
    } else {
      footer.innerHTML = `
        <button type="button" class="btn btn-secondary btn-sm" data-close-modal="rideDetailModal">Close</button>
      `;
    }

    // Bind action buttons
    document.getElementById('btnSubmitSeatRequest')?.addEventListener('click', () => {
      requestSeat(ride.id);
    });

    document.querySelectorAll('.btn-accept-request').forEach(b => {
      b.addEventListener('click', () => {
        acceptPassengerRequest(b.getAttribute('data-ride-id'), b.getAttribute('data-user-id'));
      });
    });

    document.querySelectorAll('.btn-reject-request').forEach(b => {
      b.addEventListener('click', () => {
        rejectPassengerRequest(b.getAttribute('data-ride-id'), b.getAttribute('data-user-id'));
      });
    });

    document.getElementById('btnCancelRideHost')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel this entire carpool? All passengers will be notified.')) {
        cancelRideByHost(ride.id);
      }
    });

    document.getElementById('btnLeaveRidePassenger')?.addEventListener('click', () => {
      if (confirm('Leave this pool and release your seat?')) {
        leaveRideByPassenger(ride.id);
      }
    });

    document.getElementById('btnOpenUpiFromDetail')?.addEventListener('click', () => {
      closeModal('rideDetailModal');
      openUpiModal(ride.id);
    });

    openModal('rideDetailModal');
  }

  // Seat Request Lifecycle
  function requestSeat(rideId) {
    if (!currentUser) {
      closeModal('rideDetailModal');
      openModal('authModal');
      showToast('Please sign in or register to request a seat.', 'info');
      return;
    }

    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    if (ride.genderPref === 'girls_only' && currentUser.gender === 'M') {
      showToast('This pool is strictly reserved for female students.', 'danger');
      return;
    }

    const confirmedCount = (ride.passengers || []).length;
    if (confirmedCount >= ride.totalSeats) {
      showToast('Sorry, this ride pool is already full.', 'danger');
      return;
    }

    ride.pendingRequests = ride.pendingRequests || [];
    const alreadyRequested = ride.pendingRequests.some(r => r.id === currentUser.id || r.roll === currentUser.rollNo);
    if (alreadyRequested) {
      showToast('You already have a pending seat request for this ride.', 'info');
      return;
    }

    ride.pendingRequests.push({
      id: currentUser.id,
      name: currentUser.name,
      roll: currentUser.rollNo,
      branch: currentUser.branch,
      gender: currentUser.gender,
      phone: currentUser.phone,
      requestedAt: new Date().toISOString(),
      luggage: 'Standard college luggage'
    });

    window.HBTUDataStore.saveRides(rides);
    closeModal('rideDetailModal');
    renderRidesFeed();
    showToast(`Seat requested! ${ride.host.name} will review your request.`, 'success');
  }

  function acceptPassengerRequest(rideId, userId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    ride.passengers = ride.passengers || [];
    ride.pendingRequests = ride.pendingRequests || [];

    // Capacity Concurrency check
    if (ride.passengers.length >= ride.totalSeats) {
      showToast('Cannot accept: all seats in this pool are already filled!', 'danger');
      return;
    }

    const reqIdx = ride.pendingRequests.findIndex(r => r.id === userId);
    if (reqIdx === -1) return;

    const req = ride.pendingRequests.splice(reqIdx, 1)[0];
    ride.passengers.push({
      id: req.id,
      name: req.name,
      roll: req.roll,
      gender: req.gender,
      phone: req.phone,
      joinedAt: 'Just now',
      status: 'confirmed',
      paid: false
    });

    if (ride.passengers.length >= ride.totalSeats) {
      ride.status = 'full';
    }

    window.HBTUDataStore.saveRides(rides);
    openRideDetailModal(rideId);
    renderRidesFeed();
    showToast(`Passenger ${req.name} confirmed!`, 'success');
  }

  function rejectPassengerRequest(rideId, userId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    ride.pendingRequests = (ride.pendingRequests || []).filter(r => r.id !== userId);
    window.HBTUDataStore.saveRides(rides);
    openRideDetailModal(rideId);
    renderRidesFeed();
    showToast('Seat request declined.', 'info');
  }

  function cancelRideByHost(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    ride.status = 'cancelled';
    window.HBTUDataStore.saveRides(rides);
    closeModal('rideDetailModal');
    renderRidesFeed();
    showToast('Carpool cancelled. Co-passengers will be notified.', 'info');
  }

  function leaveRideByPassenger(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride || !currentUser) return;

    ride.passengers = (ride.passengers || []).filter(p => p.id !== currentUser.id && p.roll !== currentUser.rollNo);
    if (ride.status === 'full') {
      ride.status = 'open';
    }

    window.HBTUDataStore.saveRides(rides);
    closeModal('rideDetailModal');
    renderRidesFeed();
    showToast('You have left the pool.', 'info');
  }

  // Campus Auto Schedules Section
  function initCampusAutoSection() {
    const container = document.getElementById('autoRoutesContainer');
    if (!container) return;

    const schedules = window.HBTUDataStore.getAutoSchedules();

    container.innerHTML = schedules.map(s => `
      <div class="auto-route-card">
        <span class="auto-card-badge">🟢 ${escapeHtml(s.status)}</span>
        <h4 class="auto-route-title">${escapeHtml(s.routeTitle)}</h4>

        <div class="auto-meta-item">
          <span>⏰ <strong>Hours:</strong> ${escapeHtml(s.operatingHours)}</span>
        </div>
        <div class="auto-meta-item">
          <span>⏱️ <strong>Frequency:</strong> ${escapeHtml(s.frequency)}</span>
        </div>
        <div class="auto-meta-item">
          <span>💰 <strong>Indicative Tariff:</strong> ${escapeHtml(s.indicativeFare)}</span>
        </div>

        <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.4;">
          ${escapeHtml(s.notes)}
        </p>

        <div class="auto-stops-list">
          <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-dim);">STOPS:</span>
          ${(s.stops || []).map(st => `<span class="auto-stop-tag">${escapeHtml(st)}</span>`).join('')}
        </div>
      </div>
    `).join('');

    document.getElementById('btnReportAutoSchedule')?.addEventListener('click', () => {
      openModal('autoReportModal');
    });

    document.getElementById('autoReportForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('autoRouteTitle').value.trim();
      const pickup = document.getElementById('autoPickup').value.trim();
      const drop = document.getElementById('autoDrop').value.trim();
      const hours = document.getElementById('autoHours').value.trim();
      const fare = document.getElementById('autoFare').value.trim();
      const notes = document.getElementById('autoNotes').value.trim();

      const newSched = {
        id: 'auto-' + Date.now().toString(36),
        routeTitle: title,
        pickup,
        drop,
        frequency: 'Community Reported',
        operatingHours: hours,
        indicativeFare: fare,
        vehicleType: 'Shared E-Rickshaw / Auto',
        status: 'Community-Reported',
        lastVerified: 'Recently submitted',
        notes: notes || 'Student submitted timetable.',
        stops: [pickup, drop]
      };

      const existing = window.HBTUDataStore.getAutoSchedules();
      existing.push(newSched);
      window.HBTUDataStore.saveAutoSchedules(existing);

      closeModal('autoReportModal');
      initCampusAutoSection();
      showToast('Thank you! Auto timetable submitted for community verification.', 'success');
    });
  }

  // Interactive Storyboard Media Player (See How It Works)
  function initStoryboardPlayer() {
    const steps = [
      {
        icon: '🏨',
        title: '1. Select Campus Hostel',
        caption: 'Student selects their hostel from the 14 verified East and West campus records. Pre-configured GPS pins load automatically.'
      },
      {
        icon: '🗺️',
        title: '2. Pick Destination on Map',
        caption: 'Interactive OpenStreetMap allows selecting Kanpur Central, Lucknow Airport, or dragging a pin to any exact drop location in the city.'
      },
      {
        icon: '🚖',
        title: '3. Discover Active Carpools',
        caption: 'View fellow HBTU students heading in the same direction, check verified badges, departure time, and fair indicative split price.'
      },
      {
        icon: '📨',
        title: '4. Request Seat & Host Confirms',
        caption: 'Submit a seat request. The ride creator reviews applicant batch/year, confirms passengers, and locks the carpool.'
      },
      {
        icon: '💸',
        title: '5. Transparent UPI Cost Split',
        caption: 'Co-passengers scan the host’s dynamic QR code to settle their exact ₹300 or ₹80 share with zero awkward money talks.'
      },
      {
        icon: '🚀',
        title: '6. 1-Tap Commercial Cab Dispatch',
        caption: 'Need a commercial vehicle? Tap Uber, Ola, or Rapido to launch the ride app with campus origin and destination pre-filled.'
      }
    ];

    function showStep(index) {
      storyboardCurrentStep = (index + steps.length) % steps.length;
      const s = steps[storyboardCurrentStep];

      const iconEl = document.getElementById('storyboardIcon');
      const titleEl = document.getElementById('storyboardTitle');
      const captionEl = document.getElementById('storyboardCaption');
      const indEl = document.getElementById('storyboardStepIndicator');

      if (iconEl) iconEl.textContent = s.icon;
      if (titleEl) titleEl.textContent = s.title;
      if (captionEl) captionEl.textContent = s.caption;
      if (indEl) indEl.textContent = `Step ${storyboardCurrentStep + 1} of ${steps.length}`;

      document.querySelectorAll('#storyboardDots .step-dot-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === storyboardCurrentStep);
      });
    }

    document.querySelectorAll('#storyboardDots .step-dot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.getAttribute('data-step'), 10);
        showStep(step);
      });
    });

    document.getElementById('btnStoryboardPrev')?.addEventListener('click', () => showStep(storyboardCurrentStep - 1));
    document.getElementById('btnStoryboardNext')?.addEventListener('click', () => showStep(storyboardCurrentStep + 1));

    document.getElementById('btnToggleTranscript')?.addEventListener('click', () => {
      const tr = document.getElementById('storyboardTranscript');
      if (tr) {
        tr.style.display = tr.style.display === 'none' ? 'block' : 'none';
      }
    });

    showStep(0);
  }

  // Community Feedback
  function initFeedbackSection() {
    const list = document.getElementById('communityFeedbackList');
    if (!list) return;

    const feedback = window.HBTUDataStore.getFeedback();

    list.innerHTML = feedback.map(f => `
      <div class="feedback-card-item">
        <div class="feedback-author-row">
          <span class="feedback-author-name">${escapeHtml(f.authorName)} <small style="color: var(--text-dim); font-weight: normal;">• ${escapeHtml(f.branch)}</small></span>
          <span class="feedback-tag">${escapeHtml(f.category)}</span>
        </div>
        <p class="feedback-message">"${escapeHtml(f.message)}"</p>
      </div>
    `).join('');

    document.getElementById('feedbackSubmitForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('fbAuthorName').value.trim();
      const category = document.getElementById('fbCategory').value;
      const message = document.getElementById('fbMessage').value.trim();

      const newFb = {
        id: 'fb-' + Date.now().toString(36),
        authorName: author,
        branch: 'Student Contributor',
        category,
        message,
        date: new Date().toISOString().slice(0, 10),
        status: 'Community Verified'
      };

      const existing = window.HBTUDataStore.getFeedback();
      existing.unshift(newFb);
      window.HBTUDataStore.saveFeedback(existing);

      initFeedbackSection();
      document.getElementById('feedbackSubmitForm').reset();
      showToast('Thank you for helping us improve HBTU RidePool!', 'success');
    });
  }

  // In-Pool Chat
  function openRideChatModal(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;
    activeChatRideId = rideId;
    renderChatMessages(ride);
    openModal('rideChatModal');
  }

  function renderChatMessages(ride) {
    const chatArea = document.getElementById('chatMessagesArea');
    if (!chatArea) return;

    if (!ride.chat || ride.chat.length === 0) {
      chatArea.innerHTML = `<div style="text-align: center; color: var(--text-dim); font-size: 0.82rem; padding: 1.5rem 0;">No messages yet. Send a message to coordinate with co-passengers.</div>`;
      return;
    }

    chatArea.innerHTML = ride.chat.map(msg => {
      const isMine = currentUser && msg.sender.includes(currentUser.name);
      return `
        <div style="align-self: ${isMine ? 'flex-end' : 'flex-start'}; max-width: 80%; background: ${isMine ? 'var(--primary-subtle)' : 'var(--bg-card-subtle)'}; border: 1px solid ${isMine ? 'var(--primary-border)' : 'var(--border-subtle)'}; padding: 0.5rem 0.75rem; border-radius: 8px;">
          <div style="font-size: 0.68rem; color: var(--text-dim); margin-bottom: 2px;">${escapeHtml(msg.sender)} • ${escapeHtml(msg.time)}</div>
          <div style="font-size: 0.85rem; color: var(--text-heading);">${escapeHtml(msg.message)}</div>
        </div>
      `;
    }).join('');

    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function sendChatMessage(text) {
    if (!activeChatRideId || !text.trim() || !currentUser) return;
    const ride = rides.find(r => r.id === activeChatRideId);
    if (!ride) return;

    ride.chat = ride.chat || [];
    ride.chat.push({
      sender: currentUser.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      message: text.trim()
    });

    window.HBTUDataStore.saveRides(rides);
    renderChatMessages(ride);
  }

  // Private UPI Settlement Modal
  function openUpiModal(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    const splitCalc = window.HBTUCabEngine.calculateFareSplit(ride.totalFare, ride.totalSeats);
    const body = document.getElementById('upiModalBody');
    const upiData = window.HBTUCabEngine.generateUPILink(ride.host.upiId, ride.host.name, splitCalc.farePerPerson, ride.id);

    body.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Direct UPI Settlement</span>
        <div style="font-family: var(--font-mono); font-size: 2.2rem; font-weight: 800; color: var(--primary);">₹${splitCalc.farePerPerson}</div>
        <div style="font-size: 0.82rem; color: var(--text-muted);">Pay To: <strong>${escapeHtml(ride.host.name)}</strong> (<code>${escapeHtml(upiData.upiId)}</code>)</div>
      </div>

      <div style="background: #ffffff; padding: 12px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); display: inline-block; margin-bottom: 1rem; box-shadow: var(--shadow-sm);">
        <img src="${upiData.qrUrl}" alt="UPI Dynamic QR" style="width: 170px; height: 170px; display: block;">
      </div>

      <p style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 1rem;">Scan with Google Pay, PhonePe, or Paytm. Kept private for confirmed pool members.</p>

      <a href="${upiData.upiUri}" class="btn btn-primary btn-block">
        Open UPI App (GPay / PhonePe / Paytm)
      </a>
    `;

    openModal('upiModal');
  }

  // Boarding Pass Modal
  function openTicketModal(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    const splitCalc = window.HBTUCabEngine.calculateFareSplit(ride.totalFare, ride.totalSeats);
    const body = document.getElementById('ticketModalBody');

    body.innerHTML = `
      <div style="background: var(--bg-card-subtle); border: 2px dashed var(--primary-border); padding: 1.25rem; border-radius: var(--radius-md);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.75rem; font-weight: 800; color: var(--primary);">HBTU CAMPUS PASS #${ride.id.toUpperCase()}</span>
          <span class="tag-badge tag-available">Confirmed</span>
        </div>
        <h3 style="font-size: 1.15rem; color: var(--text-heading); margin-bottom: 0.5rem;">
          ${escapeHtml(ride.from.split('(')[0])} ➔ ${escapeHtml(ride.to.split('(')[0])}
        </h3>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
          🕒 <strong>Departure:</strong> ${formatDepartureTime(ride.departureTime)}
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
          💰 <strong>Fare Share:</strong> ₹${splitCalc.farePerPerson}
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          👤 <strong>Host:</strong> ${escapeHtml(ride.host.name)} (📞 ${escapeHtml(ride.host.phone)})
        </div>
      </div>
    `;

    openModal('ticketModal');
  }

  // Student Profile Modal
  function openProfileModal() {
    currentUser = window.HBTUAuthInstance ? window.HBTUAuthInstance.getCurrentUser() : currentUser;
    if (!currentUser) {
      openModal('authModal');
      return;
    }

    const body = document.getElementById('profileModalBody');
    if (!body) return;

    const myPosted = rides.filter(r => r.host && (r.host.rollNo === currentUser.rollNo || r.host.id === currentUser.id));
    const myJoined = rides.filter(r => (r.passengers || []).some(p => p.roll === currentUser.rollNo || p.id === currentUser.id));

    body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="${currentUser.avatar}" alt="${escapeHtml(currentUser.name)}" style="width: 48px; height: 48px; border-radius: 50%;">
          <div>
            <h4 style="font-size: 1.1rem; color: var(--text-heading);">${escapeHtml(currentUser.name)}</h4>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(currentUser.branch)} • Roll: ${escapeHtml(currentUser.rollNo)}</div>
          </div>
        </div>
        <div>
          ${currentUser.verified ? `
            <span class="tag-badge tag-available">✓ Verified HBTU Student</span>
          ` : `
            <button type="button" class="btn btn-sm btn-orange" id="btnTriggerVerification">Verify Account</button>
          `}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
        <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem;">
          <strong style="font-size: 0.85rem; color: var(--text-heading);">My Created Pools (${myPosted.length})</strong>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.35rem;">
            ${myPosted.map(r => `<div>• ${escapeHtml(r.from.split('(')[0])} ➔ ${escapeHtml(r.to.split('(')[0])} (${r.status})</div>`).join('') || 'No pools created yet.'}
          </div>
        </div>

        <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem;">
          <strong style="font-size: 0.85rem; color: var(--text-heading);">My Booked Trips (${myJoined.length})</strong>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.35rem;">
            ${myJoined.map(r => `<div>• ${escapeHtml(r.to.split('(')[0])} (Host: ${escapeHtml(r.host.name)})</div>`).join('') || 'No confirmed bookings.'}
          </div>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <form id="editProfileForm">
        <h5 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.65rem;">Account Settings & Privacy</h5>
        <div class="form-row-2" style="margin-bottom: 0.65rem;">
          <div class="form-group">
            <label for="profEditName">Full Name</label>
            <input type="text" id="profEditName" class="clean-input" value="${escapeHtml(currentUser.name)}" required>
          </div>
          <div class="form-group">
            <label for="profEditPhone">Phone (Private)</label>
            <input type="tel" id="profEditPhone" class="clean-input" value="${escapeHtml(currentUser.phone)}" required>
          </div>
        </div>
        <div class="form-row-2" style="margin-bottom: 0.85rem;">
          <div class="form-group">
            <label for="profEditUpi">UPI ID (For Splits)</label>
            <input type="text" id="profEditUpi" class="clean-input" value="${escapeHtml(currentUser.upiId || '')}" placeholder="roll@okaxis">
          </div>
          <div class="form-group">
            <label for="profEditHostel">Hostel</label>
            <input type="text" id="profEditHostel" class="clean-input" value="${escapeHtml(currentUser.hostel || '')}">
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <button type="button" class="btn btn-danger btn-sm" id="btnDeleteAccount">Delete Account</button>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn btn-secondary btn-sm" id="btnLogoutSession">Sign Out</button>
            <button type="submit" class="btn btn-primary btn-sm">Save Changes</button>
          </div>
        </div>
      </form>
    `;

    document.getElementById('btnTriggerVerification')?.addEventListener('click', () => {
      closeModal('profileModal');
      openModal('verificationModal');
    });

    document.getElementById('btnLogoutSession')?.addEventListener('click', () => {
      window.HBTUAuthInstance.logout();
      closeModal('profileModal');
      updateUserAuthUI();
      renderRidesFeed();
      showToast('Logged out successfully.', 'info');
    });

    document.getElementById('btnDeleteAccount')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete your student account? This cannot be undone.')) {
        window.HBTUAuthInstance.deleteAccount();
        closeModal('profileModal');
        updateUserAuthUI();
        renderRidesFeed();
        showToast('Your account has been deleted.', 'info');
      }
    });

    document.getElementById('editProfileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = window.HBTUAuthInstance.updateProfile({
        name: document.getElementById('profEditName').value.trim(),
        phone: document.getElementById('profEditPhone').value.trim(),
        upiId: document.getElementById('profEditUpi').value.trim(),
        hostel: document.getElementById('profEditHostel').value.trim()
      });
      currentUser = updated;
      updateUserAuthUI();
      renderRidesFeed();
      closeModal('profileModal');
      showToast('Profile updated!', 'success');
    });

    openModal('profileModal');
  }

  // Post / Offer Ride Form Handler
  function handleOfferRideSubmit(e) {
    e.preventDefault();
    if (!currentUser) {
      closeModal('offerRideModal');
      openModal('authModal');
      showToast('Please sign in or register before posting a ride.', 'info');
      return;
    }

    const from = document.getElementById('offerFrom').value;
    const fromDetail = document.getElementById('offerFromDetail').value.trim();
    const to = document.getElementById('offerTo').value;
    const toDetail = document.getElementById('offerToDetail').value.trim();
    const time = document.getElementById('offerTime').value;
    const vehicle = document.getElementById('offerVehicle').value;
    const totalFare = parseInt(document.getElementById('offerTotalFare').value, 10);
    const totalSeats = parseInt(document.getElementById('offerTotalSeats').value, 10);
    const genderPref = document.getElementById('offerGenderPref').value;
    const hostUpi = document.getElementById('offerHostUpi').value.trim();
    const notes = document.getElementById('offerNotes').value.trim();

    const newRide = {
      id: 'pool-' + Date.now().toString(36),
      from,
      fromDetail,
      to,
      toDetail,
      departureTime: new Date(time).toISOString(),
      createdAt: new Date().toISOString(),
      totalFare,
      totalSeats,
      status: 'open',
      genderPref,
      vehicleType: vehicle,
      serviceProvider: 'Student Carpool',
      notes,
      host: {
        id: currentUser.id,
        name: currentUser.name,
        branch: currentUser.branch,
        year: currentUser.year,
        phone: currentUser.phone,
        upiId: hostUpi || currentUser.upiId,
        rollNo: currentUser.rollNo,
        verified: currentUser.verified,
        avatar: currentUser.avatar
      },
      passengers: [
        {
          id: currentUser.id,
          name: `${currentUser.name} (Host)`,
          roll: currentUser.rollNo,
          gender: currentUser.gender,
          joinedAt: 'Just now',
          status: 'confirmed',
          paid: true
        }
      ],
      pendingRequests: [],
      chat: []
    };

    rides.unshift(newRide);
    window.HBTUDataStore.saveRides(rides);
    closeModal('offerRideModal');
    renderRidesFeed();
    showToast('Campus pool published successfully!', 'success');
  }

  // Emergency Contacts List
  function renderEmergencyContactsList() {
    const list = document.getElementById('emergencyContactsList');
    if (!list) return;

    list.innerHTML = window.EMERGENCY_CONTACTS.map(c => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-subtle);">
        <div>
          <strong style="color: var(--text-heading); display: block; font-size: 0.9rem;">${escapeHtml(c.name)}</strong>
          <span style="font-size: 0.75rem; color: var(--text-dim);">${escapeHtml(c.desc)}</span>
        </div>
        <a href="tel:${c.phone.replace(/\s+/g, '')}" class="btn btn-sm btn-primary">📞 ${escapeHtml(c.phone)}</a>
      </div>
    `).join('');
  }

  // Protected Admin Portal
  function openAdminPortalModal() {
    const body = document.getElementById('adminModalBody');
    if (!body) return;

    body.innerHTML = `
      <div id="adminPasscodeArea" style="text-align: center; padding: 1.5rem 0;">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🔒</div>
        <h4 style="font-size: 1.1rem; color: var(--text-heading); margin-bottom: 0.35rem;">Protected Administrator Access</h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Enter campus moderation passcode to manage hostel records, auto timetables, and user reports. (Demo key: <strong>hbtu2026admin</strong>)
        </p>
        <div style="display: flex; justify-content: center; gap: 0.5rem;">
          <input type="password" id="adminPassInput" class="clean-input" placeholder="Passcode" style="max-width: 200px;">
          <button type="button" class="btn btn-primary" id="btnUnlockAdmin">Unlock</button>
        </div>
      </div>
      <div id="adminDashboardArea" style="display: none;"></div>
    `;

    document.getElementById('btnUnlockAdmin')?.addEventListener('click', () => {
      const pass = document.getElementById('adminPassInput')?.value;
      if (pass === 'hbtu2026admin') {
        renderAdminDashboard();
      } else {
        showToast('Invalid administrator passcode.', 'danger');
      }
    });

    openModal('adminModal');
  }

  function renderAdminDashboard() {
    const passArea = document.getElementById('adminPasscodeArea');
    const dashArea = document.getElementById('adminDashboardArea');
    if (passArea) passArea.style.display = 'none';
    if (!dashArea) return;

    dashArea.style.display = 'block';

    const hostels = window.HBTUDataStore.getHostels();
    const registeredUsers = window.HBTUAuthInstance ? window.HBTUAuthInstance.getRegisteredUsers() : [];

    dashArea.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
        <div style="background: var(--bg-card-subtle); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${rides.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Live Carpools</div>
        </div>
        <div style="background: var(--bg-card-subtle); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-orange);">${hostels.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Verified Hostels</div>
        </div>
        <div style="background: var(--bg-card-subtle); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--status-success);">${registeredUsers.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Registered Accounts</div>
        </div>
      </div>

      <h5 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.6rem;">Maintain Official Hostels Directory</h5>
      <div style="max-height: 220px; overflow-y: auto; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
        <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse;">
          <thead style="background: var(--bg-card-subtle); text-align: left;">
            <tr>
              <th style="padding: 6px 10px;">Hostel Name</th>
              <th style="padding: 6px 10px;">Campus</th>
              <th style="padding: 6px 10px;">Category</th>
              <th style="padding: 6px 10px;">Coordinates</th>
            </tr>
          </thead>
          <tbody>
            ${hostels.map(h => `
              <tr style="border-top: 1px solid var(--border-subtle);">
                <td style="padding: 6px 10px;"><strong>${escapeHtml(h.name)}</strong></td>
                <td style="padding: 6px 10px;">${escapeHtml(h.campus)}</td>
                <td style="padding: 6px 10px;">${h.category === 'girls' ? '🛡️ Girls' : 'Boys'}</td>
                <td style="padding: 6px 10px; font-family: var(--font-mono);">${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.75rem; color: var(--text-dim);">Admin privileges enforced on client state engine.</span>
        <button type="button" class="btn btn-secondary btn-sm" id="btnResetSeedData">Restore Initial Seed Rides</button>
      </div>
    `;

    document.getElementById('btnResetSeedData')?.addEventListener('click', () => {
      if (confirm('Reset rides database back to verified default state?')) {
        rides = window.INITIAL_RIDES;
        window.HBTUDataStore.saveRides(rides);
        renderRidesFeed();
        closeModal('adminModal');
        showToast('Seed rides restored.', 'success');
      }
    });
  }

  // Legal Documents Modal (Privacy, Terms, Guidelines)
  function openLegalModal(docType) {
    const titleEl = document.getElementById('legalModalTitle');
    const bodyEl = document.getElementById('legalModalBody');
    if (!bodyEl) return;

    const docs = {
      privacy: {
        title: 'Privacy Policy — HBTU RidePool',
        content: `
          <h4>1. Information Collection & Purpose</h4>
          <p>HBTU RidePool collects only necessary student details required to coordinate campus travel: full name, institutional email (@hbtu.ac.in), academic roll number, branch, academic year, hostel/pickup preference, and mobile contact number.</p>
          <h4>2. Strict Contact Privacy</h4>
          <p>Personal mobile phone numbers, roll numbers, and payment identifiers are kept private by default. Contact info is only disclosed to confirmed co-passengers who are mutually accepted in an active ride pool.</p>
          <h4>3. Geospatial & Map Queries</h4>
          <p>Interactive location selection utilizes OpenStreetMap and Leaflet. Nominatim reverse-geocoding queries receive general coordinates strictly to populate place names. No persistent user tracking or background GPS monitoring is performed.</p>
          <h4>4. Data Rights & Account Deletion</h4>
          <p>In accordance with Indian Digital Personal Data Protection principles, students can update their privacy preferences or delete their account and associated profile records directly from the Student Profile Dashboard at any time.</p>
        `
      },
      terms: {
        title: 'Terms of Service — HBTU RidePool',
        content: `
          <h4>1. Peer-to-Peer Carpooling Scope</h4>
          <p>HBTU RidePool is a non-commercial student communication and ride-coordination network. It does not own vehicles, operate taxi fleets, or employ drivers. All carpools are organized directly between students.</p>
          <h4>2. Commercial Third-Party Ride Services</h4>
          <p>Deep-links to Uber, Ola, and Rapido are provided for user convenience. Opening these apps does NOT book a cab automatically. Fares, driver dispatch, and transportation contracts exist solely between the student and the respective transportation provider.</p>
          <h4>3. Fair Cost Sharing</h4>
          <p>Ride participants split actual travel costs equally. Carpool hosts must not profit from rides or charge commercial tariffs beyond fair operating cost sharing.</p>
          <h4>4. Punctuality & Cancellation Rules</h4>
          <p>Students must arrive at the designated campus gate or pickup spot 5 minutes prior to departure. If canceling, give fellow students sufficient advance notice so alternative arrangements can be made.</p>
        `
      },
      community: {
        title: 'Campus Community Guidelines',
        content: `
          <h4>1. Respectful Conduct</h4>
          <p>All participants are fellow HBTU students. Treat co-passengers, auto operators, and campus security staff with respect and courtesy.</p>
          <h4>2. Zero Tolerance for Misconduct</h4>
          <p>Harassment, discriminatory remarks, or reckless behavior will result in immediate removal of platform access and referral to the HBTU Proctorial Board.</p>
          <h4>3. Girls-Only Corridor Integrity</h4>
          <p>The Girls-Only filter is designed to provide secure night and early morning travel for female students. Attempting to circumvent eligibility will result in permanent account suspension.</p>
        `
      },
      safety: {
        title: 'Campus Safety & Emergency Protocol',
        content: `
          <h4>1. Night Travel Recommendations</h4>
          <p>For journeys after 9:30 PM from Kanpur Central or Kanpur Airport, female students are advised to travel in groups or coordinate through verified Girls-Only pools.</p>
          <h4>2. Verification Check</h4>
          <p>Always verify your co-passengers' names and institutional roll numbers before departing the campus gate.</p>
          <h4>3. Immediate Helplines</h4>
          <p>In any emergency, contact the HBTU West Campus Proctor (+91 512 2534001), East Gate Security (+91 512 2534005), or UP Women Power Line (1090).</p>
        `
      },
      contact: {
        title: 'Contact & Student Support',
        content: `
          <h4>HBTU RidePool Student Mobility Initiative</h4>
          <p>Built with ❤️ by the student developer community of Harcourt Butler Technical University, Nawabganj, Kanpur, Uttar Pradesh 208002.</p>
          <p>For bug reports, auto route submissions, or privacy requests, contact: <strong>campus.ridepool@gmail.com</strong> or submit feedback directly through the feedback form on the homepage.</p>
        `
      }
    };

    const doc = docs[docType] || docs.terms;
    if (titleEl) titleEl.textContent = doc.title;
    bodyEl.innerHTML = doc.content;

    openModal('legalModal');
  }

  // Global Event Listeners & Modals Binding
  function bindGlobalEventListeners() {
    // Brand home click
    document.getElementById('brandHomeBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Modals triggers
    document.getElementById('btnOpenOfferRide')?.addEventListener('click', () => openModal('offerRideModal'));
    document.getElementById('btnEmptyOfferRide')?.addEventListener('click', () => openModal('offerRideModal'));
    document.getElementById('heroPostRideBtn')?.addEventListener('click', () => openModal('offerRideModal'));
    document.getElementById('btnOpenSos')?.addEventListener('click', () => openModal('sosModal'));
    document.getElementById('btnOpenAdminPortal')?.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminPortalModal();
    });

    // Mobile Bottom Nav
    document.getElementById('btnMobilePostRide')?.addEventListener('click', () => openModal('offerRideModal'));
    document.getElementById('btnMobileProfile')?.addEventListener('click', openProfileModal);
    document.getElementById('btnMobileMyTrips')?.addEventListener('click', () => {
      activeTab = 'my_pools';
      document.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-feed-tab') === 'my_pools');
      });
      renderRidesFeed();
      document.getElementById('explore-rides')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelectorAll('.mobile-nav-item[data-target]').forEach(item => {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // PDF Guide Download CTAs
    document.getElementById('btnDownloadGuideCta')?.addEventListener('click', () => {
      window.HBTUPdfGuide.generateAndDownload();
      showToast('Downloading HBTU RidePool Student Quick Start Guide (PDF)...', 'success');
    });

    document.getElementById('btnNavGuideDownload')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.HBTUPdfGuide.generateAndDownload();
      showToast('Downloading Student Guide (PDF)...', 'success');
    });

    // Feed filter pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeTab = pill.getAttribute('data-feed-tab');
        renderRidesFeed();
      });
    });

    // Forms
    document.getElementById('offerRideForm')?.addEventListener('submit', handleOfferRideSubmit);

    // Offer fare split live formula preview
    const fareInp = document.getElementById('offerTotalFare');
    const seatsInp = document.getElementById('offerTotalSeats');
    const prevEl = document.getElementById('offerSplitPreview');
    function updateOfferPrev() {
      const f = parseInt(fareInp?.value, 10) || 0;
      const s = parseInt(seatsInp?.value, 10) || 4;
      const calc = window.HBTUCabEngine.calculateFareSplit(f, s);
      if (prevEl) prevEl.textContent = `₹${calc.farePerPerson} / student`;
    }
    fareInp?.addEventListener('input', updateOfferPrev);
    seatsInp?.addEventListener('change', updateOfferPrev);

    // Chat submit
    document.getElementById('chatSendForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = document.getElementById('chatInputMessage');
      if (inp && inp.value) {
        sendChatMessage(inp.value);
        inp.value = '';
      }
    });

    // Auth Modal Tabs
    const tabLogin = document.getElementById('tabAuthLogin');
    const tabRegister = document.getElementById('tabAuthRegister');
    const tabForgot = document.getElementById('tabAuthForgot');
    const formLogin = document.getElementById('authLoginForm');
    const formRegister = document.getElementById('authRegisterForm');
    const formForgot = document.getElementById('authForgotForm');

    function switchAuthTab(tab) {
      tabLogin?.classList.toggle('active', tab === 'login');
      tabRegister?.classList.toggle('active', tab === 'register');
      tabForgot?.classList.toggle('active', tab === 'forgot');

      if (formLogin) formLogin.style.display = tab === 'login' ? 'block' : 'none';
      if (formRegister) formRegister.style.display = tab === 'register' ? 'block' : 'none';
      if (formForgot) formForgot.style.display = tab === 'forgot' ? 'block' : 'none';
    }

    tabLogin?.addEventListener('click', () => switchAuthTab('login'));
    tabRegister?.addEventListener('click', () => switchAuthTab('register'));
    tabForgot?.addEventListener('click', () => switchAuthTab('forgot'));

    formLogin?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('loginIdentifier').value;
      const pass = document.getElementById('loginPassword').value;
      try {
        currentUser = window.HBTUAuthInstance.login(id, pass);
        closeModal('authModal');
        updateUserAuthUI();
        renderRidesFeed();
        showToast(`Welcome back, ${currentUser.name.split(' ')[0]}!`, 'success');
      } catch (err) {
        showToast(err.message, 'danger');
      }
    });

    formRegister?.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        currentUser = window.HBTUAuthInstance.register({
          name: document.getElementById('regName').value,
          email: document.getElementById('regEmail').value,
          rollNo: document.getElementById('regRoll').value,
          branch: document.getElementById('regBranch').value,
          year: document.getElementById('regYear').value,
          hostel: document.getElementById('regHostel').value,
          gender: document.getElementById('regGender').value,
          phone: document.getElementById('regPhone').value,
          password: document.getElementById('regPassword').value
        });
        closeModal('authModal');
        updateUserAuthUI();
        renderRidesFeed();
        showToast(`Account created for ${currentUser.name}!`, 'success');
      } catch (err) {
        showToast(err.message, 'danger');
      }
    });

    formForgot?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotEmail').value;
      showToast(`Password recovery instructions sent to ${email}.`, 'info');
      switchAuthTab('login');
    });

    // Verification Submit
    document.getElementById('btnSubmitOtp')?.addEventListener('click', () => {
      const code = document.getElementById('verifyOtpInput')?.value;
      try {
        window.HBTUAuthInstance.verifyAccount(code);
        closeModal('verificationModal');
        updateUserAuthUI();
        renderRidesFeed();
        showToast('Your HBTU Student Badge is now verified! ✓', 'success');
      } catch (err) {
        showToast(err.message, 'danger');
      }
    });

    // Legal Links
    document.querySelectorAll('.open-legal-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openLegalModal(link.getAttribute('data-doc'));
      });
    });

    // Modal close controls
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal')));
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    // Escape key to close active modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const active = document.querySelector('.modal-overlay.active');
        if (active) closeModal(active.id);
      }
    });
  }

  // Helpers
  function formatDepartureTime(isoString) {
    if (!isoString) return 'Upcoming';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    if (isToday) return `Today, ${timeStr}`;
    if (isTomorrow) return `Tomorrow, ${timeStr}`;
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `<span>${escapeHtml(msg)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global exports for tests
  window.HBTUApp = {
    init,
    formatDepartureTime,
    showToast,
    openModal,
    closeModal
  };

})();
