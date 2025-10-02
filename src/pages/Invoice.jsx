import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  const invoiceRef = useRef();

  // Example values (you can later make them dynamic too!)
  const subtotal = 25000;
  const discount = 5000;
  const total = subtotal - discount;
  const amountDue = total; // If no extra payment made yet

  const downloadInvoice = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // ==== New: Adding Company Header ====
      const headerHeight = 30; // Adjust based on header content
      pdf.setFontSize(18);
      pdf.setTextColor(40, 40, 40);
      pdf.text("My Company Name Pvt Ltd.", pdfWidth / 2, 15, { align: "center" });
  
      pdf.setFontSize(11);
      pdf.text("1234, Business Street, Colombo, Sri Lanka", pdfWidth / 2, 22, { align: "center" });
      pdf.text("Phone: +94 11 2345678 | Email: info@mycompany.com", pdfWidth / 2, 28, { align: "center" });
      // ====================================
  
      // Image section (invoice body)
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20; // margins
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
      let position = headerHeight + 10; // Start image after header
  
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight); // 10mm margin
  
      // Handle multi-page if content too big
      let heightLeft = imgHeight;
      heightLeft -= (pdfHeight - position);
  
      while (heightLeft > 0) {
        pdf.addPage();
        position = 10; // top margin on new page
        pdf.addImage(imgData, 'PNG', 10, position - (imgHeight - heightLeft), imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20;
      }
  
      pdf.save('invoice.pdf');
    });
  };
  

  return (
    <div className="p-8">
      <div ref={invoiceRef} className="bg-white p-10 shadow-md max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Invoice</h1>

        <div className="mb-6">
          <p><strong>Order ID:</strong> #12345</p>
          <p><strong>Customer:</strong> John Doe</p>
          <p><strong>Date:</strong> 2025-04-26</p>
        </div>

        <table className="w-full mb-6 border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Item</th>
              <th className="border-b p-2 text-right">Qty</th>
              <th className="border-b p-2 text-right">Price</th>
              <th className="border-b p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b p-2">Event Decoration</td>
              <td className="border-b p-2 text-right">1</td>
              <td className="border-b p-2 text-right">Rs. 10,000</td>
              <td className="border-b p-2 text-right">Rs. 10,000</td>
            </tr>
            <tr>
              <td className="border-b p-2">Photography</td>
              <td className="border-b p-2 text-right">1</td>
              <td className="border-b p-2 text-right">Rs. 15,000</td>
              <td className="border-b p-2 text-right">Rs. 15,000</td>
            </tr>
          </tbody>
        </table>

        {/* Financial Summary */}
        <div className="flex justify-end mb-2">
          <div className="w-1/2">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Discount:</span>
              <span>- Rs. {discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-1 font-semibold">
              <span>Total:</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t font-bold text-lg">
              <span>Amount Due:</span>
              <span>Rs. {amountDue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={downloadInvoice}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Invoice;
