import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, getSessionUser } from "../utils/session";

export default function ProfilePage() {
  const navigate = useNavigate();

  const user = getSessionUser();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <main
      className="min-h-screen"
      style={{
        background: "#fffbf4",
        padding: "120px 40px",
        fontFamily: '"Roboto Mono", monospace',
        color: "#1c618c",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "30px",
          fontWeight: "700",
        }}
      >
        Profile
      </h1>

      <div
        style={{
          background: "white",
          maxWidth: "700px",
          padding: "30px",
          borderRadius: "20px",
          border: "3px solid #1c618c",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <p><strong>First Name:</strong> {user?.userFName}</p>

        <p><strong>Last Name:</strong> {user?.userLName}</p>

        <p><strong>Email:</strong> {user?.userEmail}</p>

        <p><strong>Username:</strong> {user?.userName}</p>

        <p><strong>Permission Level:</strong> {user?.userPermissionLevel}</p>
      </div>
    </main>
  );
}