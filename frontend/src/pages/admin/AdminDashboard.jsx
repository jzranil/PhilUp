import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  ChevronDown,
  ChevronUp,
  LogOut,
  Maximize2,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

/* ── Asset Imports ── */
/* ── Asset Imports ── */
import PhilUpLogo from "../../assets/Phil UP 2.png";
import SearchIcon from "../../assets/search.png";
import PetronLogo from "../../assets/brand-images/PetronLogo.png";
import ShellLogo from "../../assets/brand-images/ShellLogo.png";
import CleanFuelLogo from "../../assets/brand-images/CleanFuelLogo.png";
import TotalLogo from "../../assets/brand-images/TotalLogo.png";
import UnoFuelLogo from "../../assets/brand-images/UnoFuelLogo.png";
import SeaoilLogo from "../../assets/brand-images/SeaoilLogo.png";
import MetroOilLogo from "../../assets/brand-images/MetroOilLogo.png";
import GlobalOilLogo from "../../assets/brand-images/GlobalOilLogo.png";

/* ── Data ── */
const chartData = [
  { a: 38, b: 62 },
  { a: 72, b: 28 },
  { a: 22, b: 78 },
  { a: 88, b: 44 },
  { a: 48, b: 72 },
  { a: 92, b: 36 },
  { a: 55, b: 80 },
  { a: 76, b: 52 },
];

const tableRows = [
  {
    qty: 3,
    logo: "total",
    station:
      "San Lazaro Street - Felix Huertas Road Sta. Cruz, Manila, Metro Manila",
    date: "May 13, 2025",
    time: "[01:46:25]",
  },
  {
    qty: 3,
    logo: "unofuel",
    station: "Legarda St, Sampaloc, Manila, Metro Manila",
    date: "May 13, 2025",
    time: "[02:17:14]",
  },
  {
    qty: 3,
    logo: "seaoil",
    station:
      "Reg Trading Rizal Avenue - Malabon Street, Sta. Cruz, Manila, Metro Manila",
    date: "May 13, 2025",
    time: "[04:12:43]",
  },
  {
    qty: 3,
    logo: "metrooil",
    station: "Gregorio Araneta Ave - Maria Clara St, Quezon City",
    date: "May 13, 2025",
    time: "[02:25:13]",
  },
];

const subMenuItems = [
  { label: "Registered Users", path: "/admin/registered-users" },
  { label: "Admins", path: "/admin/admins" },
  { label: "Registered Locations", path: "/admin/registered-locations" },
  { label: "Gas Prices", path: "/admin/gas-prices" },
  { label: "Approvals", path: "/admin/approvals" },
  { label: "Admin Log", path: "/admin/admin-log" },
  { label: "User Log", path: "/admin/user-log" },
];

const fuelPrices = [
  { label: "Gasoline", price: "00.15", up: true },
  { label: "Diesel", price: "00.56", up: false },
  { label: "Kerosene", price: "00.49", up: true },
];

const mainNavLinks = [
  { label: "Price Change Requests", path: "/admin/price-requests" },
  { label: "Station Location Requests", path: "/admin/location-requests" },
  { label: "Account", path: "/profile" },
  { label: "Switch as User", path: "/" },
];

/* ── Logo map ── */
const logoMap = {
  petron: PetronLogo,
  shell: ShellLogo,
  cleanfuel: CleanFuelLogo,
  total: TotalLogo,
  unofuel: UnoFuelLogo,
  seaoil: SeaoilLogo,
  metrooil: MetroOilLogo,
  globaloil: GlobalOilLogo,
};

const StationLogo = ({ type }) => {
  const src = logoMap[type];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={type}
      style={{
        width: "26px",
        height: "26px",
        objectFit: "contain",
        flexShrink: 0,
        borderRadius: "50%",
      }}
    />
  );
};

