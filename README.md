# Rishi Healthcare - Super Speciality Hospital Management System 

A modern full-stack hospital management system and healthcare portal built with **pure JavaScript** across the entire stack. Features a public hospital web presence, an authenticated **Patient Health Portal**, and an **Admin & Clinical Staff Command Center**.

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons (pure JavaScript `.jsx`, `.js`)
- **Backend**: Node.js & Express REST API (ES Modules, native CORS, modular architecture)
- **Database & ORM**: PostgreSQL via **Prisma ORM** (`@prisma/client`)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs` password hashing

---

## 🏥 1. Public Hospital Portal (Website)

Access the live homepage at [http://localhost:3000](http://localhost:3000):

- **Brand Identity**: Official Rishi Healthcare teal cross emblem, verified styling, and responsive navigation.
- **5-Second Promotional Banner Carousel**: Auto-rotating hospital banners (cardiac emergency, robotic surgery, health checkups) with pause-on-hover, navigation arrows, and 1-click appointment booking.
- **OPD Appointment Booking Widget**: Real-time selection of medical department, consulting doctor, preferred date, time slot, and patient registration details.
- **Centers of Excellence**: Clinical specialties covering Cardiac Sciences, Robotic Oncology, Neurosciences, Orthopaedics, Nephrology, and Gastroenterology.
- **Rishi Diagnostics & NABL Lab Services**: Complete test directory (Hemogram, Lipid Profile, HbA1c, Thyroid, Vitamin D/B12) with instant booking and home collection scheduling.
- **About Us & Medical Advisory Board**: Overview of quaternary care, ethics, patient-first culture, and clinical advisory leadership.
- **24x7 Emergency Trauma Concierge**: Emergency hotline (1066) and direct contact assistance.

---

## 👤 2. Authenticated Patient Portal

Accessible to registered patients upon login (e.g. `rohit.kumar@example.com`):

- **Personalized Patient Dashboard**: Displays patient name, digital healthcare ID (`PAT-1001`), and blood group (`B+`).
- **Health Summary**: Real-time stat cards for upcoming appointments, active prescriptions, unpaid invoices, and outpatient status.
- **My Consultations & OPD Visits**: Live appointment tracker (`CONFIRMED`, `PENDING`, `COMPLETED`, `CANCELLED`) with 1-click booking and cancellation.
- **Medical Records & Prescriptions**: View physician clinical diagnoses, recorded vitals (blood pressure, pulse, temperature, weight), clinical notes, and medication schedules.
- **Secure Online Billing & Tax Invoices**: View itemized hospital invoices with simulated UPI/Card payment and printable official tax receipts. *(Securely restricted to logged-in patients to safeguard patient medical data).*
- **Specialist Directory**: Browse hospital specialists by department, consultation fee, room number, and schedule with direct appointment booking.

---

## 🛡️ 3. Admin & Hospital Staff Command Center

Accessible to administrative, medical, and reception staff (e.g. `admin@hospital.com` or `dr.sharma@hospital.com`):

- **Hospital Command Center (Dashboard)**: Real-time operational metrics, total patients, doctor roster, ward bed occupancy %, revenue collection, and today's appointment feed.
- **Patient Directory & EMR**: Searchable patient database, demographic profiles, comprehensive medical history drawer, and new patient onboarding.
- **Doctor & Staff Management**: Doctor profiles, consultation fees, OPD room assignments, schedule management, and live availability toggling.
- **Appointments Management**: Review and confirm online OPD requests, reschedule, mark completed, or cancel consultations.
- **Ward & Bed Management**: Interactive visual bed layout across **ICU**, **General Ward**, **Semi-Private**, and **Deluxe Suites** with admission and discharge workflows.
- **Pharmacy & Drug Inventory**: Medicine stock monitoring, low-stock notifications, quick restock (`+20`), and dispensing (`-5`).
- **Billing & Finance Management**: Issue itemized invoices (Consultations, Bed Charges, Pharmacy, Lab Diagnostics), record payments, and generate official printable tax invoices (`window.print()`).
- **Clinical Departments**: Manage hospital departments, department heads, and codes.

---

## 🔑 Demo Accounts for 1-Click Testing

The login interface includes **1-Click Quick Login** buttons for instant testing without typing credentials:

| Portal Type | Role | Name | Email | Password |
|---|---|---|---|---|
| **Patient Portal** | Patient | Rohit Kumar | `rohit.kumar@example.com` | `Password@123` |
| **Admin Portal** | Super Admin | Dr. Alok Nath | `admin@hospital.com` | `Password@123` |
| **Admin Portal** | Cardiologist | Dr. Aarav Sharma | `dr.sharma@hospital.com` | `Password@123` |
| **Admin Portal** | Receptionist | Neha Kapoor | `reception@hospital.com` | `Password@123` |

---

## 📁 Repository Structure

```text
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # PostgreSQL data models & relationships
│   ├── src/
│   │   ├── controllers/       # Route business logic (auth, appointments, billing, etc.)
│   │   ├── middleware/        # JWT auth verification, role guards, error handlers
│   │   ├── routes/            # Express REST API routes (/api/*)
│   │   ├── utils/             # Helper utilities
│   │   ├── seed.js            # Comprehensive demo database seed script
│   │   └── server.js          # Express app setup, native CORS, root status & API listener
│   ├── .env.example           # Backend environment template
│   └── package.json           # Backend dependencies (express, prisma, bcryptjs, jwt, dotenv)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/         # Admin command center modules & drawers
│   │   │   ├── max/           # Rishi Healthcare public website sections & carousel
│   │   │   ├── patient/       # Patient portal modules (records, appointments, billing)
│   │   │   └── shared/        # Shared modals, badges, navigation
│   │   ├── context/           # Global auth & state management
│   │   ├── services/          # Frontend API client
│   │   ├── App.jsx            # Main app router & layout
│   │   └── main.jsx           # Vite React DOM entry
│   ├── index.html             # HTML entry & branding
│   ├── tailwind.config.js     # Tailwind CSS theme configuration
│   └── package.json           # Frontend dependencies (react, vite, tailwindcss, lucide)
├── .gitignore                 # Protects environment files, node_modules, and build outputs
├── package.json               # Root package script runner (concurrently)
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **PostgreSQL** running locally or via a cloud instance (e.g. Supabase, Neon, or local port 5432)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/shnikhil06-cyber/Capstone-3demo.git
cd Capstone-3demo
```

### Step 2: Install Dependencies
Install dependencies for the root orchestrator, backend, and frontend:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 3: Configure Environment Variables
Create a `.env` file in the `backend/` directory by copying `.env.example`:
```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and update your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/hospital_db"
PORT=5001
JWT_SECRET="your_jwt_secret_token_key"
NODE_ENV="development"
```

### Step 4: Setup Database & Seed Demo Data
Push the Prisma database schema and populate it with sample doctors, departments, patients, appointments, rooms, and billing records:
```bash
cd backend
npx prisma db push
npm run seed
cd ..
```

### Step 5: Start Development Servers
Run both backend (port 5001) and frontend (port 3000) concurrently with a single command:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API Server**: [http://localhost:5001](http://localhost:5001)
- **Backend Status Route**: [http://localhost:5001/](http://localhost:5001/)

---

## 🔌 API Endpoints Summary

All backend API routes are prefixed with `/api`:

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | API Welcome & Service Status | Public |
| `GET` | `/api/health` | Health Check Endpoint | Public |
| `POST` | `/api/auth/login` | User authentication & JWT generation | Public |
| `POST` | `/api/auth/register` | Patient self-registration | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |
| `GET`, `POST` | `/api/doctors` | List & manage hospital doctors | Public / Admin |
| `GET`, `POST` | `/api/departments` | List & manage clinical departments | Public / Admin |
| `GET`, `POST` | `/api/appointments` | Book, view, and update appointments | Authenticated |
| `GET`, `POST` | `/api/patients` | Patient directory & medical profiles | Admin / Doctor |
| `GET`, `POST` | `/api/medical-records` | Clinical diagnoses & prescriptions | Doctor / Patient |
| `GET`, `POST` | `/api/rooms` | Ward & bed management (ICU, General) | Admin / Staff |
| `GET`, `POST` | `/api/pharmacy` | Drug inventory tracking & dispensing | Staff / Admin |
| `GET`, `POST` | `/api/billing` | Itemized invoice & tax receipt management | Authenticated |
| `GET` | `/api/dashboard/stats` | Hospital command center real-time metrics | Admin |

---

## 🛠️ Useful Commands

```bash
# Re-seed database with clean demo data
cd backend && npm run seed

# Launch Prisma Studio (interactive visual database browser)
cd backend && npm run prisma:studio

# Build frontend for production
cd frontend && npm run build
```

---

## 📄 License
This project is developed for educational and demonstration purposes.
