import { Injectable, Res } from '@nestjs/common';
const PDFDocument = require('pdfkit');

@Injectable()
export class InvoiceService {
  async generateInvoice(
    rentalData: any,
    customTitle: string,
    @Res() res: any,
  ): Promise<void> {
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice_${Date.now()}.pdf"`,
    );
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res); // Pipe the PDF directly to the response stream

    // Invoice Header
    doc.fontSize(25).text(customTitle, { align: 'center' });
    doc.moveDown(1);

    // Company Information
    const companyName = 'Company Name: MyBike';
    const gstNo = 'GST No: 36485987467';
    const address = 'Address: D-101 titanium square (Thaltej) Ahmedabad';

    doc
      .fontSize(12)
      .text(companyName, { align: 'left' })
      .text(gstNo, { align: 'left' })
      .text(address, { align: 'left' })
      .moveDown(2);

    // Rental Details
    doc.fontSize(18).text('Rental Details', { align: 'center' }).moveDown(0.5);
    doc
      .strokeColor('black') // Set stroke color to black
      .moveTo(50, doc.y + 10) // Move to the starting position of the line
      .lineTo(doc.page.width - 50, doc.y + 10) // Draw a line to the end of the page
      .stroke(); // Stroke the line

    doc.moveDown(1);
    doc
      .fontSize(13)
      .text(`Name: ${rentalData.name}`, { align: 'left' })
      .text(`Booking Date: ${rentalData.date}`, { align: 'left' })
      .text(`Hours: ${rentalData.hours ? rentalData.hours : ' - '}`, {
        align: 'left',
      })
      .text(`Rent: ${rentalData.rent}`, { align: 'left' })
      .text(`Bike: ${rentalData.bike}`, { align: 'left' })
      .moveDown(1);

    doc
      .strokeColor('black') // Set stroke color to black
      .moveTo(50, doc.y + 10) // Move to the starting position of the line
      .lineTo(doc.page.width - 50, doc.y + 10) // Draw a line to the end of the page
      .stroke();

    doc.moveDown(1);
    doc
      .fontSize(13)
      .text(`Total Payed Amount: ${rentalData.rent}`, { align: 'right' });
    doc.text(`(8% GST Included)`, { align: 'right' });

    doc
      .strokeColor('black') // Set stroke color to black
      .moveTo(50, doc.y + 10) // Move to the starting position of the line
      .lineTo(doc.page.width - 50, doc.y + 10) // Draw a line to the end of the page
      .stroke();

    // Current Date (on the right side)
    doc.moveDown(2);

    // Invoice Footer
    doc.fontSize(15).text('Thank you for your business!', { align: 'center' });

    await doc.end(); // End the document
  }
}
