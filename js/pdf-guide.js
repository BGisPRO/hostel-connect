/**
 * HBTU RidePool - Student Quick Start Guide PDF Generator
 * Harcourt Butler Technical University, Kanpur
 * 
 * Generates an authentic, structured, printer-friendly downloadable PDF guide.
 * Includes complete workflows, hostel listings, safety rules, fair fare splitting formulas,
 * third-party deep links, and emergency helplines.
 */

(function () {
  'use strict';

  class HBTUPdfGuide {
    static generateAndDownload() {
      if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
        this.generateWithJsPDF();
      } else {
        this.generatePrintableBlob();
      }
    }

    static generateWithJsPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const primaryTeal = [13, 148, 136]; // #0d9488
      const navyDark = [15, 23, 42];     // #0f172a
      const slateGray = [71, 85, 105];   // #475569
      const subtleBorder = [226, 232, 240];

      // Page 1: Header & Overview
      doc.setFillColor(...primaryTeal);
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('HBTU RidePool — Student Quick Start Guide', 14, 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Official Campus Mobility Handbook • v2.1 • October 2026', 14, 20);

      let y = 32;

      // Section 1: What is HBTU RidePool
      doc.setTextColor(...navyDark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('1. What is HBTU RidePool?', 14, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...slateGray);
      const text1 = 'HBTU RidePool is a student-built peer mobility coordination platform designed for Harcourt Butler Technical University, Kanpur. It helps students from East Campus (Nawabganj) and West Campus (Awadhpuri) coordinate shared cab and auto rides to major transit hubs including Kanpur Central Railway Station (CNB), Lucknow Airport (LKO), Chakeri Airport, and city destinations. Students split travel costs transparently and plan journeys in advance.';
      const split1 = doc.splitTextToSize(text1, 182);
      doc.text(split1, 14, y);
      y += (split1.length * 4.5) + 4;

      // Section 2: Account Creation & Verification
      doc.setTextColor(...navyDark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('2. Account Setup & Verification', 14, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...slateGray);
      const text2 = '• Register using your full name, university email (@hbtu.ac.in), branch, year, and primary hostel.\n• Account verification requires entering the 4-digit verification code sent to your email (Default MVP passcode: 1921).\n• Privacy guarantee: Your personal phone number, roll number, and payment identifiers are kept private and only disclosed to confirmed co-passengers once a ride is approved.';
      const split2 = doc.splitTextToSize(text2, 182);
      doc.text(split2, 14, y);
      y += (split2.length * 4.5) + 4;

      // Section 3: Verified HBTU Hostels Directory
      doc.setTextColor(...navyDark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('3. Verified Campus Hostels & Pickup Points', 14, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...slateGray);
      const hostelsText = '• West Campus Boys: Ramanujan Hostel, Shridharacharya Hostel, Abdul Kalam Hostel, Visvesvaraya Hostel\n• East Campus Boys: Raman Hostel, Vishwakarma Hostel, Ambedkar Hostel, Aryabhatt Hostel\n• West Campus Girls: Alaknanda Hostel, Mandakini Hostel\n• East Campus Girls: Gangotri Hostel, Bhagirathi Hostel, Kaveri Hostel, Saraswati Hostel\n• Main Gates: West Awadhpuri Main Gate (Gate 1 & 2), East Nawabganj Central Library Gate';
      const splitHostels = doc.splitTextToSize(hostelsText, 182);
      doc.text(splitHostels, 14, y);
      y += (splitHostels.length * 4) + 4;

      // Section 4: How Ride Matching & Future-Booking Logic Works
      doc.setTextColor(...navyDark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('4. Future Carpools vs. Commercial Cabs (Important Distinction)', 14, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...slateGray);
      const bookingText = '• Peer Carpool: Organized directly between verified students. Ride hosts publish date, time, available seats, and estimated total fare.\n• Seat Requests: Passengers submit a request. The host reviews and accepts or rejects the seat.\n• Confirmation Status: A pool displays "Open for passengers" until capacity is reached ("Full").\n• Commercial Cabs: HBTU RidePool provides 1-tap deep links to Uber, Ola, and Rapido with pre-filled GPS coordinates. Opening these apps does NOT book a cab automatically; the ride must be ordered within that app.';
      const splitBooking = doc.splitTextToSize(bookingText, 182);
      doc.text(splitBooking, 14, y);
      y += (splitBooking.length * 4) + 4;

      // Section 5: Transparent Fare Splitting Formula
      doc.setTextColor(...navyDark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('5. Fair Fare Splitting Rule', 14, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...slateGray);
      const fareText = '• Transparent Formula: Indicative Fare Per Student = Math.ceil(Total Estimated Cab Fare ÷ Total Seats).\n• Example: A ₹1,800 cab to Lucknow Airport split among 4 students equals ₹450 per student (saving ₹1,350 each!).\n• Settlement: Co-passengers pay the host directly via UPI dynamic QR code or cash upon boarding.';
      const splitFare = doc.splitTextToSize(fareText, 182);
      doc.text(splitFare, 14, y);
      y += (splitFare.length * 4) + 6;

      // Section 6: Safety, Women-Only Pools & Emergency Helplines
      doc.setTextColor(...navyDark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('6. Campus Safety Guidelines & 24x7 Helplines', 14, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...slateGray);
      const safetyText = '• Girls-Only Filter: Female students can filter and create pools strictly reserved for women riders.\n• Emergency Contacts:\n  - HBTU West Campus Proctorial Office: +91 512 2534001\n  - HBTU East Campus Security Control: +91 512 2534005\n  - UP Women Power Line (24x7): 1090\n  - National Emergency Response: 112\n  - Kanpur Central Railway Police (GRP): +91 512 2321200\n  - HBTU Health Centre & Dispensary: +91 512 2534015';
      const splitSafety = doc.splitTextToSize(safetyText, 182);
      doc.text(splitSafety, 14, y);
      y += (splitSafety.length * 3.8) + 6;

      // Footer
      doc.setDrawColor(...subtleBorder);
      doc.line(14, 280, 196, 280);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('HBTU RidePool • Built for the Harcourt Butler Technical University Student Community • Kanpur, UP, India', 14, 285);

      // Trigger Download
      doc.save('HBTU_RidePool_Student_Quick_Start_Guide.pdf');
    }

    static generatePrintableBlob() {
      // Fallback printable view
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>HBTU RidePool — Student Quick Start Guide (v2.1)</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #0f172a; max-width: 800px; margin: 40px auto; padding: 0 20px; }
            h1 { color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 8px; font-size: 24px; }
            h2 { color: #1e293b; margin-top: 24px; font-size: 18px; }
            p, li { color: #475569; font-size: 14px; }
            .badge { background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .helpline-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-top: 15px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>HBTU RidePool — Student Quick Start Guide <span class="badge">v2.1</span></h1>
          <p><em>Official Campus Mobility Handbook • Harcourt Butler Technical University, Kanpur</em></p>
          
          <h2>1. What is HBTU RidePool?</h2>
          <p>HBTU RidePool is a student-built peer mobility coordination platform designed for Harcourt Butler Technical University, Kanpur. It helps students from East Campus (Nawabganj) and West Campus (Awadhpuri) coordinate shared cab and auto rides to major transit hubs including Kanpur Central Railway Station (CNB), Lucknow Airport (LKO), and city destinations.</p>

          <h2>2. Account Setup & Verification</h2>
          <p>Register using your full name, university email (@hbtu.ac.in), branch, year, and primary hostel. Verification requires entering the 4-digit code sent to your student email (Default MVP passcode: 1921). Personal phone numbers and payment IDs are kept private and only disclosed to confirmed co-passengers once a ride is approved.</p>

          <h2>3. Verified Campus Hostels & Pickup Points</h2>
          <ul>
            <li><strong>West Campus Boys:</strong> Ramanujan Hostel, Shridharacharya Hostel, Abdul Kalam Hostel, Visvesvaraya Hostel</li>
            <li><strong>East Campus Boys:</strong> Raman Hostel, Vishwakarma Hostel, Ambedkar Hostel, Aryabhatt Hostel</li>
            <li><strong>West Campus Girls:</strong> Alaknanda Hostel, Mandakini Hostel</li>
            <li><strong>East Campus Girls:</strong> Gangotri Hostel, Bhagirathi Hostel, Kaveri Hostel, Saraswati Hostel</li>
            <li><strong>Campus Gates:</strong> West Awadhpuri Main Gate (Gate 1 & 2), East Nawabganj Central Library Gate</li>
          </ul>

          <h2>4. Future Carpools vs. Commercial Cabs</h2>
          <p>Peer Carpools are organized directly between students. HBTU RidePool also provides 1-tap deep links to Uber, Ola, and Rapido with pre-filled GPS coordinates. Opening these apps does NOT book a cab automatically; the ride must be confirmed within that app.</p>

          <h2>5. Fair Fare Splitting Rule</h2>
          <p>Indicative Fare Per Student = Total Cab Fare ÷ Total Seats. For example, a ₹1,800 cab to Lucknow Airport split among 4 students equals ₹450 per student.</p>

          <h2>6. Campus Safety & Emergency Helplines</h2>
          <div class="helpline-box">
            <p><strong>HBTU West Campus Proctorial Office:</strong> +91 512 2534001</p>
            <p><strong>HBTU East Campus Security Control Room:</strong> +91 512 2534005</p>
            <p><strong>UP Women Power Line (24x7):</strong> 1090</p>
            <p><strong>National Emergency Response:</strong> 112</p>
            <p><strong>Kanpur Central GRP Station:</strong> +91 512 2321200</p>
            <p><strong>HBTU Health Centre & Dispensary:</strong> +91 512 2534015</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `;

      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'HBTU_RidePool_Student_Quick_Start_Guide.html';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 500);
    }
  }

  window.HBTUPdfGuide = HBTUPdfGuide;
})();
