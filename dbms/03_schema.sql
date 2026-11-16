-- ============================================================================
-- RISHI HEALTHCARE - HOSPITAL MANAGEMENT SYSTEM (HMS)
-- RELATIONAL DATABASE DDL SCHEMA DEFINITION (POSTGRESQL)
-- File: dbms/03_schema.sql
-- ============================================================================

-- Enable UUID extension for cryptographic surrogate primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CLEANUP / DROP EXISTING TABLES (Reverse Dependency Order)
-- ============================================================================
DROP TABLE IF EXISTS "LabReport" CASCADE;
DROP TABLE IF EXISTS "LabTest" CASCADE;
DROP TABLE IF EXISTS "BillItem" CASCADE;
DROP TABLE IF EXISTS "Bill" CASCADE;
DROP TABLE IF EXISTS "PrescriptionItem" CASCADE;
DROP TABLE IF EXISTS "Medicine" CASCADE;
DROP TABLE IF EXISTS "Prescription" CASCADE;
DROP TABLE IF EXISTS "MedicalRecord" CASCADE;
DROP TABLE IF EXISTS "Admission" CASCADE;
DROP TABLE IF EXISTS "Bed" CASCADE;
DROP TABLE IF EXISTS "Room" CASCADE;
DROP TABLE IF EXISTS "Appointment" CASCADE;
DROP TABLE IF EXISTS "Patient" CASCADE;
DROP TABLE IF EXISTS "Doctor" CASCADE;
DROP TABLE IF EXISTS "Department" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- ============================================================================
-- 2. TABLE DEFINITIONS
-- ============================================================================

-- Table: User (Authentication & Role-Based Access Control)
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(30) NOT NULL DEFAULT 'PATIENT',
    "name" VARCHAR(255),
    "phone" VARCHAR(30),
    "avatar" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK ("role" IN ('ADMIN', 'DOCTOR', 'PATIENT', 'RECEPTIONIST', 'PHARMACIST'))
);

-- Table: Department (Clinical Centers of Excellence)
CREATE TABLE "Department" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(150) NOT NULL UNIQUE,
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "description" TEXT,
    "icon" VARCHAR(100) DEFAULT 'Building2',
    "headDoctor" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: Doctor (Medical Specialist Clinical Profiles)
CREATE TABLE "Doctor" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" INT NOT NULL UNIQUE,
    "departmentId" UUID NOT NULL,
    "specialization" VARCHAR(200) NOT NULL,
    "qualification" VARCHAR(200) NOT NULL,
    "experienceYears" INT NOT NULL DEFAULT 0,
    "consultationFee" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "roomNo" VARCHAR(50),
    "workingHours" VARCHAR(100) NOT NULL DEFAULT '09:00 AM - 05:00 PM',
    "isAvailable" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctor_user FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_doctor_department FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table: Patient (Patient Demographics & Medical Profile)
