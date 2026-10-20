# 🚖 HBTU RidePool — Smart Cab Pooling & Booking Engine

> **Live Cab Comparator, 1-Tap Uber & Rapido Booking, and Peer-to-Peer Fare Splitting for Harcourt Butler Technical University (HBTU) Kanpur Students.**

---

## 🌟 What Sets This Apart from a Basic "Messenger"?

Rather than acting merely as an informal chat board, **HBTU RidePool** is an end-to-end **Mobility & Transit Engine** that connects directly into the cab ecosystem:

1. **⚡ Live Multi-Cab Fare Comparator (Uber vs. Ola vs. Rapido vs. inDrive)**:
   - Compares live estimated tariffs across 4 major services for any campus corridor.
   - Shows **Solo Cab Price vs. 4-Student Split Price** (e.g. ₹1,800 solo taxi to Lucknow Airport becomes **₹450/person**, saving ₹1,350 per student!).
   - Displays estimated pickup arrival duration (*e.g. Uber: 3–7 mins, Rapido: 2–5 mins*).

2. **🚀 1-Tap Uber & Rapido GPS Deep-Link Booking**:
   - Universal URL intents with **exact pre-configured HBTU GPS coordinates**:
     - *HBTU West Campus Gate / DBRA Hostel* (`26.4950° N, 80.3015° E`)
     - *HBTU East Campus / Central Library* (`26.4862° N, 80.3160° E`)
     - *Kanpur Central Platform 1 Cantt Side* (`26.4539° N, 80.3513° E`)
     - *Lucknow CCS Airport Terminal 3* (`26.7606° N, 80.8893° E`)
     - *Kanpur Chakeri Airport* (`26.4410° N, 80.4078° E`)
   - Clicking **"Book on Uber"** or **"Book on Rapido"** opens the app with origin and destination already pre-filled.

3. **🚖 Real-Time Driver & Cab Dispatch Broadcast**:
   - Once the host books on Uber/Ola/Taxi, they log the driver's info:
     - Driver Name & Direct Call Button
     - Vehicle Model & Color (*e.g. White Maruti Suzuki Dzire*)
     - Official Number Plate (*e.g. `UP 78 EZ 4821`*)
     - Ride Start OTP (*e.g. `6192`*)
   - Instantly broadcasts to every co-passenger's phone screen so nobody has to hunt for the car at the campus gate.

4. **💸 Dynamic UPI Payment QR Code & Settlement**:
   - Generates compliant `upi://pay?pa=...&pn=...&am=...&cu=INR` links with live dynamic QR codes.
   - Co-passengers can scan and pay their ₹450 or ₹80 split via **Google Pay, PhonePe, or Paytm** in 5 seconds.
   - Tracks payment status (*Paid ✓ vs. Pending*) without awkward money conversations.

5. **🎯 Smart Schedule & Flight/Train Matcher**:
   - Students enter their train or flight time window (*e.g. 4:30 PM departure*).
   - An intelligent matching algorithm scores and pairs them with batchmates traveling in the same corridor within a ±30-to-60 minute window.

6. **🛡️ Campus Safety & Verification**:
   - Roll number & branch verification badges.
   - **Girls-Only Pools (`🛡️ Girls Only`)**: Exclusive filter for female students.
   - Direct emergency hotline buttons for **HBTU Proctorial Board**, **East/West Security**, **UP Women Helpline 1090**, and **112**.

---

## 💻 Tech Stack & Architecture

- **Frontend**: HTML5, Modern Vanilla CSS3 (Glassmorphism, custom design system, fluid responsive grids).
- **Transit Engine**: `js/cab-service.js` (Tariff calculations, Haversine road distances, GPS coordinates, Uber & Rapido deep-link builders, UPI string generators).
- **Core State Engine**: `js/app.js` (Reactive filters, state persistence in `localStorage`, automated chat simulation, modal orchestration, Web Audio API sounds).
- **Transit Radar**: `js/map-visualizer.js` (Interactive SVG campus corridors).

---

## 🏃 Running the Application

The web app runs locally on any web server:
```bash
python -m http.server 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
