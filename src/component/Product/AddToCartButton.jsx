// src/components/Product/AddToCartButton.jsx
import { useState } from "react";

const AddToCartButton = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      quantity
    });
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <div className="flex items-center border rounded">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-3 py-1 hover:bg-gray-100"
        >
          -
        </button>
        <span className="px-3">{quantity}</span>
        <button
          onClick={() => setQuantity(q => q + 1)}
          className="px-3 py-1 hover:bg-gray-100"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartButton;