import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, ShieldCheck, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import SidePanel from "../component/SidePanel";



const CreateInvestorLogin = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [grantedAccess, setGrantedAccess] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // API CONFIG
  const API_BASE_URL = "http://localhost:5000";
  const AUTH_URL = `${API_BASE_URL}/auth`;
  const INVESTOR_URL = `${API_BASE_URL}/api/investors`;

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  // Fetch investors
  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(INVESTOR_URL, getAuthHeader());
      const data = response.data.data || response.data;
      setInvestors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setMessage({ type: 'error', text: 'Failed to load investors list.' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Account Creation
  const handleCreateAccount = async (investorId, investorName) => {
    setSubmitting(investorId);
    setMessage({ type: '', text: '' });

    try {
      // This hits: POST http://localhost:5000/api/auth/create-account
      const response = await axios.post(
        `${AUTH_URL}/create-account`,
        {
          linkedRecordId: investorId,
          role: 'investor'
        },
        getAuthHeader()
      );

      toast.success(`Credentials generated for ${investorName}`);

      setGrantedAccess(prev => ({
        ...prev,
        [investorId]: true
      }));

      setMessage({
        type: 'success',
        text: `Success! Login created for ${investorName}. Temp Password: ${response.data.credentials.tempPassword}`
      });

      fetchInvestors();

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error creating account.';
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel />

      <div className="flex-1 overflow-auto ml-0 md:ml-64 p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 border-b pb-5">
          <div className="flex items-center gap-3">

            {/* Green Icon */}
            <div className="p-3 bg-green-600 text-white rounded-lg">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Investor Access Control
              </h2>
              <p className="text-gray-500 text-sm">
                Create and manage portal logins for registered investors.
              </p>
            </div>
          </div>

          <button
            onClick={fetchInvestors}
            className="text-sm text-green-600 hover:underline"
          >
            Refresh List
          </button>
        </div>

        {/* MESSAGE ALERT */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success'
              ? <CheckCircle size={20} />
              : <AlertCircle size={20} />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-hidden border border-gray-200 rounded-xl">

          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Investor Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Contact
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="animate-spin mx-auto mb-4 text-green-600" size={32} />
                    <p>Fetching investor records...</p>
                  </td>
                </tr>
              ) : investors.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    No investors found in the system.
                  </td>
                </tr>
              ) : (
                investors.map((inv) => (

                  <tr key={inv._id} className="hover:bg-gray-50">

                    {/* Investor */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">
                        {inv.name}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        ID: {inv.investorId || 'N/A'}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                        <Mail size={14} className="text-gray-400" />
                        {inv.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {inv.phone}
                      </div>
                    </td>

                    {/* Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleCreateAccount(inv._id, inv.name)}
                        disabled={submitting === inv._id || grantedAccess[inv._id]}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm text-white
                        ${
                          grantedAccess[inv._id]
                            ? "bg-green-700 cursor-default"
                            : "bg-emerald-700 hover:bg-emerald-800"
                        }`}
                      >

                        {submitting === inv._id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : grantedAccess[inv._id] ? (
                          <CheckCircle size={18} />
                        ) : (
                          <UserPlus size={18} />
                        )}

                        {grantedAccess[inv._id]
                          ? "Granted"
                          : "Grant Portal Access"}
                      </button>
                    </td>

                  </tr>

                ))
              )}

            </tbody>
          </table>

        </div>

        {/* SECURITY NOTE */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">

          <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />

          <div className="text-xs text-blue-800 space-y-1">

            <p><strong>Security Policy:</strong></p>

            <ul className="list-disc ml-4">
              <li>This action creates a User account linked to the Investor record.</li>
              <li>A temporary password is generated and sent via email automatically.</li>
              <li>Investors are restricted to the Web Application only.</li>
            </ul>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CreateInvestorLogin;