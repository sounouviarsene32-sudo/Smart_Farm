const axios = require('axios');

async function testDashboard() {
    try {
        console.log('Testing dashboard API...');

        // Test de l'API dashboard
        const response = await axios.get('http://localhost:3000/api/dashboard/overview', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGFjZjA4MzM3ZjA5ZjQ4ZjQ4ZjQ4ZiIsInJvbGUiOiJjaGVmIiwiaWF0IjoxNzMyOTQ3MzI3LCJleHAiOjE3MzI5NTA5Mjd9.example' // Token d'exemple
            }
        });

        console.log('Dashboard response:');
        console.log('Campaigns:', response.data.campaigns.map(c => ({
            name: c.name,
            animalsCount: c.animalsCount
        })));

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testDashboard();