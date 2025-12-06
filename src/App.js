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

// Admin components
import AdminEvents from "./pages/AdminEvents";
import AdminAddEvent from "./pages/AdminAddEvent";
import AdminProduct from "./pages/AdminProduct";
import AdminBills from "./pages/AdminBills";

// Customer Management Components
import CustomerMgtPage from "./pages/CustomerMgtPage";

// Employee Management
import CertificateCard from "./pages/CertificateCard";
import Dashboard from "./pages/Dashboard";
import SalaryView from "./pages/EmployeePayroll";
import Certificate from "./pages/Certificate";

// Public pages
import AboutUs from "./pages/AboutUs";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";
import Checkout from "./pages/Checkout";
import FeedbackPage from "./pages/FeedbackListPage";
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

// Blockchain Investor Management
import BlockchainInvestorPage from "./pages/BlockchainInvestorPage";

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

  const hideHeaderFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/dashboard" ||
    location.pathname === "/employee-payroll" ||
    location.pathname === "/settings" ||
    location.pathname === "/CertificateCard" ||
    location.pathname === "/blockchain-investors" ||
    location.pathname.startsWith("/certificate");

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
        {/* Blockchain Investor Management */}
        <Route path="/blockchain-investors" element={<BlockchainInvestorPage />} />

        {/* Certificate Routes */}
        <Route path="/certificate/:investorId" element={<Certificate />} />
        <Route path="/verify/:blockHash" element={<Certificate />} />

        {/* Admin Routes */}
        <Route path="/adminevents" element={<AdminEvents />} />
        <Route path="/adminaddevent" element={<AdminAddEvent />} />
        <Route path="/adminproduct" element={<AdminProduct />} />
        <Route path="/admin-bills" element={<AdminBills />} />
        <Route
          path="/CertificateCard"
          element={
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
          }
        />
        <Route path="/employee-payroll" element={<SalaryView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerMgtPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* User Routes */}
        <Route path="/customerprofile" element={<ProfilePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/feedback" element={<FeedbackListPage />} />

        {/* Public / Mixed */}
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/orders/:userId" element={<OrderHistory />} />
        <Route path="/customerviewevent" element={<CustomerViewEvent />} />
        <Route path="/customerproduct/:eventId/:eventName?" element={<CustomerProduct />} />
        <Route path="/signup" element={!userData ? <SignUpPage /> : userData.role === "user" ? <Navigate to="/" /> : <Navigate to="/dashboard" />} />
        <Route path="/signin" element={!userData ? <LoginPage /> : userData.role === "user" ? <Navigate to="/" /> : <Navigate to="/dashboard" />} />
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
