
-- =====================================
-- 1. USER TABLE
-- =====================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'PATIENT',
    name VARCHAR(255),
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- 2. DEPARTMENT TABLE
-- =====================================
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- =====================================
-- 3. DOCTOR TABLE
-- =====================================
CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    department_id INT REFERENCES department(id),
    specialization VARCHAR(200),
    qualification VARCHAR(200),
    experience_years INT DEFAULT 0,
    consultation_fee NUMERIC(10,2) DEFAULT 500,
    is_available BOOLEAN DEFAULT TRUE
);

-- =====================================
-- 4. PATIENT TABLE
-- =====================================
CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    patient_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30),
    date_of_birth DATE,
    age INT,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    address TEXT
);

-- =====================================
-- 5. APPOINTMENT TABLE
-- =====================================
CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(id),
    doctor_id INT REFERENCES doctor(id),
    department_id INT REFERENCES department(id),
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    reason TEXT
);

-- =====================================
-- 6. MEDICAL RECORD TABLE
-- =====================================
CREATE TABLE medical_record (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(id),
    doctor_id INT REFERENCES doctor(id),
    appointment_id INT REFERENCES appointment(id),
    record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT,
    symptoms TEXT,
    doctor_notes TEXT
);

-- =====================================
-- 7. PRESCRIPTION TABLE
-- =====================================
CREATE TABLE prescription (
    id SERIAL PRIMARY KEY,
    medical_record_id INT REFERENCES medical_record(id),
    patient_id INT REFERENCES patient(id),
    doctor_id INT REFERENCES doctor(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- 8. MEDICINE TABLE
-- =====================================
CREATE TABLE medicine (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    stock INT DEFAULT 0,
    unit_price NUMERIC(10,2),
    expiry_date DATE
);

-- =====================================
-- 9. PRESCRIPTION ITEM TABLE
-- =====================================
CREATE TABLE prescription_item (
    id SERIAL PRIMARY KEY,
    prescription_id INT REFERENCES prescription(id),
    medicine_id INT REFERENCES medicine(id),
    medicine_name VARCHAR(200),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration_days INT
);

-- =====================================
-- 10. ROOM TABLE
-- =====================================
CREATE TABLE room (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) UNIQUE,
    floor INT DEFAULT 1,
    room_type VARCHAR(50),
    daily_rate NUMERIC(10,2),
    total_beds INT DEFAULT 1
);

-- =====================================
-- 11. BED TABLE
-- =====================================
CREATE TABLE bed (
    id SERIAL PRIMARY KEY,
    bed_number VARCHAR(50) UNIQUE,
    room_id INT REFERENCES room(id),
    status VARCHAR(50) DEFAULT 'AVAILABLE'
);

-- =====================================
-- 12. ADMISSION TABLE
-- =====================================
CREATE TABLE admission (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(id),
    bed_id INT REFERENCES bed(id),
    doctor_id INT REFERENCES doctor(id),
    admission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    discharge_date TIMESTAMP,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'ADMITTED'
);

-- =====================================
-- 13. BILL TABLE
-- =====================================
CREATE TABLE bill (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(id),
    appointment_id INT REFERENCES appointment(id),
    admission_id INT REFERENCES admission(id),
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10,2) DEFAULT 0,
    paid_amount NUMERIC(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'UNPAID'
);

-- =====================================
-- 14. BILL ITEM TABLE
-- =====================================
CREATE TABLE bill_item (
    id SERIAL PRIMARY KEY,
    bill_id INT REFERENCES bill(id),
    description VARCHAR(255),
    quantity INT DEFAULT 1,
    unit_price NUMERIC(10,2),
    total_price NUMERIC(10,2)
);

-- =====================================
-- 15. LAB TEST TABLE
-- =====================================
CREATE TABLE lab_test (
    id SERIAL PRIMARY KEY,
    test_code VARCHAR(50) UNIQUE,
    test_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    cost NUMERIC(10,2)
);

-- =====================================
-- 16. LAB REPORT TABLE
-- =====================================
CREATE TABLE lab_report (
    id SERIAL PRIMARY KEY,
    lab_test_id INT REFERENCES lab_test(id),
    patient_id INT REFERENCES patient(id),
    doctor_id INT REFERENCES doctor(id),
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    result_summary TEXT,
    findings TEXT,
    status VARCHAR(50) DEFAULT 'REQUESTED'
);
