import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResinHistoryDetail = () => {
  const { analysisId } = useParams(); // /resin/history/:analysisId
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock API call — replace with Firestore call later
  const mockRecord = {
    analysisId: "A-12345",
    treeId: "T-01962",
    resinScore: 72,
    riskLevel: "High",
    confidence: 93,
    spreadPattern: "Partial",
    suggestedAction: "Recheck in 30 days",
    modelVersion: "v3.1.4",
    workerNotes: "Minor fungal marks on left trunk.",
    overrideScore: null,
    timestamp: "2025-01-12 10:32 AM",
    workerName: "Worker A",
    originalImageUrl: "/images/original.jpg",
    heatmapUrl: "/images/heatmap.jpg",
    aiOverlayUrl: "/images/overlay.jpg",
    auditLog: [
      {
        time: "10:35 AM",
        action: "AI analysis completed",
        details: "Model v3.1.4"
      },
      {
        time: "10:31 AM",
        action: "Image uploaded",
        details: "Worker A from Mobile"
      }
    ]
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      // simulate fetch delay
      await new Promise((r) => setTimeout(r, 400));
      setData(mockRecord);
      setLoading(false);
    }
    load();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-700">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
        <span className="ml-3 text-lg">Loading analysis details...</span>
      </div>
    );
  }

  return (
    <div className="p-6 ml-64 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">AI Resin Analysis Details</h1>
          <p className="text-gray-500">Analysis #{data.analysisId}</p>
        </div>
        <button
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* Analysis Summary Card */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center">
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Tree ID: {data.treeId}
            </h2>
            <p className="text-gray-500">Performed: {data.timestamp}</p>
            <p className="text-gray-500">By: {data.workerName}</p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-full text-white text-sm 
              ${data.riskLevel === "High" ? "bg-red-500" :
                data.riskLevel === "Medium" ? "bg-orange-400" :
                data.riskLevel === "Low" ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              {data.riskLevel} Risk
            </span>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800">{data.resinScore}%</p>
              <p className="text-sm text-gray-500">Resin Score</p>
            </div>
          </div>

        </div>
      </div>

      {/* Images: Original & Heatmap */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-3">Original Image</h3>
          <img
            src={data.originalImageUrl}
            alt="original"
            className="rounded-lg w-full h-80 object-cover"
          />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-3">AI Heatmap Output</h3>
          <img
            src={data.heatmapUrl}
            alt="heatmap"
            className="rounded-lg w-full h-80 object-cover"
          />

          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => navigate(`/resin/heatmap/${analysisId}`)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              View Full Heatmap
            </button>

            <button 
              onClick={() => navigate(`/resin/compare/${analysisId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Compare Original vs AI
            </button>
          </div>
        </div>

      </div>

      {/* Insights Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Analysis Insights</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p><strong>Resin Spread:</strong> {data.spreadPattern}</p>
            <p><strong>Suggested Action:</strong> {data.suggestedAction}</p>
          </div>
          
          <div>
            <p><strong>AI Confidence:</strong> {data.confidence}%</p>
            <p><strong>Model Version:</strong> {data.modelVersion}</p>
          </div>
        </div>

        {data.workerNotes && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700">Worker Notes:</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-md border mt-1">
              {data.workerNotes}
            </p>
          </div>
        )}
      </div>

      {/* Audit Log */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Audit Log</h3>

        <div className="space-y-3">
          {data.auditLog.map((log, i) => (
            <div key={i} className="border rounded-md p-3 bg-gray-50">
              <p className="font-semibold">{log.time}</p>
              <p className="text-gray-700">{log.action}</p>
              <p className="text-gray-500 text-sm">{log.details}</p>
            </div>
          ))}
        </div>

      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate(`/tree/${data.treeId}`)}
          className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-black"
        >
          Open Tree Profile
        </button>

        <button
          onClick={() => navigate(`/resin/history`)}
          className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back to History
        </button>
      </div>

    </div>
  );
};

export default ResinHistoryDetail;
