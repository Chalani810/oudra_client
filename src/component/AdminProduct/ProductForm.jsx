import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ProductForm = ({
  onAddProduct,
  onUpdateProduct,
  onCancel,
  isLoading,
  isEditMode,
  productId,
  }) => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const MIN_PRICE = 100; // Minimum price allowed

  const [productName, setProductName] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [stock, setStock] = useState(50);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [events, setEvents] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [priceError, setPriceError] = useState("");

  const categories = [
    "Chair",
    "Table",
    "Carpet",
    "Curtain",
    "Buffet Set",
    "Tent",
    "Table Cloth",
  ];

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleEventChange = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    
    // Validate price
    if (value && parseFloat(value) < MIN_PRICE) {
      setPriceError(`Price must be at least ${MIN_PRICE}`);
    } else {
      setPriceError("");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/event`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvents(response.data);

        // Handle edit mode
        if (isEditMode && productId && typeof productId === "object") {
          setProductName(productId.pname || "");
          setStock(productId.stockqut || 50);
          setPrice(productId.pprice || "");
          setCategory(productId.category || "");
          const eventIds = Array.isArray(productId.events)
            ? productId.events.map((event) =>
                typeof event === "object" && event._id ? event._id : event
              )
            : [];
          setSelectedEvents(eventIds);
        } else if (isEditMode) {
          toast.error("Invalid product data for editing");
        }
      } catch (err) {
        toast.error("Failed to load events");
      }
    };

    fetchEvents();
  }, [productId, isEditMode, apiUrl]);

  const isFormValid = () => {
    return (
      productName.trim() &&
      selectedEvents.length > 0 &&
      price &&
      parseFloat(price) >= MIN_PRICE &&
      category &&
      (isEditMode || imageFile)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!productName.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (selectedEvents.length === 0) {
      toast.error("At least one event must be selected");
      return;
    }
    if (!price) {
      toast.error("Price is required");
      return;
    }
    if (parseFloat(price) < MIN_PRICE) {
      toast.error(`Price must be at least ${MIN_PRICE}`);
      return;
    }
    if (!category) {
      toast.error("Category is required");
      return;
    }
    if (!isEditMode && !imageFile) {
      toast.error("Product image is required");
      return;
    }

    const productData = {
      pname: productName.trim(),
      events: selectedEvents,
      stock,
      pprice: price,
      category,
      productImage: imageFile,
    };

    try {
      if (isEditMode && productId && productId._id) {
        await onUpdateProduct(productId._id, productData);
      } else {
        await onAddProduct(productData);
      }

      if (!isEditMode) {
        setProductName("");
        setSelectedEvents([]);
        setStock(50);
        setPrice("");
        setCategory("");
        setImageFile(null);
      }
    } catch (err) {
      console.error("ProductForm - Error submitting form:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const getSelectedEventTitles = () => {
    if (selectedEvents.length === 0) return "Select events...";

    return events
      .filter((event) => selectedEvents.includes(event._id))
      .map((event) => event.title)
      .join(", ");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required={!isEditMode}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        {imageFile && (
          <p className="text-sm text-gray-500 mt-1">
            Selected: {imageFile.name}
          </p>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Events
        </label>
        <div
          className="w-full px-3 py-2 border border-gray-300 rounded cursor-pointer"
          onClick={toggleDropdown}
        >
          {selectedEvents.length > 0
            ? getSelectedEventTitles()
            : "Select events..."}
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
            {events.map((event) => (
              <div
                key={event._id}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center ${
                  selectedEvents.includes(event._id) ? "bg-blue-50" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventChange(event._id);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event._id)}
                  readOnly
                  className="mr-2 pointer-events-none"
                />
                <span>{event.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Stock Quantity
        </label>
        <input
          type="number"
          min="50"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          step="0.01"
          min={MIN_PRICE}
          value={price}
          onChange={handlePriceChange}
          required
          className={`w-full px-3 py-2 border ${
            priceError ? "border-red-500" : "border-gray-300"
          } rounded`}
          placeholder={`E.g., ${MIN_PRICE}.00`}
        />
        {priceError && (
          <p className="text-sm text-red-500 mt-1">{priceError}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading || !isFormValid()}
        >
          {isLoading
            ? "Saving..."
            : isEditMode
            ? "Update Product"
            : "Save Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;