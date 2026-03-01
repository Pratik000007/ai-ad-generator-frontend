import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateAd from "./pages/CreateAd";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import MyAds from "./pages/MyAds";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import ForgotPassword from "./pages/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>

        {/* 🌍 Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* 🔐 Login Route with Role-Based Redirect */}
        <Route
          path="/login"
          element={
            !token ? (
              <Login />
            ) : role === "ADMIN" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* 🔐 Register Route with Role-Based Redirect */}
        <Route
          path="/register"
          element={
            !token ? (
              <Register />
            ) : role === "ADMIN" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* 🔒 USER Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-ad"
          element={
            <ProtectedRoute>
              <CreateAd />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-ads"
          element={
            <ProtectedRoute>
              <MyAds />
            </ProtectedRoute>
          }
        />

        {/* 🔒 ADMIN Protected Route */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 🚫 Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />

  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;