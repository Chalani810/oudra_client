import React from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// MAIN COMPONENT WRAPPER
const ResinDashboardComponents = ({
  stats,
  distribution,
  unhealthyTrend,
  latestResults,
  alerts,
}) => {
  // Default data in case props are not provided
  const defaultStats = {
    totalAnalyses: '1.2.47',
    highRiskTrees: '2.8',
    avgScore: '3.7',
    pendingAnalyses: '2'
  };

  const defaultDistribution = [
    { name: 'High Resin Formation SXR', value: 687 },
    { name: 'Low Reference Resin Translation SXR', value: 360 }
  ];

  const defaultUnhealthyTrend = [
    { week: 'Week 2', value: 10 },
    { week: 'Week 4', value: 7 },
    { week: 'Week 6', value: 5 },
    { week: 'Week 8', value: 2 }
  ];

  const defaultLatestResults = [
    { treeId: 'T-01962', score: 0.2, level: 'High', worker: 'AVA Card', time: '2 hours ago' },
    { treeId: 'T-01524', score: 0.1, level: 'Medium', worker: 'Multi Card', time: '1 hour ago' },
    { treeId: 'T-01967', score: 7.8, level: 'Low', worker: 'Mobile Drive', time: '4 hours ago' },
    { treeId: 'T-01421', score: 0.5, level: 'High', worker: 'Errors Waves', time: '2 hours ago' },
    { treeId: 'T-01868', score: 0.5, level: 'Medium', worker: 'Motor', time: '6 hours ago' },
    { treeId: 'T-01773', score: 0.5, level: 'High', worker: 'U.S. Addresses', time: '7 hours ago' }
  ];

  const defaultAlerts = [
    { message: 'Tree T-01324 shows critical resin score', time: '15 min ago', type: 'critical' },
    { message: 'Section B-12 requires immediate inspection', time: '1 hour ago', type: 'critical' },
    { message: 'Tree T-01527 productivity dropped 40%', time: '2 hours ago', type: 'critical' },
    { message: 'New AI model update available', time: '3 hours ago', type: 'info' }
  ];

  // Use provided data or defaults
  const currentStats = stats || defaultStats;
  const currentDistribution = distribution || defaultDistribution;
  const currentTrend = unhealthyTrend || defaultUnhealthyTrend;
  const currentResults = latestResults || defaultLatestResults;
  const currentAlerts = alerts || defaultAlerts;

  // Colors for pie chart
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

  return (
    <div className="resin-dashboard-components">
      {/* ========================= */}
      {/*     TOP STAT CARDS       */}
      {/* ========================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{currentStats.totalAnalyses}</div>
          <div className="stat-label">Total AI Analyses Today</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{currentStats.highRiskTrees}</div>
          <div className="stat-label">High-risk Resin Trees</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{currentStats.avgScore}</div>
          <div className="stat-label">Average Resin Score</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{currentStats.pendingAnalyses}</div>
          <div className="stat-label">Finding Analyses Amitting #</div>
        </div>
      </div>

      {/* ========================= */}
      {/*      RESIN CHARTS         */}
      {/* ========================= */}
      <div className="content-grid">
        {/* Left Column - Distribution and Trends */}
        <div className="charts-column">
          {/* Distribution Chart */}
          <div className="chart-section">
            <h3 className="section-title">Resin Score Distribution</h3>
            <p className="chart-subtitle">Based on Latest All Resin Score for Tree</p>
            
            <div className="distribution-container">
              <div className="pie-chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={currentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {currentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="distribution-list">
                {currentDistribution.map((item, index) => (
                  <div key={index} className="distribution-item">
                    <div className="distribution-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <div className="distribution-info">
                      <div className="distribution-label">{item.name}</div>
                      <div className="distribution-value">{item.value} trees</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unhealthy Trees Trend */}
          <div className="chart-section">
            <h3 className="section-title">Unhealthy Trees Over Time</h3>
            <p className="chart-subtitle">Resin Number Marked Health Status (Unhealthy / Emergent / All Risk)</p>
            
            <div className="line-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={currentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#667eea" 
                    strokeWidth={2}
                    dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#667eea' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Critical Alerts */}
        <div className="alerts-column">
          <div className="alerts-section">
            <h3 className="section-title">Critical Alerts</h3>
            
            <div className="alerts-list">
              {currentAlerts.length === 0 ? (
                <p className="no-alerts">No critical alerts</p>
              ) : (
                currentAlerts.map((alert, index) => (
                  <div key={index} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      {alert.type === 'critical' ? '⚠️' : 'ℹ️'}
                    </div>
                    <div className="alert-content">
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-time">{alert.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="view-all">
              <button className="view-all-btn">View All Alerts</button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/*   LATEST AI RESULTS       */}
      {/* ========================= */}
      <div className="table-section">
        <h3 className="section-title">Latest AI Results</h3>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tree ID</th>
                <th>Score</th>
                <th>Risk Level</th>
                <th>Worker</th>
                <th>Timestamp</th>
                <th>Test</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.length > 0 ? (
                currentResults.map((row, index) => (
                  <tr key={index}>
                    <td>{row.treeId}</td>
                    <td>{row.score}</td>
                    <td className={`risk-level ${row.level?.toLowerCase()}`}>
                      {row.level}
                    </td>
                    <td>{row.worker}</td>
                    <td>{row.time}</td>
                    <td className="test-action">→</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No Records Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="view-all">
          <button className="view-all-btn">View All Results</button>
        </div>
      </div>

      <style jsx>{`
        .resin-dashboard-components {
          width: 100%;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .chart-section, .alerts-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .chart-subtitle {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        /* Distribution */
        .distribution-container {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .pie-chart-container {
          flex: 1;
          max-width: 200px;
        }

        .distribution-list {
          flex: 2;
        }

        .distribution-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }

        .distribution-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .distribution-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .distribution-label {
          font-weight: 500;
          color: #333;
        }

        .distribution-value {
          color: #667eea;
          font-weight: 600;
        }

        /* Line Chart */
        .line-chart-container {
          height: 200px;
          margin-top: 20px;
        }

        /* Alerts */
        .alerts-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .alert-item {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          margin-bottom: 15px;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          border-radius: 5px;
        }

        .alert-item.critical {
          background: #f8d7da;
          border-left-color: #dc3545;
        }

        .alert-item.info {
          background: #d1ecf1;
          border-left-color: #17a2b8;
        }

        .alert-icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }

        .alert-content {
          flex: 1;
        }

        .alert-message {
          font-weight: 500;
          margin-bottom: 5px;
          color: #333;
        }

        .alert-time {
          color: #666;
          font-size: 0.8rem;
        }

        .no-alerts {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 20px;
        }

        /* Table */
        .table-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .table-container {
          margin: 20px 0;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .data-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .data-table tr:hover {
          background-color: #f8f9fa;
        }

        .risk-level.high {
          color: #e74c3c;
          font-weight: 600;
        }

        .risk-level.medium {
          color: #f39c12;
          font-weight: 600;
        }

        .risk-level.low {
          color: #27ae60;
          font-weight: 600;
        }

        .test-action {
          color: #667eea;
          font-weight: bold;
          cursor: pointer;
        }

        .no-data {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 20px;
        }

        /* View All Buttons */
        .view-all {
          text-align: center;
          margin-top: 15px;
        }

        .view-all-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .view-all-btn:hover {
          background: #5a6fd8;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .distribution-container {
            flex-direction: column;
          }
          
          .pie-chart-container {
            max-width: 100%;
          }
          
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default ResinDashboardComponents;