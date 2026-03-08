const User = require('../models/User');
const Patient = require('../models/Patient');
const Staff = require('../models/Staff');
const Inventory = require('../models/Inventory');

const seedClinicalData = async () => {
    try {
        const usersCount = await User.countDocuments();
        if (usersCount > 0) return; // Already seeded

        console.log('--- Auto-Seeding Clinical Data ---');

        const usersData = [
            { username: 'admin', password: 'password123', role: 'admin' },
            { username: 'pharmacist', password: 'password123', role: 'pharmacist' },
            { username: 'nurse_sarah', password: 'password123', role: 'nurse' },
            { username: 'dr_arjun', password: 'password123', role: 'doctor' },
            { username: 'ravi_kumar', password: 'password123', role: 'patient' },
            { username: 'dr_sharma', password: 'password123', role: 'doctor' },
            { username: 'dr_verma', password: 'password123', role: 'doctor' },
            { username: 'dr_patel', password: 'password123', role: 'doctor' },
            { username: 'dr_das', password: 'password123', role: 'doctor' },
            { username: 'nurse_priya', password: 'password123', role: 'nurse' },
            { username: 'nurse_john', password: 'password123', role: 'nurse' },
            { username: 'nurse_anita', password: 'password123', role: 'nurse' },
            { username: 'nurse_deepa', password: 'password123', role: 'nurse' }
        ];

        const staffProfiles = [
            { name: 'Dr. Rajesh Sharma', gender: 'Male', age: 52, role: 'doctor', department: 'Cardiology', specialization: 'Interventional Cardiology', experience: 25, username: 'dr_sharma' },
            { name: 'Dr. Meera Verma', gender: 'Female', age: 41, role: 'doctor', department: 'Pediatrics', specialization: 'Neonatology', experience: 15, username: 'dr_verma' },
            { name: 'Dr. Arjun Reddy', gender: 'Male', age: 38, role: 'doctor', department: 'Orthopedics', specialization: 'Spine Surgery', experience: 10, username: 'dr_arjun' },
            { name: 'Dr. Sneh Patel', gender: 'Female', age: 45, role: 'doctor', department: 'Neurology', specialization: 'Neurosurgeon', experience: 18, username: 'dr_patel' },
            { name: 'Dr. Amit Das', gender: 'Male', age: 35, role: 'doctor', department: 'ER', specialization: 'Trauma Specialist', experience: 7, username: 'dr_das' },
            { name: 'Sarah Wilson', gender: 'Female', age: 29, role: 'nurse', department: 'ICU-1', ward: 'B-Block', shift: 'Morning Shift: 6:00 AM – 2:00 PM', experience: 6, username: 'nurse_sarah' },
            { name: 'Priya Mani', gender: 'Female', age: 27, role: 'nurse', department: 'Pediatrics', ward: 'C-Block', shift: 'Evening Shift: 2:00 PM – 10:00 PM', experience: 4, username: 'nurse_priya' },
            { name: 'John Doe', gender: 'Male', age: 31, role: 'nurse', department: 'ER', ward: 'A-Block', shift: 'Night Shift: 10:00 PM – 6:00 AM', experience: 8, username: 'nurse_john' },
            { name: 'Anita Roy', gender: 'Female', age: 35, role: 'nurse', department: 'Orthopedics', ward: 'B-Block', shift: 'Morning Shift: 6:00 AM – 2:00 PM', experience: 12, username: 'nurse_anita' },
            { name: 'Deepa Kaur', gender: 'Female', age: 26, role: 'nurse', department: 'General Medicine', ward: 'D-Block', shift: 'Evening Shift: 2:00 PM – 10:00 PM', experience: 3, username: 'nurse_deepa' }
        ];

        for (const userData of usersData) {
            const user = await User.create(userData);
            const profileData = staffProfiles.find(p => p.username === userData.username);

            if (profileData) {
                const { username, ...cleanProfile } = profileData;
                await Staff.create({ ...cleanProfile, userId: user._id });
            } else if (userData.role === 'patient' && userData.username === 'ravi_kumar') {
                // Patient profile handled separately below
            }
        }

        await Patient.create([
            { name: 'Aman Singh', age: 28, gender: 'Male', ipNumber: 'IP-2026-101', ward: 'ICU-1', bed: '101', diagnosis: 'Dengue', status: 'Warning', vitals: { spo2: 96, temp: 38.5 } },
            { name: 'Vikram Mehta', age: 55, gender: 'Male', ipNumber: 'IP-2026-102', ward: 'ICU-1', bed: '102', diagnosis: 'Post-MI', status: 'Stable', vitals: { spo2: 98, temp: 36.6 } },
            { name: 'Sunita Rao', age: 48, gender: 'Female', ipNumber: 'IP-2026-103', ward: 'General', bed: '205', diagnosis: 'Diabetes', status: 'Stable', vitals: { spo2: 97, temp: 36.8 } },
            { name: 'Baby Kavya', age: 0.1, gender: 'Female', ipNumber: 'IP-2026-104', ward: 'NICU', bed: 'N1', diagnosis: 'Preterm', status: 'Stable', vitals: { spo2: 99, temp: 37.1 } },
            { name: 'Robert Lewis', age: 72, gender: 'Male', ipNumber: 'IP-2026-105', ward: 'ICU-1', bed: '105', diagnosis: 'Respiratory', status: 'Critical', vitals: { spo2: 88, temp: 38.2 } }
        ]);

        await Inventory.create([
            { genericName: 'Paracetamol', brand: 'Dolo 650', stock: 100, price: 30, isEmergency: false },
            { genericName: 'Adrenaline', brand: 'EpiPen', stock: 10, price: 4500, isEmergency: true }
        ]);

        console.log('--- Clinical Data Seeded Successful ---');
    } catch (error) {
        console.error('Auto-Seeding Error:', error);
    }
};

module.exports = { seedClinicalData };
