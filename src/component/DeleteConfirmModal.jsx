import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "", // Optional: e.g., "Tree #123" to make it more specific
  isDeleting = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header with red accent */}
        <div className="bg-red-50 p-6 pb-4 flex flex-col items-center text-center relative">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
          
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-600" size={24} />
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
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:bg-red-400 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;