CREATE TABLE "Patient" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" INT UNIQUE,
    "patientCode" VARCHAR(50) NOT NULL UNIQUE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30) NOT NULL,
    "dateOfBirth" TIMESTAMP WITH TIME ZONE,
    "age" INT,
    "gender" VARCHAR(20) NOT NULL,
    "bloodGroup" VARCHAR(10),
    "address" TEXT,
    "emergencyContactName" VARCHAR(255),
    "emergencyContactPhone" VARCHAR(30),
    "allergies" TEXT,
    "chronicConditions" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient_user FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_patient_gender CHECK ("gender" IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_patient_blood CHECK ("bloodGroup" IS NULL OR "bloodGroup" IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'))
);

-- Table: Appointment (Outpatient Department Consultation Bookings)
CREATE TABLE "Appointment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "appointmentNumber" VARCHAR(50) NOT NULL UNIQUE,
    "patientId" UUID NOT NULL,
    "doctorId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "appointmentDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "timeSlot" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL DEFAULT 'CONSULTATION',
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "reason" TEXT NOT NULL,
    "symptoms" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_patient FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appointment_doctor FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appointment_department FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_appointment_status CHECK ("status" IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'))
);

-- Table: MedicalRecord (Doctor Clinical Diagnosis & Vitals EMR)
CREATE TABLE "MedicalRecord" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "patientId" UUID NOT NULL,
    "doctorId" UUID NOT NULL,
    "appointmentId" UUID UNIQUE,
    "recordDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diagnosis" TEXT NOT NULL,
    "symptoms" TEXT,
    "vitalsBp" VARCHAR(50),
    "vitalsPulse" VARCHAR(50),
    "vitalsTemp" VARCHAR(50),
    "vitalsWeight" VARCHAR(50),
    "doctorNotes" TEXT,
    "followUpDate" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medrecord_patient FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_medrecord_doctor FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_medrecord_appointment FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Table: Prescription (Physician Signed Medication Orders)
CREATE TABLE "Prescription" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "medicalRecordId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "doctorId" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prescription_medrecord FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_prescription_patient FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_prescription_doctor FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Medicine (Central Hospital Drug Formulary & Inventory)
CREATE TABLE "Medicine" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "name" VARCHAR(200) NOT NULL,
    "genericName" VARCHAR(200),
    "category" VARCHAR(100) NOT NULL,
    "manufacturer" VARCHAR(200),
    "dosageForm" VARCHAR(50) NOT NULL DEFAULT 'TABLET',
    "stock" INT NOT NULL DEFAULT 0,
    "minStockAlert" INT NOT NULL DEFAULT 10,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: PrescriptionItem (Itemized Medicine Dosing Details)
CREATE TABLE "PrescriptionItem" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "prescriptionId" UUID NOT NULL,
    "medicineId" UUID,
    "medicineName" VARCHAR(200) NOT NULL,
    "dosage" VARCHAR(100) NOT NULL,
    "frequency" VARCHAR(100) NOT NULL,
    "durationDays" INT NOT NULL,
    "instructions" TEXT,
    CONSTRAINT fk_rxitem_prescription FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rxitem_medicine FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Table: Room (Hospital Ward Units & Per-Diem Tariffs)
CREATE TABLE "Room" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "roomNumber" VARCHAR(50) NOT NULL UNIQUE,
    "floor" INT NOT NULL DEFAULT 1,
    "roomType" VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    "dailyRate" DOUBLE PRECISION NOT NULL,
    "totalBeds" INT NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_room_type CHECK ("roomType" IN ('ICU', 'GENERAL', 'SEMI_PRIVATE', 'DELUXE'))
);

-- Table: Bed (Physical Inpatient Beds & Status Tracking)
CREATE TABLE "Bed" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bedNumber" VARCHAR(50) NOT NULL UNIQUE,
    "roomId" UUID NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bed_room FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_bed_status CHECK ("status" IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'))
);

-- Table: Admission (Inpatient Hospital Admission Episodes)
CREATE TABLE "Admission" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "admissionCode" VARCHAR(50) NOT NULL UNIQUE,
    "patientId" UUID NOT NULL,
    "bedId" UUID NOT NULL,
    "attendingDoctorId" UUID NOT NULL,
    "admissionDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dischargeDate" TIMESTAMP WITH TIME ZONE,
    "reason" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'ADMITTED',
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admission_patient FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_admission_bed FOREIGN KEY ("bedId") REFERENCES "Bed"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_admission_doctor FOREIGN KEY ("attendingDoctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_admission_status CHECK ("status" IN ('ADMITTED', 'DISCHARGED', 'TRANSFERRED'))
);

