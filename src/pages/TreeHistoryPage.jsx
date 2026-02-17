//path:oudra-client(web app front end)/src/pages/TreeHistoryPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Filter, Download } from "lucide-react";
import { treeService } from "../services/treeService";

const TreeHistoryPage = () => {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const [treeHistory, setTreeHistory] = useState([]);
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    actionType: "",
    changedBy: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    fetchData();
  }, [treeId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [treeData, historyData] = await Promise.all([
        treeService.getTreeById(treeId),
        treeService.getTreeHistory(treeId)
      ]);
      setTree(treeData);
      setTreeHistory(historyData);
    } catch (err) {
      setError("Failed to load data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionTypeColor = (actionType) => {
    const colors = {
      'ManualEdit': 'bg-blue-100 text-blue-800',
      'Inspection': 'bg-green-100 text-green-800',
      'LifecycleUpdate': 'bg-purple-100 text-purple-800',
      'NoteAdded': 'bg-yellow-100 text-yellow-800',
      'StatusChange': 'bg-orange-100 text-orange-800',
      'Inoculated': 'bg-indigo-100 text-indigo-800'
    };
    return colors[actionType] || 'bg-gray-100 text-gray-800';
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredHistory = treeHistory.filter(history => {
    if (filters.actionType && history.actionType !== filters.actionType) return false;
    if (filters.changedBy && !history.changedBy?.toLowerCase().includes(filters.changedBy.toLowerCase())) return false;
    if (filters.startDate && new Date(history.timestamp) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(history.timestamp) > new Date(filters.endDate + 'T23:59:59')) return false;
    return true;
  });

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${treeId}-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/treeprofile/${treeId}`)}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Tree Profile
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tree History - {treeId}
                </h1>
                <p className="text-gray-600">Complete audit log for tree {treeId}</p>
              </div>
            </div>
            <button
              onClick={exportHistory}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <Filter size={20} className="text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                  <select
                    value={filters.actionType}
                    onChange={(e) => handleFilterChange('actionType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Actions</option>
                    <option value="ManualEdit">Manual Edit</option>
                    <option value="Inspection">Inspection</option>
                    <option value="LifecycleUpdate">Lifecycle Update</option>
                    <option value="NoteAdded">Note Added</option>
                    <option value="StatusChange">Status Change</option>
                    <option value="Inoculated">Inoculated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Changed By</label>
                  <input
                    type="text"
                    value={filters.changedBy}
                    onChange={(e) => handleFilterChange('changedBy', e.target.value)}
                    placeholder="Search user..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Activity History ({filteredHistory.length} entries)
              </h3>
            </div>
            
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No history found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No activity history matches your current filters.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredHistory.map((history) => (
                  <li key={history._id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionTypeColor(history.actionType)}`}>
                            {history.actionType}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDateTime(history.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{history.changedBy}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-800">{history.notes || 'No description provided'}</p>
                      </div>
                      {history.device && (
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            history.device === 'web' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {history.device === 'web' ? 'Web App' : 'Mobile App'}
                          </span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeHistoryPage;