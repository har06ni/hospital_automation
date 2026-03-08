const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Staff = require('./models/Staff');
const Inventory = require('./models/Inventory');

dotenv.config();

const users = [
    { username: 'admin', password: 'password123', role: 'admin' },
    { username: 'dr_arjun', password: 'password123', role: 'doctor' },
    { username: 'dr_meena', password: 'password123', role: 'doctor' },
    { username: 'dr_john', password: 'password123', role: 'doctor' },
    { username: 'nurse_sarah', password: 'password123', role: 'nurse' },
    { username: 'nurse_kevin', password: 'password123', role: 'nurse' },
    { username: 'nurse_amit', password: 'password123', role: 'nurse' },
    { username: 'nurse_priya', password: 'password123', role: 'nurse' },
    { username: 'dr_kumar', password: 'password123', role: 'doctor' },
    { username: 'dr_ravi', password: 'password123', role: 'doctor' },
    { username: 'dr_pavya', password: 'password123', role: 'doctor' },
    { username: 'dr_sri', password: 'password123', role: 'doctor' },
    { username: 'nurse_bala', password: 'password123', role: 'nurse' },
    { username: 'nurse_devi', password: 'password123', role: 'nurse' },
    { username: 'nurse_janani', password: 'password123', role: 'nurse' },
    { username: 'nurse_mowni', password: 'password123', role: 'nurse' },
    { username: 'nurse_indu', password: 'password123', role: 'nurse' },
    { username: 'nurse_lara', password: 'password123', role: 'nurse' },
    { username: 'nurse_vikas', password: 'password123', role: 'nurse' },
    { username: 'nurse_sneha', password: 'password123', role: 'nurse' },
    { username: 'nurse_rohit', password: 'password123', role: 'nurse' },
    { username: 'dr_sharma', password: 'password123', role: 'doctor' },
    { username: 'dr_patel', password: 'password123', role: 'doctor' },
    { username: 'ravi_kumar', password: 'password123', role: 'patient' },
    { username: 'anita_sharma', password: 'password123', role: 'patient' },
    { username: 'lakshmi_devi', password: 'password123', role: 'patient' },
    { username: 'rahul_verma', password: 'password123', role: 'patient' },
    { username: 'maya_singh', password: 'password123', role: 'patient' },
    { username: 'kiran_kumar', password: 'password123', role: 'patient' },
    { username: 'vikram_rathore', password: 'password123', role: 'patient' },
    { username: 'sneha_reddy', password: 'password123', role: 'patient' },
    { username: 'arjun_sharma', password: 'password123', role: 'patient' },
    { username: 'priya_das', password: 'password123', role: 'patient' },
    { username: 'amit_shah', password: 'password123', role: 'patient' },
    { username: 'neha_gupta', password: 'password123', role: 'patient' },
    { username: 'suresh_raina', password: 'password123', role: 'patient' }
];

const staffProfiles = [
    {
        name: 'Dr. Arjun Reddy', gender: 'Male', age: 45, role: 'doctor', department: 'Critical Care',
        specialization: 'Critical Care Medicine', assignedWards: ['ICU-1', 'ICU-2'], experience: 18, username: 'dr_arjun'
    },
    {
        name: 'Dr. Meena Gupta', gender: 'Female', age: 42, role: 'doctor', department: 'Internal Medicine',
        specialization: 'General Medicine', assignedWards: ['Ward-1', 'Ward-2'], experience: 15, username: 'dr_meena'
    },
    {
        name: 'Dr. John Wilson', gender: 'Male', age: 50, role: 'doctor', department: 'Surgery',
        specialization: 'General Surgery', assignedWards: ['Post-Op / Recovery Ward', 'Ward-1'], experience: 22, username: 'dr_john'
    },
    {
        name: 'Sarah Wilson', gender: 'Female', age: 29, role: 'nurse', department: 'ICU',
        ward: 'ICU-1, ICU-2', shift: 'Morning Shift: 6:00 AM – 2:00 PM', experience: 6, username: 'nurse_sarah'
    },
    {
        name: 'Kevin Hart', gender: 'Male', age: 31, role: 'nurse', department: 'General Wards',
        ward: 'Ward-1, Ward-2, Post-Op', shift: 'Morning Shift: 6:00 AM – 2:00 PM', experience: 8, username: 'nurse_kevin'
    },
    {
        name: 'Amit Kumar', gender: 'Male', age: 35, role: 'nurse', department: 'All Wards',
        ward: 'All Wards', shift: 'Evening Shift: 2:00 PM – 10:00 PM', experience: 12, username: 'nurse_amit'
    },
    {
        name: 'Priya Mani', gender: 'Female', age: 27, role: 'nurse', department: 'All Wards',
        ward: 'All Wards', shift: 'Night Shift: 10:00 PM – 6:00 AM', experience: 4, username: 'nurse_priya'
    },
    {
        name: 'Dr. Kumar', gender: 'Male', age: 52, role: 'doctor', department: 'Cardiology',
        specialization: 'Cardiologist', assignedWards: ['Ward-1'], experience: 24, username: 'dr_kumar',
        location: 'Floor 2, Wing B', imageUrl: 'https://img.freepik.com/free-photo/doctor-with-stethoscope-hospital-background_1150-597.jpg'
    },
    {
        name: 'Dr. Ravi', gender: 'Male', age: 38, role: 'doctor', department: 'Internal Medicine',
        specialization: 'Internal Medicine', assignedWards: ['Ward-1', 'Ward-2'], experience: 12, username: 'dr_ravi',
        location: 'Floor 1, Suite C', imageUrl: 'https://t3.ftcdn.net/jpg/02/60/04/09/360_F_260040900_o7K6sT399HjES70faWnEHYv1fM9wzvpB.jpg'
    },
    {
        name: 'Dr. Pavya', gender: 'Female', age: 35, role: 'doctor', department: 'Pediatrics',
        specialization: 'Pediatrician', assignedWards: ['Ward-2'], experience: 8, username: 'dr_pavya',
        location: 'Floor 3, Pediatrics Wing', imageUrl: 'https://img.freepik.com/free-photo/female-doctor-white-coat-with-stethoscope-around-neck-standing-holding-notebook-pen_1150-13674.jpg'
    },
    {
        name: 'Dr. Sri', gender: 'Female', age: 41, role: 'doctor', department: 'Neurology',
        specialization: 'Neurologist', assignedWards: ['ICU-2'], experience: 15, username: 'dr_sri',
        location: 'Floor 2, Suite D', imageUrl: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-white-coat-with-stethoscope-standing-with-folded-arms-isolated-green-background_651396-880.jpg'
    },
    {
        name: 'Bala', gender: 'Male', age: 30, role: 'nurse', department: 'General',
        ward: 'Ward-1, Ward-2', shift: 'Morning Shift: 6:00 AM – 2:00 PM', experience: 7, username: 'nurse_bala'
    },
    {
        name: 'Devi', gender: 'Female', age: 33, role: 'nurse', department: 'Critical Care',
        ward: 'ICU-1, ICU-2', shift: 'Evening Shift: 2:00 PM – 10:00 PM', experience: 10, username: 'nurse_devi'
    },
    {
        name: 'Janani', gender: 'Female', age: 28, role: 'nurse', department: 'Surgery',
        ward: 'Post-Op', shift: 'Night Shift: 10:00 PM – 6:00 AM', experience: 5, username: 'nurse_janani'
    },
    {
        name: 'Mowni', gender: 'Female', age: 29, role: 'nurse', department: 'Pediatrics',
        ward: 'NICU, Pediatric Ward', shift: 'Morning Shift: 6:00 AM – 2:00 PM', experience: 6, username: 'nurse_mowni'
    },
    {
        name: 'Indu', gender: 'Female', age: 31, role: 'nurse', department: 'Cardiology',
        ward: 'Cardiac Ward', shift: 'Evening Shift: 2:00 PM – 10:00 PM', experience: 8, username: 'nurse_indu'
    },
    {
        name: 'Lara Croft', gender: 'Female', age: 26, role: 'nurse', department: 'Emergency',
        ward: 'ER-1', shift: 'Night Shift: 10:00 PM – 6:00 AM', experience: 3, username: 'nurse_lara'
    },
    {
        name: 'Vikas Khanna', gender: 'Male', age: 34, role: 'nurse', department: 'General Wards',
        ward: 'Ward-3', shift: 'Morning Shift: 6:00 AM – 2:00 PM', experience: 9, username: 'nurse_vikas'
    },
    {
        name: 'Sneha Kapur', gender: 'Female', age: 29, role: 'nurse', department: 'Pediatrics',
        ward: 'Pediatric Ward', shift: 'Evening Shift: 2:00 PM – 10:00 PM', experience: 5, username: 'nurse_sneha'
    },
    {
        name: 'Rohit Sharma', gender: 'Male', age: 32, role: 'nurse', department: 'Surgery',
        ward: 'Post-Op', shift: 'Night Shift: 10:00 PM – 6:00 AM', experience: 7, username: 'nurse_rohit'
    },
    {
        name: 'Dr. Sharma', gender: 'Male', age: 48, role: 'doctor', department: 'Orthopedics',
        specialization: 'Orthopedic Surgeon', assignedWards: ['Ward-3'], experience: 20, username: 'dr_sharma'
    },
    {
        name: 'Dr. Patel', gender: 'Male', age: 43, role: 'doctor', department: 'Endocrinology',
        specialization: 'Endocrinologist', assignedWards: ['Ward-1', 'Ward-2'], experience: 16, username: 'dr_patel'
    }
];

