import React from 'react';
import { Pencil, Trash, Star } from 'lucide-react';

const FeedbackCardGrid = ({ feedbacks, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {feedbacks.map((fb) => (
        <div 
          key={fb._id} 
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
        >
          {/* Photo (if exists) - made smaller */}
          {fb.photoUrl && (
            <div className="h-32 overflow-hidden">
              <img 
                src={fb.photoUrl} 
                alt="Feedback" 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Compact Content */}
          <div className="p-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="text-xs font-semibold text-gray-800">
                  Order #{fb?.orderId?.orderId?.split('-')[1]}
                </h3>
                <p className="text-xs text-gray-500">
                  {new Date(fb.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < fb?.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{fb?.message}</p>

            {/* Compact Order Summary */}
            <div className="mb-2 border-t py-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Event:</span>
                <span className="text-gray-700 font-medium">{fb.orderId?.cart?.eventId?.title}</span>
              </div>
             
            </div>

            {/* Compact Action Buttons */}
            <div className="flex justify-end space-x-1">
              <button 
                onClick={() => onEdit(fb)}
                className="text-xs flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                <Pencil size={12} className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => onDelete(fb._id)}
                className="text-xs flex items-center px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
              >
                <Trash size={12} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackCardGrid;