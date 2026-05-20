import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../../utils/session";
import AdminRequestReviewPage from "./AdminRequestReviewPage";

export default function AdminLocationRequestPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getSessionUser();

    if (!user || user.userPermissionLevel < 50) {
      navigate("/");
    }
  }, [navigate]);

  return <AdminRequestReviewPage type="location" />;
}