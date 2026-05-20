import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

import philUpLogo from "../assets/Phil Up 2.png";
import wave1 from "../assets/bottom wave 1.png";
import wave2 from "../assets/bottom wave 2.png";
import wave3 from "../assets/bottom wave 3.png";
import wave4 from "../assets/bottom wave 4.png";

import { isLoggedIn, getSessionUser, logoutSession } from "../utils/session";

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

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  const fields = [
  { label: "Username", value: user?.userName },
  { label: "First Name", value: user?.userFName },
  { label: "Last Name", value: user?.userLName },
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

  const handleLogout = () => {
    logoutSession();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background-color: #fffbf4; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <div
        style={{
          position: "fixed",
          zIndex: 300,
          width: "100vw",
          backgroundColor: "#fffbf4",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "1.5vw 2.5vw 0 2.5vw",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "25vw",
              height: "5vw",
              gap: "1vw",
            }}
          >
            <button
              onClick={() => {
                setMenuOpen((v) => !v);
                setSettingsOpen(false);
                setSearchOpen(false);
              }}
              style={{
                fontSize: "2vw",
                color: "#1c618c",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FaBars />
            </button>

            <button
              onClick={() => {
                setSearchOpen((v) => !v);
                setMenuOpen(false);
                setSettingsOpen(false);
              }}
              style={{
                fontSize: "2vw",
                color: "#1c618c",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FaSearch />
            </button>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "15vw",
                border: "none",
                outline: "none",
                color: "#1c618c",
                fontSize: "1vw",
                fontFamily: '"Roboto Mono", monospace',
                backgroundColor: "#fffbf4",
              }}
              placeholder="Search stations..."
            />
          </div>

          <div
            onClick={() => navigate("/")}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%) translateY(1vw)",
              zIndex: 400,
              cursor: "pointer",
            }}
          >
            <img
              src={philUpLogo}
              alt="Phil Up"
              style={{ width: "12.5vw", height: "12.5vw" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "25vw",
              height: "5vw",
              gap: "1vw",
            }}
          >
            <button
              style={{
                fontSize: "2vw",
                color: "#1c618c",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FaBell />
            </button>

            <button
              onClick={() => {
                setSettingsOpen((v) => !v);
                setMenuOpen(false);
                setSearchOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FaUserCircle style={{ fontSize: "2.3vw", color: "#1c618c" }} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "0 2.5vw" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div style={{ width: "25vw", borderTop: "0.25vw solid #1c618c", margin: "0.5vw 1vw" }} />
            <div style={{ width: "25vw", margin: "0.5vw 1vw" }} />
            <div style={{ width: "25vw", borderTop: "0.25vw solid #1c618c", margin: "0.5vw 1vw" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div style={{ width: "20vw", borderTop: "0.25vw solid #1c618c", margin: "0.5vw 1vw" }} />
            <div style={{ width: "20vw", margin: "0.5vw 1vw" }} />
            <div style={{ width: "20vw", margin: "0.5vw 1vw" }} />
            <div style={{ width: "20vw", borderTop: "0.25vw solid #1c618c", margin: "0.5vw 1vw" }} />
          </div>
        </div>

        {menuOpen && (
          <div
            style={{
              color: "#1c618c",
              fontWeight: 700,
              fontFamily: '"Roboto Mono", monospace',
              fontSize: "2vw",
              backgroundColor: "#fffbf4",
              width: "20.5vw",
              borderRadius: "0 0 2vw 2vw",
              border: "0.25vw solid #1c618c",
              padding: "2vw",
            }}
          >
            {["Top Lowest", "Most Visited", "Nearest", "Locations"].map((item) => (
              <p
                key={item}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/locations");
                }}
                style={{ cursor: "pointer", marginBottom: "0.5vw" }}
              >
                {item}
              </p>
            ))}

            <p style={{ cursor: "pointer", marginBottom: "0.5vw" }}>
              {user?.userName}
            </p>

            {user?.userPermissionLevel >= 50 && (
              <p
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin");
                }}
                style={{ cursor: "pointer", marginBottom: "0.5vw" }}
              >
                Switch as Admin
              </p>
            )}

            <p
              onClick={handleLogout}
              style={{ cursor: "pointer", marginBottom: "0.5vw" }}
            >
              Log Out
            </p>
          </div>
        )}

        {settingsOpen && (
          <div
            style={{
              color: "#1c618c",
              fontWeight: 700,
              fontFamily: '"Roboto Mono", monospace',
              fontSize: "2vw",
              backgroundColor: "#fffbf4",
              width: "20.5vw",
              borderRadius: "0 0 2vw 2vw",
              border: "0.25vw solid #1c618c",
              padding: "2vw",
              position: "absolute",
              right: "2.5vw",
            }}
          >
            <p
              onClick={() => {
                setSettingsOpen(false);
                navigate("/profile");
              }}
              style={{ cursor: "pointer", marginBottom: "0.5vw" }}
            >
              {user?.userName}
            </p>

            {user?.userPermissionLevel >= 50 && (
              <p
                onClick={() => {
                  setSettingsOpen(false);
                  navigate("/admin");
                }}
                style={{ cursor: "pointer", marginBottom: "0.5vw" }}
              >
                Switch as Admin
              </p>
            )}

            <p onClick={handleLogout} style={{ cursor: "pointer" }}>
              Log Out
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          paddingTop: "9vw",
          minHeight: "100vh",
          backgroundColor: "#fffbf4",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <img src={wave1} alt="" style={{ width: "140%", position: "absolute", bottom: "22vw", left: "-20%", opacity: 0.55 }} />
          <img src={wave2} alt="" style={{ width: "120%", position: "absolute", bottom: "13vw", left: 0, opacity: 0.7 }} />
          <img src={wave3} alt="" style={{ width: "125%", position: "absolute", bottom: "6vw", left: "-10%", opacity: 0.85 }} />
          <img src={wave4} alt="" style={{ width: "115%", position: "absolute", bottom: 0, left: 0 }} />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "4vw 5vw 6vw 5vw",
            gap: "4vw",
          }}
        >
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
            <div style={{ flex: 1 }}>
              {fields.map((f) => (
                <ProfileField key={f.label} label={f.label} value={f.value} />
              ))}
            </div>

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
                <span style={{ fontSize: "0.8vw", color: "#2a6aaa" }}>
                  Member Since
                </span>
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
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 5,
          width: "100vw",
          minHeight: "20vw",
          backgroundColor: "#fffbf4",
          fontSize: "1vw",
          fontFamily: '"Roboto Mono", monospace',
          color: "#1c618c",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-around",
          borderTop: "0.1vw solid #1c618c",
        }}
      >
        <div>
          <img
            src={philUpLogo}
            alt="Phil Up"
            style={{ width: "12.5vw", height: "12.5vw", margin: "2vw" }}
          />
        </div>

        <div style={{ width: "25vw" }}>
          <p><b>INFORMATION</b></p>
          <p>Partners</p>
          <p>About Us</p>
          <p>Area Coverage</p>
        </div>

        <div style={{ width: "25vw" }}>
          <p><b>CONTACT US</b></p>
          <p>+63905-505-0505</p>
          <p>[Address]</p>
          <p>philup_ph@gmail.com</p>
        </div>

        <div style={{ width: "25vw" }}>
          <div style={{ display: "flex", gap: "1vw", fontSize: "2vw", marginBottom: "1vw" }}>
            <FaFacebookSquare />
            <FaInstagramSquare />
            <FaLinkedin />
            <FaSquareXTwitter />
          </div>
          <p>2025 (c) PhilUp Philippines, All Rights Reserved</p>
        </div>
      </div>
    </>
  );
}