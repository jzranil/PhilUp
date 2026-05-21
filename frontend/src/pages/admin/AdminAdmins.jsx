import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../../utils/session";
import AdminTablePage from "./AdminTablePage";
import { showWarning } from "../../utils/swal";

export default function AdminAdmins() {

const navigate = useNavigate();

useEffect(() => {

async function checkAccess(){

 const user = getSessionUser();

 if(!user || user.userPermissionLevel < 100){

    await showWarning(
      "Access Denied",
      "Only Super Admins can access this page."
    );

    navigate("/admin");
 }

}

checkAccess();

}, [navigate]);

return <AdminTablePage tableKey="admins" />

}