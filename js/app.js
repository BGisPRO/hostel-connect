/**
 * HBTU RidePool - Minimalist Application Engine
 * Harcourt Butler Technical University, Kanpur
 */

(function () {
  'use strict';

  // State
  let rides = [];
  let currentUser = null;
  let activeTab = 'all';
  let activeChatRideId = null;

  function init() {
    loadUser();
    loadRides();
    populateSelectDropdowns();
    initAutoTakeSection();
    bindEvents();
    renderRides();
    renderEmergencyContacts();
  }

  function loadUser() {
    const saved = localStorage.getItem('hbtu_cabpool_user');
    if (saved) {
      try {
        currentUser = JSON.parse(saved);
      } catch (e) {
        currentUser = DEFAULT_CURRENT_USER;
      }
    } else {
      currentUser = DEFAULT_CURRENT_USER;
      localStorage.setItem('hbtu_cabpool_user', JSON.stringify(currentUser));
    }
    updateUserUI();
  }

  function updateUserUI() {
    const navName = document.getElementById('navUserName');
    const navAvatar = document.getElementById('navUserAvatar');
    if (navName && currentUser) {
      navName.textContent = `${currentUser.name.split(' ')[0]} (${currentUser.branch.split(' ')[0]} '${currentUser.year.match(/\d{2}/) ? currentUser.year.match(/\d{2}/)[0] : '26'})`;
    }
    if (navAvatar && currentUser) {
      navAvatar.src = currentUser.avatar;
    }
  }

  function loadRides() {
    const saved = localStorage.getItem('hbtu_cabpool_rides');
    if (saved) {
      try {
        rides = JSON.parse(saved);
      } catch (e) {
        rides = INITIAL_RIDES;
      }
    } else {
      rides = INITIAL_RIDES;
      saveRides();
    }
  }

  function saveRides() {
    localStorage.setItem('hbtu_cabpool_rides', JSON.stringify(rides));
  }

  function isUserInRide(ride) {
    if (!currentUser) return false;
    const isHost = ride.host.rollNo === currentUser.rollNo || ride.host.name === currentUser.name;
    const isPassenger = (ride.passengers || []).some(p => p.roll === currentUser.rollNo || p.name.includes(currentUser.name));
    return isHost || isPassenger;
  }

  function populateSelectDropdowns() {
    const offerFrom = document.getElementById('offerFrom');
    const offerTo = document.getElementById('offerTo');
    const optionsHtml = HBTU_LOCATIONS.map(loc => `<option value="${loc.name}">${loc.name}</option>`).join('');

    if (offerFrom) offerFrom.innerHTML = optionsHtml;
    if (offerTo) offerTo.innerHTML = optionsHtml;

    if (offerFrom && offerFrom.options.length > 1) offerFrom.selectedIndex = 1;
    if (offerTo && offerTo.options.length > 3) offerTo.selectedIndex = 3;

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

  // Direct Auto-Take Bar (Rapido, Uber, Ola, Campus Auto)
  function initAutoTakeSection() {
    const fromSel = document.getElementById('directFromSelect');
    const toSel = document.getElementById('directToSelect');
    const grid = document.getElementById('autoTakeCardsGrid');

    function updateAutoTakeGrid() {
      const from = fromSel?.value || 'HBTU West Campus (Awadhpuri)';
      const to = toSel?.value || 'Lucknow Airport (CCS / Amausi - LKO)';
      if (!grid || !window.HBTUCabEngine) return;

      const options = window.HBTUCabEngine.getCabOptions(from, to);

      grid.innerHTML = options.map(opt => {
        const isAuto = opt.id === 'campus_auto';
        return `
          <div class="autotake-card">
            <div class="autotake-card-top">
              <span class="card-service-title">${opt.icon} ${opt.name}</span>
              <span class="card-eta-badge">${opt.eta}</span>
            </div>

            <div class="card-price-row">
              <span class="split-fare-large">₹${opt.split4} <small style="font-size: 0.72rem; color: var(--text-dim); font-weight: 500;">/person</small></span>
              <span class="solo-fare-small">Solo Taxi: ₹${opt.soloFare} (${opt.distKm} km)</span>
            </div>

            ${isAuto ? `
              <button class="btn btn-sm btn-cyan autotake-btn" id="btnCampusAutoStand">
                Gate Auto Stand
              </button>
            ` : `
              <a href="${opt.link}" target="_blank" class="btn btn-sm ${opt.btnClass} autotake-btn">
                Auto-Take ${opt.name} ➔
              </a>
            `}
          </div>
        `;
      }).join('');

      document.getElementById('btnCampusAutoStand')?.addEventListener('click', () => {
        showToast('Local e-rickshaws and autos available directly outside West Campus DBRA Gate & East Gate.', 'info');
      });

      renderRides();
    }

    fromSel?.addEventListener('change', updateAutoTakeGrid);
    toSel?.addEventListener('change', updateAutoTakeGrid);

    // Quick Destination Chips
    document.querySelectorAll('.dest-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.dest-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const dest = chip.getAttribute('data-dest');
        if (toSel) {
          toSel.value = dest;
          updateAutoTakeGrid();
          showToast(`Destination set: ${chip.textContent}`, 'info');
        }
      });
    });

    updateAutoTakeGrid();
  }

  function formatTime(isoString) {
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

  // Render Minimalist Rides List
  function renderRides() {
    const container = document.getElementById('ridesContainer');
    const emptyState = document.getElementById('noRidesFound');
    const countPill = document.getElementById('feedCountPill');
    const toSel = document.getElementById('directToSelect');
    const currentDest = toSel?.value || '';

    if (!container) return;

    let filtered = rides.filter(ride => {
      if (activeTab === 'my_pools' && !isUserInRide(ride)) return false;
      if (activeTab === 'girls_only' && ride.genderPref !== 'girls_only') return false;

      // Optional smart destination affinity
      if (currentDest && !ride.to.toLowerCase().includes(currentDest.toLowerCase().split('(')[0].trim())) {
        // If not matching active tab, still show general pools
      }

      return true;
    });

    if (countPill) countPill.textContent = `${filtered.length} Ride${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered.map(ride => {
      const remainingSeats = ride.totalSeats - ride.bookedSeats;
      const perHead = Math.ceil(ride.totalFare / ride.totalSeats);
      const isJoined = isUserInRide(ride);
      const isGirls = ride.genderPref === 'girls_only';
      const isFull = remainingSeats <= 0;

      // Direct links
      const uberLink = CAB_SERVICES[1].buildLink(ride.from, ride.to);

      // Clean display names
      const fromShort = ride.from.split('(')[0].trim();
      const toShort = ride.to.split('(')[0].trim();
      const vehicleShort = ride.vehicleType.split('(')[0].trim();
      const hostBranchShort = ride.host.branch ? ride.host.branch.split('&')[0].trim() : '';
      const hostAvatar = ride.host.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ride.host.name)}`;

      return `
        <article class="minimal-ride-card" data-ride-id="${ride.id}">
          <!-- Top Bar: Status Badges & Price Split -->
          <div class="ride-card-top-bar">
            <div class="ride-card-badges">
              <span class="ride-time-pill" title="Departure Time">
                🕒 ${formatTime(ride.departureTime)}
              </span>
              <span class="seat-pill ${remainingSeats > 0 ? 'available' : 'full'}">
                ${remainingSeats > 0 ? `🟢 ${remainingSeats} seat${remainingSeats > 1 ? 's' : ''} left` : '🚫 Full'}
              </span>
              ${isGirls ? `<span class="tag-pill rose">🛡️ Girls Only</span>` : ''}
              <span class="tag-pill vehicle-pill">${escapeHtml(vehicleShort)}</span>
              ${ride.driverDetails ? `<span class="tag-pill plate">${escapeHtml(ride.driverDetails.plateNumber)}</span>` : ''}
            </div>

            <div class="ride-card-fare">
              <span class="fare-val">₹${perHead}</span>
              <span class="fare-note">per head</span>
            </div>
          </div>

          <!-- Route Display: From ➔ To -->
          <div class="ride-card-route">
            <div class="route-station route-from">
              <span class="station-marker origin"></span>
              <div class="station-meta">
                <span class="station-name">${escapeHtml(fromShort)}</span>
                ${ride.fromDetail ? `<span class="station-detail" title="${escapeHtml(ride.fromDetail)}">${escapeHtml(ride.fromDetail)}</span>` : ''}
              </div>
            </div>

            <div class="route-connector-arrow">
              <span class="connector-track"></span>
              <span class="connector-symbol">➔</span>
            </div>

            <div class="route-station route-to">
              <span class="station-marker destination"></span>
              <div class="station-meta">
                <span class="station-name">${escapeHtml(toShort)}</span>
                ${ride.toDetail ? `<span class="station-detail" title="${escapeHtml(ride.toDetail)}">${escapeHtml(ride.toDetail)}</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Trip Note -->
          ${ride.notes ? `
            <div class="ride-card-note" title="${escapeHtml(ride.notes)}">
              <span class="note-icon">💬</span>
              <span class="note-content">"${escapeHtml(ride.notes)}"</span>
            </div>
          ` : ''}

          <!-- Bottom Bar: Host info & Action Buttons -->
          <div class="ride-card-bottom-bar">
            <div class="ride-host-chip">
              <img src="${hostAvatar}" alt="${escapeHtml(ride.host.name)}" class="host-avatar">
              <div class="host-info-text">
                <span class="host-label">Host: <strong>${escapeHtml(ride.host.name)}</strong></span>
                ${hostBranchShort ? `<span class="host-branch-text">${escapeHtml(hostBranchShort)}</span>` : ''}
              </div>
            </div>

            <div class="ride-actions-row">
              <a href="${uberLink}" target="_blank" class="btn btn-uber btn-sm" title="Auto-Take in Uber with destination prefilled">
                Uber
              </a>

              <button class="btn btn-secondary btn-sm btn-open-chat" data-ride-id="${ride.id}">
                💬 Chat
              </button>

              <button class="btn btn-secondary btn-sm btn-open-upi" data-ride-id="${ride.id}">
                UPI
              </button>

              ${isJoined ? `
                <button class="btn btn-cyan btn-sm btn-view-pass" data-ride-id="${ride.id}">
                  Pass
                </button>
              ` : (isFull ? `
                <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.5;">Full</button>
              ` : `
                <button class="btn btn-primary btn-sm btn-join-ride" data-ride-id="${ride.id}">
                  Join
                </button>
              `)}
            </div>
          </div>
        </article>
      `;
    }).join('');

    bindCardEvents();
  }

  function bindCardEvents() {
    document.querySelectorAll('.btn-join-ride').forEach(btn => {
      btn.addEventListener('click', () => {
        const rideId = btn.getAttribute('data-ride-id');
        openRideDetailModal(rideId);
      });
    });

    document.querySelectorAll('.btn-open-chat').forEach(btn => {
      btn.addEventListener('click', () => {
        const rideId = btn.getAttribute('data-ride-id');
        openRideChatModal(rideId);
      });
    });

    document.querySelectorAll('.btn-open-upi').forEach(btn => {
      btn.addEventListener('click', () => {
        const rideId = btn.getAttribute('data-ride-id');
        openUpiModal(rideId);
      });
    });

    document.querySelectorAll('.btn-view-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const rideId = btn.getAttribute('data-ride-id');
        openTicketModal(rideId);
      });
    });
  }

  // Ride Detail Modal
  function openRideDetailModal(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    const remainingSeats = ride.totalSeats - ride.bookedSeats;
    const perHead = Math.ceil(ride.totalFare / ride.totalSeats);
    const body = document.getElementById('detailModalBody');
    const footer = document.getElementById('detailModalFooter');

    body.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-sm); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 0.72rem; color: var(--accent-emerald); font-weight: 700;">CONFIRMED FARE SPLIT</span>
          <div style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 800; color: #fff;">₹${perHead} <small style="font-size: 0.8rem; font-weight: 500; color: var(--text-dim);">/person</small></div>
        </div>
        <div style="text-align: right; font-size: 0.85rem; color: #34d399; font-weight: 700;">
          🟢 ${remainingSeats} seat${remainingSeats > 1 ? 's' : ''} left
        </div>
      </div>

      <div style="font-size: 0.9rem;">
        <div style="margin-bottom: 0.4rem;"><strong>Route:</strong> ${ride.from} (${ride.fromDetail}) ➔ ${ride.to} (${ride.toDetail})</div>
        <div style="margin-bottom: 0.4rem;"><strong>Time:</strong> ${formatTime(ride.departureTime)}</div>
        <div style="margin-bottom: 0.4rem;"><strong>Host:</strong> ${ride.host.name} (${ride.host.branch})</div>
      </div>

      <div style="font-size: 0.85rem;">
        <strong style="display: block; margin-bottom: 0.3rem;">Co-passengers:</strong>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          ${ride.passengers.map(p => `<span class="mini-tag">${p.gender === 'F' ? '👩‍🎓' : '👨‍🎓'} ${p.name}</span>`).join('')}
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button type="button" class="btn btn-secondary btn-sm" data-close-modal="rideDetailModal">Cancel</button>
      <button type="button" class="btn btn-primary btn-sm" id="btnConfirmJoinPool" data-ride-id="${ride.id}">
        Confirm & Reserve Seat
      </button>
    `;

    document.getElementById('btnConfirmJoinPool')?.addEventListener('click', () => {
      confirmJoin(ride.id);
    });

    openModal('rideDetailModal');
  }

  function confirmJoin(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    if (ride.genderPref === 'girls_only' && currentUser.gender === 'M') {
      showToast('This pool is strictly for female students.', 'danger');
      return;
    }

    ride.passengers.push({
      name: currentUser.name,
      roll: currentUser.rollNo,
      gender: currentUser.gender,
      joinedAt: 'Just now',
      paid: false
    });
    ride.bookedSeats += 1;

    saveRides();
    closeModal('rideDetailModal');
    renderRides();
    showToast(`Seat reserved in ${ride.host.name}'s pool!`, 'success');
  }

  // Chat
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
    chatArea.innerHTML = (ride.chat || []).map(msg => {
      const isMine = currentUser && msg.sender.includes(currentUser.name);
      return `
        <div class="chat-bubble ${isMine ? 'mine' : 'theirs'}">
          <div style="font-size: 0.7rem; opacity: 0.7; margin-bottom: 2px;">${msg.sender} • ${msg.time}</div>
          <div>${escapeHtml(msg.message)}</div>
        </div>
      `;
    }).join('');
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function sendChat(text) {
    if (!activeChatRideId || !text.trim()) return;
    const ride = rides.find(r => r.id === activeChatRideId);
    if (!ride) return;

    ride.chat = ride.chat || [];
    ride.chat.push({
      sender: currentUser.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      message: text.trim()
    });

    saveRides();
    renderChatMessages(ride);
  }

  // UPI
  function openUpiModal(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;
    const perHead = Math.ceil(ride.totalFare / ride.totalSeats);
    const body = document.getElementById('upiModalBody');
    const upiData = window.HBTUCabEngine.generateUPILink(ride.host.upiId, ride.host.name, perHead, ride.id);

    body.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <span style="font-size: 0.75rem; color: var(--text-dim);">PAYMENT SPLIT</span>
        <div style="font-family: var(--font-mono); font-size: 2.2rem; font-weight: 800; color: var(--accent-emerald);">₹${perHead}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">To: ${ride.host.name} (<code>${upiData.upiId}</code>)</div>
      </div>

      <div style="background: #fff; padding: 10px; border-radius: var(--radius-sm); display: inline-block; margin-bottom: 1rem;">
        <img src="${upiData.qrUrl}" alt="QR" style="width: 160px; height: 160px; display: block;">
      </div>

      <a href="${upiData.upiUri}" class="btn btn-primary" style="width: 100%;">
        Open UPI App (GPay / PhonePe / Paytm)
      </a>
    `;

    openModal('upiModal');
  }

  // Boarding Pass
  function openTicketModal(rideId) {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;
    const perHead = Math.ceil(ride.totalFare / ride.totalSeats);
    const body = document.getElementById('ticketModalBody');

    body.innerHTML = `
      <div style="background: var(--bg-input); border: 1px dashed var(--border-subtle); padding: 1.25rem; border-radius: var(--radius-md);">
        <div style="font-size: 0.72rem; color: var(--accent-emerald); font-weight: 700;">HBTU BOARDING PASS #${ride.id.toUpperCase()}</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0.5rem 0;">${ride.from.split('(')[0]} ➔ ${ride.to.split('(')[0]}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">🕒 ${formatTime(ride.departureTime)} • Split: ₹${perHead}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">Host Contact: ${ride.host.name} (${ride.host.phone})</div>
      </div>
    `;

    openModal('ticketModal');
  }

  // Post Pool Form
  function handleOfferSubmit(e) {
    e.preventDefault();
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
      id: 'ride-' + Date.now().toString().slice(-4),
      from,
      fromDetail,
      to,
      toDetail,
      departureTime: new Date(time).toISOString(),
      totalFare,
      totalSeats,
      bookedSeats: 1,
      genderPref,
      vehicleType: vehicle,
      driverDetails: null,
      notes,
      host: {
        name: currentUser.name,
        branch: currentUser.branch,
        year: currentUser.year,
        phone: currentUser.phone,
        whatsapp: currentUser.whatsapp || ('91' + currentUser.phone),
        upiId: hostUpi || currentUser.upiId,
        rollNo: currentUser.rollNo,
        avatar: currentUser.avatar
      },
      passengers: [
        { name: `${currentUser.name} (Host)`, roll: currentUser.rollNo, gender: currentUser.gender, joinedAt: 'Just now', paid: true }
      ],
      chat: []
    };

    rides.unshift(newRide);
    saveRides();
    closeModal('offerRideModal');
    renderRides();
    showToast('Cab pool published live!', 'success');
  }

  function renderEmergencyContacts() {
    const container = document.getElementById('emergencyContactsList');
    if (!container) return;
    container.innerHTML = EMERGENCY_CONTACTS.map(c => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.85rem;">
        <div>
          <strong style="color: #fff; display: block;">${c.name}</strong>
          <span style="font-size: 0.74rem; color: var(--text-dim);">${c.desc}</span>
        </div>
        <a href="tel:${c.phone.replace(/\s+/g, '')}" class="btn btn-sm btn-secondary">📞 ${c.phone}</a>
      </div>
    `).join('');
  }

  // Modals
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
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function bindEvents() {
    document.getElementById('brandHomeBtn')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('btnOpenOfferRide')?.addEventListener('click', () => openModal('offerRideModal'));
    document.getElementById('btnEmptyOfferRide')?.addEventListener('click', () => openModal('offerRideModal'));
    document.getElementById('btnOpenSos')?.addEventListener('click', () => openModal('sosModal'));

    // Offer fare split live preview
    const fareInp = document.getElementById('offerTotalFare');
    const seatsInp = document.getElementById('offerTotalSeats');
    const prevEl = document.getElementById('offerSplitPreview');
    function updatePrev() {
      const f = parseInt(fareInp?.value, 10) || 0;
      const s = parseInt(seatsInp?.value, 10) || 4;
      if (prevEl) prevEl.textContent = `₹${Math.ceil(f / s)} / student`;
    }
    fareInp?.addEventListener('input', updatePrev);
    seatsInp?.addEventListener('change', updatePrev);

    document.getElementById('offerRideForm')?.addEventListener('submit', handleOfferSubmit);

    // Feed Tabs
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeTab = pill.getAttribute('data-feed-tab');
        renderRides();
      });
    });

    // Chat submit
    document.getElementById('chatSendForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = document.getElementById('chatInputMessage');
      if (inp && inp.value) {
        sendChat(inp.value);
        inp.value = '';
      }
    });

    // Close modals
    document.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', () => closeModal(el.getAttribute('data-close-modal')));
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    // Profile Modal
    document.getElementById('btnOpenProfile')?.addEventListener('click', () => {
      const nameInp = document.getElementById('profNameInput');
      const rollInp = document.getElementById('profRollInput');
      const branchInp = document.getElementById('profBranchInput');
      const phoneInp = document.getElementById('profPhoneInput');
      const upiInp = document.getElementById('profUpiInput');

      if (nameInp && currentUser) nameInp.value = currentUser.name;
      if (rollInp && currentUser) rollInp.value = currentUser.rollNo;
      if (branchInp && currentUser) branchInp.value = currentUser.branch;
      if (phoneInp && currentUser) phoneInp.value = currentUser.phone;
      if (upiInp && currentUser) upiInp.value = currentUser.upiId || '';

      openModal('profileModal');
    });

    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      currentUser.name = document.getElementById('profNameInput').value.trim();
      currentUser.rollNo = document.getElementById('profRollInput').value.trim();
      currentUser.branch = document.getElementById('profBranchInput').value.trim();
      currentUser.phone = document.getElementById('profPhoneInput').value.trim();
      currentUser.upiId = document.getElementById('profUpiInput').value.trim();
      localStorage.setItem('hbtu_cabpool_user', JSON.stringify(currentUser));
      updateUserUI();
      closeModal('profileModal');
      showToast('Profile saved!', 'success');
      renderRides();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
