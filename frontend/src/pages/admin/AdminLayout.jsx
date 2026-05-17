import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  User,
} from "lucide-react";

import PhilUpLogo from "../../assets/Phil UP 2.png";
import SearchIcon from "../../assets/search.png";

const tableLinks = [
  { label: "Registered Users", path: "/admin/registered-users" },
  { label: "Admins", path: "/admin/admins" },
  { label: "Registered Locations", path: "/admin/registered-locations" },
  { label: "Gas Prices", path: "/admin/gas-prices" },
  { label: "Approvals", path: "/admin/approvals" },
  { label: "Admin Log", path: "/admin/admin-log" },
  { label: "User Log", path: "/admin/user-log" },
];

const mainNavLinks = [
  { label: "Price Change Requests", path: "/admin/price-requests" },
  { label: "Station Location Requests", path: "/admin/location-requests" },
  { label: "Account", path: "/profile" },
  { label: "Switch as User", path: "/" },
];

const linkStyle = ({ isActive }) => ({
  display: "block",
  color: isActive ? "#1c618c" : "#3178ad",
  fontSize: "0.9vw",
  fontWeight: isActive ? 700 : 400,
  marginBottom: "0.35vw",
});

const Waves = () => (
  <div
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100vw",
      zIndex: 0,
      pointerEvents: "none",
    }}
  >
    <svg
      viewBox="0 0 1440 220"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%" }}
    >
      <path
        d="M0,85 C180,165 360,22 540,85 C720,148 900,22 1080,85 C1200,124 1360,55 1440,85 L1440,220 L0,220 Z"
        fill="#a1e3f9"
        opacity="0.55"
      />
      <path
        d="M0,115 C240,52 480,175 720,115 C960,55 1200,175 1440,115 L1440,220 L0,220 Z"
        fill="#3178ad"
        opacity="0.45"
      />
      <path
        d="M0,145 C200,112 400,170 600,145 C800,120 1000,165 1200,145 C1320,130 1400,152 1440,145 L1440,220 L0,220 Z"
        fill="#1c618c"
        opacity="0.65"
      />
    </svg>
  </div>
);

export default function AdminLayout({
  children,
  searchQuery = "",
  onSearchChange,
}) {
  const [tablesOpen, setTablesOpen] = useState(true);

  return (
    <div
      style={{
        fontFamily: '"Roboto Mono", monospace',
        backgroundColor: "#fffbf4",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=ZCOOL+QingKe+HuangYou&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 0; }
        a { text-decoration: none; color: inherit; }
        .nav-btn { background: none; border: none; cursor: pointer; color: #1c618c; display: flex; align-items: center; }
        .nav-btn:hover, .sb-item:hover { opacity: 0.7; }
        .sb-item { cursor: pointer; transition: opacity .15s; }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          zIndex: 300,
          backgroundColor: "#fffbf4",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5vw 2.5vw 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8vw",
              width: "25vw",
            }}
          >
            <button className="nav-btn" aria-label="Open menu">
              <Menu size="1.8vw" />
            </button>
            <img
              src={SearchIcon}
              alt=""
              style={{
                width: "1.5vw",
                height: "1.5vw",
                objectFit: "contain",
              }}
            />
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search admin tables..."
              style={{
                border: "none",
                outline: "none",
                color: "#1c618c",
                fontSize: "1vw",
                fontFamily: '"Roboto Mono", monospace',
                backgroundColor: "#fffbf4",
                width: "14vw",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Link
              to="/admin"
              style={{ position: "absolute", top: "0.5vw", zIndex: 301 }}
            >
              <img
                src={PhilUpLogo}
                alt="Phil UP Logo"
                style={{ width: "6vw", height: "auto", objectFit: "contain" }}
              />
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1.5vw",
              width: "25vw",
            }}
          >
            <button className="nav-btn" aria-label="Notifications">
              <Bell size="1.8vw" />
            </button>
            <button className="nav-btn" aria-label="Admin account">
              <User size="2.1vw" />
            </button>
          </div>
        </div>

        <div style={{ padding: "0 2.5vw" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                width: "25vw",
                height: 0,
                border: "0.22vw solid #1c618c",
                margin: "0.85vw 1vw",
              }}
            />
            <div style={{ width: "25vw", margin: "0.85vw 1vw" }} />
            <div
              style={{
                width: "25vw",
                height: 0,
                border: "0.22vw solid #1c618c",
                margin: "0.85vw 1vw",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                width: "20vw",
                height: 0,
                border: "0.22vw solid #1c618c",
                margin: "0.5vw 1vw",
              }}
            />
            <div style={{ width: "20vw", margin: "0.5vw 1vw" }} />
            <div style={{ width: "20vw", margin: "0.5vw 1vw" }} />
            <div
              style={{
                width: "20vw",
                height: 0,
                border: "0.22vw solid #1c618c",
                margin: "0.5vw 1vw",
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          paddingTop: "8.8vw",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        <aside
          style={{
            width: "13vw",
            flexShrink: 0,
            border: "0.2vw solid #1c618c",
            borderRadius: "0 1vw 1vw 0",
            margin: "0.5vw 0 1vw 0.4vw",
            padding: "1.3vw 1vw",
            fontSize: "1.05vw",
            color: "#1c618c",
            alignSelf: "flex-start",
            backgroundColor: "#fffbf4",
          }}
        >
          <NavLink
            to="/admin"
            className="sb-item"
            style={({ isActive }) => ({
              display: "block",
              color: "#1c618c",
              fontWeight: 700,
              marginBottom: "1vw",
              opacity: isActive ? 1 : undefined,
            })}
          >
            Dashboard
          </NavLink>

          <div style={{ marginBottom: "0.6vw" }}>
            <button
              type="button"
              className="sb-item"
              onClick={() => setTablesOpen((value) => !value)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                border: "none",
                background: "transparent",
                color: "#1c618c",
                fontFamily: '"Roboto Mono", monospace',
                fontSize: "1.05vw",
                fontWeight: 700,
                marginBottom: "0.4vw",
              }}
            >
              <span>Tables</span>
              {tablesOpen ? (
                <ChevronUp size="0.95vw" />
              ) : (
                <ChevronDown size="0.95vw" />
              )}
            </button>
            {tablesOpen && (
              <div style={{ paddingLeft: "1vw" }}>
                {tableLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="sb-item"
                    style={linkStyle}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {mainNavLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="sb-item"
              style={({ isActive }) => ({
                display: "block",
                color: "#1c618c",
                fontWeight: 700,
                marginBottom: "0.85vw",
                opacity: isActive ? 1 : undefined,
              })}
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            to="/login"
            className="sb-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45vw",
              fontWeight: 700,
              marginTop: "0.5vw",
            }}
          >
            <span>Log Out</span>
            <LogOut size="0.95vw" />
          </Link>
        </aside>

        <main style={{ flex: 1, padding: "0.5vw 1.5vw 6vw 1vw" }}>
          {children}
        </main>
      </div>

      <Waves />
    </div>
  );
}
