import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import BurgerDropdown from "../components/BurgerDropdown";
import philUpLogo from "../assets/Phil Up 2.png";
import wave1 from "../assets/bottom wave 1.png";
import wave2 from "../assets/bottom wave 2.png";
import wave3 from "../assets/bottom wave 3.png";
import wave4 from "../assets/bottom wave 4.png";
import { getSessionUser, logoutSession } from "../utils/session";

// Mock data to prevent crash in search panel
const MOCK_NEAREST = [];
const MOCK_TOP_VISITS = [];
const filteredStations = [];

export default function HomeLayoutPage() {
  // 1. ALL HOOKS AND STATE MUST BE INSIDE THE COMPONENT
  const navigate = useNavigate();
  const user = getSessionUser();
  const isLoggedIn = !!user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchTab, setActiveSearchTab] = useState("results");
  const [mapSrc, setMapSrc] = useState("");
  const [navZ] = useState(300);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Helper functions
  const openSearch = (tab) => {
    setActiveSearchTab(tab);
    setSearchOpen(true);
    setMenuOpen(false);
    setSettingsOpen(false);
    document.body.style.overflowY = "hidden";
  };

  const closeSearch = () => {
    setSearchOpen(false);
    document.body.style.overflowY = "scroll";
  };

  const toggleMenu = () => {
    setMenuOpen((v) => !v);
    setSettingsOpen(false);
    setSearchOpen(false);
    document.body.style.overflowY = "scroll";
  };

  const toggleSettings = () => {
    setSettingsOpen((v) => !v);
    setMenuOpen(false);
    setSearchOpen(false);
    document.body.style.overflowY = "scroll";
  };

  const handleSearchIcon = () => {
    if (searchOpen) closeSearch();
    else openSearch("results");
  };

  const goToLocations = () => {
    setMenuOpen(false);
    setSettingsOpen(false);
    setSearchOpen(false);
    document.body.style.overflowY = "scroll";
    navigate("/locations");
  };

  const handleLogout = () => {
    logoutSession();
    navigate("/login");
  };

  // Burger menu actions
  const burgerActions = {
    "Top Lowest": () => {
      setMenuOpen(false);
    },
    "Most Visited": () => {
      setMenuOpen(false);
      openSearch("topVisits");
    },
    Locations: goToLocations,
    Nearest: () => {
      setMenuOpen(false);
      openSearch("nearest");
    },
    [user?.userName]: () => {
      setMenuOpen(false);
      navigate("/profile");
    },
    "Switch as Admin": () => {
      setMenuOpen(false);
      if (user?.userPermissionLevel >= 50) {
        navigate("/admin");
      }
    },
    "Log Out": handleLogout,
    "Log In": () => {
      setMenuOpen(false);
      navigate("/login");
    },
  };

  function StationCard({ brandLogo, stationAdd, onSelect }) {
    return (
      <div
        onClick={onSelect}
        style={{
          padding: "1vw",
          border: "0.15vw solid #1c618c",
          borderRadius: "0.5vw",
          marginBottom: "0.8vw",
          cursor: "pointer",
          backgroundColor: "#f9f9f9",
        }}
      >
        <img src={brandLogo} alt="Brand" style={{ width: "3vw", height: "3vw" }} />
        <p style={{ fontSize: "0.9vw", color: "#1c618c", marginTop: "0.5vw" }}>
          {stationAdd}
        </p>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#1c618c", fontFamily: '"Roboto Mono", monospace', color: "#fffbf4" }}>
      {/* ── COMMON NAVBAR ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=ZCOOL+QingKe+HuangYou&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background-color: #fffbf4; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 0; }

        .home-search-panel {
          position: fixed;
          left: 50%;
          top: clamp(112px, 7.9vw, 168px);
          transform: translateX(-50%);
          z-index: 301;
          width: calc(100vw - 7vw);
          max-width: 1500px;
          max-height: calc(100vh - clamp(132px, 14vw, 190px));
          overflow-y: auto;
          box-sizing: border-box;
          border: 0.25vw solid #1c618c;
          border-top: none;
          border-radius: 0 0 1vw 1vw;
          background-color: #fffbf4;
          padding: clamp(18px, 2.2vw, 34px);
          font-family: "Roboto Mono", monospace;
          box-shadow: 0 18px 40px rgba(28, 97, 140, 0.16);
        }

        .home-search-grid {
          display: flex;
          align-items: stretch;
          gap: clamp(22px, 3vw, 46px);
        }

        .home-search-left {
          flex: 0 0 min(48%, 520px);
          min-width: 0;
        }

        .home-search-right {
          flex: 1;
          min-width: 320px;
          color: #1c618c;
        }

        .home-search-title {
          color: #1c618c;
          fontWeight: 700;
          font-size: clamp(18px, 1.8vw, 28px);
          line-height: 1.2;
          margin-bottom: clamp(12px, 1.2vw, 18px);
        }

        .home-search-section + .home-search-section {
          margin-top: clamp(22px, 2.2vw, 34px);
        }

        .home-search-empty {
          color: #3178ad;
          font-size: clamp(12px, 1vw, 15px);
          line-height: 1.5;
          padding: 10px 0 14px;
        }

        .home-search-map {
          width: 100%;
          height: clamp(320px, 46vh, 520px);
          border-radius: 1vw;
          border: 0.25vw solid #1c618c;
          display: block;
        }

        @media (max-width: 900px) {
          .home-search-panel {
            top: clamp(96px, 18vw, 150px);
            width: 92vw;
          }

          .home-search-grid {
            flex-direction: column;
          }

          .home-search-left,
          .home-search-right {
            flex: 1 1 auto;
            min-width: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* ====== FIXED NAVBAR ====== */}
      <div
        id="fixedBGNavBar"
        style={{
          position: "fixed",
          zIndex: navZ,
          transform: "translate(0%,0%)",
          width: "100vw",
        }}
      >
        {/* Top Nav Row */}
        <div
          className="flex flex-row flex-nowrap justify-between items-center w-full"
          style={{ padding: "1.5vw 2.5vw 0 2.5vw" }}
        >
          {/* Left: Hamburger + Search */}
          <div
            className="flex flex-row flex-nowrap justify-around items-center"
            style={{ width: "25vw", height: "5vw", position: "relative" }}
          >
            <button
              onClick={toggleMenu}
              className="text-[2vw] text-[#1c618c] bg-transparent border-none cursor-pointer"
              aria-label="Open menu"
            >
              <FaBars />
            </button>
            {menuOpen && (
              <BurgerDropdown
                items={[
                  "Top Lowest",
                  "Most Visited",
                  "Locations",
                  "Nearest",
                  ...(isLoggedIn
                    ? [
                        user?.userName,
                        ...(user?.userPermissionLevel >= 50 ? ["Switch as Admin"] : []),
                        "Log Out",
                      ]
                    : ["Log In"]),
                ]}
                actions={burgerActions}
              />
            )}
            <div
              className="flex flex-row flex-nowrap justify-between items-center"
              style={{ width: "17.5vw" }}
            >
              <button
                onClick={handleSearchIcon}
                className="text-[2vw] text-[#1c618c] bg-transparent border-none cursor-pointer"
                aria-label="Search stations"
              >
                <FaSearch />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  openSearch("results");
                }}
                onClick={() => openSearch("results")}
                className="border-none outline-none text-[#1c618c] text-[1vw] font-mono"
                style={{ width: "15vw", backgroundColor: "#fffbf4" }}
                placeholder="Search stations..."
              />
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center items-center">
            <div
              className="absolute"
              onClick={() => navigate("/")}
              style={{
                marginTop: "5vw",
                zIndex: searchOpen ? 500 : "inherit",
                cursor: "pointer",
              }}
            >
              <img
                src={philUpLogo}
                alt="Phil Up"
                style={{
                  width: "12.5vw",
                  height: "12.5vw",
                }}
              />
            </div>
          </div>

          {/* Right: Bell + Profile */}
          <div
            className="flex flex-row flex-nowrap justify-end items-center"
            style={{ width: "25vw", height: "5vw" }}
          >
            <div
              className="flex flex-row flex-nowrap justify-around items-center"
              style={{ width: "10vw" }}
            >
              <button
                className="text-[2vw] text-[#1c618c] bg-transparent border-none cursor-pointer"
                aria-label="Notifications"
              >
                <FaBell />
              </button>
              <button
                onClick={toggleSettings}
                className="flex items-center justify-center bg-transparent border-none cursor-pointer"
                style={{ width: "3vw", height: "3vw" }}
                aria-label="Open profile menu"
              >
                <FaUserCircle className="text-[2.3vw] text-[#1c618c]" />
              </button>
            </div>
          </div>
        </div>

        {/* Nav Dividers */}
        <div
          className="flex flex-col justify-between items-center w-full"
          style={{ padding: "0 2.5vw" }}
        >
          <div className="flex flex-row flex-nowrap justify-between items-center w-full">
            <div style={{ width: "25vw", height: 0, borderRadius: "0.25vw", border: "0.25vw solid #1c618c", margin: "1vw" }} />
            <div style={{ width: "25vw", height: 0, borderRadius: "0.25vw", margin: "1vw" }} />
            <div style={{ width: "25vw", height: 0, borderRadius: "0.25vw", border: "0.25vw solid #1c618c", margin: "1vw" }} />
          </div>
          <div className="flex flex-row flex-nowrap justify-between items-center w-full">
            <div style={{ width: "20vw", height: 0, borderRadius: "0.25vw", border: "0.25vw solid #1c618c", margin: "1vw" }} />
            <div style={{ width: "20vw", height: 0, borderRadius: "0.25vw", margin: "1vw" }} />
            <div style={{ width: "20vw", height: 0, borderRadius: "0.25vw", margin: "1vw" }} />
            <div style={{ width: "20vw", height: 0, borderRadius: "0.25vw", border: "0.25vw solid #1c618c", margin: "1vw" }} />
          </div>
        </div>

        {/* Hidden Search Panel */}
        {searchOpen && (
          <div className="home-search-panel">
            <div className="home-search-grid">
              {/* Left Panel */}
              <div className="home-search-left">
                <section className="home-search-section">
                  <h1 className="home-search-title">Results</h1>
                  {searchQuery ? (
                    filteredStations.length > 0 ? (
                      filteredStations.map((s) => (
                        <StationCard key={s.fuelLocID} brandLogo={s.brandLogo} stationAdd={s.stationAdd} onSelect={() => {}} />
                      ))
                    ) : (
                      <p className="home-search-empty">No stations match your search.</p>
                    )
                  ) : (
                    <p className="home-search-empty">Search for a station to show matching results.</p>
                  )}
                </section>

                <section className="home-search-section">
                  <h1 className="home-search-title">Stations Nearby</h1>
                  {MOCK_NEAREST.map((s) => (
                    <StationCard key={s.fuelLocID} brandLogo={s.brandLogo} stationAdd={s.stationAdd} onSelect={() => {}} />
                  ))}
                </section>

              {/* Top Visits */}
              {activeSearchTab === "topVisits" && (
                <section className="home-search-section">
                  <h1 className="home-search-title">Top Visits</h1>
                  {MOCK_TOP_VISITS.map((s) => (
                    <StationCard key={s.fuelLocID} brandLogo={s.brandLogo} stationAdd={s.stationAdd} onSelect={() => {}} />
                  ))}
                </section>
              )}

              {/* Favorites */}
              {activeSearchTab === "favorites" && (
                <section className="home-search-section">
                  <h1 className="home-search-title">Favorites</h1>
                  <p className="home-search-empty">Log in to see your favorites.</p>
                </section>
              )}
            </div>

            {/* Right Panel — Map */}
              <section className="home-search-right">
                <h1 className="home-search-title">Stations Near You</h1>
                <iframe
                  src={mapSrc}
                  className="home-search-map"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Search Map"
                />
              </section>
            </div>
          </div>
        )}
      </div>

      {/* Main Profile Content */}
      <div
        style={{
          paddingTop: "10vw",
          minHeight: "100vh",
          backgroundColor: "#fffbf4",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Wave Background */}
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

        {/* Profile Content / Outlet */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "3vw",
            gap: "4vw",
          }}
        >
            <Outlet />
        </div>
      </div>
    </main>
  );
}