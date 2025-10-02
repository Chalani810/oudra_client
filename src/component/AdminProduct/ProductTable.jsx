import React from "react";
import { FaCamera, FaEdit, FaTrash } from "react-icons/fa";

const ProductTable = ({ products, isLoading, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl shadow-sm bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-red-100 text-left border-b border-red-200">
            <th className="p-4 text-left font-medium">Photo</th>
            <th className="p-4 text-left font-medium">Product Name</th>
            <th className="p-4 text-left font-medium">Events</th>
            <th className="p-4 text-left font-medium">Stock</th>
            <th className="p-4 text-right font-medium">Price</th>
            <th className="p-4 text-left font-medium">Category</th>
            <th className="p-4 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-b last:border-b-0 hover:bg-white transition-all"
            >
              <td className="p-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {product.photoUrl ? (
                    <img
                      src={product.photoUrl}
                      alt={product.pname}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaCamera className="text-gray-400" />
                  )}
                </div>
              </td>
              <td className="p-4 font-medium text-gray-800">{product.pname}</td>
              <td className="p-4 text-gray-700">
                {Array.isArray(product.events) && product.events.length > 0
                  ? product.events
                      .map(event => event.title)
                      .join(", ")
                  : "None"}
              </td>
              <td className="p-4 text-gray-700">{product.stockqut}</td>
              <td className="p-4 text-right text-gray-700">
                {product.pprice ? Number(product.pprice).toFixed(2) : "0.00"}
              </td>
              <td className="p-4 text-gray-700">{product.category}</td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit Product"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete Product"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && !isLoading && (
        <div className="w-full text-center p-8">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;