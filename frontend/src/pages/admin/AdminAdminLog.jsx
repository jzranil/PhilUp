import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../../utils/session";
import AdminTablePage from "./AdminTablePage";
import { showWarning } from "../../utils/swal";

export default function AdminAdminLog() {
  const navigate = useNavigate();

  useEffect(() => {

    async function checkAccess(){

      const user = getSessionUser();

      if (!user || user.userPermissionLevel < 50) {

        await showWarning(
          "Access Denied",
          "Only Admins can access this page."
        );

        navigate("/admin");
      }

    }

    checkAccess();

  }, [navigate]);

  return <AdminTablePage tableKey="admin-log" />;
}