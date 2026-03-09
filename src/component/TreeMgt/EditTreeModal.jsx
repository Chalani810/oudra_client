// path: oudra-client/src/component/TreeMgt/EditTreeModal.jsx
import React, { useState, useEffect } from "react";
import { X, ExternalLink, ShieldCheck, Clock } from "lucide-react";
import { treeService } from "../../services/treeService";

const EditTreeModal = ({ isOpen, onClose, tree, onSave }) => {
  const [formData, setFormData] = useState({
    investorId: "",
    investorName: "",
    block: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tree && isOpen) {
      setFormData({
        investorId: tree.investorId || "",
        investorName: tree.investorName || "",
        block: tree.block || "",
      });
    }
  }, [tree, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await treeService.updateTree(tree.treeId, { ...formData, lastUpdatedBy: "web-admin" });
      onSave();
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update.');
    } finally { setIsSubmitting(false); }
  };

  if (!isOpen || !tree) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Edit Tree Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Blockchain Status Card */}
          <div className={`p-4 rounded-lg border flex items-center justify-between ${
            tree.blockchainStatus === 'Verified' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center gap-3">
              {tree.blockchainStatus === 'Verified' ? (
                <ShieldCheck className="text-green-600" size={24} />
              ) : (
                <Clock className="text-orange-600" size={24} />
              )}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Blockchain Status</p>
                <p className={`text-sm font-semibold ${
                  tree.blockchainStatus === 'Verified' ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {tree.blockchainStatus || 'Pending'}
                </p>
              </div>
            </div>
            
            {tree.blockchainTxHash && (
              <a 
                href={`https://amoy.polygonscan.com/tx/${tree.blockchainTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
              >
                Receipt <ExternalLink size={12} />
              </a>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
              <select
                name="block"
                value={formData.block}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {['A', 'B', 'C', 'D', 'E', 'F'].map(b => (
                  <option key={b} value={`Block-${b}`}>Block {b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investor ID</label>
              <input
                type="text"
                name="investorId"
                value={formData.investorId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 text-gray-600 border rounded-lg">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Update Tree"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTreeModal;