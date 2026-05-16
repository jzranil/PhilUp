import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import ProfilePage from "../pages/ProfilePage";
import LocationsPage from "../pages/LocationsPage";
import LocationDetailsPage from "../pages/LocationDetailsPage";
import UploadPricePage from "../pages/UploadPricePage";
import UploadLocationPage from "../pages/UploadLocationPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminLocationRequestPage from "../pages/admin/AdminLocationRequestPage";
import AdminPriceRequestPage from "../pages/admin/AdminPriceRequestPage";
import AdminReports from "../pages/admin/AdminReports";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/:locationId" element={<LocationDetailsPage />} />
        <Route path="/upload-price" element={<UploadPricePage />} />
        <Route path="/upload-location" element={<UploadLocationPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/location-requests" element={<AdminLocationRequestPage />} />
        <Route path="/admin/price-requests" element={<AdminPriceRequestPage />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
