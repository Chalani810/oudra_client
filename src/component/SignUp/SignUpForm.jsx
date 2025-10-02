import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    profilePicture: null,
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      street: "",
      city: "",
      postalCode: "",
      country: "",
      profilePicture: null,
      agreeToTerms: false,
    });
  }, []);

  useEffect(() => {
    if (formData.phone.startsWith("+94")) {
      setFormData(prev => ({ ...prev, country: "Sri Lanka" }));
    }
  }, [formData.phone]);

  const validateField = (fieldName, value) => {
    const errors = { ...fieldErrors };
    
    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          errors[fieldName] = "This field is required";
        } else if (!/^[A-Za-z]+$/.test(value)) {
          errors[fieldName] = "Only alphabetical characters are allowed";
        } else {
          delete errors[fieldName];
        }
        break;
        
      case "email":
        if (!value.trim()) {
          errors.email = "Email is required";
        } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;
        
      case "phone":
        if (!value.trim()) {
          errors.phone = "Phone number is required";
        } else if (!/^\+94\d{9}$/.test(value)) {
          errors.phone = "Please enter a valid phone number (+94 followed by 9 digits)";
        } else {
          delete errors.phone;
        }
        break;
        
      case "password":
        if (!value.trim()) {
          errors.password = "Password is required";
        } else if (value.length < 8) {
          errors.password = "Password must be at least 8 characters";
        } else {
          delete errors.password;
        }
        // Also validate confirm password if it exists
        if (formData.confirmPassword) {
          validateField("confirmPassword", formData.confirmPassword);
        }
        break;
        
      case "confirmPassword":
        if (!value.trim()) {
          errors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          errors.confirmPassword = "Passwords do not match";
        } else {
          delete errors.confirmPassword;
        }
        break;
        
      case "postalCode":
        if (!value.trim()) {
          errors.postalCode = "Postal code is required";
        } else if (!/^\d{5}$/.test(value)) {
          errors.postalCode = "Postal code must be exactly 5 digits";
        } else {
          delete errors.postalCode;
        }
        break;
        
      case "agreeToTerms":
        if (!value) {
          errors.agreeToTerms = "You must agree to the terms";
        } else {
          delete errors.agreeToTerms;
        }
        break;
        
      default:
        // Required field validation for address fields
        if (typeof value === "string" && !value.trim()) {
          errors[fieldName] = "This field is required";
        } else {
          delete errors[fieldName];
        }
    }
    
    setFieldErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === "checkbox" ? checked : type === "file" ? files[0] : value;
    
    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Validate the field immediately after changing it
    if (name !== "profilePicture") {
      validateField(name, newValue);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched on submit
    const allFields = Object.keys(formData);
    const newTouchedFields = {};
    allFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

    // Validate all fields
    allFields.forEach(field => {
      if (field !== "profilePicture") {
        validateField(field, formData[field]);
      }
    });

    if (!isFormValid()) {
      setError("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", formData.phone);
      data.append("street", formData.street);
      data.append("city", formData.city);
      data.append("postalCode", formData.postalCode);
      data.append("country", formData.country);
      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      }

      await axios.post(`${apiUrl}/auth/register`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/signin", { 
        state: { 
          success: "Registration successful! Please login.",
          email: formData.email 
        } 
      });
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.message?.includes("already exists")) {
        setError("It looks like you've already registered. Please sign in.");
      } else {
        setError(err.response?.data?.message || 
          err.message || 
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    // Check if there are any field errors
    if (Object.keys(fieldErrors).length > 0) return false;

    // Check required fields (excluding profilePicture which is optional)
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'password',
      'confirmPassword',
      'street',
      'city',
      'postalCode',
      'country',
      'agreeToTerms'
    ];

    return requiredFields.every(field => {
      const value = formData[field];
      return typeof value === 'boolean' ? value : value && value.toString().trim();
    });
  };

  const handleSignInRedirect = () => {
    navigate("/signin");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-center">Get Started Now</h2>
      <p className="text-gray-500 text-center mb-6">
        Enter your credentials to create your account
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block mb-1 font-semibold">First Name *</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
              fieldErrors.firstName && touchedFields.firstName 
                ? 'border-red-500 focus:ring-red-400' 
                : 'focus:ring-red-400'
            }`}
            required
          />
          {fieldErrors.firstName && touchedFields.firstName && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-semibold">Last Name *</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
              fieldErrors.lastName && touchedFields.lastName 
                ? 'border-red-500 focus:ring-red-400' 
                : 'focus:ring-red-400'
            }`}
            required
          />
          {fieldErrors.lastName && touchedFields.lastName && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block mb-1 font-semibold">Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
              fieldErrors.email && touchedFields.email 
                ? 'border-red-500 focus:ring-red-400' 
                : 'focus:ring-red-400'
            }`}
            required
          />
          {fieldErrors.email && touchedFields.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-semibold">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            placeholder="+94771234567"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
              fieldErrors.phone && touchedFields.phone 
                ? 'border-red-500 focus:ring-red-400' 
                : 'focus:ring-red-400'
            }`}
            required
          />
          {fieldErrors.phone && touchedFields.phone && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold">Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password (min 8 chars)"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
                fieldErrors.password && touchedFields.password 
                  ? 'border-red-500 focus:ring-red-400' 
                  : 'focus:ring-red-400'
              }`}
              required
              minLength="8"
            />
            {fieldErrors.password && touchedFields.password && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-semibold">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
                fieldErrors.confirmPassword && touchedFields.confirmPassword 
                  ? 'border-red-500 focus:ring-red-400' 
                  : 'focus:ring-red-400'
              }`}
              required
            />
            {fieldErrors.confirmPassword && touchedFields.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-semibold">Street Address *</label>
          <input
            type="text"
            name="street"
            placeholder="Street and house number"
            value={formData.street}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
              fieldErrors.street && touchedFields.street 
                ? 'border-red-500 focus:ring-red-400' 
                : 'focus:ring-red-400'
            }`}
            required
          />
          {fieldErrors.street && touchedFields.street && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-semibold">City *</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
                fieldErrors.city && touchedFields.city 
                  ? 'border-red-500 focus:ring-red-400' 
                  : 'focus:ring-red-400'
              }`}
              required
            />
            {fieldErrors.city && touchedFields.city && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.city}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Postal Code *</label>
            <input
              type="text"
              name="postalCode"
              placeholder="10230"
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
                fieldErrors.postalCode && touchedFields.postalCode 
                  ? 'border-red-500 focus:ring-red-400' 
                  : 'focus:ring-red-400'
              }`}
              required
            />
            {fieldErrors.postalCode && touchedFields.postalCode && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.postalCode}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Country *</label>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
                fieldErrors.country && touchedFields.country 
                  ? 'border-red-500 focus:ring-red-400' 
                  : 'focus:ring-red-400'
              }`}
              required
            />
            {fieldErrors.country && touchedFields.country && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.country}</p>
            )}
          </div>
        </div>

        {/* User Profile Picture */}
        <div>
          <label className="block mb-1 font-semibold">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          {formData.profilePicture && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {formData.profilePicture.name}
            </p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 mr-2 ${
              fieldErrors.agreeToTerms && touchedFields.agreeToTerms 
                ? 'border-red-500' 
                : ''
            }`}
            required
          />
          <p className="text-sm">
            I agree to the{" "}
            <a 
              href="/terms" 
              className="text-blue-600 underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a 
              href="/privacy" 
              className="text-blue-600 underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </p>
          {fieldErrors.agreeToTerms && touchedFields.agreeToTerms && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.agreeToTerms}</p>
          )}
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition duration-300 disabled:opacity-50"
          disabled={loading || !isFormValid()}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Sign In Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleSignInRedirect}
            className="text-red-500 font-semibold hover:underline focus:outline-none"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;