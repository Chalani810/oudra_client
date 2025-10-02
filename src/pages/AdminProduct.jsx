import React, { useState, useEffect } from "react";
import Sidebar from "../component/AdminEvent/Sidebar";
import ProductTable from "../component/AdminProduct/ProductTable";
import ProductForm from "../component/AdminProduct/ProductForm";
import ConfirmationModal from "../component/ConfirmationModal";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddProductPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // Store full product object
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/product`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to fetch products";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (newProduct) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!newProduct.pname || !newProduct.pprice || !newProduct.category) {
        throw new Error("Missing required fields: name, price, or category");
      }
      if (!Array.isArray(newProduct.events) || newProduct.events.length === 0) {
        throw new Error("At least one event is required");
      }

      const formData = new FormData();
      formData.append("pname", newProduct.pname);
      formData.append("stock", newProduct.stock || 0);
      formData.append("pprice", newProduct.pprice);
      formData.append("category", newProduct.category);
      newProduct.events.forEach((event) => {
        formData.append("events[]", event); // Use events[] for array
      });
      if (newProduct.productImage) {
        formData.append("productImage", newProduct.productImage);
      }
      const response = await axios.post(`${apiUrl}/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await fetchProducts();
      setShowModal(false);
      toast.success("Product added successfully");
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message || "Failed to add product";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (updatedPId, updatedProduct) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !updatedProduct.pname ||
        !updatedProduct.pprice ||
        !updatedProduct.category
      ) {
        throw new Error("Missing required fields: name, price, or category");
      }
      if (
        !Array.isArray(updatedProduct.events) ||
        updatedProduct.events.length === 0
      ) {
        throw new Error("At least one event is required");
      }

      const formData = new FormData();
      formData.append("pname", updatedProduct.pname);
      formData.append("stock", updatedProduct.stock || 0);
      formData.append("pprice", updatedProduct.pprice);
      formData.append("category", updatedProduct.category);
      updatedProduct.events.forEach((event) => {
        formData.append("events[]", event); // Use events[] for array
      });
      if (updatedProduct.productImage instanceof File) {
        formData.append("productImage", updatedProduct.productImage);
      }

      const response = await axios.put(
        `${apiUrl}/product/${updatedPId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchProducts();
      setShowModal(false);
      setIsEditMode(false);
      setEditProduct(null);
      toast.success("Product updated successfully");
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update product";
      setError(errMsg);
      console.error(
        "AddProductPage - Error updating product:",
        err.response?.data || err
      );
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (productId) => {
    const product = products.find((p) => p._id === productId._id);
    if (product) {
      setEditProduct(product); // Store full product object
      setIsEditMode(true);
      setShowModal(true);
    } else {
      console.warn("AddProductPage - Product not found for ID:", productId);
      toast.error("Product not found for editing");
    }
  };

  const handleDeleteRequest = (productId) => {
    setSelectedProductId(productId);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    setShowConfirmModal(false);
    if (!selectedProductId) return;

    setIsLoading(true);
    try {
      await axios.delete(`${apiUrl}/product/${selectedProductId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchProducts();
      setSelectedProductId(null);
      toast.success("Product deleted successfully");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to delete product";
      setError(errMsg);
      console.error("AddProductPage - Error deleting product:", err);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.pname.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const response = await axios.get(`${apiUrl}/product_report/products`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "product_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Product report downloaded");
    } catch (err) {
      console.error("AddProductPage - Download failed:", err);
      toast.error("Failed to download product report PDF");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Product Management
              </h1>

              <div className="flex gap-4">
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                  disabled={isDownloadingPDF}
                >
                  {isDownloadingPDF ? "Downloading..." : "Export"}
                </button>
                <div className="flex gap-4 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setIsEditMode(false);
                      setEditProduct(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      "+ Add Product"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {isLoading && !showModal && (
              <div className="mb-6 p-3 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading products...
              </div>
            )}

            <div className="w-full overflow-x-auto rounded-xl shadow-sm bg-white">
              <ProductTable
                products={filteredProducts}
                isLoading={isLoading}
                onEdit={handleEditProduct}
                onDelete={handleDeleteRequest}
              />
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-lg relative">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <ProductForm
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onCancel={() => setShowModal(false)}
                    isLoading={isLoading}
                    isEditMode={isEditMode}
                    productId={editProduct} // Pass full product object
                  />
                </div>
              </div>
            )}

            <ConfirmationModal
              isOpen={showConfirmModal}
              onCancel={() => setShowConfirmModal(false)}
              onConfirm={handleDeleteConfirmed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
