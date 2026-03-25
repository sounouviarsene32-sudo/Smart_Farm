import fetch from 'node-fetch';

const testSimpleReport = async () => {
  try {
    console.log('🔄 Test simple de génération de rapport...');
    
    // Connexion
    const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error('❌ Connexion échouée');
      return;
    }

    console.log('✅ Connexion réussie');

    // Test avec production (plus simple)
    console.log('📝 Test génération rapport production...');
    const reportResponse = await fetch('http://localhost:8080/api/reports/generate/production', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        campaignId: '69c4041c483add5c9b147e75',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        authorId: 'agent123',
        authorName: 'Agent Test',
        authorRole: 'agent'
      })
    });

    console.log('📊 Status:', reportResponse.status);
    
    try {
      const reportData = await reportResponse.json();
      console.log('📋 Response:', reportData);
      
      if (reportData.success) {
        console.log('✅ Rapport généré avec succès!');
      } else {
        console.log('❌ Erreur:', reportData.message);
      }
    } catch (parseError) {
      console.log('❌ Erreur parsing JSON:', parseError.message);
      const text = await reportResponse.text();
      console.log('📄 Response brute:', text);
    }
    
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
};

testSimpleReport();
