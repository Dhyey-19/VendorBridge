import PDFDocument from 'pdfkit';

export const generatePOPdf = (po, quotation) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text('VendorBridge', { align: 'left' });
      doc.fontSize(10).text('123 Procurement Ave, Tech City, 560001', { align: 'left' });
      doc.moveDown(2);

      doc.fontSize(24).text('PURCHASE ORDER', { align: 'right' });
      doc.fontSize(12).text(`PO Number: ${po.poNumber}`, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
      doc.moveDown(2);

      // Vendor Info
      doc.fontSize(14).text('Vendor Details', { underline: true });
      doc.fontSize(12).text(`Name: ${quotation.vendorId.name}`);
      doc.text(`Contact: ${quotation.vendorId.contactName || 'N/A'}`);
      doc.text(`Email: ${quotation.vendorId.contactEmail || 'N/A'}`);
      doc.moveDown(2);

      // RFQ Details
      doc.fontSize(14).text('Order Details', { underline: true });
      doc.fontSize(12).text(`RFQ Title: ${quotation.rfqId.title}`);
      doc.text(`Quantity: ${quotation.rfqId.quantity} Units`);
      doc.text(`Price Per Unit: Rs. ${quotation.pricePerUnit.toFixed(2)}`);
      doc.text(`Delivery Timeline: ${quotation.deliveryTimeline}`);
      doc.moveDown(2);

      // Total Amount
      doc.rect(50, doc.y, 500, 40).fillAndStroke('#f3f4f6', '#e5e7eb');
      doc.fillColor('#000').fontSize(16).text(`Total Amount: Rs. ${po.totalAmount.toFixed(2)}`, 60, doc.y - 30);

      // Footer
      doc.moveDown(4);
      doc.fontSize(10).text('This is an electronically generated document. No signature is required.', { align: 'center', color: 'grey' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
