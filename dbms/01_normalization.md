# Database Normalization Report: Rishi Healthcare HMS

## 1. Executive Summary

This report documents the formal relational database normalization process for the **Rishi Healthcare & Hospital Management System (HMS)**. 

The schema has been decomposed and designed to achieve **Boyce-Codd Normal Form (BCNF)** and **Third Normal Form (3NF)** across all entities. This ensures:
- **Zero Redundancy**: No duplicate storage of clinical, demographic, pharmaceutical, or billing data.
- **Elimination of Anomalies**: Prevention of Insertion, Update, and Deletion anomalies in critical quaternary healthcare workflows.
- **Referential & Domain Integrity**: Strict foreign key constraints with explicit referential actions (`ON DELETE CASCADE`, `ON DELETE SET NULL`, `ON DELETE RESTRICT`).

---

## 2. Unnormalized Form (UNF) Analysis

In an unnormalized hospital ledger (flat record / spreadsheet), patient visits, consultations, lab tests, prescriptions, bed allocations, and invoices are recorded as single mega-rows with repeating groups and mixed domains.

### 2.1 Sample UNF Record

```text
UNF_HospitalRecord(
    PatientCode, PatientName, PatientPhone, PatientEmail, PatientDOB, PatientBloodGroup,
    DoctorName, DoctorSpecialization, DoctorFee, DepartmentName, DepartmentCode,
    AppointmentNumber, AppointmentDate, TimeSlot, Diagnosis, Symptoms, VitalsBP, VitalsPulse,
    PrescriptionMedicines [MedicineName, Dosage, Frequency, Duration, UnitPrice, Manufacturer],
    RoomNumber, RoomType, DailyRate, BedNumber, AdmissionDate, DischargeDate,
    InvoiceNumber, InvoiceSubtotal, TaxRate, TotalAmount, PaymentStatus,
    LabTestCode, LabTestName, LabTestCost, LabResultFindings
)
```

### 2.2 Anomalies in UNF

1. **Insertion Anomaly**:
   - A new clinical department (e.g., *Robotic Oncology*) or medical specialist cannot be added until an appointment is booked by a patient.
   - A new room or bed cannot exist in the database without an active admitted patient.
   - A pharmaceutical medicine or lab test catalog entry cannot be registered without being prescribed or billed.

2. **Update Anomaly**:
   - If Dr. Aarav Sharma changes his OPD consultation fee or room number, hundreds of historical rows referencing his name must be updated. Any missed row results in contradictory data.
   - If the daily rate for *ICU Bed* changes, past and present patient bills without historical isolation risk inconsistent calculations.

3. **Deletion Anomaly**:
   - Deleting a patient's historical visit record inadvertently deletes the doctor's record, department existence, or pharmaceutical medicine catalog entry.

---

## 3. First Normal Form (1NF)

### 3.1 Definition & Requirements
A relation is in **1NF** if and only if:
1. Every attribute contains only **atomic (indivisible)** values.
2. There are **no repeating groups** or arrays stored inside single fields.
3. Each record is uniquely identifiable by a Primary Key.

### 3.2 1NF Decomposition
- **Separation of Prescription Items**: The repeating list of prescribed medicines `PrescriptionMedicines[...]` is decomposed into an individual relation `PrescriptionItem`.
- **Separation of Bill Items**: Itemized invoice line items are extracted into `BillItem`.
- **Separation of Vitals**: Patient vitals (`BP`, `Pulse`, `Temperature`, `Weight`) are split into distinct, atomic columns (`vitalsBp`, `vitalsPulse`, `vitalsTemp`, `vitalsWeight`).
- **Primary Keys Assigned**: Surrogate unique identifiers (UUIDs and auto-incrementing integers) are assigned to every relation (`id`).

---

## 4. Second Normal Form (2NF)

### 4.1 Definition & Requirements
A relation is in **2NF** if:
1. It is already in **1NF**.
2. There are **no partial dependencies**—every non-prime attribute is fully functionally dependent on the entire Primary Key (specifically relevant for composite keys).

### 4.2 2NF Decomposition Analysis

Consider a composite relation handling prescription lines:
$$\text{PrescriptionDetail}(\underline{\text{PrescriptionId}, \text{MedicineCode}}, \text{MedicineName}, \text{Manufacturer}, \text{Dosage}, \text{Frequency}, \text{Duration}, \text{UnitPrice})$$

- $\text{PrescriptionId}, \text{MedicineCode} \to \text{Dosage}, \text{Frequency}, \text{Duration}$ (Full Dependency)
- $\text{MedicineCode} \to \text{MedicineName}, \text{Manufacturer}, \text{UnitPrice}$ (**Partial Dependency** on a subset of the candidate key)

#### Decomposition into 2NF:
1. **`Medicine` Table** (Catalog):
   $$\underline{\text{MedicineId}} \to \text{Code}, \text{Name}, \text{GenericName}, \text{Category}, \text{Manufacturer}, \text{UnitPrice}, \text{Stock}, \text{ExpiryDate}$$
