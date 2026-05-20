import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getSessionUser } from "../utils/session";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const user = getSessionUser();

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
  alert("Please fill all required fields.");
  return;
}

    if (!formData.userEmail.includes("@")) {
      alert("Email must contain @.");
      return;
    }

    if (!/^09\d{9}$/.test(formData.userContact)) {
      alert("Contact number must be 11 digits and start with 09.");
      return;
    }

    try {
      const userId = user?._id || user?.id || user?.userID;

if (!userId) {
  alert("User ID not found. Please log out and log in again.");
  return;
}

const res = await axios.put(
  `http://localhost:9000/api/users/${userId}`,
  formData
);

const updatedUser = res.data.user || res.data;
localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
alert(
  error.response?.data?.message ||
  error.response?.data?.errorMessage ||
  "Failed to update profile."
);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "0.9vw 1vw",
    marginBottom: "1vw",
    borderRadius: "0.7vw",
    border: "0.15vw solid #1c618c",
    outline: "none",
    fontFamily: '"Roboto Mono", monospace',
    color: "#1c618c",
    backgroundColor: "#fffbf4",
    fontWeight: 700,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#fffbf4",
        padding: "120px 40px",
        fontFamily: '"Roboto Mono", monospace',
        color: "#1c618c",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          border: "0.2vw solid #1c618c",
          borderRadius: "1.2vw",
          padding: "2.5vw",
          boxShadow: "0 0.3vw 1.2vw rgba(0,80,160,0.10)",
        }}
      >
        <h1 style={{ marginBottom: "2vw", fontSize: "2rem" }}>
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit}>

            <input
  name="userName"
  placeholder="Username"
  value={formData.userName}
  onChange={handleChange}
  style={inputStyle}
  required
/>

          <input
            name="userFName"
            placeholder="First Name"
            value={formData.userFName}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            name="userLName"
            placeholder="Last Name"
            value={formData.userLName}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            name="userEmail"
            type="email"
            placeholder="Email"
            value={formData.userEmail}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            name="userAddress"
            placeholder="Address"
            value={formData.userAddress}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="userContact"
            placeholder="Contact Number"
            value={formData.userContact}
            onChange={handleChange}
            style={inputStyle}
            maxLength={11}
            required
          />

          <div style={{ display: "flex", gap: "1vw", marginTop: "1vw" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "0.9vw",
                borderRadius: "0.7vw",
                border: "none",
                backgroundColor: "#1c618c",
                color: "#fffbf4",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Update
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              style={{
                flex: 1,
                padding: "0.9vw",
                borderRadius: "0.7vw",
                border: "0.15vw solid #1c618c",
                backgroundColor: "transparent",
                color: "#1c618c",
                fontWeight: 700,
                cursor: "pointer",
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