const patients = [
    {
        name: 'Ravi Kumar', age: 45, gender: 'Male', ipNumber: 'IP-2024-001', ward: 'ICU-1', bed: 'A1',
        doa: new Date('2024-02-10'), diagnosis: 'Severe Pneumonia', status: 'Stable', username: 'ravi_kumar',
        vitals: { heartRate: 72, bp: '120/80', spo2: 98, temp: 36.5, bloodSugar: 140 }
    },
    {
        name: 'Anita Sharma', age: 62, gender: 'Female', ipNumber: 'IP-2024-005', ward: 'ICU-1', bed: 'A2',
        doa: new Date('2024-02-11'), diagnosis: 'Post-Op Observation', status: 'Warning', username: 'anita_sharma',
        vitals: { heartRate: 110, bp: '140/90', spo2: 95, temp: 37.0, bloodSugar: 180 }
    },
    {
        name: 'Lakshmi Devi', age: 70, gender: 'Female', ipNumber: 'IP-2024-012', ward: 'ICU-2', bed: 'C1',
        doa: new Date('2024-02-13'), diagnosis: 'Acute Heart Failure', status: 'Critical', username: 'lakshmi_devi',
        vitals: { heartRate: 125, bp: '170/105', spo2: 89, temp: 37.5, bloodSugar: 160 }
    },
    {
        name: 'Rahul Verma', age: 29, gender: 'Male', ipNumber: 'IP-2024-015', ward: 'Ward-1', bed: 'D5',
        doa: new Date('2024-02-14'), diagnosis: 'Acute Gastroenteritis', status: 'Stable', username: 'rahul_verma',
        vitals: { heartRate: 90, bp: '110/70', spo2: 99, temp: 37.2, bloodSugar: 110 }
    },
    {
        name: 'Maya Singh', age: 55, gender: 'Female', ipNumber: 'IP-2024-018', ward: 'Ward-1', bed: 'D6',
        doa: new Date('2024-02-15'), diagnosis: 'Post-stroke recovery', status: 'Stable', username: 'maya_singh',
        vitals: { heartRate: 78, bp: '135/85', spo2: 97, temp: 36.8, bloodSugar: 125 }
    },
    {
        name: 'Kiran Kumar', age: 40, gender: 'Male', ipNumber: 'IP-2024-020', ward: 'ICU-2', bed: 'C2',
        doa: new Date('2024-02-16'), diagnosis: 'Diabetic Ketoacidosis', status: 'Warning', username: 'kiran_kumar',
        vitals: { heartRate: 105, bp: '130/80', spo2: 96, temp: 37.5, bloodSugar: 350 }
    },
    {
        name: 'Vikram Rathore', age: 68, gender: 'Male', ipNumber: 'IP-2024-022', ward: 'Ward-2', bed: 'E1',
        doa: new Date('2024-02-17'), diagnosis: 'Congestive Heart Failure', status: 'Warning', username: 'vikram_rathore',
        vitals: { heartRate: 92, bp: '145/95', spo2: 94, temp: 37.1, bloodSugar: 145 }
    },
    {
        name: 'Sneha Reddy', age: 22, gender: 'Female', ipNumber: 'IP-2024-025', ward: 'Ward-1', bed: 'D7',
        doa: new Date('2024-02-18'), diagnosis: 'Appx Surgery Recovery', status: 'Stable', username: 'sneha_reddy',
        vitals: { heartRate: 82, bp: '115/75', spo2: 99, temp: 37.0, bloodSugar: 90 }
    },
    {
        name: 'Arjun Sharma', age: 34, gender: 'Male', ipNumber: 'IP-2024-028', ward: 'ICU-1', bed: 'A3',
        doa: new Date('2024-02-19'), diagnosis: 'Multi-organ failure', status: 'Critical', username: 'arjun_sharma',
        vitals: { heartRate: 135, bp: '90/60', spo2: 85, temp: 38.2, bloodSugar: 210 }
    },
    {
        name: 'Priya Das', age: 28, gender: 'Female', ipNumber: 'IP-2024-030', ward: 'Ward-1', bed: 'D8',
        doa: new Date('2024-02-20'), diagnosis: 'Dengue Fever', status: 'Stable', username: 'priya_das',
        vitals: { heartRate: 88, bp: '110/70', spo2: 98, temp: 39.0, bloodSugar: 105 }
    },
    {
        name: 'Amit Shah', age: 52, gender: 'Male', ipNumber: 'IP-2024-032', ward: 'Ward-2', bed: 'E2',
        doa: new Date('2024-02-21'), diagnosis: 'Type 2 Diabetes Control', status: 'Stable', username: 'amit_shah',
        vitals: { heartRate: 76, bp: '130/85', spo2: 97, temp: 36.6, bloodSugar: 250 }
    },
    {
        name: 'Neha Gupta', age: 31, gender: 'Female', ipNumber: 'IP-2024-035', ward: 'ICU-2', bed: 'C3',
        doa: new Date('2024-02-22'), diagnosis: 'Severe Asthma Attack', status: 'Warning', username: 'neha_gupta',
        vitals: { heartRate: 102, bp: '125/80', spo2: 93, temp: 37.1, bloodSugar: 115 }
    },
    {
        name: 'Suresh Raina', age: 39, gender: 'Male', ipNumber: 'IP-2024-038', ward: 'Ward-3', bed: 'F1',
        doa: new Date('2024-02-23'), diagnosis: 'Fracture Recovery', status: 'Stable', username: 'suresh_raina',
        vitals: { heartRate: 80, bp: '120/80', spo2: 99, temp: 36.8, bloodSugar: 95 }
    }
];

