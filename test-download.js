import fetch from 'node-fetch';
import fs from 'fs';

const testDownload = async () => {
  try {
    console.log('🔄 Test de téléchargement PDF...');
    
    // Se connecter
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

    // Télécharger le rapport
    const reportId = '69c40732b43ed5d6068a847b'; // Nouvel ID du rapport généré
    
    const downloadResponse = await fetch(`http://localhost:8080/api/reports/download/${reportId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    console.log('📊 Download response status:', downloadResponse.status);
    console.log('📋 Content-Type:', downloadResponse.headers.get('content-type'));

    if (downloadResponse.ok) {
      const buffer = await downloadResponse.buffer();
      fs.writeFileSync('test-report.pdf', buffer);
      console.log('✅ PDF téléchargé avec succès! Fichier sauvegardé: test-report.pdf');
      console.log('📄 Taille du fichier:', buffer.length, 'bytes');
    } else {
      const errorData = await downloadResponse.json();
      console.log('❌ Téléchargement échoué:', errorData);
    }
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
};

testDownload();
