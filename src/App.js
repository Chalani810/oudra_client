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
import AdminNavbar from "./component/AdminEvent/Navbar";
import AdminRoute from "./component/AdminRoute";
import UserRoute from "./component/UserRoute";

// Admin components
import AdminEvents from "./pages/AdminEvents";
import AdminAddEvent from "./pages/AdminAddEvent";
import AdminProduct from "./pages/AdminProduct";
import AdminBills from "./pages/AdminBills";

// Customer Management Components
import CustomerMgtPage from "./pages/CustomerMgtPage";
import CustomerTable from "./component/CustomerMgt/CustomerTable";

// Employee Management
import EmployeeManagement from "./pages/EmployeeManagement";
import Dashboard from "./pages/Dashboard";
import SalaryView from "./pages/EmployeePayroll";

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
  const isEventAdminPage =
    location.pathname === "/adminevents" ||
    location.pathname === "/adminaddevent";
  const isCustomerAdminPage = location.pathname === "/customers";
  const isPasswordResetPage = location.pathname.startsWith("/forgot-password");

  const userData = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4BB543",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#FF3333",
              secondary: "#fff",
            },
          },
          loading: {
            duration: 5000,
          },
        }}
      />
      {location.pathname !== "/adminEvents" &&
        location.pathname !== "/AdminAddEvent" &&
        location.pathname !== "/AdminProduct" &&
        location.pathname !== "/AdminProduct" &&
        location.pathname !== "/EmployeeManagement" &&
        location.pathname !== "/admin-bills" &&
        location.pathname !== "/employee-payroll" &&
        location.pathname !== "/EmployeeManagement" &&
        location.pathname !== "/dashboard" &&
        location.pathname !== "/settings" &&
        !isEventAdminPage &&
        !isCustomerAdminPage && <Header />}

      <Routes>
        <Route
          path="/adminEvents"
          element={
            <AdminRoute>
              <AdminEvents />
            </AdminRoute>
          }
        />
        <Route
          path="/adminproduct"
          element={
            <AdminRoute>
              <AdminProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-bills"
          element={
            <AdminRoute>
              <AdminBills />
            </AdminRoute>
          }
        />
        <Route
          path="/employeeManagement"
          element={
            <AdminRoute>
              <EmployeeManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/employee-payroll"
          element={
            <AdminRoute>
              <SalaryView />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <AdminRoute>
              <CustomerMgtPage />
            </AdminRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AdminRoute>
              <SettingsPage />
            </AdminRoute>
          }
        />


        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/orders/:userId" element={<OrderHistory />} />

        <Route path="/customerviewevent" element={<CustomerViewEvent />} />
        <Route
          path="/customerproduct/:eventId/:eventName?"
          element={<CustomerProduct />}
        />

        <Route
          path="/customerprofile"
          element={
            <UserRoute>
              <ProfilePage />
            </UserRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <UserRoute>
              <Cart />
            </UserRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <UserRoute>
              <Checkout />
            </UserRoute>
          }
        />
  <Route
          path="/invoice"
          element={
            <UserRoute>
              <Invoice />
            </UserRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <UserRoute>
              <FeedbackListPage />
            </UserRoute>
          }
        />

        <Route
          path="/signup"
          element={
            !userData ? (
              <SignUpPage />
            ) : userData?.role == "user" ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/signin"
          element={
            !userData ? (
              <LoginPage />
            ) : userData?.role == "user" ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route path="/forgot-password/*" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
      {location.pathname !== "/admin-bills" &&
        location.pathname !== "/adminEvents" &&
        location.pathname !== "/AdminAddEvent" &&
        location.pathname !== "/AdminProduct" &&
        location.pathname !== "/EmployeeManagement" &&
        location.pathname !== "/employee-payroll" &&
        location.pathname !== "/dashboard" &&
        location.pathname !== "/settings" &&
        !isEventAdminPage &&
        !isCustomerAdminPage && <Footer />}
    </>
  );
}
export default App;