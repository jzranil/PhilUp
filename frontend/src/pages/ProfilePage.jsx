import { useState } from "react";
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

// Replace these with your actual asset paths
import philUpLogo from "../assets/Phil Up 2.png";
import wave1 from "../assets/bottom wave 1.png";
import wave2 from "../assets/bottom wave 2.png";
import wave3 from "../assets/bottom wave 3.png";
import wave4 from "../assets/bottom wave 4.png";

const profileData = {
  username: "JONATHAN43",
  fullName: "JONATHAN ANTHONY JESUS",
  email: "JONNY.JESUS@GMAIL.COM",
  birthday: "JUNE 27, 1969",
  contactNumber: "09112001297",
};

const fields = [
  { label: "Username", value: profileData.username },
  { label: "Full Name", value: profileData.fullName },
  { label: "E-Mail", value: profileData.email },
  { label: "Birthday", value: profileData.birthday },
  { label: "Contact Number", value: profileData.contactNumber },
];

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
        {value}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn] = useState(true);

  const toggleMenu = () => {
    setMenuOpen((v) => !v);
    setSettingsOpen(false);
    setSearchOpen(false);
  };

  const toggleSettings = () => {
    setSettingsOpen((v) => !v);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchIcon = () => {
    setSearchOpen((v) => !v);
    setMenuOpen(false);
    setSettingsOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background-color: #fffbf4; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* ====== FIXED NAVBAR (identical structure to HomePage) ====== */}
      <div
        style={{
          position: "fixed",
          zIndex: 300,
          width: "100vw",
          backgroundColor: "#fffbf4",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "1.5vw 2.5vw 0 2.5vw",
          }}
        >
          {/* Left: Hamburger + Search */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "25vw",
              height: "5vw",
              gap: "1vw",
            }}
          >
            <button
              onClick={toggleMenu}
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
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}
            >
              <button
                onClick={handleSearchIcon}
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
          </div>

          {/* Center: Logo */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <a
              href="/"
              style={{ position: "absolute", marginTop: "5vw", zIndex: 400 }}
            >
              <img
                src={philUpLogo}
                alt="Phil Up"
                style={{ width: "12.5vw", height: "12.5vw" }}
              />
            </a>
          </div>

          {/* Right: Bell + Profile */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "25vw",
              height: "5vw",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
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
                onClick={toggleSettings}
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
        </div>

        {/* Divider lines */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 2.5vw",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "25vw",
                borderTop: "0.25vw solid #1c618c",
                margin: "0.5vw 1vw",
              }}
            />
            <div style={{ width: "25vw", margin: "0.5vw 1vw" }} />
            <div
              style={{
                width: "25vw",
                borderTop: "0.25vw solid #1c618c",
                margin: "0.5vw 1vw",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "20vw",
                borderTop: "0.25vw solid #1c618c",
                margin: "0.5vw 1vw",
              }}
            />
            <div style={{ width: "20vw", margin: "0.5vw 1vw" }} />
            <div style={{ width: "20vw", margin: "0.5vw 1vw" }} />
            <div
              style={{
                width: "20vw",
                borderTop: "0.25vw solid #1c618c",
                margin: "0.5vw 1vw",
              }}
            />
          </div>
        </div>

        {/* Menu dropdown */}
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
              boxSizing: "border-box",
              marginLeft: "-0.25vw",
              padding: "2vw",
            }}
          >
            {[
              "Top Lowest",
              "Most Visited",
              "Favorites",
              "Nearest",
              "Locations",
            ].map((item) => (
              <p
                key={item}
                style={{ cursor: "pointer", marginBottom: "0.5vw" }}
              >
                {item}
              </p>
            ))}
          </div>
        )}

        {/* Settings dropdown */}
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
              boxSizing: "border-box",
              padding: "2vw",
              position: "absolute",
              right: "2.5vw",
            }}
          >
            {isLoggedIn ? (
              <>
                <a
                  href="/profile"
                  style={{
                    display: "block",
                    color: "#1c618c",
                    textDecoration: "none",
                    marginBottom: "0.5vw",
                  }}
                >
                  Profile
                </a>
                <a
                  href="/settings"
                  style={{
                    display: "block",
                    color: "#1c618c",
                    textDecoration: "none",
                  }}
                >
                  Settings
                </a>
              </>
            ) : (
              <a
                href="/login"
                style={{
                  display: "block",
                  color: "#1c618c",
                  textDecoration: "none",
                }}
              >
                Log In
              </a>
            )}
          </div>
        )}
      </div>

      {/* ====== PAGE BODY ====== */}
      <div
        style={{
          paddingTop: "9vw",
          minHeight: "100vh",
          backgroundColor: "#fffbf4",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Wave background */}
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
          <img
            src={wave1}
            alt=""
            style={{
              width: "140%",
              position: "absolute",
              bottom: "22vw",
              left: "-20%",
              opacity: 0.55,
            }}
          />
          <img
            src={wave2}
            alt=""
            style={{
              width: "120%",
              position: "absolute",
              bottom: "13vw",
              left: 0,
              opacity: 0.7,
            }}
          />
          <img
            src={wave3}
            alt=""
            style={{
              width: "125%",
              position: "absolute",
              bottom: "6vw",
              left: "-10%",
              opacity: 0.85,
            }}
          />
          <img
            src={wave4}
            alt=""
            style={{ width: "115%", position: "absolute", bottom: 0, left: 0 }}
          />
        </div>

        {/* Profile content */}
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

          {/* Info card */}
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
            {/* Left: fields */}
            <div style={{ flex: 1 }}>
              {fields.map((f) => (
                <ProfileField key={f.label} label={f.label} value={f.value} />
              ))}
            </div>

            {/* Right: actions + stats */}
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
              {/* Edit Profile button */}
              <button
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
                  letterSpacing: "0.04em",
                }}
              >
                Edit Profile
              </button>

              {/* Divider */}
              <div
                style={{ borderTop: "0.15vw solid #c8e0f0", margin: "0.5vw 0" }}
              />

              {/* Stats */}
              <p
                style={{
                  fontSize: "0.8vw",
                  fontFamily: '"Roboto Mono", monospace',
                  color: "#5a8ab0",
                  fontWeight: 700,
                  marginBottom: "0.3vw",
                }}
              >
                ACCOUNT STATS
              </p>

              {[
                { label: "Stations Visited", value: "12" },

                { label: "Member Since", value: "2024" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    backgroundColor: "#e8f4fc",
                    borderRadius: "0.6vw",
                    padding: "0.6vw 0.8vw",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8vw",
                      fontFamily: '"Roboto Mono", monospace',
                      color: "#2a6aaa",
                    }}
                  >
                    {stat.label}
                  </span>
                  <span
                    style={{
                      fontSize: "1vw",
                      fontFamily: '"Roboto Mono", monospace',
                      fontWeight: 700,
                      color: "#1c618c",
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}

              {/* Divider */}
              <div
                style={{ borderTop: "0.15vw solid #c8e0f0", margin: "0.5vw 0" }}
              />

              {/* Logout */}
              <button
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
                  letterSpacing: "0.04em",
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====== FOOTER (identical to HomePage) ====== */}
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
          <p>
            <b>INFORMATION</b>
          </p>
          <p>Partners</p>
          <p>About Us</p>
          <p>Area Coverage</p>
        </div>

        <div style={{ width: "25vw" }}>
          <p>
            <b>CONTACT US</b>
          </p>
          <p>+63905-505-0505</p>
          <p>[Address]</p>
          <p>philup_ph@gmail.com</p>
        </div>

        <div style={{ width: "25vw" }}>
          <div
            style={{
              display: "flex",
              gap: "1vw",
              fontSize: "2vw",
              marginBottom: "1vw",
            }}
          >
            <FaFacebookSquare />
            <FaInstagramSquare />
            <FaLinkedin />
            <FaSquareXTwitter />
          </div>
          <p>
            <a href="#" style={{ color: "#1c618c" }}>
              Terms &amp; Conditions
            </a>
            {" - "}
            <a href="#" style={{ color: "#1c618c" }}>
              Privacy Policy
            </a>
          </p>
          <p>2025 (c) PhilUp Philippines, All Rights Reserved</p>
        </div>
      </div>
    </>
  );
}
