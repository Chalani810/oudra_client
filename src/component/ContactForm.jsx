import React, { useState, useEffect } from 'react';

const ContactForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    services: [],
  });

  const servicesList = [
    'Wedding Planning',
    'Co-Operate Event',
    'Proposal Event',
    'Anniversary Party',
    'Birthday Party',
    'Other',
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(`${apiUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = await response.json();

          if (response.ok) {
            setForm(prev => ({
              ...prev,
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              phone: userData.phone || '',
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        services: checked
          ? [...prev.services, value]
          : prev.services.filter((s) => s !== value),
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Your message has been sent!");
        setForm(prev => ({
          ...prev,
          message: '',
          services: [],
        }));
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg m-5">
      <h2 className="text-2xl font-bold text-center mb-2">Get In Touch</h2>
      <p className="text-center text-gray-500 mb-6">We'll Get Back To You Within 24 Hours</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
      </div>

      <input
        type="email"
        name="email"
        placeholder="you@company.com"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-4"
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="LK, +94 70 000 0000"
        value={form.phone}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-4"
        required
      />

      <textarea
        name="message"
        rows="4"
        placeholder="Leave us a message..."
        value={form.message}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-4"
        required
      />

      <div className="mb-4">
        <label className="block font-semibold mb-2">Services</label>
        <div className="grid grid-cols-2 gap-2">
          {servicesList.map((service) => (
            <label key={service} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="services"
                value={service}
                checked={form.services.includes(service)}
                onChange={handleChange}
                className="accent-red-500"
              />
              <span>{service}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;