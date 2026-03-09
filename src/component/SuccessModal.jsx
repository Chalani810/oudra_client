import React from "react";
import { CheckCircle, X } from "lucide-react";

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title = "Success!", 
  message = "The action was completed successfully.",
  itemName = "" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header with green accent */}
        <div className="bg-green-50 p-6 pb-4 flex flex-col items-center text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          
          <h3 className="text-lg font-bold text-slate-800">
            {title}
          </h3>
        </div>

        {/* Body content */}
        <div className="p-6 pt-2 text-center text-slate-600">
          <p>{message}</p>
          {itemName && (
            <p className="mt-2 font-semibold text-slate-800 bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 inline-block">
              {itemName}
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 pt-0 flex justify-center">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
};

export default SuccessModal;