/**
 * HBTU RidePool - Authentication & Student Profile Manager
 * Harcourt Butler Technical University, Kanpur
 * 
 * Handles user sign-up, login, logout, password recovery, verification,
 * and privacy settings.
 */

(function () {
  'use strict';

  class HBTUAuth {
    constructor() {
      this.STORAGE_KEY_USER = 'hbtu_auth_current_user';
      this.STORAGE_KEY_USERS_DB = 'hbtu_auth_registered_users';
      this.init();
    }

    init() {
      // Ensure seed default user exists in registered database
      const users = this.getRegisteredUsers();
      if (users.length === 0 && window.DEFAULT_CURRENT_USER) {
        users.push({
          ...window.DEFAULT_CURRENT_USER,
          passwordHash: 'hbtu2026', // Initial demo password
          registeredAt: new Date().toISOString()
        });
        localStorage.setItem(this.STORAGE_KEY_USERS_DB, JSON.stringify(users));
      }
    }

    getRegisteredUsers() {
      const data = localStorage.getItem(this.STORAGE_KEY_USERS_DB);
      if (data) {
        try { return JSON.parse(data); } catch (e) { return []; }
      }
      return [];
    }

    getCurrentUser() {
      const active = localStorage.getItem(this.STORAGE_KEY_USER);
      if (active === 'null' || active === null && localStorage.getItem('hbtu_auth_session_init')) {
        return null;
      }
      if (active) {
        try { return JSON.parse(active); } catch (e) { return null; }
      }
      // Initial seed fallback on very first app load
      if (window.DEFAULT_CURRENT_USER) {
        localStorage.setItem('hbtu_auth_session_init', 'true');
        this.setCurrentUser(window.DEFAULT_CURRENT_USER);
        return window.DEFAULT_CURRENT_USER;
      }
      return null;
    }

    setCurrentUser(user) {
      if (user) {
        localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
        // Also sync with HBTUDataStore
        if (window.HBTUDataStore) {
          window.HBTUDataStore.saveUser(user);
        }
      } else {
        localStorage.setItem(this.STORAGE_KEY_USER, 'null');
      }
      this.notifyAuthStateChange();
    }

    register(userData) {
      const users = this.getRegisteredUsers();

      // Validate university email or roll number uniqueness
      const email = (userData.email || '').trim().toLowerCase();
      const rollNo = (userData.rollNo || '').trim().toUpperCase();

      if (!email || !rollNo || !userData.name || !userData.password) {
        throw new Error('Please fill all mandatory fields (Name, Email, Roll No, Password).');
      }

      const existing = users.find(u => u.email.toLowerCase() === email || u.rollNo.toUpperCase() === rollNo);
      if (existing) {
        throw new Error('An account with this University Email or Roll Number already exists. Please log in.');
      }

      const isHbtuEmail = email.endsWith('@hbtu.ac.in');

      const newUser = {
        id: 'usr_' + Date.now().toString(36),
        name: userData.name.trim(),
        email: email,
        rollNo: rollNo,
        branch: userData.branch || 'Engineering',
        year: userData.year || '1st Year (2026)',
        hostel: userData.hostel || 'HBTU West Campus (Awadhpuri)',
        phone: userData.phone ? userData.phone.trim() : '',
        whatsapp: userData.phone ? ('91' + userData.phone.trim().replace(/\D/g, '')) : '',
        upiId: userData.upiId ? userData.upiId.trim() : `${rollNo.toLowerCase()}@okaxis`,
        gender: userData.gender || 'any',
        verified: isHbtuEmail, // Automatic pre-verification if valid @hbtu.ac.in domain
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name)}`,
        passwordHash: userData.password,
        registeredAt: new Date().toISOString(),
        privacySettings: {
          hidePhoneUntilConfirmed: true,
          hideEmail: true
        }
      };

      users.push(newUser);
      localStorage.setItem(this.STORAGE_KEY_USERS_DB, JSON.stringify(users));

      // Set as active session
      this.setCurrentUser(newUser);
      return newUser;
    }

    login(identifier, password) {
      const users = this.getRegisteredUsers();
      const cleanId = (identifier || '').trim().toLowerCase();

      const user = users.find(u => 
        (u.email.toLowerCase() === cleanId || u.rollNo.toLowerCase() === cleanId) &&
        u.passwordHash === password
      );

      if (!user) {
        throw new Error('Invalid credentials. Check your email/roll number and password.');
      }

      this.setCurrentUser(user);
      return user;
    }

    logout() {
      this.setCurrentUser(null);
    }

    verifyAccount(otpCode) {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No active student session to verify.');

      // Standard OTP verification (Accepts 1921 - HBTU founding year - or any 4 digit code for MVP)
      if (otpCode && (otpCode.trim() === '1921' || otpCode.trim().length === 4)) {
        user.verified = true;
        this.updateProfile(user);
        return true;
      }
      throw new Error('Invalid verification code. Enter the 4-digit code sent to your student email (Hint: 1921).');
    }

    updateProfile(updatedFields) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return null;

      const merged = { ...currentUser, ...updatedFields };
      this.setCurrentUser(merged);

      // Sync in users DB
      const users = this.getRegisteredUsers();
      const idx = users.findIndex(u => u.id === merged.id || u.rollNo === merged.rollNo);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updatedFields };
        localStorage.setItem(this.STORAGE_KEY_USERS_DB, JSON.stringify(users));
      }

      return merged;
    }

    deleteAccount() {
      const user = this.getCurrentUser();
      if (!user) return;

      const users = this.getRegisteredUsers().filter(u => u.id !== user.id && u.rollNo !== user.rollNo);
      localStorage.setItem(this.STORAGE_KEY_USERS_DB, JSON.stringify(users));
      this.logout();
    }

    notifyAuthStateChange() {
      window.dispatchEvent(new CustomEvent('hbtu_auth_change', {
        detail: { user: this.getCurrentUser() }
      }));
    }
  }

  window.HBTUAuthInstance = new HBTUAuth();
})();
