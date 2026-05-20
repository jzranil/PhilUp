import { getSessionUser, logoutSession } from "../utils/session";
import { useNavigate } from "react-router-dom";

function ProfileField({ label, value }) {
  return (
    <div style={{ marginBottom: "1.2vw" }}>
      <p
        style={{
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontSize: "1.1vw",
          color: "#2a6aaa",
          marginBottom: "0.3vw",
        }}
      >
        {label}
      </p>
      <span
        style={{
          fontFamily: '"Roboto Mono", monospace',
          fontWeight: 700,
          fontSize: "1vw",
          color: "#1a4a7a",
          letterSpacing: "0.06em",
        }}
      >
        {value || "N/A"}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getSessionUser();

  if (!user) return null;

  // 1. Defined the missing handleLogout function
  const handleLogout = () => {
    logoutSession();
    navigate("/login");
  };

  const fields = [
    { label: "Username", value: user?.userName },
    { label: "Full Name", value: `${user?.userFName || ""} ${user?.userLName || ""}`.trim() },
    { label: "E-Mail", value: user?.userEmail },
    { label: "Address", value: user?.userAddress },
    { label: "Contact Number", value: user?.userContact },
    {
      label: "Role",
      value:
        user?.userPermissionLevel === 1
          ? "User"
          : user?.userPermissionLevel === 50
          ? "Admin"
          : user?.userPermissionLevel === 100
          ? "Super Admin"
          : "Unknown",
    },
  ];

  const memberSince = user?.dateCreated
    ? new Date(user.dateCreated).toLocaleDateString()
    : user?._id
    ? new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString()
    : "N/A";

  // 2. Added <> (React Fragment) to wrap the sibling elements
  return (
    <>
      {/* Avatar */}
      <div
        style={{
          width: "18vw",
          height: "18vw",
          borderRadius: "50%",
          background: "linear-gradient(160deg, #b8ddf5 30%, #7ab8d8 100%)",
          border: "0.4vw solid #90c8e8",
          flexShrink: 0,
          marginTop: "0.5vw",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 180 180" width="100%" height="100%">
          <circle cx="90" cy="65" r="40" fill="#5a9cc0" />
          <ellipse cx="90" cy="190" rx="70" ry="55" fill="#5a9cc0" />
        </svg>
      </div>

      {/* Profile Info Card */}
      <div
        style={{
          background: "#fffbf4",
          border: "0.2vw solid #2a6aaa",
          borderRadius: "1.2vw",
          padding: "2vw 2.5vw",
          width: "62vw",
          boxShadow: "0 0.3vw 1.2vw rgba(0,80,160,0.10)",
          display: "flex",
          gap: "3vw",
        }}
      >
        {/* Left: Profile Fields */}
        <div style={{ flex: 1 }}>
          {fields.map((f) => (
            <ProfileField key={f.label} label={f.label} value={f.value} />
          ))}
        </div>

        {/* Right: Actions & Stats */}
        <div
          style={{
            width: "18vw",
            display: "flex",
            flexDirection: "column",
            gap: "1vw",
            borderLeft: "0.15vw solid #c8e0f0",
            paddingLeft: "2vw",
          }}
        >
          <button
            onClick={() => navigate("/edit-profile")}
            style={{
              backgroundColor: "#1c618c",
              color: "#fffbf4",
              border: "none",
              borderRadius: "0.6vw",
              padding: "0.6vw 1vw",
              fontSize: "0.9vw",
              fontFamily: '"Roboto Mono", monospace',
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Edit Profile
          </button>

          <div style={{ borderTop: "0.15vw solid #c8e0f0", margin: "0.5vw 0" }} />

          <p
            style={{
              fontSize: "0.8vw",
              fontFamily: '"Roboto Mono", monospace',
              color: "#5a8ab0",
              fontWeight: 700,
            }}
          >
            ACCOUNT STATS
          </p>

          <div
            style={{
              backgroundColor: "#e8f4fc",
              borderRadius: "0.6vw",
              padding: "0.6vw 0.8vw",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.8vw", color: "#2a6aaa" }}>
              Stations Visited
            </span>
            <span style={{ fontSize: "1vw", fontWeight: 700, color: "#1c618c" }}>
              12
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#e8f4fc",
              borderRadius: "0.6vw",
              padding: "0.6vw 0.8vw",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.8vw", color: "#2a6aaa" }}>Member Since</span>
            <span style={{ fontSize: "1vw", fontWeight: 700, color: "#1c618c" }}>
              {memberSince}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              color: "#c0392b",
              border: "0.15vw solid #c0392b",
              borderRadius: "0.6vw",
              padding: "0.6vw 1vw",
              fontSize: "0.9vw",
              fontFamily: '"Roboto Mono", monospace',
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}