-- Table: Bill (Official Hospital Invoices & Tax Receipts)
CREATE TABLE "Bill" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "invoiceNumber" VARCHAR(50) NOT NULL UNIQUE,
    "patientId" UUID NOT NULL,
    "appointmentId" UUID,
    "admissionId" UUID,
    "issueDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP WITH TIME ZONE,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" VARCHAR(50) NOT NULL DEFAULT 'UNPAID',
    "paymentMethod" VARCHAR(50) NOT NULL DEFAULT 'CASH',
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bill_patient FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_bill_appointment FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_bill_admission FOREIGN KEY ("admissionId") REFERENCES "Admission"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_bill_status CHECK ("status" IN ('UNPAID', 'PAID', 'PARTIAL', 'CANCELLED')),
    CONSTRAINT chk_bill_payment_method CHECK ("paymentMethod" IN ('CASH', 'CARD', 'UPI', 'INSURANCE', 'NET_BANKING'))
);

-- Table: BillItem (Itemized Charges on Hospital Invoice)
CREATE TABLE "BillItem" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "billId" UUID NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "category" VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    "quantity" INT NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    CONSTRAINT fk_billitem_bill FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_billitem_category CHECK ("category" IN ('CONSULTATION', 'BED_CHARGE', 'PHARMACY', 'LAB_TEST', 'PROCEDURE', 'OTHER'))
);

-- Table: LabTest (Pathology & Radiology Test Catalog)
CREATE TABLE "LabTest" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "testCode" VARCHAR(50) NOT NULL UNIQUE,
    "testName" VARCHAR(200) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "sampleType" VARCHAR(100) NOT NULL DEFAULT 'Blood',
    "cost" DOUBLE PRECISION NOT NULL,
    "turnaroundHours" INT NOT NULL DEFAULT 24,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: LabReport (Patient Laboratory Diagnostic Findings)
CREATE TABLE "LabReport" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "reportCode" VARCHAR(50) NOT NULL UNIQUE,
    "labTestId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "doctorId" UUID NOT NULL,
    "testDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultSummary" TEXT,
    "findings" TEXT,
    "normalRange" VARCHAR(100),
    "status" VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_labreport_test FOREIGN KEY ("labTestId") REFERENCES "LabTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_labreport_patient FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_labreport_doctor FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_labreport_status CHECK ("status" IN ('REQUESTED', 'SAMPLE_COLLECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

-- ============================================================================
-- 3. PERFORMANCE INDEXES (Foreign Keys & Frequent Search Predicates)
-- ============================================================================
CREATE INDEX "idx_user_email" ON "User"("email");
CREATE INDEX "idx_doctor_departmentId" ON "Doctor"("departmentId");
CREATE INDEX "idx_patient_patientCode" ON "Patient"("patientCode");
CREATE INDEX "idx_patient_phone" ON "Patient"("phone");
CREATE INDEX "idx_appointment_patientId" ON "Appointment"("patientId");
CREATE INDEX "idx_appointment_doctorId" ON "Appointment"("doctorId");
CREATE INDEX "idx_appointment_date" ON "Appointment"("appointmentDate");
CREATE INDEX "idx_medrecord_patientId" ON "MedicalRecord"("patientId");
CREATE INDEX "idx_prescription_patientId" ON "Prescription"("patientId");
CREATE INDEX "idx_rxitem_prescriptionId" ON "PrescriptionItem"("prescriptionId");
CREATE INDEX "idx_bed_roomId" ON "Bed"("roomId");
CREATE INDEX "idx_bed_status" ON "Bed"("status");
CREATE INDEX "idx_admission_patientId" ON "Admission"("patientId");
CREATE INDEX "idx_admission_status" ON "Admission"("status");
CREATE INDEX "idx_bill_patientId" ON "Bill"("patientId");
CREATE INDEX "idx_bill_invoiceNumber" ON "Bill"("invoiceNumber");
CREATE INDEX "idx_billitem_billId" ON "BillItem"("billId");
CREATE INDEX "idx_labreport_patientId" ON "LabReport"("patientId");
CREATE INDEX "idx_labreport_status" ON "LabReport"("status");

-- ============================================================================
-- Schema definition complete. Compatible with PostgreSQL 13+ and Prisma ORM.
-- ============================================================================
