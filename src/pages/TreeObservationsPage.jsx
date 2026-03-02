//path: oudra-client(web app front end)/src/component/pages/TreeObservationsPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, FileText } from "lucide-react";
import { treeService } from "../services/treeService";

const TreeObservationsPage = () => {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const [observations, setObservations] = useState([]);
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  fetchData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
}, [treeId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [treeData, observationsData] = await Promise.all([
        treeService.getTreeById(treeId),
        treeService.getTreeObservations(treeId)
      ]);
      setTree(treeData);
      setObservations(observationsData);
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

  const getObservationTypeColor = (type) => {
    const colors = {
      'Routine': 'bg-blue-100 text-blue-800',
      'Disease': 'bg-red-100 text-red-800',
      'Pest': 'bg-orange-100 text-orange-800',
      'Fertilizer': 'bg-green-100 text-green-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
                  Field Notes - {treeId}
                </h1>
                <p className="text-gray-600">Observations and notes from field workers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Summary Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{observations.length}</div>
                  <div className="text-sm text-gray-500">Total Notes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {observations.filter(obs => obs.healthStatus === 'Healthy').length}
                  </div>
                  <div className="text-sm text-gray-500">Healthy Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {observations.filter(obs => obs.healthStatus === 'Warning').length}
                  </div>
                  <div className="text-sm text-gray-500">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {observations.filter(obs => obs.healthStatus === 'Damaged' || obs.healthStatus === 'Dead').length}
                  </div>
                  <div className="text-sm text-gray-500">Issues Reported</div>
                </div>
              </div>
            </div>
          </div>

          {/* Observations List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {observations.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No observations</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No field notes have been added for this tree yet.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {observations.map((observation) => (
                  <li key={observation._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getObservationTypeColor(observation.type)}`}>
                            {observation.type}
                          </span>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            observation.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                            observation.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                            observation.healthStatus === 'Damaged' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {observation.healthStatus}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDateTime(observation.timestamp)}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-800">{observation.notes}</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>By {observation.observedBy}</span>
                        {observation.images && observation.images.length > 0 && (
                          <span className="ml-4">
                            📷 {observation.images.length} photo(s)
                          </span>
                        )}
                      </div>
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

export default TreeObservationsPage;
