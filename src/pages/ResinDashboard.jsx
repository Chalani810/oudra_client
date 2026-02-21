import React, { useState, useEffect } from 'react';
import ResinDashboardComponents from '../component/Resin/ResinDashboardComponents';
import SidePanel from "../component/SidePanel";
import ResinTopbar from '../component/Resin/ResinTopbar';

const ResinDashboard = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    distribution: [],
    unhealthyTrend: [],
    latestResults: [],
    alerts: []
  });

  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const mockData = {
    stats: {
      totalAnalyses: '1.2.47',
      highRiskTrees: '2.8',
      avgScore: '3.7',
      pendingAnalyses: '2'
    },
    distribution: [
      { name: 'High Resin Formation SXR', value: 687, color: '#FF6B6B' },
      { name: 'Low Reference Resin Translation SXR', value: 360, color: '#4ECDC4' }
    ],
    unhealthyTrend: [
      { week: 'Week 2', value: 10 },
      { week: 'Week 4', value: 7 },
      { week: 'Week 6', value: 5 },
      { week: 'Week 8', value: 2 }
    ],
    latestResults: [
      { 
        treeId: 'T-01962', 
        score: 0.2, 
        level: 'High', 
        worker: 'AVA Card', 
        time: '2 hours ago'
      },
      { 
        treeId: 'T-01524', 
        score: 0.1, 
        level: 'Medium', 
        worker: 'Multi Card', 
        time: '1 hour ago'
      },
      { 
        treeId: 'T-01967', 
        score: 7.8, 
        level: 'Low', 
        worker: 'Mobile Drive', 
        time: '4 hours ago'
      },
      { 
        treeId: 'T-01421', 
        score: 0.5, 
        level: 'High', 
        worker: 'Errors Waves', 
        time: '2 hours ago'
      },
      { 
        treeId: 'T-01868', 
        score: 0.5, 
        level: 'Medium', 
        worker: 'Motor', 
        time: '6 hours ago'
      },
      { 
        treeId: 'T-01773', 
        score: 0.5, 
        level: 'High', 
        worker: 'U.S. Addresses', 
        time: '7 hours ago'
      }
    ],
    alerts: [
      { 
        id: 1, 
        message: 'Tree T-01324 shows critical resin score', 
        time: '15 min ago', 
        type: 'critical'
      },
      { 
        id: 2, 
        message: 'Section B-12 requires immediate inspection', 
        time: '1 hour ago', 
        type: 'critical'
      },
      { 
        id: 3, 
        message: 'Tree T-01527 productivity dropped 40%', 
        time: '2 hours ago', 
        type: 'critical'
      },
      { 
        id: 4, 
        message: 'New AI model update available', 
        time: '3 hours ago', 
        type: 'info'
      }
    ]
  };

  // Simulate API call
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Resin Analysis Dashboard...</p>
      </div>
    );
  }

    return (
    <div className="flex min-h-screen">
      {/* Side Panel */}
      <SidePanel />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Resin Topbar */}
        <ResinTopbar />
        
        {/* Dashboard Content */}
        <div className="flex-1 resin-dashboard">
          {/* Dashboard Components */}
          <ResinDashboardComponents 
            stats={dashboardData.stats}
            distribution={dashboardData.distribution}
            unhealthyTrend={dashboardData.unhealthyTrend}
            latestResults={dashboardData.latestResults}
            alerts={dashboardData.alerts}
          />

          <style jsx>{`
            .resin-dashboard {
              min-height: calc(100vh - 80px);
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
            }

            .dashboard-loading {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              color: white;
            }

            .loading-spinner {
              width: 50px;
              height: 50px;
              border: 4px solid rgba(255, 255, 255, 0.3);
              border-top: 4px solid white;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 20px;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default ResinDashboard;