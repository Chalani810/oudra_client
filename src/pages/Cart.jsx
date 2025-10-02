import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';
import { AiOutlineDownload } from 'react-icons/ai';
import { jsPDF } from 'jspdf';

const CartPage = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
    advancepayment,
    duepayment,
  } = useCart();

  const generateInvoice = () => {
    const doc = new jsPDF();

  
    // Title (Company Name)
doc.setFontSize(20);
doc.setFont('helvetica', 'bold');
doc.setTextColor(255, 0, 0); // Red
doc.text('Glimmer', 105, 20, null, null, 'center');

// Subtitle (Invoice)
doc.setFontSize(16);
doc.setFont('helvetica', 'normal');
doc.setTextColor(0, 0, 0); // Black
doc.text('Invoice', 105, 35, null, null, 'center');

// Company Address
const companyAddress = '1234 Business St, City, Country';
doc.setFontSize(12);
doc.setTextColor(0, 0, 0); // Black
doc.text(`Address: ${companyAddress}`, 10, 50);

// Date
const currentDate = new Date().toLocaleDateString(); // Format current date
doc.setFontSize(12);
doc.text(`Date: ${currentDate}`, 10, 40);

// Draw Border around the content
doc.setDrawColor(0, 0, 0); // Black border
doc.setLineWidth(0.5);
doc.rect(10, 60, 190, 120); // x, y, width, height

// Separator line
doc.setLineWidth(0.5);
doc.line(10, 25, 200, 25);

// Items section
doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
let y = 70; // Starting y position for content

// Adding header for items, quantities, and amounts
doc.text('Item', 15, y);
doc.text('Quantity', 105, y);
doc.text('Amount', 170, y);
y += 8; // Adding some space after the header

// List the items with their quantities and amounts
items.forEach((item, index) => {
  doc.text(item.name, 15, y);
  doc.text(`${item.quantity}`, 105, y, { align: 'center' });
  doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 170, y, { align: 'right' });
  y += 8; // Move to next line
});

// Add line separator after the item list
doc.setLineWidth(0.5);
doc.line(10, y + 2, 200, y + 2);
y += 8; // Add some space after the separator

// Align total, advance payment, and due payment below the amount column
const rightColumnX = 170; 

// Total, Advance Payment, and Due Payment
doc.text('Total Amount : $' + cartTotal.toFixed(2), rightColumnX, y, { align: 'right' });
doc.text('Advance Payment : Rs.' + advancepayment, rightColumnX, y + 10, { align: 'right' });
doc.text('Due Payment : Rs.' + duepayment, rightColumnX, y + 20, { align: 'right' });


// Footer (Thank You message)
doc.setFontSize(10);
doc.setFont('helvetica', 'italic');
doc.setTextColor(100, 100, 100); // Lighter grey for footer
doc.text('Thank you for your purchase!', 105, y + 50, null, null, 'center');

    // Save the PDF
    doc.save('invoice.pdf');
  };
  

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-white text-black">
      <h1 className="text-3xl font-semibold text-center mb-8">Your Cart</h1>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Side: Cart Items */}
        <div className="flex-1 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-lg text-gray-600">No items to display.</div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex p-4 border border-black rounded-lg shadow-md space-x-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-700">${item.price.toFixed(2)}</p>

                  <div className="flex items-center space-x-3 mt-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-4 py-2 bg-gray-400 text-lg rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-4 py-2 bg-gray-400 text-lg rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-4 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-2xl shadow-xl space-y-6 border-gray-200">
          {items.length === 0 && (
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
              <Link
                to="/products"
                className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          )}

          <Link
            to="/products"
            className="block w-full text-center bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-medium"
          >
            Continue Shopping
          </Link>

          {items.length > 0 && (
            <>
              <h3 className="text-2xl font-semibold text-gray-800">Order Summary</h3>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs.{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Advance Payment</span>
                <span>Rs.{advancepayment}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Due otal</span>
                <span>Rs.{duepayment}</span>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Link
                  to="/checkout"
                  className="w-full text-center px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"

                >
                  Proceed to Checkout
                </Link>

                <div
                  onClick={generateInvoice}
                 className="flex flex-col items-center cursor-pointer text-blue-600 hover:text-blue-800"
                >
                 <AiOutlineDownload className="w-6 h-6" />
                 <span className="text-sm mt-1">View Invoice</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
