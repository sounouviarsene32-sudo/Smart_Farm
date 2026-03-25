import fetch from 'node-fetch';

const createUser = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin Test',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Utilisateur créé avec succès!');
      
      // Test de connexion
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
      console.log('Login response status:', loginResponse.status);
      console.log('Login response data:', loginData);

      if (loginResponse.ok && loginData.success) {
        console.log('✅ Connexion réussie!');
        console.log('Token:', loginData.token);
      } else {
        console.log('❌ Connexion échouée');
      }
    } else {
      console.log('❌ Création utilisateur échouée');
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};

createUser();
