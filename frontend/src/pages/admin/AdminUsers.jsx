import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../../utils/session";
import AdminTablePage from "./AdminTablePage";

export default function AdminUsers() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getSessionUser();

    if (!user || user.userPermissionLevel < 50) {
      navigate("/");
    }
  }, [navigate]);

  return <AdminTablePage tableKey="registered-users" />;
}