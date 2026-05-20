import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../../utils/session";
import AdminTablePage from "./AdminTablePage";

export default function AdminAdmins() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getSessionUser();

    if (!user || user.userPermissionLevel < 100) {
      navigate("/admin");
    }
  }, [navigate]);

  return <AdminTablePage tableKey="admins" />;
}