2. **`PrescriptionItem` Table** (Transaction detail):
   $$\underline{\text{PrescriptionItemId}} \to \text{PrescriptionId}, \text{MedicineId}, \text{Dosage}, \text{Frequency}, \text{DurationDays}, \text{Instructions}$$

The same principle was applied to itemized billing:
- **`BillItem`** depends on `BillId` and its own surrogate PK, decoupling line items from master billing header data.

---

## 5. Third Normal Form (3NF)

### 5.1 Definition & Requirements
A relation is in **3NF** if:
1. It is in **2NF**.
2. There are **no transitive dependencies** ($X \to Y$ and $Y \to Z$, where $Z$ is a non-prime attribute dependent on non-key attribute $Y$).

### 5.2 3NF Decomposition Case Studies

#### Case 1: Doctor and Department
- **Transitive Dependency**: $\text{DoctorId} \to \text{DepartmentId} \to \text{DepartmentName}, \text{DepartmentCode}, \text{HeadDoctor}$
- **Decomposition**:
  - `Doctor` retains `departmentId` as Foreign Key.
  - `Department` stores `id`, `name`, `code`, `description`, `icon`, `headDoctor`.
  - Result: Department name or head doctor can change in one place without altering individual doctor records.

#### Case 2: Room, Bed, and Inpatient Admission
- **Transitive Dependency**: $\text{AdmissionId} \to \text{BedId} \to \text{RoomId} \to \text{RoomType}, \text{DailyRate}, \text{Floor}$
- **Decomposition**:
  - `Room`: Stores `id`, `roomNumber`, `floor`, `roomType`, `dailyRate`, `totalBeds`.
  - `Bed`: Stores `id`, `bedNumber`, `roomId` (FK), `status`.
  - `Admission`: Stores `id`, `patientId` (FK), `bedId` (FK), `attendingDoctorId` (FK), `admissionDate`, `dischargeDate`, `reason`, `status`.
  - Result: Daily room rates and room capacities depend strictly on `RoomId`. Deleting an admission record does not delete the bed or room.

#### Case 3: User Authentication vs. Clinical Profile
- **Transitive Dependency**: $\text{PatientId} \to \text{UserId} \to \text{Email}, \text{PasswordHash}, \text{Role}$
- **Decomposition**:
  - `User`: Handles RBAC authentication credentials (`email`, `password`, `role`, `username`).
  - `Patient`: Handles clinical demographics (`patientCode`, `bloodGroup`, `allergies`, `chronicConditions`, `emergencyContact`).
  - `Doctor`: Handles credentialed practitioner details (`specialization`, `qualification`, `experienceYears`, `consultationFee`, `roomNo`).
  - Result: Passwords, JWT secrets, and roles are isolated from clinical healthcare records.

#### Case 4: Diagnostic Lab Test Catalog vs. Patient Lab Reports
- **Transitive Dependency**: $\text{ReportId} \to \text{LabTestId} \to \text{TestName}, \text{Category}, \text{SampleType}, \text{StandardCost}$
- **Decomposition**:
  - `LabTest`: Diagnostic test catalog (`testCode`, `testName`, `category`, `sampleType`, `cost`, `turnaroundHours`).
  - `LabReport`: Transactional lab orders & clinical findings (`reportCode`, `labTestId`, `patientId`, `doctorId`, `testDate`, `resultSummary`, `findings`, `normalRange`, `status`).

---

## 6. Boyce-Codd Normal Form (BCNF) Verification

A relation is in **BCNF** if and only if for every non-trivial functional dependency $X \to Y$, **$X$ is a Superkey**.

| Entity | Candidate Keys | Determinants ($X$) | Is $X$ a Superkey? | Normal Form |
|---|---|---|---|---|
| **User** | `{id}`, `{email}` | `id`, `email` | **Yes** | **BCNF** |
| **Department** | `{id}`, `{name}`, `{code}` | `id`, `name`, `code` | **Yes** | **BCNF** |
| **Doctor** | `{id}`, `{userId}` | `id`, `userId` | **Yes** | **BCNF** |
| **Patient** | `{id}`, `{patientCode}` | `id`, `patientCode` | **Yes** | **BCNF** |
| **Appointment** | `{id}`, `{appointmentNumber}` | `id`, `appointmentNumber` | **Yes** | **BCNF** |
| **MedicalRecord** | `{id}` | `id` | **Yes** | **BCNF** |
| **Prescription** | `{id}` | `id` | **Yes** | **BCNF** |
| **PrescriptionItem** | `{id}` | `id` | **Yes** | **BCNF** |
| **Room** | `{id}`, `{roomNumber}` | `id`, `roomNumber` | **Yes** | **BCNF** |
| **Bed** | `{id}`, `{bedNumber}` | `id`, `bedNumber` | **Yes** | **BCNF** |
| **Admission** | `{id}`, `{admissionCode}` | `id`, `admissionCode` | **Yes** | **BCNF** |
| **Medicine** | `{id}`, `{code}` | `id`, `code` | **Yes** | **BCNF** |
| **Bill** | `{id}`, `{invoiceNumber}` | `id`, `invoiceNumber` | **Yes** | **BCNF** |
| **BillItem** | `{id}` | `id` | **Yes** | **BCNF** |
| **LabTest** | `{id}`, `{testCode}` | `id`, `testCode` | **Yes** | **BCNF** |
| **LabReport** | `{id}`, `{reportCode}` | `id`, `reportCode` | **Yes** | **BCNF** |

