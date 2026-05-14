import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";

// Import other pages as you create them:
// import LoginPage from "../pages/LoginPage";
// import ProfilePage from "../pages/ProfilePage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* The index route (the first thing people see) */}
        <Route path="/" element={<HomePage />} />

        {/* Example of how to add future routes:
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
        */}

        {/* 404 Page Catch-all */}
        <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;