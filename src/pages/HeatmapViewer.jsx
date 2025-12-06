import React, { useState, useRef, useEffect } from "react";
import SidePanel from "../component/SidePanel";
import ResinTopbar from "../component/Resin/ResinTopbar";
import { useParams } from "react-router-dom";
import { fetchAnalysisById } from "../api/resinApi";

const HeatmapViewer = () => {
  const { analysisId } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  // Zoom + Pan states
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Opacity (original image behind heatmap)
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAnalysisById(analysisId);
        setAnalysis(data);
      } catch (error) {
        console.error("Error loading heatmap viewer:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [analysisId]);

  if (loading || !analysis) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-green-600 rounded-full"></div>
        <span className="ml-3">Loading Heatmap Viewer...</span>
      </div>
    );
  }

  const handleMouseDown = (e) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    setTranslate((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel />

      <div className="flex-1 ml-64 flex flex-col">
        <ResinTopbar />

        <div className="p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Full Heatmap Viewer – Tree #{analysis.treeId}
            </h1>

            <a
              href={`/resin/tree/${analysis.treeId}`}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              ← Back to Resin Detail
            </a>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl p-4 shadow mb-6">
            <p className="text-lg font-semibold text-gray-800">Resin Score: {analysis.resinScore}%</p>
            <p className="text-gray-500">
              Risk Level: {analysis.riskLevel} | Model: {analysis.modelVersion}
            </p>
            <p className="text-gray-500">
              Analyzed on: {new Date(analysis.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Viewer */}
          <div
            className="relative bg-black rounded-xl overflow-hidden shadow-lg h-[600px] select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Original Image */}
            <img
              src={analysis.originalImageUrl}
              alt="Original"
              className="absolute top-0 left-0 w-full h-full object-contain"
              style={{
                opacity: 0.4,
              }}
            />

            {/* Heatmap (Moves & Zooms) */}
            <img
              src={analysis.heatmapUrl}
              alt="Heatmap"
              className="absolute top-0 left-0 object-contain"
              style={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: "center center",
                opacity: opacity,
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          {/* Controls */}
          <div className="mt-6 bg-white rounded-xl p-6 shadow grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Zoom Controls */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Zoom</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setScale((s) => s + 0.1)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  +
                </button>
                <button
                  onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  –
                </button>
              </div>
            </div>

            {/* Opacity Control */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Heatmap Opacity</h3>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Reset */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Actions</h3>
              <button
                onClick={resetView}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg w-full"
              >
                Reset View
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HeatmapViewer;
