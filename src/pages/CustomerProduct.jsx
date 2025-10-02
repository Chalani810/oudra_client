import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const apiUrl = "http://localhost:5000"; // Set your backend API base URL

const ProductPage = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { eventId, eventName } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiUrl}/product/by-event-category/${eventId}`
        );
        setGroupedProducts(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setGroupedProducts({});
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [eventId]);

  const addToCart = async (productId) => {
    if (!user) {
      navigate("/signin");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${apiUrl}/cart/${user.id}`,
        {
          productId,
          quantity: 1,
          eventId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">Browse Our {eventName} Products</h1>
        <p className="mt-4 text-gray-600">
          Find the perfect items for your event.
        </p>
      </header>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : Object.keys(groupedProducts).length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No products available for this event.</p>
        </div>
      ) : (
        Object.keys(groupedProducts).map((category) => (
          <div key={category} className="px-10 py-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {groupedProducts[category].map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={product.photoUrl}
                    alt={product.pname}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 flex flex-col justify-between w-full">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{product.pname}</h3>
                      <p className="text-lg font-semibold text-gray-900 mb-4">
                        LKR {product.pprice.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(product._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-fit"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductPage;