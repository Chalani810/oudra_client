import React from "react";
//import Sidebar from "../component/SideBar";
import { Filter, Camera, FileText, Download, Plus, Minus, Layers } from "lucide-react";

const VirtualMapPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* <Sidebar />*/}

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Virtual Map View</h2>

          <div className="flex items-center gap-3">
            <button className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">
              <Camera size={18} className="mr-2" />
              Map Snapshot
            </button>

            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* MAP AREA */}
        <div className="p-6">
          <div className="relative bg-gray-200 rounded-xl shadow-sm w-full h-[550px] overflow-hidden">

            {/* Placeholder (will be replaced with Google Maps later) */}
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">
              <span>Google Map will render here</span>
            </div>

            {/* Floating Controls (Right side) */}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <button className="p-3 bg-white shadow-md rounded-lg hover:bg-gray-100"><Plus size={20} /></button>
              <button className="p-3 bg-white shadow-md rounded-lg hover:bg-gray-100"><Minus size={20} /></button>
              <button className="p-3 bg-white shadow-md rounded-lg hover:bg-gray-100"><Layers size={20} /></button>
            </div>

            {/* Generate Report & Export Map Buttons (Top center-right) */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/4 flex gap-3">
              <button className="flex items-center bg-white px-3 py-2 rounded-lg shadow hover:bg-gray-100">
                <FileText size={18} className="mr-2" />
                Generate Report
              </button>

              <button className="flex items-center bg-white px-3 py-2 rounded-lg shadow hover:bg-gray-100">
                <Download size={18} className="mr-2" />
                Export Map
              </button>
            </div>

            {/* Tree Status Legend (Bottom-left) */}
            <div className="absolute bottom-6 left-6 bg-white shadow-md rounded-xl p-4">
              <p className="font-semibold mb-2">Tree Status</p>
              <div className="space-y-2 text-sm">

                <div className="flex justify-between items-center w-40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full"></span> Healthy
                  </div>
                  <span>1245</span>
                </div>

                <div className="flex justify-between items-center w-40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span> Attention
                  </div>
                  <span>87</span>
                </div>

                <div className="flex justify-between items-center w-40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span> Critical
                  </div>
                  <span>23</span>
                </div>

                <div className="flex justify-between items-center w-40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-black rounded-full"></span> Archived
                  </div>
                  <span>45</span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VirtualMapPage;
