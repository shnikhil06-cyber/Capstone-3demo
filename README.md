# CarePulse Hospital Management System (HMS)

A dual-portal web application with dedicated experiences for **Patients / Users** and **Admins / Hospital Staff**, built with **pure JavaScript** across the stack:
- **Frontend**: React (Vite + Tailwind CSS + Lucide Icons) in pure JavaScript (`.jsx`, `.js`)
- **Backend**: Express REST API in pure JavaScript (Node.js ES Modules)
- **Database**: PostgreSQL on port 5432 using **Prisma ORM** (`@prisma/client`)
- **Connection**: `DATABASE_URL="postgresql://nikhilsharma:NIKhil%40123@localhost:5432/hospital_db"`

---

## 🏥 First Screen: Rishi Healthcare Public Portal

When you open the web application at [http://localhost:3000](http://localhost:3000), it opens directly to the **Rishi Healthcare Super Speciality Hospital Homepage**:
- **Brand & Logo**: Official Rishi Healthcare teal cross emblem with signature S-curve division, matching the hospital promotional banners across all pages, modals, and browser favicons.
- **5-Second Promotional Banner Carousel**: Placed directly below the navbar, automatically rotates through featured hospital promotional banners every 5 seconds (with pause-on-hover, arrow controls, and interactive 1-click booking scroll).
- **Hero OPD Booking Widget**: Directly select Speciality, Doctor, Preferred Date, OPD Slot, and enter patient details to book appointments online.
- **Top Bar Quick Navigation**:
  - 👤 **Patient Sign In**: Sign in to the Patient / Visitor Health Portal
  - 🛡️ **Are you an Admin?**: Opens the Hospital Staff & Admin Management Console
  - 💳 **Pay Bill Online**: Instant hospital invoice lookup and payment

---

## 👤 1. Patient / User Portal

When logging in as a patient (e.g. Rohit Kumar or any registered patient):
- **Personalized Header**: Displays patient's name, digital healthcare code (`PAT-1001`), and blood group (`B+`).
- **My Health Overview**: Live stat cards (Upcoming Consultations, Active Prescriptions, Unpaid Invoices, Outpatient Status), and next scheduled visit details.
- **My Appointments**: View scheduled consultations, live status (`CONFIRMED`, `PENDING`, `COMPLETED`, `CANCELLED`), cancel pending appointments, and book new OPD visits.
- **My Medical Records & Prescriptions**: View doctor clinical diagnoses, recorded vitals (BP, pulse, temperature, weight), doctor notes, and prescribed medications with dosage routines.
- **My Bills & Online Payments**: View hospital tax invoices, 1-click Pay Now (simulated UPI/Card payment), and printable official tax receipt.
- **Find Specialists Directory**: Browse hospital physicians by department, consultation fee, OPD room number, and timings with a 1-click "Book with Doctor" button.
- **Switch to Admin Portal / Log Out**: Quick switcher in the navbar to test admin mode anytime.

---

## 🛡️ 2. Admin & Hospital Staff Portal

When logging in as Admin or Hospital Staff (e.g. Dr. Alok Nath or Dr. Aarav Sharma):
- **Hospital Command Center (Dashboard)**: Real-time analytics, total patients, doctors count, bed occupancy %, collected revenue, today's appointments table.
- **Patient Directory & EMR**: Searchable patient database, demographic profiles, medical history drawer, new patient registration.
- **Medical Specialists Management**: Doctor directory, fee settings, OPD room assignments, schedule management, live availability toggle.
- **Appointments Management**: Confirm pending appointments, reschedule, mark completed, or cancel.
- **Ward & Bed Management**: Interactive visual ward map (ICU, General Ward, Semi-Private, Deluxe Suites), bed admission and patient discharge with automatic invoice generation.
- **Pharmacy & Drug Inventory**: Medicine stock tracking, low-stock alerts, quick restock (`+20`) and dispense (`-5`).
- **Billing & Finance**: Issue itemized invoices (Consultation, Pharmacy, Bed Charges, Lab Tests), payment recording, and official printable tax invoice (`window.print()`).
- **Clinical Departments**: Manage cardiology, neurology, orthopedics, pediatrics, and medicine units.
- **Switch to Patient Portal View**: Quick preview button in the navbar.

---

## 🔑 Demo Accounts for 1-Click Testing

| Portal Type | Role | Name | Email | Password |
|---|---|---|---|---|
| **Patient Portal** | Patient | Rohit Kumar | `rohit.kumar@example.com` | `Password@123` |
| **Admin Portal** | Super Admin | Dr. Alok Nath | `admin@hospital.com` | `Password@123` |
| **Admin Portal** | Cardiologist | Dr. Aarav Sharma | `dr.sharma@hospital.com` | `Password@123` |
| **Admin Portal** | Receptionist | Neha Kapoor | `reception@hospital.com` | `Password@123` |

*(The login screen also provides 1-Click Instant Login buttons for both portals so you don't even have to type credentials).*

---

## 🚀 How to Run

### Run Both Frontend & Backend Concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

### Re-seed Clean Demo Data Anytime:
Click the **"Reset Demo Data"** button in the navbar, or run:
```bash
cd backend && npm run seed
```
