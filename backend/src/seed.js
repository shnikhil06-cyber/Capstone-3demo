import bcryptjs from 'bcryptjs';
import prisma from './prisma.js';

export async function seedDatabase() {
  console.log('🌱 Seeding Rishi Healthcare System database...');

  // Clean existing data in reverse order of foreign key dependencies
  await prisma.prescriptionItem.deleteMany({});
  await prisma.prescription.deleteMany({});
  await prisma.medicalRecord.deleteMany({});
  await prisma.billItem.deleteMany({});
  await prisma.bill.deleteMany({});
  await prisma.admission.deleteMany({});
  await prisma.labReport.deleteMany({});
  await prisma.labTest.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.bed.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.medicine.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcryptjs.hash('Password@123', 10);

  // 1. Create Core Users
  console.log('Creating users...');
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@hospital.com',
      password: defaultPasswordHash,
      name: 'Dr. Alok Nath',
      role: 'ADMIN',
      phone: '+91 11 2651 5050',
    },
  });

  await prisma.user.create({
    data: {
      username: 'reception',
      email: 'reception@hospital.com',
      password: defaultPasswordHash,
      name: 'Neha Kapoor',
      role: 'RECEPTIONIST',
      phone: '+91 11 2651 5051',
    },
  });

  await prisma.user.create({
    data: {
      username: 'pharma',
      email: 'pharma@hospital.com',
      password: defaultPasswordHash,
      name: 'Rohan Joshi',
      role: 'PHARMACIST',
      phone: '+91 11 2651 5052',
    },
  });

  // 2. Create Departments (Centers of Excellence)
  console.log('Creating Rishi Healthcare Centers of Excellence...');
  const cardiology = await prisma.department.create({
    data: {
      name: 'Cardiac Sciences',
      code: 'CARD',
      description: 'Comprehensive cardiology, cath lab, robotic heart surgery, and TAVR.',
      icon: 'Heart',
    },
  });

  const oncology = await prisma.department.create({
    data: {
      name: 'Cancer Care / Oncology',
      code: 'ONCO',
      description: 'Precision oncology, robotic cancer surgery, immunotherapy, and bone marrow transplant.',
      icon: 'Activity',
    },
  });

  const neurology = await prisma.department.create({
    data: {
      name: 'Neurosciences',
      code: 'NEUR',
      description: 'Advanced stroke management, neurosurgery, epilepsy, and robotic spine surgery.',
      icon: 'Brain',
    },
  });

  const orthopedics = await prisma.department.create({
    data: {
      name: 'Orthopaedics & Joint Replacement',
      code: 'ORTH',
      description: 'Robotic knee/hip replacement, sports injury arthroscopy, and trauma surgery.',
      icon: 'Bone',
    },
  });

  const pediatrics = await prisma.department.create({
    data: {
      name: 'Paediatrics & Child Care',
      code: 'PEDI',
      description: 'NICU Level III, paediatric surgery, immunization, and growth monitoring.',
      icon: 'Baby',
    },
  });

  const generalMedicine = await prisma.department.create({
    data: {
      name: 'Internal Medicine & Diabetology',
      code: 'GMED',
      description: 'Primary care, lifestyle disorders, chronic diabetes control, and geriatric care.',
      icon: 'Stethoscope',
    },
  });

  const emergency = await prisma.department.create({
    data: {
      name: 'Emergency & Trauma Care (24x7)',
      code: 'EMER',
      description: 'Dedicated 24x7 acute trauma resuscitation, stroke ready, cardiac emergency care.',
      icon: 'AlertCircle',
    },
  });

  // 3. Create Doctors
  console.log('Creating Rishi Healthcare consultants...');
  const docUser1 = await prisma.user.create({
    data: {
      username: 'dr.sharma',
      email: 'dr.sharma@hospital.com',
      password: defaultPasswordHash,
      name: 'Dr. Balbir Sharma',
      role: 'DOCTOR',
      phone: '+91 98111 22334',
    },
  });
  const doctorSharma = await prisma.doctor.create({
    data: {
      userId: docUser1.id,
      departmentId: cardiology.id,
      specialization: 'Chairman - Cardiac Sciences & Interventional Cardiologist',
      qualification: 'MBBS, MD (Gen Med), DM (Cardiology), FACC (USA)',
      experienceYears: 24,
      consultationFee: 1500,
      roomNo: 'Rishi Saket - OPD 101',
      workingHours: '09:00 AM - 02:00 PM',
      isAvailable: true,
    },
  });

  const docUser2 = await prisma.user.create({
    data: {
      username: 'dr.patel',
      email: 'dr.patel@hospital.com',
      password: defaultPasswordHash,
      name: 'Dr. Priya Patel',
      role: 'DOCTOR',
      phone: '+91 98222 33445',
    },
  });
  const doctorPatel = await prisma.doctor.create({
    data: {
      userId: docUser2.id,
      departmentId: neurology.id,
      specialization: 'Principal Director - Neurology & Stroke Medicine',
      qualification: 'MBBS, MD, DM (Neurology), Fellowship Stroke (Canada)',
      experienceYears: 18,
      consultationFee: 1200,
      roomNo: 'Rishi Saket - OPD 204',
      workingHours: '10:00 AM - 04:00 PM',
      isAvailable: true,
    },
  });

  const docUser3 = await prisma.user.create({
    data: {
      username: 'dr.singh',
      email: 'dr.singh@hospital.com',
      password: defaultPasswordHash,
      name: 'Dr. Vikramaditya Singh',
      role: 'DOCTOR',
      phone: '+91 98333 44556',
    },
  });
  const doctorSingh = await prisma.doctor.create({
    data: {
      userId: docUser3.id,
      departmentId: orthopedics.id,
      specialization: 'Director - Robotic Joint Replacement & Orthopaedics',
      qualification: 'MBBS, MS (Orthopaedics), MCh (Ortho, UK)',
      experienceYears: 20,
      consultationFee: 1200,
      roomNo: 'Rishi Pusa Road - OPD 105',
      workingHours: '09:30 AM - 03:30 PM',
      isAvailable: true,
    },
  });

  const docUser4 = await prisma.user.create({
    data: {
      username: 'dr.gupta',
      email: 'dr.gupta@hospital.com',
      password: defaultPasswordHash,
      name: 'Dr. Ananya Gupta',
      role: 'DOCTOR',
      phone: '+91 98444 55667',
    },
  });
  const doctorGupta = await prisma.doctor.create({
    data: {
      userId: docUser4.id,
      departmentId: pediatrics.id,
      specialization: 'Senior Consultant - Paediatrics & Neonatal Intensive Care',
      qualification: 'MBBS, MD (Paediatrics), DNB, Fellowship Neonatology',
      experienceYears: 14,
      consultationFee: 900,
      roomNo: 'Rishi Gurugram - OPD 302',
      workingHours: '11:00 AM - 06:00 PM',
      isAvailable: true,
    },
  });

  const docUser5 = await prisma.user.create({
    data: {
      username: 'dr.verma',
      email: 'dr.verma@hospital.com',
      password: defaultPasswordHash,
      name: 'Dr. Rajesh Verma',
      role: 'DOCTOR',
      phone: '+91 98555 66778',
    },
  });
  const doctorVerma = await prisma.doctor.create({
    data: {
      userId: docUser5.id,
      departmentId: generalMedicine.id,
      specialization: 'Director - Internal Medicine & Diabetology',
      qualification: 'MBBS, MD (Internal Medicine), PGD (Diabetology)',
      experienceYears: 19,
      consultationFee: 800,
      roomNo: 'Rishi Shalimar Bagh - OPD 102',
      workingHours: '08:30 AM - 01:30 PM',
      isAvailable: true,
    },
  });

  // 4. Create Patients
  console.log('Creating patients...');
  const patient1User = await prisma.user.create({
    data: {
      username: 'rohit.kumar',
      email: 'rohit.kumar@example.com',
      password: defaultPasswordHash,
      name: 'Rohit Kumar',
      role: 'PATIENT',
      phone: '+91 97111 88990',
    },
  });
  const patient1 = await prisma.patient.create({
    data: {
      userId: patient1User.id,
      patientCode: 'MAX-PAT-1001',
      name: 'Rohit Kumar',
      email: 'rohit.kumar@example.com',
      phone: '+91 97111 88990',
      gender: 'Male',
      age: 38,
      bloodGroup: 'B+',
      address: 'B-12, Greater Kailash Part 1, New Delhi',
      emergencyContactName: 'Kavita Kumar (Wife)',
      emergencyContactPhone: '+91 97111 88991',
      allergies: 'Penicillin, Sulfa drugs',
      chronicConditions: 'Stage 1 Hypertension',
    },
  });

  const patient2User = await prisma.user.create({
    data: {
      username: 'sneha.reddy',
      email: 'sneha.reddy@example.com',
      password: defaultPasswordHash,
      name: 'Sneha Reddy',
      role: 'PATIENT',
      phone: '+91 97222 77889',
    },
  });
  const patient2 = await prisma.patient.create({
    data: {
      userId: patient2User.id,
      patientCode: 'MAX-PAT-1002',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 97222 77889',
      gender: 'Female',
      age: 29,
      bloodGroup: 'O+',
      address: 'Tower 4, DLF Phase 5, Gurugram',
      emergencyContactName: 'Manoj Reddy (Brother)',
      emergencyContactPhone: '+91 97222 77880',
      allergies: 'None',
      chronicConditions: 'Migraine',
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      patientCode: 'MAX-PAT-1003',
      name: 'Amitabh Das',
      email: 'amitabh.das@example.com',
      phone: '+91 97333 66778',
      gender: 'Male',
      age: 64,
      bloodGroup: 'A+',
      address: 'Plot 45, Saket Enclave, New Delhi',
      emergencyContactName: 'Shampa Das (Wife)',
      emergencyContactPhone: '+91 97333 66779',
      allergies: 'Aspirin',
      chronicConditions: 'Type 2 Diabetes, Coronary Artery Disease',
    },
  });

  // 5. Create Rishi Wards & Beds
  console.log('Creating Rishi Hospital rooms and ICU beds...');
  const icuRoom = await prisma.room.create({
    data: {
      roomNumber: 'Max-ICU-201',
      floor: 2,
      roomType: 'ICU',
      dailyRate: 7500,
      totalBeds: 4,
    },
  });

  const bedICU1 = await prisma.bed.create({
    data: { bedNumber: 'ICU-B01', roomId: icuRoom.id, status: 'OCCUPIED' },
  });
  await prisma.bed.create({
    data: { bedNumber: 'ICU-B02', roomId: icuRoom.id, status: 'AVAILABLE' },
  });
  await prisma.bed.create({
    data: { bedNumber: 'ICU-B03', roomId: icuRoom.id, status: 'AVAILABLE' },
  });
  await prisma.bed.create({
    data: { bedNumber: 'ICU-B04', roomId: icuRoom.id, status: 'MAINTENANCE' },
  });

  const deluxe301 = await prisma.room.create({
    data: {
      roomNumber: 'Max-Suite-401',
      floor: 4,
      roomType: 'DELUXE',
      dailyRate: 6500,
      totalBeds: 1,
    },
  });

  await prisma.bed.create({
    data: { bedNumber: 'DLX-401', roomId: deluxe301.id, status: 'AVAILABLE' },
  });

  const genWard101 = await prisma.room.create({
    data: {
      roomNumber: 'Max-Ward-101',
      floor: 1,
      roomType: 'GENERAL',
      dailyRate: 1800,
      totalBeds: 4,
    },
  });

  await prisma.bed.create({
    data: { bedNumber: 'GW-101-A', roomId: genWard101.id, status: 'AVAILABLE' },
  });
  await prisma.bed.create({
    data: { bedNumber: 'GW-101-B', roomId: genWard101.id, status: 'AVAILABLE' },
  });

  // 6. Active Admission in ICU
  await prisma.admission.create({
    data: {
      admissionCode: 'MAX-ADM-2026-001',
      patientId: patient3.id,
      bedId: bedICU1.id,
      attendingDoctorId: doctorSharma.id,
      admissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      reason: 'Acute Coronary Syndrome, post-angiography observation in CCU',
      status: 'ADMITTED',
      notes: 'Continuous cardiac monitoring. Patient vitals stable.',
    },
  });

  // 7. Max Pharmacy Medicines
  console.log('Creating Max Pharmacy medicines...');
  const med1 = await prisma.medicine.create({
    data: {
      code: 'MAX-MED-101',
      name: 'Augmentin 625 Duo',
      genericName: 'Amoxicillin + Clavulanic Acid 625mg',
      category: 'Antibiotics',
      manufacturer: 'GSK Pharma',
      dosageForm: 'TABLET',
      stock: 150,
      minStockAlert: 20,
      unitPrice: 24.5,
      expiryDate: new Date('2027-10-31'),
    },
  });

  const med2 = await prisma.medicine.create({
    data: {
      code: 'MAX-MED-102',
      name: 'Atorva 20mg',
      genericName: 'Atorvastatin 20mg',
      category: 'Cardiovascular',
      manufacturer: 'Zydus Cadila',
      dosageForm: 'TABLET',
      stock: 90,
      minStockAlert: 15,
      unitPrice: 16.0,
      expiryDate: new Date('2027-12-15'),
    },
  });

  const med3 = await prisma.medicine.create({
    data: {
      code: 'MAX-MED-103',
      name: 'Budecort 200 Inhaler',
      genericName: 'Budesonide 200mcg',
      category: 'Respiratory',
      manufacturer: 'Cipla',
      dosageForm: 'INHALER',
      stock: 12,
      minStockAlert: 15, // Low stock triggered!
      unitPrice: 385.0,
      expiryDate: new Date('2027-04-30'),
    },
  });

  // 8. Appointments
  console.log('Creating appointments...');
  const today = new Date();
  const appointment1 = await prisma.appointment.create({
    data: {
      appointmentNumber: 'MAX-APT-1001',
      patientId: patient1.id,
      doctorId: doctorSharma.id,
      departmentId: cardiology.id,
      appointmentDate: today,
      timeSlot: '10:00 AM',
      type: 'CONSULTATION',
      status: 'CONFIRMED',
      reason: 'Routine cardiac evaluation & ambulatory BP check',
      symptoms: 'Occasional palpitation upon exertion',
      notes: 'Advised fasting lipid profile before visit.',
    },
  });

  await prisma.appointment.create({
    data: {
      appointmentNumber: 'MAX-APT-1002',
      patientId: patient2.id,
      doctorId: doctorPatel.id,
      departmentId: neurology.id,
      appointmentDate: today,
      timeSlot: '11:30 AM',
      type: 'CONSULTATION',
      status: 'CONFIRMED',
      reason: 'Chronic migraine with visual aura',
      symptoms: 'Unilateral pulsatile pain',
    },
  });

  // 9. Medical Record and Prescription
  const medRecord1 = await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      doctorId: doctorSharma.id,
      appointmentId: appointment1.id,
      diagnosis: 'Primary Essential Hypertension with Hypercholesterolemia',
      symptoms: 'Occasional mild headache, fatigue',
      vitalsBp: '136/88 mmHg',
      vitalsPulse: '74 bpm',
      vitalsTemp: '98.4 F',
      vitalsWeight: '76 kg',
      doctorNotes: 'Prescribed daily statin and lifestyle moderation. Reduce dietary sodium.',
      followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const prescription1 = await prisma.prescription.create({
    data: {
      medicalRecordId: medRecord1.id,
      patientId: patient1.id,
      doctorId: doctorSharma.id,
      notes: 'Take after dinner. Routine lipid test in 4 weeks.',
    },
  });

  await prisma.prescriptionItem.create({
    data: {
      prescriptionId: prescription1.id,
      medicineId: med2.id,
      medicineName: 'Atorva 20mg (Atorvastatin)',
      dosage: '1 tablet',
      frequency: 'Once daily at night',
      durationDays: 30,
      instructions: 'After dinner with water',
    },
  });

  // 10. Max Healthcare Bill (Paid Invoice)
  const bill1 = await prisma.bill.create({
    data: {
      invoiceNumber: 'MAX-INV-2026-001',
      patientId: patient1.id,
      appointmentId: appointment1.id,
      issueDate: today,
      dueDate: today,
      subtotal: 1980,
      taxRate: 5.0,
      taxAmount: 99,
      discount: 79,
      totalAmount: 2000,
      paidAmount: 2000,
      status: 'PAID',
      paymentMethod: 'UPI',
      notes: 'Paid at Rishi Super Speciality Hospital Saket counter via UPI.',
    },
  });

  await prisma.billItem.createMany({
    data: [
      {
        billId: bill1.id,
        description: 'Super Speciality Consultation - Dr. Balbir Sharma (Chairman Cardiac)',
        category: 'CONSULTATION',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
      },
      {
        billId: bill1.id,
        description: 'Atorva 20mg (30 Tablets Box)',
        category: 'PHARMACY',
        quantity: 1,
        unitPrice: 480,
        totalPrice: 480,
      },
    ],
  });

  // 11. Max Healthcare Unpaid Bill for Online Bill Pay Demo
  const bill2 = await prisma.bill.create({
    data: {
      invoiceNumber: 'MAX-INV-2026-002',
      patientId: patient2.id,
      issueDate: today,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      subtotal: 1400,
      taxRate: 5.0,
      taxAmount: 70,
      discount: 20,
      totalAmount: 1450,
      paidAmount: 0,
      status: 'UNPAID',
      paymentMethod: 'UPI',
      notes: 'Neurology OPD follow-up and Brain MRI preliminary review.',
    },
  });

  await prisma.billItem.createMany({
    data: [
      {
        billId: bill2.id,
        description: 'Neurology Consultation - Dr. Priya Patel (Principal Director)',
        category: 'CONSULTATION',
        quantity: 1,
        unitPrice: 1200,
        totalPrice: 1200,
      },
      {
        billId: bill2.id,
        description: 'Digital EEG / Nerve Conduction Screen',
        category: 'LAB_TEST',
        quantity: 1,
        unitPrice: 200,
        totalPrice: 200,
      },
    ],
  });

  console.log('✅ Rishi Healthcare database seeded successfully!');
}

if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .catch((e) => {
      console.error('❌ Error during seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
