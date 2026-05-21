import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayoutPage from "../pages/HomeLayoutPage"; 

import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import ProfilePage from "../pages/ProfilePage";
import LocationsPage from "../pages/LocationsPage";
import LocationDetailsPage from "../pages/LocationDetailsPage";
import UploadLocationPage from "../pages/UploadLocationPage";
import EditProfilePage from "../pages/EditProfilePage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminLocationRequestPage from "../pages/admin/AdminLocationRequestPage";
import AdminPriceRequestPage from "../pages/admin/AdminPriceRequestPage";
import AdminReports from "../pages/admin/AdminReports";
import AdminAdmins from "../pages/admin/AdminAdmins";
import AdminRegisteredLocations from "../pages/admin/AdminRegisteredLocations";
import AdminGasPrices from "../pages/admin/AdminGasPrices";
import AdminApprovals from "../pages/admin/AdminApprovals";
import AdminAdminLog from "../pages/admin/AdminAdminLog";
import AdminUserLog from "../pages/admin/AdminUserLog";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ── STANDALONE PAGES (No Navbar, No background waves) ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />

        {/* ── PROTECTED / PUBLIC APP PAGES (Wrapped inside HomeLayoutPage) ── */}
        <Route element={<HomeLayoutPage />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/locations/:locationId" element={<LocationDetailsPage />} />
          <Route path="/upload-location" element={<UploadLocationPage />} />
          {/* Adjusted to dynamically accept the parameter passed from LocationDetailsPage */}
        </Route>

        {/* ── ADMIN MANAGEMENT PANEL ROUTES ── */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/registered-users" element={<AdminUsers />} />
        <Route path="/admin/admins" element={<AdminAdmins />} />
        <Route path="/admin/registered-locations" element={<AdminRegisteredLocations />} />
        <Route path="/admin/gas-prices" element={<AdminGasPrices />} />
        <Route path="/admin/approvals" element={<AdminApprovals />} />
        <Route path="/admin/admin-log" element={<AdminAdminLog />} />
        <Route path="/admin/user-log" element={<AdminUserLog />} />
        <Route path="/admin/location-requests" element={<AdminLocationRequestPage />} />
        <Route path="/admin/price-requests" element={<AdminPriceRequestPage />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        {/* ── 404 CATCH-ALL ── */}
        <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;