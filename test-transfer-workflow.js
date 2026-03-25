import fetch from 'node-fetch';

const testTransferWorkflow = async () => {
  try {
    console.log('🔄 Test du workflow complet de transfert...');
    
    // 1. Connexion
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
    const token = loginData.token;

    // 2. Générer un rapport
    console.log('📝 Génération d\'un rapport...');
    const reportResponse = await fetch('http://localhost:8080/api/reports/generate/production', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

    const reportData = await reportResponse.json();
    
    if (!reportData.success) {
      console.error('❌ Génération échouée:', reportData);
      return;
    }

    console.log('✅ Rapport généré:', reportData.report._id);
    const reportId = reportData.report._id;

    // 3. Transférer le rapport
    console.log('📤 Transfert du rapport...');
    const transferResponse = await fetch('http://localhost:8080/api/reports/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        reportId,
        recipientType: 'chef',
        recipientId: 'chef123',
        message: 'Veuillez valider ce rapport financier'
      })
    });

    const transferData = await transferResponse.json();
    
    if (!transferData.success) {
      console.error('❌ Transfert échoué:', transferData);
      return;
    }

    console.log('✅ Rapport transféré avec succès');

    // 4. Vérifier les rapports en attente pour le chef
    console.log('👀 Vérification des rapports en attente...');
    const pendingResponse = await fetch('http://localhost:8080/api/reports/pending/role/chef', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const pendingData = await pendingResponse.json();
    
    if (!pendingData.success) {
      console.error('❌ Récupération échouée:', pendingData);
      return;
    }

    console.log('✅ Rapports en attente:', pendingData.reports.length);
    if (pendingData.reports.length > 0) {
      const pendingReport = pendingData.reports[0];
      console.log('📋 Détails du rapport en attente:');
      console.log('  - Titre:', pendingReport.title);
      console.log('  - Statut:', pendingReport.status);
      console.log('  - Transféré à:', pendingReport.transferredTo?.type);
      console.log('  - Date transfert:', pendingReport.transferredTo?.transferredAt);

      // 5. Valider le rapport
      console.log('✅ Validation du rapport...');
      const validateResponse = await fetch(`http://localhost:8080/api/reports/validate/${pendingReport._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'validate',
          comment: 'Rapport validé après vérification'
        })
      });

      const validateData = await validateResponse.json();
      
      if (!validateData.success) {
        console.error('❌ Validation échouée:', validateData);
        return;
      }

      console.log('✅ Rapport validé avec succès');
      console.log('📊 Nouveau statut:', validateData.report.status);
      console.log('📝 Validation:', validateData.report.validation);
    }

    console.log('🎉 Workflow complet terminé avec succès !');
    
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
};

testTransferWorkflow();
