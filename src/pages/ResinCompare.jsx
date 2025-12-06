import React, { useState, useEffect, useRef } from "react";
import SidePanel from "../component/SidePanel";
import ResinTopbar from "../component/Resin/ResinTopbar";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAnalysisById, downloadAnalysisReport } from "../api/resinApi";

const ResinCompare = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [opacity, setOpacity] = useState(0.7);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'original', 'overlay'
  const [isDragging, setIsDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAnalysisById(analysisId);
        setAnalysis(data);
      } catch (err) {
        console.error("Error loading compare data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [analysisId]);

  const handleSliderMove = (event) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let pos = ((event.clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    setSliderPosition(pos);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    const stopDragging = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleSliderMove);
      document.removeEventListener("mouseup", stopDragging);
    };
    
    document.addEventListener("mousemove", handleSliderMove);
    document.addEventListener("mouseup", stopDragging, { once: true });
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const result = await downloadAnalysisReport(analysisId, 'pdf');
      // Simulate download - in real app, you'd use the URL from result
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `resin-comparison-${analysis.treeId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getRiskLevelBadge = (riskLevel) => {
    const color = getRiskLevelColor(riskLevel);
    return `bg-${color}-100 text-${color}-800`;
  };

  if (loading || !analysis) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <SidePanel />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Comparison View...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidePanel />

      <div className="flex-1 ml-64 flex flex-col">
        <ResinTopbar />

        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Image Comparison – Tree #{analysis.treeId}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Analysis ID: {analysisId} • {new Date(analysis.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/resin/tree/${analysis.treeId}`)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center"
              >
                <span className="mr-2">←</span>
                Back to Tree
              </button>
              <button
                onClick={handleDownloadReport}
                disabled={downloading}
                className={`px-4 py-2 rounded-lg transition flex items-center ${
                  downloading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {downloading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📄</span>
                    Export PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Score & Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resin Score</p>
                  <p className="text-3xl font-bold text-green-600">{analysis.resinScore}%</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelBadge(analysis.riskLevel)}`}>
                  {analysis.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
              <p className="text-sm text-gray-600">Model Confidence</p>
              <p className="text-2xl font-bold text-blue-600">{analysis.modelConfidence}%</p>
              <p className="text-xs text-gray-500 mt-1">Version: {analysis.modelVersion}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
              <p className="text-sm text-gray-600">Analysis Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(analysis.timestamp).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(analysis.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Main Comparison Area */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Image Comparison</h2>
                
                {/* View Mode Toggle */}
                <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
                  {['split', 'original', 'overlay'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setViewMode(mode);
                        if (mode === 'original') setSliderPosition(0);
                        if (mode === 'overlay') setSliderPosition(100);
                        if (mode === 'split') setSliderPosition(50);
                      }}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                        viewMode === mode
                          ? 'bg-white text-gray-800 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison Container */}
            <div className="p-6">
              <div 
                ref={containerRef}
                className="relative w-full h-[600px] rounded-lg overflow-hidden border-2 border-gray-300 bg-black"
              >
                {/* Original Image - Always visible but controlled by slider */}
                <img
                  src={analysis.originalImageUrl}
                  alt="Original Tree Image"
                  className="absolute top-0 left-0 w-full h-full object-contain"
                />

                {/* AI Overlay - Controlled by slider and opacity */}
                <div
                  className="absolute top-0 left-0 h-full overflow-hidden transition-all duration-150"
                  style={{ 
                    width: viewMode === 'original' ? '0%' : 
                           viewMode === 'overlay' ? '100%' : `${sliderPosition}%` 
                  }}
                >
                  <img
                    src={analysis.aiOverlayUrl || analysis.heatmapUrl}
                    alt="AI Resin Analysis Overlay"
                    className="w-full h-full object-contain"
                    style={{ opacity: viewMode === 'original' ? 0 : opacity }}
                  />
                </div>

                {/* Slider Line - Only show in split mode */}
                {viewMode === 'split' && (
                  <div
                    className={`absolute top-0 bottom-0 w-1 bg-green-500 cursor-col-resize flex items-center justify-center transition-all ${
                      isDragging ? 'scale-110' : 'scale-100'
                    }`}
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={handleMouseDown}
                  >
                    <div className="w-3 h-12 bg-green-500 rounded-sm shadow-lg flex items-center justify-center">
                      <div className="w-1 h-6 bg-white bg-opacity-60 rounded"></div>
                    </div>
                    
                    {/* Slider handle dots */}
                    <div className="absolute -top-2 -left-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                )}

                {/* Position Indicator */}
                {viewMode === 'split' && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Split: {Math.round(sliderPosition)}%</span>
                    </div>
                  </div>
                )}

                {/* Mode Indicator */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
                </div>

                {/* Image Labels */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm">
                  📷 Original Image
                </div>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm">
                  🔍 AI Resin Analysis
                </div>
              </div>

              {/* Controls Panel */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Opacity Control */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Overlay Opacity</h3>
                    <span className="text-sm bg-white px-2 py-1 rounded border">
                      {Math.round(opacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Transparent</span>
                    <span>Opaque</span>
                  </div>
                </div>

                {/* Split Position Control */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Split Position</h3>
                    <span className="text-sm bg-white px-2 py-1 rounded border">
                      {Math.round(sliderPosition)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    disabled={viewMode !== 'split'}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Original</span>
                    <span>Overlay</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button 
                  onClick={() => {
                    setSliderPosition(50);
                    setOpacity(0.7);
                    setViewMode('split');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setOpacity(0.7)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Reset Opacity
                </button>
                <button 
                  onClick={() => setSliderPosition(50)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Reset Split
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Print View
                </button>
                <button 
                  onClick={() => navigate(`/resin/view/${analysisId}`)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                >
                  Full Heatmap
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Analysis Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Spread Pattern:</span>
                  <span className="font-medium">{analysis.spreadPattern || "Localized"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommended Action:</span>
                  <span className="font-medium text-blue-600">{analysis.recommendedAction || "Recheck in 30 days"}</span>
                </div>
                {analysis.workerNotes && (
                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-gray-600 block mb-2">Worker Notes:</span>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{analysis.workerNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Color Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">High resin concentration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-sm">Medium resin concentration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Low resin concentration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span className="text-sm">No significant resin detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom slider thumb styles */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default ResinCompare;