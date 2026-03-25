import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

class ReportGenerator {
  async generateReport(type, data) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = 750;
    const fontSize = 12;
    const lineHeight = 20;

    // Header
    page.drawText('Rapport ' + type.charAt(0).toUpperCase() + type.slice(1), {
      x: 50,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 40;

    // Informations générales
    page.drawText('Période: ' + data.startDate + ' au ' + data.endDate, {
      x: 50,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight;
    page.drawText('Date de génération: ' + new Date().toLocaleDateString('fr-FR'), {
      x: 50,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    yPosition -= 40;

    // Contenu spécifique selon le type
    switch (type) {
      case 'financier':
        this.addFinancialContent(page, font, boldFont, data, yPosition);
        break;
      case 'production':
        this.addProductionContent(page, font, boldFont, data, yPosition);
        break;
      case 'stock':
        this.addStockContent(page, font, boldFont, data, yPosition);
        break;
      case 'sante':
        this.addHealthContent(page, font, boldFont, data, yPosition);
        break;
    }

    // Footer
    const totalPages = pdfDoc.getPageCount();
    for (let i = 0; i < totalPages; i++) {
      const currentPage = pdfDoc.getPage(i);
      currentPage.drawText(`Page ${i + 1} sur ${totalPages}`, {
        x: 500,
        y: 30,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    return await pdfDoc.save();
  }

  addFinancialContent(page, font, boldFont, data, yPosition) {
    const lineHeight = 20;

    // Titre section
    page.drawText('Analyse Financière', {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0,2, 0.5),
    });

    yPosition -= 30;

    // Données financières (simulées pour l'exemple)
    const financialData = [
      { label: 'Revenus Totaux', value: '12 500 000 FCFA' },
      { label: 'Dépenses Totales', value: '8 750 000 FCFA' },
      { label: 'Bénéfice Net', value: '3 750 000 FCFA' },
      { label: 'Marge', value: '30%' },
    ];

    financialData.forEach(item => {
      page.drawText(item.label + ': ' + item.value, {
        x: 70,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    });

    yPosition -= 20;

    // Analyse par département
    page.drawText('Analyse par Département', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0.5, 0),
    });

    yPosition -= 25;

    const departments = [
      { name: 'Volaille', revenus: '5 500 000 FCFA', depenses: '2 100 000 FCFA' },
      { name: 'Bovins', revenus: '4 200 000 FCFA', depenses: '3 500 000 FCFA' },
      { name: 'Ovins', revenus: '2 800 000 FCFA', depenses: '3 150 000 FCFA' },
    ];

    departments.forEach(dept => {
      page.drawText(dept.name + ':', {
        x: 70,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
      page.drawText('  Revenus: ' + dept.revenus, {
        x: 90,
        y: yPosition,
        size: 11,
        font,
        color: rgb(0, 0.5, 0),
      });
      yPosition -= lineHeight;
      page.drawText('  Dépenses: ' + dept.depenses, {
        x: 90,
        y: yPosition,
        size: 11,
        font,
        color: rgb(0.5, 0, 0),
      });
      yPosition -= lineHeight + 10;
    });
  }

  addProductionContent(page, font, boldFont, data, yPosition) {
    const lineHeight = 20;

    page.drawText('Analyse de Production', {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0, 0.5, 0),
    });

    yPosition -= 30;

    const productionData = [
      { label: 'Production Volaille', value: '1 200 têtes' },
      { label: 'Production Bovins', value: '450 têtes' },
      { label: 'Production Ovins', value: '800 têtes' },
      { label: 'Taux de Croissance Moyen', value: '15%' },
    ];

    productionData.forEach(item => {
      page.drawText(item.label + ': ' + item.value, {
        x: 70,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    });
  }

  addStockContent(page, font, boldFont, data, yPosition) {
    const lineHeight = 20;

    page.drawText('État des Stocks', {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0, 0.5, 0),
    });

    yPosition -= 30;

    const stockData = [
      { label: 'Aliment Volaille', value: '2.5 tonnes', status: 'Normal' },
      { label: 'Aliment Bovins', value: '1.8 tonnes', status: 'Normal' },
      { label: 'Médicaments', value: '150 unités', status: 'Critique' },
      { label: 'Vaccins', value: '80 doses', status: 'Normal' },
    ];

    stockData.forEach(item => {
      page.drawText(item.label + ': ' + item.value + ' (' + item.status + ')', {
        x: 70,
        y: yPosition,
        size: 12,
        font,
        color: item.status === 'Critique' ? rgb(1, 0, 0) : rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    });
  }

  addHealthContent(page, font, boldFont, data, yPosition) {
    const lineHeight = 20;

    page.drawText('Rapport Santé', {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0.5, 0, 0),
    });

    yPosition -= 30;

    const healthData = [
      { label: 'Animaux Vaccinés', value: '1 850 / 2 000' },
      { label: 'Taux de Maladie', value: '3.2%' },
      { label: 'Traitements Administrés', value: '45' },
      { label: 'Mortalité', value: '1.5%' },
    ];

    healthData.forEach(item => {
      page.drawText(item.label + ': ' + item.value, {
        x: 70,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    });
  }
}

export default ReportGenerator;