const axios = require('axios');

async function fetchDatabaseContents() {
    try {
        console.log("=== Logging in as Admin ===");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'admin',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log("\n=== PATIENTS ===");
        try {
            const patients = await axios.get('http://localhost:5000/api/patients', config);
            console.log(JSON.stringify(patients.data, null, 2));
        } catch (e) {
            console.error("Patients error:", e.response ? e.response.data : e.message);
        }

        console.log("\n=== STAFF ===");
        try {
            const staff = await axios.get('http://localhost:5000/api/staff', config);
            console.log(JSON.stringify(staff.data, null, 2));
        } catch (e) {
            console.error("Staff error:", e.response ? e.response.data : e.message);
        }

        console.log("\n=== INVENTORY ===");
        try {
            const inventory = await axios.get('http://localhost:5000/api/inventory', config);
            console.log(JSON.stringify(inventory.data, null, 2));
        } catch (e) {
            console.error("Inventory error:", e.response ? e.response.data : e.message);
        }

    } catch (err) {
        console.error("Login Error:");
        console.error(err.response ? JSON.stringify(err.response.data) : err.message);
    }
}

fetchDatabaseContents();
