import { useState } from 'react';
import { useCart } from './CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      
      <div className="product-actions">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button 
          onClick={() => addToCart(product, quantity)}
          className="add-to-cart"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;