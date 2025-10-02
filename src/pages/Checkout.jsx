import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AiOutlineDownload } from "react-icons/ai";
import { FaFileDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";

const CheckoutForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const userData = JSON.parse(localStorage.getItem("user"));
  const [bankDetailsModalOpen, setBankDetailsModalOpen] = useState(false);

  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    orderNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    telephone: "",
    mobile: "",
    contactMethod: "call",
    guestCount: "less than 100",
    eventDate: null,
    comment: "",
    cartTotal: 0,
    advancePayment: 0,
    duepayment: 0,
    slipUrl: null,
    slipPreview: null,
  });
  const bankDetails = {
    accountNumber: "200067834",
    accountName: "Glimmer",
    bankName: "Commercial Bank",
    branch: "Colombo 7",
    contact: "glimmer.infomail@gmail.com",
  };

  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // First fetch the cart data
        const cartResponse = await axios.get(`${apiUrl}/cart/${userData.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCart(cartResponse.data.data);

        // Then fetch user data
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await fetch(`${apiUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = await userResponse.json();

          if (!userResponse.ok) {
            throw new Error(userData.message || "Failed to fetch user details");
          }

          // Now set the form data with both cart and user data
          setFormData({
            userId: userData._id || "",
            orderNumber: "",
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            address: userData.address
              ? `${userData.address.street || ""}, ${
                  userData.address.city || ""
                }, ${userData.address.postalCode || ""}, ${
                  userData.address.country || ""
                }`
              : "",
            telephone: "",
            mobile: userData.phone || "",
            contactMethod: "call",
            guestCount: "less than 100",
            eventDate: null,
            comment: "",
            cartTotal: cartResponse.data.data?.cartTotal || 0,
            advancePayment: cartResponse.data.data?.advancePayment || 0,
            duepayment: cartResponse.data.data?.totalDue || 0,
            slipUrl: null,
            slipPreview: null,
            cart: cartResponse.data.data,
          });
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setMessage("Failed to load data. Please try again.");
      }
    };

    loadData();
  }, [apiUrl, userData.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, eventDate: date }));
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
    if (!isCalendarOpen && datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
      setFormData((prev) => ({ ...prev, slipUrl: file, slipPreview: preview }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mobile) {
      setIsSuccess(false);
      setMessage("Mobile number is required");
      return;
    }
    if (!formData.userId) {
      setIsSuccess(false);
      setMessage("User ID is not fetched. Please refresh.");
      return;
    }
    if (!formData.eventDate) {
      setIsSuccess(false);
      setMessage("Event date is required");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    const slPhoneRegex = /^\+94\d{9}$/;

    if (!formData.mobile.trim()) {
      setIsSuccess(false);
      setMessage("Mobile number is required.");
      return;
    } else if (!slPhoneRegex.test(formData.mobile)) {
      setIsSuccess(false);
      setMessage(
        "Please enter a valid Sri Lankan mobile number (+94 followed by 9 digits)."
      );
      return;
    }

    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      setIsSuccess(false);
      setMessage("Please enter a valid 10-digit telephone number.");
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("userId", formData.userId);
    formDataToSend.append("orderNumber", formData.orderNumber);
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("telephone", formData.telephone);
    formDataToSend.append("eventDate", formData.eventDate);
    formDataToSend.append("mobile", formData.mobile);
    formDataToSend.append("contactMethod", formData.contactMethod);
    formDataToSend.append("guestCount", formData.guestCount);
    formDataToSend.append("comment", formData.comment);
    formDataToSend.append("cartTotal", formData.cartTotal.toString());
    formDataToSend.append("advancePayment", formData.advancePayment.toString());
    formDataToSend.append("duepayment", formData.duepayment.toString());
    formDataToSend.append("cart", JSON.stringify(formData.cart));

    if (formData.slipUrl) {
      formDataToSend.append("slip", formData.slipUrl);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/checkout/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to submit order");

      setIsSuccess(true);
      setMessage("Order submitted successfully!");
      setOrderSubmitted(true);

      setFormData((prev) => ({
        ...prev,
        address: "",
        telephone: "",
        mobile: "",
        contactMethod: "call",
        guestCount: "less than 100",
        eventDate: null,
        comment: "",
        slipUrl: null,
        slipPreview: null,
      }));
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSuccess(false);
      setMessage(error.message || "Failed to submit order. Please try again.");
    }
  };

  const generateInvoice = () => {
    const doc = new jsPDF();
    
    // ===== HEADER SECTION =====
     doc.setFontSize(22);
     doc.setFont("helvetica", "bold");

    // Set initial color to black
     doc.setTextColor(0, 0, 0);
     doc.text("Gli", 105, 20, { align: "center" });

    // Calculate width of "Gli" to position "mm" correctly
    const gliWidth = doc.getTextWidth("Gli");
    const startX = 105 - (gliWidth / 2);

    // Switch to red for "mm"
    doc.setTextColor(255, 0, 0);
    doc.text("mm", startX + gliWidth, 20);

    // Calculate width of "mm" to position "er" correctly
    const mmWidth = doc.getTextWidth("mm");

   // Switch back to black for "er"
    doc.setTextColor(0, 0, 0);
    doc.text("er", startX + gliWidth + mmWidth, 20);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Invoice | Flower Road, Colombo 7", 105, 30, { align: "center" });
    
    // Divider line
    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(20, 35, 190, 35);
    
    // ===== INVOICE INFO =====
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Date: ${currentDate}`, 20, 45);
    doc.text(`Invoice #: ${Math.floor(Math.random() * 10000)}`, 20, 52);
    
    // ===== ITEMS TABLE =====
    // Table header with light gray background
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 60, 170, 10, 'F');
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Item Description", 25, 67);
    doc.text("Qty", 110, 67, { align: "center" });
    doc.text("Amount", 180, 67, { align: "right" });
    
    // Table rows with alternating colors
    let y = 70;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    cart.items.forEach((item, index) => {
        y += 10;
        
        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(20, y - 5, 170, 10, 'F');
        }
        
        doc.text(item.productId?.pname || "Product", 25, y);
        doc.text(`${item.quantity}`, 110, y, { align: "center" });
        doc.text(`Rs.${(item.quantity * item.price).toFixed(2)}`, 180, y, { align: "right" });
    });
    
    // ===== TOTALS SECTION =====
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    
    doc.text("Subtotal:", 150, y, { align: "right" });
    doc.text(`Rs.${cart.cartTotal.toFixed(2)}`, 180, y, { align: "right" });
    y += 8;
    
    doc.text("Advance Payment:", 150, y, { align: "right" });
    doc.text(`Rs.${cart.advancePayment.toFixed(2)}`, 180, y, { align: "right" });
    y += 8;
    
    doc.setTextColor(255, 0, 0); // Red for due amount
    doc.text("Balance Due:", 150, y, { align: "right" });
    doc.text(`Rs.${cart.totalDue.toFixed(2)}`, 180, y, { align: "right" });
    doc.setTextColor(0, 0, 0); // Reset to black
    
    // ===== BANK DETAILS =====
    y += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text("Account Name: Glimmer", 20, y + 8);
    doc.text("Bank: Commercial Bank", 20, y + 16);
    doc.text("Account No: 200067834", 20, y + 24);
    doc.text("Branch: Colombo 7", 20, y + 32);
    doc.text("Email: glimmer.infomail@gmail.com", 20, y + 40);
    
    // ===== FOOTER =====
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    
    doc.save(`Glimmer_Invoice_${currentDate.replace(/\//g, '-')}.pdf`);
   };

  if (orderSubmitted && isSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200 my-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <FaCheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            Order Submitted Successfully!
          </h2>

          <div className="mt-4 p-4 bg-green-50 rounded-lg text-green-700">
            <p className="text-lg">{message}</p>
            <p className="mt-2 text-sm">
              We've received your order and will contact you shortly.
            </p>
          </div>
          <div
            onClick={generateInvoice}
            className="flex flex-col items-center cursor-pointer text-green-600 hover:text-green-800 m-4"
          >
            <FaFileDownload className="w-6 h-6" />
            <span className="text-sm mt-1">Download Invoice</span>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate(`/customerviewevent`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200 my-8 text-center">
        <div className="text-xl font-semibold text-gray-700 mb-4">
          Your cart is empty
        </div>
        <p className="text-gray-600 mb-6">
          There are no items in your cart to checkout. Please add some items
          first.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 bg-slate-50 my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Checkout Form</h2>

      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-3 text-lg font-medium text-gray-900">
            Personal Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              readOnly
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
            <input type="hidden" name="firstName" value={formData.firstName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              readOnly
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
            <input type="hidden" name="lastName" value={formData.lastName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={formData.email}
              readOnly
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
            <input type="hidden" name="email" value={formData.email} />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-2 text-lg font-medium text-gray-900">
            Contact Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telephone
            </label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Contact Method
            </label>
            <select
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="call">Phone Call</option>
              <option value="message">Text Message</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-2 text-lg font-medium text-gray-900">
            Event Details
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estimated Guest Count
            </label>
            <select
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="less than 100">Less than 100</option>
              <option value="100-200">100-200</option>
              <option value="more than 200">More than 200</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Event Date <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1 w-full">
              <DatePicker
                selected={formData.eventDate}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholderText="Select date"
                open={isCalendarOpen}
                onClickOutside={() => setIsCalendarOpen(false)}
                ref={datePickerRef}
                required
                readOnly
              />
              <FaCalendarAlt
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 cursor-pointer"
                onClick={toggleCalendar}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="md:col-span-3 flex items-center justify-between">
            <h3 className="md:col-span-3 text-lg font-medium text-gray-900">
              Payment Information
            </h3>

            <div className="flex items-center gap-1">
              <span className="text-sm text-red-500">Bank Details</span>
              <button
                onClick={() => setBankDetailsModalOpen(true)}
                className="p-1 text-red-500 hover:text-green-500 transition-colors rounded-full hover:bg-red-100"
                aria-label="View bank details"
                title="View bank details"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cart Total
            </label>
            <input
              type="text"
              value={`LKR ${formData.cartTotal}`}
              readOnly
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Advance Payment
            </label>
            <input
              type="text"
              value={`LKR ${formData.advancePayment}`}
              readOnly
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Payment
            </label>
            <input
              type="text"
              value={`LKR ${formData.duepayment}`}
              readOnly
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Payment Slip <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex items-center">
              <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Choose File
                <input
                  type="file"
                  name="slipUrl"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                  required
                />
              </label>
              <span className="ml-2 text-sm text-gray-500">
                {formData.slipUrl ? formData.slipUrl.name : "No file chosen"}
              </span>
            </div>
            {formData.slipPreview && (
              <div className="mt-2">
                <img
                  src={formData.slipPreview}
                  alt="Preview"
                  className="h-32 object-contain border rounded"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
          >
            Submit Order
          </button>
        </div>
      </form>
      {bankDetailsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Bank Details</h2>
            </div>

            <div className="space-y-3">
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Account Number
                </span>
                <p className="mt-1 text-base text-gray-900">
                  {bankDetails.accountNumber}
                </p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Account Name
                </span>
                <p className="mt-1 text-base text-gray-900">
                  {bankDetails.accountName}
                </p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Bank Name
                </span>
                <p className="mt-1 text-base text-gray-900">
                  {bankDetails.bankName}
                </p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Branch
                </span>
                <p className="mt-1 text-base text-gray-900">
                  {bankDetails.branch}
                </p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Contact
                </span>
                <p className="mt-1 text-base text-gray-900">
                  <a
                    href={`mailto:${bankDetails.contact}`}
                    className="text-red-600 hover:underline"
                  >
                    {bankDetails.contact}
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setBankDetailsModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
