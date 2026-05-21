import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../../utils/session";
import AdminRequestReviewPage from "./AdminRequestReviewPage";
import { showWarning } from "../../utils/swal";

export default function AdminPriceRequestPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAccess() {
      const user = getSessionUser();

      if (!user || user.userPermissionLevel < 50) {
        await showWarning(
          "Access Denied",
          "Only Admins and Super Admins can access price requests."
        );

        navigate("/", {
          replace: true
        });
      }
    }

    checkAccess();
  }, [navigate]);

  return <AdminRequestReviewPage type="price" />;
}