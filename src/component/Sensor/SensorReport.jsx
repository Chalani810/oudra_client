import React, { useRef } from 'react';

// Copy the threshold functions from IotSensorData
const getPHStatus = (ph) => {
  if (ph < 3.8 || ph > 6.5) return "Critical";
  if ((ph >= 3.8 && ph < 4.5) || (ph > 6.0 && ph <= 6.5)) return "Warning";
  return "Normal";
};

const getTemperatureStatus = (temp) => {
  if (temp < 20 || temp > 46) return "Critical";
  if ((temp >= 20 && temp < 25) || (temp > 40 && temp <= 46)) return "Warning";
  return "Normal";
};

const getMoistureStatus = (moisture) => {
  if (moisture < 60 || moisture > 90) return "Critical";
  if ((moisture >= 60 && moisture < 70) || (moisture > 85 && moisture <= 90)) return "Warning";
  return "Normal";
};

const getHumidityStatus = (humidity) => {
  if (humidity < 50 || humidity > 90) return "Critical";
  if ((humidity >= 50 && humidity < 70) || (humidity > 80 && humidity <= 90)) return "Warning";
  return "Normal";
};

const calculateOverallStatus = (row) => {
  const statuses = [
    getPHStatus(row.ph),
    getTemperatureStatus(row.temperature),
    getMoistureStatus(row.soilMoisture),
    getHumidityStatus(row.humidity),
  ];

  if (statuses.includes("Critical")) return "Critical";
  if (statuses.includes("Warning")) return "Warning";
  return "Normal";
};

const SimpleReport = ({ data, onClose }) => {
  const reportRef = useRef();
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Count trees by status
  const normalTrees = data.filter(row => calculateOverallStatus(row) === "Normal").length;
  const warningTrees = data.filter(row => calculateOverallStatus(row) === "Warning").length;
  const criticalTrees = data.filter(row => calculateOverallStatus(row) === "Critical").length;

  // Simple PDF download using browser's print function
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>IoT Sensor Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #166534; margin-bottom: 5px; }
            h2 { color: #333; margin-top: 20px; margin-bottom: 10px; }
            h3 { color: #444; margin-top: 15px; margin-bottom: 8px; }
            .header { text-align: center; margin-bottom: 20px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat-box { text-align: center; padding: 10px; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .status-normal { background-color: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 3px; }
            .status-warning { background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 3px; }
            .status-critical { background-color: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 3px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            .summary { margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>IoT Sensor Data Report</h1>
            <p>Generated on: ${currentDate} at ${currentTime}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Trees: ${data.length}</p>
            <p>Healthy: ${normalTrees} | Warning: ${warningTrees} | Critical: ${criticalTrees}</p>
          </div>
          
          <h2>Sensor Data</h2>
          <table>
            <thead>
              <tr>
                <th>Tree ID</th>
                <th>Block</th>
                <th>Temp (°C)</th>
                <th>Humidity (%)</th>
                <th>pH</th>
                <th>Soil Moisture</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(row => {
                const status = calculateOverallStatus(row);
                let statusClass = '';
                if (status === 'Normal') statusClass = 'status-normal';
                if (status === 'Warning') statusClass = 'status-warning';
                if (status === 'Critical') statusClass = 'status-critical';
                
                return `
                  <tr>
                    <td>${row.treeId}</td>
                    <td>${row.block}</td>
                    <td>${row.temperature}</td>
                    <td>${row.humidity}</td>
                    <td>${row.ph}</td>
                    <td>${row.soilMoisture}</td>
                    <td><span class="${statusClass}">${status}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Report generated by IoT Sensor Monitoring System</p>
            <p>${currentDate} ${currentTime}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-green-800 text-white">
          <div>
            <h2 className="text-xl font-bold">Sensor Report</h2>
            <p className="text-sm opacity-90">Generated: {currentDate} {currentTime}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-auto p-6" ref={reportRef}>
          <div className="space-y-6">
            {/* Report Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">IoT Sensor Data Report</h1>
              <p className="text-gray-600">Comprehensive analysis of tree sensor data</p>
              
              {/* Simple Stats */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-gray-800">{data.length}</div>
                  <div className="text-sm text-gray-600">Total Trees</div>
                </div>
                <div className="bg-green-50 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-green-600">{normalTrees}</div>
                  <div className="text-sm text-green-700">Healthy</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-yellow-600">{warningTrees}</div>
                  <div className="text-sm text-yellow-700">Warning</div>
                </div>
                <div className="bg-red-50 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-red-600">{criticalTrees}</div>
                  <div className="text-sm text-red-700">Critical</div>
                </div>
              </div>
            </div>

            {/* Main Data Table */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Sensor Data</h3>
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Tree ID</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Block</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Temp (°C)</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Humidity (%)</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">pH</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Soil Moisture</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row) => {
                      const status = calculateOverallStatus(row);
                      return (
                        <tr key={row.treeId} className="border">
                          <td className="px-4 py-2 border">{row.treeId}</td>
                          <td className="px-4 py-2 border">{row.block}</td>
                          <td className="px-4 py-2 border">{row.temperature}°C</td>
                          <td className="px-4 py-2 border">{row.humidity}%</td>
                          <td className="px-4 py-2 border">{row.ph}</td>
                          <td className="px-4 py-2 border">{row.soilMoisture}%</td>
                          <td className="px-4 py-2 border">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              status === "Normal"
                                ? "bg-green-100 text-green-700"
                                : status === "Warning"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-800 mb-2">Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Total trees monitored: {data.length}</p>
                <p>• Healthy trees: {normalTrees}</p>
                <p>• Warning trees: {warningTrees}</p>
                <p>• Critical trees: {criticalTrees}</p>
                {criticalTrees > 0 && (
                  <p className="text-red-600 font-medium">
                    • Immediate action required for {criticalTrees} critical tree(s)
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t">
              <p>Generated by IoT Sensor Monitoring System</p>
              <p>Report Date: {currentDate} | Time: {currentTime}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t flex justify-between bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
          >
            Close
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Print Report
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900 text-sm font-medium"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleReport;