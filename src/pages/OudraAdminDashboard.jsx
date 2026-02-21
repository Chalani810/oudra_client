//path:oudra-client/src/pages/OudraAdminDashboard.jsx
import React, { useState, useEffect } from "react";
//import Sidebar from "../component/SidePanel";
import { Filter, Camera, FileText, Download, Plus, Minus, Layers } from "lucide-react";
import TreeMap from "../component/TreeMap/TreeMap";
import { treeService } from "../services/treeService";
import SidePanel from "../component/SidePanel"; 

const OudraAdminDashboard = () => {
  const [stats, setStats] = useState({
    healthy: 0,
    warning: 0,
    damaged: 0,
    dead: 0,
    totalWithGPS: 0,
    totalTrees: 0,
    harvestedTrees: 0 // Track separately but don't show on map
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const trees = await treeService.getAllTrees();
      
      // Count only ACTIVE trees with GPS (exclude harvested)
      const activeTreesWithGPS = trees.filter(t => 
        t.gps && 
        t.gps.lat !== 0 && 
        t.lifecycleStatus !== 'Harvested'
      );
      
      const stats = {
        // Only count health statuses for ACTIVE trees (not harvested)
        healthy: trees.filter(t => 
          t.healthStatus === 'Healthy' && 
          t.lifecycleStatus !== 'Harvested'
        ).length,
        warning: trees.filter(t => 
          t.healthStatus === 'Warning' && 
          t.lifecycleStatus !== 'Harvested'
        ).length,
        damaged: trees.filter(t => 
          t.healthStatus === 'Damaged' && 
          t.lifecycleStatus !== 'Harvested'
        ).length,
        dead: trees.filter(t => 
          t.healthStatus === 'Dead' && 
          t.lifecycleStatus !== 'Harvested'
        ).length,
        
        // Separate tracking
        totalWithGPS: activeTreesWithGPS.length,
        totalTrees: trees.length,
        harvestedTrees: trees.filter(t => t.lifecycleStatus === 'Harvested').length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    alert('Report generation feature coming soon');
  };

  const handleExportMap = () => {
    alert('Map export feature coming soon');
  };

  const handleMapSnapshot = () => {
    alert('Map snapshot feature coming soon');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Side Panel */}
      <SidePanel />
      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Virtual Tree Map</h2>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? 'Loading...' : (
                <>
                  {stats.totalWithGPS} active trees mapped
                  {stats.harvestedTrees > 0 && (
                    <span className="text-gray-500 ml-2">
                      ({stats.harvestedTrees} harvested trees hidden)
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleMapSnapshot}
              className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Camera size={18} className="mr-2" />
              Snapshot
            </button>

            <button 
              onClick={() => fetchStats()}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh data"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* MAP AREA */}
        <div className="p-6">
          <div className="relative bg-white rounded-xl shadow-sm w-full h-[600px] overflow-hidden">
            
            {/* Google Map Component */}
            <TreeMap />

            {/* Action Buttons (Top center) */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
              <button 
                onClick={handleGenerateReport}
                className="flex items-center bg-white px-3 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                <FileText size={18} className="mr-2" />
                Generate Report
              </button>

              <button 
                onClick={handleExportMap}
                className="flex items-center bg-white px-3 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                <Download size={18} className="mr-2" />
                Export Map
              </button>
            </div>

            {/* Tree Health Status Legend (Bottom-left) */}
            <div className="absolute bottom-6 left-6 bg-white shadow-md rounded-xl p-4 z-10">
              <p className="font-semibold mb-3 text-gray-800">Tree Health Status</p>
              <div className="space-y-2 text-sm">
                {/* Healthy - Green */}
                <div className="flex justify-between items-center w-48">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-gray-700">Healthy</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.healthy}</span>
                </div>

                {/* Warning - Yellow */}
                <div className="flex justify-between items-center w-48">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="text-gray-700">Warning</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.warning}</span>
                </div>

                {/* Damaged - Orange (matching marker color) */}
                <div className="flex justify-between items-center w-48">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    <span className="text-gray-700">Damaged</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.damaged}</span>
                </div>

                {/* Dead - Red (matching marker color) */}
                <div className="flex justify-between items-center w-48">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-gray-700">Dead</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.dead}</span>
                </div>
              </div>

              {/* Info note about harvested trees */}
              {stats.harvestedTrees > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    * {stats.harvestedTrees} harvested tree{stats.harvestedTrees !== 1 ? 's' : ''} not shown on map
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OudraAdminDashboard;