**Conclusion**: Since every determinant in every functional dependency is a candidate key / superkey, the entire Rishi Healthcare relational database is strictly in **BCNF**.

---

## 7. Functional Dependency (FD) Specification

Below is the formal functional dependency set for the database relations:

```text
User:
    id -> username, email, password, role, name, phone, avatar, createdAt, updatedAt
    email -> id, username, password, role, name, phone, avatar, createdAt, updatedAt

Department:
    id -> name, code, description, icon, headDoctor, createdAt, updatedAt
    name -> id, code, description, icon, headDoctor, createdAt, updatedAt
    code -> id, name, description, icon, headDoctor, createdAt, updatedAt

Doctor:
    id -> userId, departmentId, specialization, qualification, experienceYears, consultationFee, roomNo, workingHours, isAvailable, createdAt, updatedAt
    userId -> id, departmentId, specialization, qualification, experienceYears, consultationFee, roomNo, workingHours, isAvailable, createdAt, updatedAt

Patient:
    id -> userId, patientCode, name, email, phone, dateOfBirth, age, gender, bloodGroup, address, emergencyContactName, emergencyContactPhone, allergies, chronicConditions, createdAt, updatedAt
    patientCode -> id, userId, name, email, phone, dateOfBirth, age, gender, bloodGroup, address, emergencyContactName, emergencyContactPhone, allergies, chronicConditions, createdAt, updatedAt

Appointment:
    id -> appointmentNumber, patientId, doctorId, departmentId, appointmentDate, timeSlot, type, status, reason, symptoms, notes, createdAt, updatedAt
    appointmentNumber -> id, patientId, doctorId, departmentId, appointmentDate, timeSlot, type, status, reason, symptoms, notes, createdAt, updatedAt

Room:
    id -> roomNumber, floor, roomType, dailyRate, totalBeds, createdAt
    roomNumber -> id, floor, roomType, dailyRate, totalBeds, createdAt

Bed:
    id -> bedNumber, roomId, status, createdAt
    bedNumber -> id, roomId, status, createdAt

Admission:
    id -> admissionCode, patientId, bedId, attendingDoctorId, admissionDate, dischargeDate, reason, status, notes, createdAt, updatedAt
    admissionCode -> id, patientId, bedId, attendingDoctorId, admissionDate, dischargeDate, reason, status, notes, createdAt, updatedAt

Medicine:
    id -> code, name, genericName, category, manufacturer, dosageForm, stock, minStockAlert, unitPrice, expiryDate, createdAt, updatedAt
    code -> id, name, genericName, category, manufacturer, dosageForm, stock, minStockAlert, unitPrice, expiryDate, createdAt, updatedAt

Bill:
    id -> invoiceNumber, patientId, appointmentId, admissionId, issueDate, dueDate, subtotal, taxRate, taxAmount, discount, totalAmount, paidAmount, status, paymentMethod, notes, createdAt, updatedAt
    invoiceNumber -> id, patientId, appointmentId, admissionId, issueDate, dueDate, subtotal, taxRate, taxAmount, discount, totalAmount, paidAmount, status, paymentMethod, notes, createdAt, updatedAt

LabTest:
    id -> testCode, testName, category, sampleType, cost, turnaroundHours, description, createdAt
    testCode -> id, testName, category, sampleType, cost, turnaroundHours, description, createdAt

LabReport:
    id -> reportCode, labTestId, patientId, doctorId, testDate, resultSummary, findings, normalRange, status, createdAt, updatedAt
    reportCode -> id, labTestId, patientId, doctorId, testDate, resultSummary, findings, normalRange, status, createdAt, updatedAt
```

---

## 8. Summary of Normalization Benefits

1. **Storage Optimization**: Redundant text strings (e.g. repeated department names, room rates, test names) are stored exactly once.
2. **Transaction Integrity**: Modifying a doctor's fee or room's daily rate immediately updates future workflows without corrupting historical billing tables.
3. **Auditability & Traceability**: Each clinical record, admission, prescription item, lab report, and tax invoice is cleanly linked via surrogate UUIDs and human-readable business codes (`PAT-1001`, `APT-2026-101`, `INV-2026-001`, `MED-101`, `LAB-101`).
