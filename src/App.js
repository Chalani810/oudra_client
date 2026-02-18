//path: oudra-client(web app front end)/src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import "./index.css";

// Global components
import Header from "./component/Header";
import Footer from "./component/Footer";
import AdminRoute from "./component/AdminRoute";
import UserRoute from "./component/UserRoute";

import WeatherPage from "./pages/WeatherPage";
import TreeMgtPage from "./pages/TreeMgtPage";
import TreeProfileScreen from "./pages/TreeProfileScreen";
import OudraAdminDashboard from "./pages/OudraAdminDashboard";
import TreeObservationsPage from "./pages/TreeObservationsPage";
import TreeHistoryPage from "./pages/TreeHistoryPage"; 
import TasksPage from "./pages/TasksPage";
import EmployeeMgtPage from "./pages/EmployeeMgtPage";
import AdminEvents from "./pages/AdminEvents";
import AdminAddEvent from "./pages/AdminAddEvent";
import AdminProduct from "./pages/AdminProduct";
import AdminBills from "./pages/AdminBills";


// Customer Management Components
import CustomerMgtPage from "./pages/CustomerMgtPage";
//admin sensor table
import IoTSensorData from "./pages/IoTSensorData";

// Employee Management
import CertificateCard from "./pages/CertificateCard";
import Dashboard from "./pages/Dashboard";
import SalaryView from "./pages/EmployeePayroll";

import ResinDashboard from "./pages/ResinDashboard";
import ResinDetail from "./pages/ResinDetail";
import ResinCompare from "./pages/ResinCompare";
import HeatmapViewer from "./pages/HeatmapViewer";
import ResinHistoryDetail from "./pages/ResinHistoryDetail";
import ResinAnalysisTable from "./pages/ResinAnalysisTable";

// Public pages
import AboutUs from "./pages/AboutUs";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";
import Checkout from "./pages/Checkout";
import FeedbackListPage from "./pages/FeedbackListPage";
import ProfilePage from "./pages/CustomerProfilePage";
import Cart from "./pages/UserCart";
import Invoice from "./pages/Invoice";
import OrderHistory from "./pages/OrderHistory";
import CustomerViewEvent from "./pages/CustomerViewEvent";
import CustomerProduct from "./pages/CustomerProduct";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import SettingsPage from "./pages/Settings";


import { CartProvider } from "./CartContext";

function App() {
  return (
    <Router>
      <CartProvider>
        <AppWithRoutes />
      </CartProvider>
    </Router>
  );
}