/* ── Digit Boxes ── */
const Digits = ({ digits, boxSize = "2.2vw", fontSize = "2.2vw" }) => (
  <div
    style={{
      display: "flex",
      gap: "0.18vw",
      alignItems: "center",
      flexWrap: "nowrap",
    }}
  >
    {String(digits)
      .split("")
      .map((c, i) => (
        <span
          key={i}
          style={{
            fontFamily: '"ZCOOL QingKe HuangYou", sans-serif',
            fontSize,
            backgroundColor: "#a1e3f9",
            color: "#3178ad",
            width: c === "." ? "1.3vw" : boxSize,
            height: boxSize,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {c}
        </span>
      ))}
  </div>
);

/* ── Card shell ── */
const Card = ({ children, style = {} }) => (
  <div
    style={{
      border: "0.2vw solid #1c618c",
      borderRadius: "1vw",
      padding: "1.2vw",
      backgroundColor: "#fffbf4",
      fontFamily: '"Roboto Mono", monospace',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── Request Table ── */
const RequestTable = ({ title, to }) => (
  <Card style={{ flex: 1 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.8vw",
      }}
    >
      <h2
        style={{
          color: "#1c618c",
          fontSize: "1.15vw",
          fontWeight: 700,
          margin: 0,
        }}
      >
        {title}
      </h2>
      <Link to={to} aria-label={`Open ${title}`}>
        <Maximize2
          size="1vw"
          color="#1c618c"
          style={{ cursor: "pointer", flexShrink: 0 }}
        />
      </Link>
    </div>
    <div
      style={{
        display: "flex",
        color: "#1c618c",
        fontWeight: 700,
        fontSize: "0.88vw",
        borderBottom: "0.12vw solid #1c618c",
        paddingBottom: "0.4vw",
        marginBottom: "0.4vw",
      }}
    >
      <span style={{ width: "5.5vw" }}>Quantity</span>
      <span style={{ flex: 1 }}>Station</span>
      <span style={{ width: "7vw", textAlign: "right" }}>Date</span>
    </div>
    {tableRows.map((row, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: "0.65vw",
          gap: "0.3vw",
        }}
      >
        <span
          style={{
            width: "5.5vw",
            fontSize: "0.82vw",
            color: "#3178ad",
            textAlign: "center",
            paddingTop: "0.2vw",
          }}
        >
          {row.qty}
        </span>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            gap: "0.4vw",
          }}
        >
          <StationLogo type={row.logo} />
          <span
            style={{ fontSize: "0.75vw", color: "#3178ad", lineHeight: 1.35 }}
          >
            {row.station}
          </span>
        </div>
        <div
          style={{
            width: "7vw",
            fontSize: "0.7vw",
            color: "#3178ad",
            textAlign: "right",
            lineHeight: 1.4,
          }}
        >
          <div>{row.date}</div>
          <div>{row.time}</div>
        </div>
      </div>
    ))}
  </Card>
);

/* ── Waves ── */
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

/* ══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [tablesOpen, setTablesOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
        .nav-btn:hover { opacity: 0.7; }
        .sb-item { cursor: pointer; transition: opacity .15s; }
        .sb-item:hover { opacity: 0.6; }
      `}</style>

      {/* ══ NAVBAR ══ */}
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
          {/* Left */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8vw",
              width: "25vw",
            }}
          >
            <button className="nav-btn">
              <Menu size="1.8vw" />
            </button>
            <button className="nav-btn" style={{ padding: 0 }}>
              <img
                src={SearchIcon}
                alt="Search"
                style={{
                  width: "1.5vw",
                  height: "1.5vw",
                  objectFit: "contain",
                }}
              />
            </button>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stations..."
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

          {/* Center — Phil UP Logo */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <a
              href="/"
              style={{ position: "absolute", top: "0.5vw", zIndex: 301 }}
            >
              <img
                src={PhilUpLogo}
                alt="Phil UP Logo"
                style={{ width: "6vw", height: "auto", objectFit: "contain" }}
              />
            </a>
          </div>

          {/* Right */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1.5vw",
              width: "25vw",
            }}
          >
            <button className="nav-btn">
              <Bell size="1.8vw" />
            </button>
            <button className="nav-btn">
              <User size="2.1vw" />
            </button>
          </div>
        </div>

        {/* Dividers */}
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

      {/* ══ BODY ══ */}
      <div
        style={{
          display: "flex",
          paddingTop: "8.8vw",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Sidebar ── */}
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
            style={{
              display: "block",
              color: "#1c618c",
              fontWeight: 700,
              marginBottom: "1vw",
            }}
          >
            Dashboard
          </NavLink>

          <div style={{ marginBottom: "0.6vw" }}>
            <div
              className="sb-item"
              onClick={() => setTablesOpen((v) => !v)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
            </div>
            {tablesOpen && (
              <div style={{ paddingLeft: "1vw" }}>
                {subMenuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="sb-item"
                    style={({ isActive }) => ({
                      display: "block",
                      color: isActive ? "#1c618c" : "#3178ad",
                      fontSize: "0.9vw",
                      fontWeight: isActive ? 700 : 400,
                      marginBottom: "0.35vw",
                    })}
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
              style={{
                display: "block",
                color: "#1c618c",
                fontWeight: 700,
                marginBottom: "0.85vw",
              }}
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

        {/* ── Main ── */}
        <main style={{ flex: 1, padding: "0.5vw 1.5vw 6vw 1vw" }}>
          <div style={{ display: "flex", gap: "1.2vw", marginBottom: "1.2vw" }}>
            {/* Fuel Price Changes */}
            <Card style={{ flex: "0 0 21vw" }}>
              <h2
                style={{
                  color: "#1c618c",
                  fontSize: "1.2vw",
                  fontWeight: 700,
                  marginBottom: "1vw",
                }}
              >
                Fuel Price Changes
              </h2>
              {fuelPrices.map(({ label, price, up }) => (
                <div key={label} style={{ marginBottom: "0.75vw" }}>
                  <p
                    style={{
                      color: "#1c618c",
                      fontSize: "0.95vw",
                      marginBottom: "0.25vw",
                    }}
                  >
                    {label}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45vw",
                    }}
                  >
                    <span
                      style={{
                        color: up ? "#22a855" : "#e53535",
                        fontSize: "1.1vw",
                        fontWeight: 700,
                      }}
                    >
                      {up ? "▲" : "▼"}
                    </span>
                    <Digits digits={price} boxSize="1.85vw" fontSize="1.85vw" />
                  </div>
                </div>
              ))}
            </Card>

            {/* New Visitors */}
            <Card style={{ flex: 1 }}>
              <h2
                style={{
                  color: "#1c618c",
                  fontSize: "1.2vw",
                  fontWeight: 700,
                  marginBottom: "0.8vw",
                }}
              >
                New Visitors
              </h2>
              <Digits digits="003465" boxSize="2.3vw" fontSize="2.3vw" />
              <p
                style={{
                  color: "#22a855",
                  fontSize: "1vw",
                  margin: "0.45vw 0",
                }}
              >
                +3.72%
              </p>
              <div style={{ height: "7vw" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="a"
                      stroke="#3178ad"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="b"
                      stroke="#a1e3f9"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* New Registrations */}
            <Card style={{ flex: 1 }}>
              <h2
                style={{
                  color: "#1c618c",
                  fontSize: "1.2vw",
                  fontWeight: 700,
                  marginBottom: "0.8vw",
                }}
              >
                New Registrations
              </h2>
              <Digits digits="004259" boxSize="2.3vw" fontSize="2.3vw" />
              <p
                style={{
                  color: "#1c618c",
                  fontSize: "0.95vw",
                  margin: "0.7vw 0 0.3vw",
                }}
              >
                Registered Users
              </p>
              <Digits digits="029420" boxSize="2.3vw" fontSize="2.3vw" />
              <p
                style={{
                  color: "#22a855",
                  fontSize: "1vw",
                  marginTop: "0.5vw",
                }}
              >
                +0.144%
              </p>
            </Card>
          </div>

          {/* Request tables */}
          <div style={{ display: "flex", gap: "1.2vw" }}>
            <RequestTable
              title="Station Location Requests"
              to="/admin/location-requests"
            />
            <RequestTable
              title="Price Change Requests"
              to="/admin/price-requests"
            />
          </div>
        </main>
      </div>

      <Waves />
    </div>
  );
}