const seedDB = async () => {
    try {
        const mongoose = require('mongoose');
        const { MongoMemoryServer } = require('mongodb-memory-server');

        // Reuse the logic: Connect to local or Memory
        try {
            await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
            console.log('Connected to Primary DB for seeding');
        } catch (e) {
            console.warn('Seeding to In-Memory Server...');
            const mongoServer = await MongoMemoryServer.create();
            await mongoose.connect(mongoServer.getUri());
        }

        // Clear Existing
        await User.deleteMany();
        await Patient.deleteMany();
        await Staff.deleteMany();
        await Inventory.deleteMany();

        // 1. Create Users and Map Profiles
        for (const userData of users) {
            const user = await User.create(userData);

            const profileData = staffProfiles.find(p => p.username === userData.username);
            if (profileData) {
                const { username, ...cleanProfile } = profileData;
                await Staff.create({
                    ...cleanProfile,
                    userId: user._id
                });
            }
        }

        // 2. Create Patients
        await Patient.create(patients);

        // 3. Create Sample Meds
        await Inventory.create([
            { genericName: 'Paracetamol', brand: 'Dolo 650', dosage: '650mg', form: 'Tablet', stock: 100, price: 30, isEmergency: false },
            { genericName: 'Adrenaline', brand: 'EpiPen', dosage: '0.3mg', form: 'Injection', stock: 10, price: 4500, isEmergency: true },
            { genericName: 'Amoxicillin', brand: 'Augmentin 625', dosage: '625mg', form: 'Tablet', stock: 50, price: 120, isEmergency: false },
            { genericName: 'Atropine', brand: 'Atropine Sulfate', dosage: '0.6mg', form: 'Injection', stock: 5, price: 150, isEmergency: true }
        ]);

        console.log('--- Clinical Database Seeded ---');
        console.log('Admins: 1 | Pharmacists: 1');
        console.log('Doctors: 5 | Nurses: 5');
        console.log('Patients: 5 | Medications: 4');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDB();
