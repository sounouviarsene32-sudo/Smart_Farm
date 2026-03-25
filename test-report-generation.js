import fetch from 'node-fetch';

const testReportGeneration = async () => {
  try {
    console.log('🔄 Test de génération de rapport...');
    
    // D'abord se connecter pour obtenir un token
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

    console.log('✅ Connexion réussie, token obtenu');

    // Générer un rapport
    const reportResponse = await fetch('http://localhost:8080/api/reports/generate/production', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        campaignId: '69c4041c483add5c9b147e75', // ID de l'utilisateur admin comme campagne de test
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        authorId: 'agent123',
        authorName: 'Agent Test',
        authorRole: 'agent'
      })
    });

    const reportData = await reportResponse.json();
    console.log('📊 Report response status:', reportResponse.status);
    console.log('📋 Report response data:', JSON.stringify(reportData, null, 2));

    if (reportResponse.ok && reportData.success) {
      console.log('✅ Rapport généré avec succès!');
      console.log('📄 Report ID:', reportData.report._id);
    } else {
      console.log('❌ Génération de rapport échouée');
      console.log('Message:', reportData.message || 'Erreur inconnue');
    }
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
};

testReportGeneration();
