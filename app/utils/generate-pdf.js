// Helper: Generate PDF in memory
const PDFDocument = require("pdfkit");

async function generateTicketsPDF(ticketsSoldArray) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const buffers = [];
  
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });
  
        // Document Title
        doc
          .fontSize(18)
          .text("Your Ticket Confirmation", { underline: true })
          .moveDown();
  
        ticketsSoldArray.forEach((ticketSold, index) => {
          const event = ticketSold.Ticket.Event;
  
          // Print basic info
          doc.fontSize(14).text(`Ticket #${index + 1}`);
          doc.fontSize(12).text(`Event Title: ${event.title}`);
          doc.text(
            `Seat: ${
              event.seated
                ? ticketSold.seat ?? "No seat info"
                : "Non-seated"
            }`
          );
          doc.text(
            `Section: ${
              event.seated
                ? ticketSold.section ?? "No section info"
                : "Non-seated"
            }`
          );
          doc.text(`Color: ${ticketSold.color}`);
  
          // Convert DataURL to Buffer (so we can embed it)
          if (ticketSold.qr_code) {
            const base64Data = ticketSold.qr_code.split(",")[1]; 
            // Remove the "data:image/png;base64," part
            const qrBuffer = Buffer.from(base64Data, "base64");
            // Place QR image in the PDF
            doc.moveDown();
            doc.image(qrBuffer, {
              fit: [100, 100],
              align: "left",
            });
          }
  
          doc.moveDown().moveDown();
  
          // Optionally add a page break after each ticket, or just spacing
          // doc.addPage();
        });
  
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
  module.exports = {generateTicketsPDF}