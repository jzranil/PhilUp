import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getSessionUser } from "../utils/session";
import {
  showSuccess,
  showError,
  showWarning,
  showConfirm,
} from "../utils/swal";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const user = getSessionUser();

  useEffect(() => {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };
}, []);

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    userFName: user?.userFName || "",
    userLName: user?.userLName || "",
    userEmail: user?.userEmail || "",
    userAddress: user?.userAddress || "",
    userContact: user?.userContact || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "userFName" || name === "userLName") {
      const cleaned = value.replace(/[^A-Za-z\s]/g, "").slice(0, 30);
      setFormData({ ...formData, [name]: cleaned });
      return;
    }

    if (name === "userContact") {
      const cleaned = value.replace(/\D/g, "").slice(0, 11);
      setFormData({ ...formData, [name]: cleaned });
      return;
    }

    if (name === "userEmail") {
      setFormData({ ...formData, [name]: value.slice(0, 50) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.userName ||
      !formData.userFName ||
      !formData.userLName ||
      !formData.userEmail ||
      !formData.userContact
    ) {
      await showWarning(
        "Missing Fields",
        "Please fill all required fields."
      );
      return;
    }

    if (!formData.userEmail.includes("@")) {
      await showWarning(
        "Invalid Email",
        "Email must contain @"
      );
      return;
    }

    if (!/^09\d{9}$/.test(formData.userContact)) {
      await showWarning(
        "Invalid Contact",
        "Contact number must start with 09 and contain 11 digits."
      );
      return;
    }

    try {
      const userId =
        user?._id ||
        user?.id ||
        user?.userID;

      if (!userId) {
        await showError(
          "User Missing",
          "Please login again."
        );
        return;
      }

      const confirmed = await showConfirm(
        "Update Profile?",
        "Save your profile changes?"
      );

      if (!confirmed) return;

      const res = await axios.put(
        `http://localhost:9000/api/users/${userId}`,
        formData
      );

      const updatedUser =
        res.data.user || res.data;

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      await showSuccess(
        "Profile Updated",
        "Your profile updated successfully."
      );

      navigate("/profile");

    } catch(error){

      await showError(
        "Update Failed",
        error.response?.data?.message ||
        "Unable to update profile."
      );

    }
  }

  const inputStyle = {
  width: "100%",
  height: "44px",
  padding: "8px 16px",
  marginBottom: "9px",
  border: "2px solid #15689b",
  borderRadius: "13px",
  fontSize: "0.95rem",
  color: "#15689b",
  fontWeight: "700",
  fontFamily: '"Roboto Mono", monospace',
  background: "#f7f3ed",
};

  return (

    <main
  style={{
    position: "fixed",
    inset: 0,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "130px",
    boxSizing: "border-box",
    zIndex: 5,
  }}
>

     <div
  style={{
    width: "650px",
    padding: "24px 34px",
    borderRadius: "25px",
    border: "3px solid #15689b",
    background: "#f7f7f7",
    color: "#15689b",
    fontFamily: '"Roboto Mono", monospace',
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
  }}
>

        <h1
          style={{
            textAlign:"center",
            fontSize:"2.5rem",
            marginBottom:"20px"
          }}
        >
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            name="userName"
            value={formData.userName}
            placeholder="Username"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="userFName"
            value={formData.userFName}
            placeholder="First Name"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="userLName"
            value={formData.userLName}
            placeholder="Last Name"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="userEmail"
            value={formData.userEmail}
            placeholder="Email"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="userAddress"
            value={formData.userAddress}
            placeholder="Address"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="userContact"
            value={formData.userContact}
            placeholder="Contact Number"
            onChange={handleChange}
            style={inputStyle}
          />

          <div
            style={{
              display:"flex",
              gap:"16px",
              marginTop:"20px"
            }}
          >

            <button
              type="submit"
              style={{
                flex:1,
                height:"50px",
                border:"none",
                borderRadius:"15px",
                background:"#15689b",
                color:"white",
                fontWeight:"700",
                cursor:"pointer"
              }}
            >
              Update
            </button>

            <button
              type="button"
              onClick={async()=>{

                const confirmed=
                await showConfirm(
                  "Discard Changes?",
                  "Unsaved changes will be lost."
                );

                if(confirmed){
                  navigate("/profile");
                }

              }}
              style={{
                flex:1,
                height:"50px",
                border:"2px solid #15689b",
                borderRadius:"15px",
                background:"transparent",
                color:"#15689b",
                fontWeight:"700",
                cursor:"pointer"
              }}
            >
              Back
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}