function AppWithRoutes() {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("user"));

  // Header/Footer rendering condition
  const hideHeaderFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/dashboard" ||
    location.pathname === "/employee-payroll" ||
    location.pathname === "/settings" ||
    location.pathname === "/resin-dashboard" ||
    location.pathname.startsWith("/resin-details")||
    location.pathname === "/resin-compare" ||
    location.pathname === "/heatmap-viewer" ||
    location.pathname === "/resin-history-detail" ||
    location.pathname === "/resin-analysis-table" ||
    location.pathname === "/IoTSensorData" ||
    location.pathname === "/treemgt" ||
    location.pathname === "/admindashboard" ||
    location.pathname === "/taskmgt" ||
    location.pathname === "/employee-mgt" ||
    location.pathname === "/CertificateCard";

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: "#fff", color: "#363636" },
          success: { duration: 3000, iconTheme: { primary: "#4BB543", secondary: "#fff" } },
          error: { duration: 4000, iconTheme: { primary: "#FF3333", secondary: "#fff" } },
          loading: { duration: 5000 },
        }}
      />
      {!hideHeaderFooter && <Header />}

      <Routes>
        {/* Admin Routes */}

       <Route 
          path="/resin-dashboard" 
          element={
            <AdminRoute>
              <ResinDashboard />
            </AdminRoute>
          } 
        />

          <Route 
          path="/resin-details/:treeId" 
          element={
            <AdminRoute>
              <ResinDetail />
            </AdminRoute>
             }
           />


        <Route 
          path="/resin-compare" 
          element={ 
            <AdminRoute>
              <ResinCompare />
            </AdminRoute>
          } 
        />

        <Route 
          path="/heatmap-viewer" 
          element={
            <AdminRoute>
              <HeatmapViewer />
            </AdminRoute>
          } 
        />

        <Route 
          path="/resin-history-detail" 
          element={
            <AdminRoute>
              <ResinHistoryDetail />
            </AdminRoute>
          } 
        />

        <Route 
          path="/resin-analysis-table" 
          element={
            <AdminRoute>
              <ResinAnalysisTable />
            </AdminRoute>
          } 
        />

        <Route path="/treemgt" element={<AdminRoute><TreeMgtPage /></AdminRoute>} />
        <Route path="/treeprofile/:treeId" element={<AdminRoute><TreeProfileScreen /></AdminRoute>} />
        <Route path="/admindashboard" element={<AdminRoute><OudraAdminDashboard /></AdminRoute>} />
        <Route path="/treeprofile/:treeId/observations" element={<AdminRoute><TreeObservationsPage /></AdminRoute>} />
        <Route path="/treeprofile/:treeId/history" element={<AdminRoute><TreeHistoryPage /></AdminRoute>} />
        <Route path="/taskmgt" element={<AdminRoute><TasksPage /></AdminRoute>} />
        <Route path="/employee-mgt" element={<AdminRoute><EmployeeMgtPage /></AdminRoute>} />
        <Route path="/adminevents" element={<AdminRoute><AdminEvents /></AdminRoute>} />
        <Route path="/adminaddevent" element={<AdminRoute><AdminAddEvent /></AdminRoute>} />
        <Route path="/adminproduct" element={<AdminRoute><AdminProduct /></AdminRoute>} />
        <Route path="/admin-bills" element={<AdminRoute><AdminBills /></AdminRoute>} />
        <Route
          path="/CertificateCard"
          element={
            <AdminRoute>
              <CertificateCard
                certificate={{
                  _id: "CERT123",
                  treeId: "TR-001",
                  owner: "John Doe",
                  species: "Aquilaria Malaccensis",
                  plantingDate: "2022-05-10",
                  status: "Approved",
                  resinQuality: "A",
                  resinYield: 25,
                  gpsCoordinates: { latitude: 7.8731, longitude: 80.7718 },
                }}
                showActions={true}
              />
            </AdminRoute>
          }
        />
        <Route path="/employee-payroll" element={<AdminRoute><SalaryView /></AdminRoute>} />
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/customers" element={<AdminRoute><CustomerMgtPage /></AdminRoute>} />
        <Route path="/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
        

        {/* User Routes */}
        <Route path="/customerprofile" element={<UserRoute><ProfilePage /></UserRoute>} />
        <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
        <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
        <Route path="/invoice" element={<UserRoute><Invoice /></UserRoute>} />
        <Route path="/feedback" element={<UserRoute><FeedbackListPage /></UserRoute>} />
        <Route path="/IoTSensorData" element={<AdminRoute><IoTSensorData /></AdminRoute>} />

        {/* Weather Route - Using the new WeatherPage */}
        <Route path="/weather" element={<WeatherPage />} />

        {/* Public / Mixed Routes */}
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/orders/:userId" element={<OrderHistory />} />
        <Route path="/customerviewevent" element={<CustomerViewEvent />} />
        <Route path="/customerproduct/:eventId/:eventName?" element={<CustomerProduct />} />
        <Route 
          path="/signup" 
          element={
            !userData ? <SignUpPage /> : 
            userData.role === "user" ? <Navigate to="/" /> : <Navigate to="/dashboard" />
          } 
        />
        <Route 
          path="/signin" 
          element={
            !userData ? <LoginPage /> : 
            userData.role === "user" ? <Navigate to="/" /> : <Navigate to="/dashboard" />
          } 
        />
        <Route path="/forgot-password/*" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
