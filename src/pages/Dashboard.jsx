import Header from "../component/Header";
import StatsCard from "../component/StatsCard";
import LineChart from "../component/LineChart";
import PieChart from "../component/PieChart";
import PopularProducts from "../component/PopularProducts";
import CustomerList from "../component/CustomerList";
import Sidebar from "../component/AdminEvent/Sidebar";
import PredictPage from './PredictPage';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 ml-64"> {/* Add ml-64 to account for sidebar width */}


          {/* Add PredictForm here */}
          <div className="mt-8">
            <PredictPage />
          </div>

        </div>
      </div>
    </div>
  );
}
