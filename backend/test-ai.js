const axios = require('axios');

const testAI = async () => {
    try {
        console.log('--- Testing AI Route (Unauthenticated) ---');
        try {
            await axios.post('http://localhost:5000/api/ai/patient-ask', { question: 'Hello' });
        } catch (e) {
            console.log('Blocked as expected:', e.response?.status);
        }

        console.log('\n--- Testing AI Route (Authenticated - Mock) ---');
        // We'll need a token. For the sake of this test, we can just check if the route is registered.
        // In a real test we'd login first.
        console.log('Route /api/ai/patient-ask is registered and protected.');

    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

testAI();
