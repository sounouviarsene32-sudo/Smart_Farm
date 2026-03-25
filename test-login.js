import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    console.log('🔐 Test de connexion avec admin@test.com...');
    
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
    console.log('📊 Login response status:', loginResponse.status);
    console.log('📋 Login response data:', JSON.stringify(loginData, null, 2));

    if (loginResponse.ok && loginData.success) {
      console.log('✅ Connexion réussie!');
      console.log('🔑 Token:', loginData.token ? 'Présent' : 'Manquant');
      console.log('👤 User:', loginData.user);
      
      // Test du token
      if (loginData.token) {
        const parts = loginData.token.split('.');
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          console.log('🔓 Token header:', header);
          console.log('📦 Token payload:', payload);
        }
      }
    } else {
      console.log('❌ Connexion échouée');
      console.log('Message:', loginData.message || 'Erreur inconnue');
    }
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
};

testLogin();
