// path: oudra-client/src/App.js
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

// =======================
// TREE & TASK MANAGEMENT
// =======================
import TreeMgtPage from "./pages/TreeMgtPage";
import TreeProfileScreen from "./pages/TreeProfileScreen";
import TreeObservationsPage from "./pages/TreeObservationsPage";
import TreeHistoryPage from "./pages/TreeHistoryPage";
import TasksPage from "./pages/TasksPage";
import OudraAdminDashboard from "./pages/OudraAdminDashboard";

// =======================
// INVESTOR MANAGEMENT
// =======================
import InvestorCertificateManager from "./pages/InvestorCertificateManager";
import CreateInvestorModal from "./component/Investor/CreateInvestorModal";

// =======================
// ADMIN PAGES
// =======================
import AdminEvents from "./pages/AdminEvents";
import AdminAddEvent from "./pages/AdminAddEvent";
import AdminProduct from "./pages/AdminProduct";
import AdminBills from "./pages/AdminBills";
import CustomerMgtPage from "./pages/CustomerMgtPage";

// =======================
// EMPLOYEE / DASHBOARD
// =======================
import Dashboard from "./pages/Dashboard";
import SalaryView from "./pages/EmployeePayroll";
// import CertificateCard from "./pages/CertificateCard";
import SettingsPage from "./pages/Settings";

// =======================
// CERTIFICATE & BLOCKCHAIN
// =======================
import Certificate from "./pages/Certificate";
//import SmartCertificate from "./pages/SmartCertificate";
import BlockchainInvestorPage from "./pages/BlockchainInvestorPage";

// =======================
// INVESTOR PORTAL
// =======================
import InvestorDashboard from "./pages/InvestorDashboard";

// =======================
// PUBLIC & USER PAGES
// =======================
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/SignInPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import ProfilePage from "./pages/CustomerProfilePage";
import Cart from "./pages/UserCart";
import Checkout from "./pages/Checkout";
import Invoice from "./pages/Invoice";
import OrderHistory from "./pages/OrderHistory";
import CustomerViewEvent from "./pages/CustomerViewEvent";
import CustomerProduct from "./pages/CustomerProduct";
import FeedbackListPage from "./pages/FeedbackListPage";

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

  // Hide header/footer for admin, investor & blockchain pages
  const hideHeaderFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/investor") ||
    location.pathname.startsWith("/certificates") ||
    location.pathname.startsWith("/smart-certificate") ||
    location.pathname.startsWith("/verify") ||
    location.pathname === "/dashboard" ||
    location.pathname === "/employee-payroll" ||
    location.pathname === "/settings" ||
    location.pathname === "/blockchain-investors" ||
    location.pathname === "/CertificateCard" ||
    location.pathname === "/investor-management" ||
    location.pathname.startsWith("/create-investor");

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: "#fff", color: "#363636" },
          success: {
            duration: 3000,
            iconTheme: { primary: "#4BB543", secondary: "#fff" },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: "#FF3333", secondary: "#fff" },
          },
        }}
      />

      {!hideHeaderFooter && <Header />}

      <Routes>
        {/* ========================
            INVESTOR MANAGEMENT
        ======================== */}
        <Route path="/investor-management" element={<InvestorCertificateManager />} />
        <Route
          path="/create-investor"
          element={<CreateInvestorModal isOpen={true} onClose={() => window.history.back()} />}
        />

        {/* ========================
            INVESTOR PORTAL
        ======================== */}
        <Route path="/investor/dashboard" element={<InvestorDashboard />} />

        {/* ========================
            BLOCKCHAIN & CERTIFICATES
        ======================== */}
        <Route path="/blockchain-investors" element={<BlockchainInvestorPage />} />
        <Route path="/certificates/:certificateId" element={<Certificate/>} />

        {/* ========================
            TREE MANAGEMENT
        ======================== */}
        <Route path="/treemgt" element={<TreeMgtPage />} />
        <Route path="/treeprofile/:treeId" element={<TreeProfileScreen />} />
        <Route path="/treeprofile/:treeId/observations" element={<TreeObservationsPage />} />
        <Route path="/treeprofile/:treeId/history" element={<TreeHistoryPage />} />
        <Route path="/taskmgt" element={<TasksPage />} />
        <Route path="/admindashboard" element={<OudraAdminDashboard />} />

        {/* ========================
            ADMIN
        ======================== */}
        <Route path="/adminevents" element={<AdminEvents />} />
        <Route path="/adminaddevent" element={<AdminAddEvent />} />
        <Route path="/adminproduct" element={<AdminProduct />} />
        <Route path="/admin-bills" element={<AdminBills />} />
        <Route path="/customers" element={<CustomerMgtPage />} />

        {/* ========================
            EMPLOYEE
        ======================== */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-payroll" element={<SalaryView />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* ========================
            USER
        ======================== */}
        <Route path="/customerprofile" element={<ProfilePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/feedback" element={<FeedbackListPage />} />

        {/* ========================
            PUBLIC
        ======================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/orders/:userId" element={<OrderHistory />} />
        <Route path="/customerviewevent" element={<CustomerViewEvent />} />
        <Route path="/customerproduct/:eventId/:eventName?" element={<CustomerProduct />} />

        {/* ========================
            AUTH
        ======================== */}
        <Route
          path="/signup"
          element={
            !userData
              ? <SignUpPage />
              : userData.role === "user"
              ? <Navigate to="/" />
              : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/signin"
          element={
            !userData
              ? <LoginPage />
              : userData.role === "user"
              ? <Navigate to="/" />
              : <Navigate to="/dashboard" />
          }
        />
        <Route path="/forgot-password/*" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

        {/* Redirects */}
        <Route path="/investors" element={<Navigate to="/investor-management" />} />
        <Route path="/investor-portal" element={<Navigate to="/investor/dashboard" />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
