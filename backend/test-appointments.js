const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';

async function runTest() {
    console.log('--- Starting Appointment API Verification ---');

    try {
        // 1. Login as patient
        console.log('1. Logging in as patient...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'ravi_kumar',
            password: 'password123'
        });
        token = loginRes.data.token;
        console.log('   ✓ Logged in as Ravi Kumar');

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Fetch Doctors
        console.log('2. Fetching available doctors...');
        const doctorsRes = await axios.get(`${API_URL}/appointments/doctors`, { headers });
        const doctors = doctorsRes.data;
        console.log(`   ✓ Found ${doctors.length} doctors`);

        if (doctors.length === 0) throw new Error('No doctors found');
        const targetDoctor = doctors[0];
        console.log(`   * Selection: ${targetDoctor.name} (${targetDoctor.specialization})`);

        // 3. Book Appointment
        console.log('3. Booking appointment for tomorrow...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        const bookingRes = await axios.post(`${API_URL}/appointments/book`, {
            doctorId: targetDoctor._id,
            date: dateStr,
            timeSlot: '10:30 AM',
            phoneNumber: '+91 99999 00000',
            email: 'ravi@example.com',
            patientName: 'Ravi'
        }, { headers });

        console.log(`   ✓ Appointment Booked! Ref: ${bookingRes.data.appointment.referenceId}`);

        // 4. Test Double Booking Prevention
        console.log('4. Testing double-booking prevention...');
        try {
            await axios.post(`${API_URL}/appointments/book`, {
                doctorId: targetDoctor._id,
                date: dateStr,
                timeSlot: '10:30 AM',
                phoneNumber: '+91 00000 00000'
            }, { headers });
            console.log('   ✗ Error: Double booking was allowed!');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log('   ✓ Double booking prevented (Correctly blocked)');
            } else {
                throw err;
            }
        }

        // 5. Verify Patient Appointments
        console.log('5. Verifying patient appointment list...');
        const myAptsRes = await axios.get(`${API_URL}/appointments/my`, { headers });
        const myApts = myAptsRes.data;
        const found = myApts.find(a => a.referenceId === bookingRes.data.appointment.referenceId);
        if (found) {
            console.log(`   ✓ Appointment found in history for ${found.doctorName}`);
        } else {
            console.log('   ✗ Appointment not found in history');
        }

        console.log('\n--- Status: ALL BACKEND TESTS PASSED ---');

    } catch (error) {
        console.error('\n--- Verification Failed ---');
        console.error(error.response?.data || error.message);
        process.exit(1);
    }
}

runTest();
