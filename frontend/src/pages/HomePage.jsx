import { useState, useEffect, useRef } from "react";
import { FaBars, FaBell, FaFacebookSquare, FaInstagramSquare, FaLinkedin, FaSearch, FaUserCircle } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import BurgerDropdown from "../components/BurgerDropdown";
import { getSessionUser, logoutSession } from "../utils/session";

// Asset imports
import philUpLogo from "../assets/Phil Up 2.png";
import nozzleGas from "../assets/NOZZLE GAS.png";
import wave1 from "../assets/bottom wave 1.png";
import wave2 from "../assets/bottom wave 2.png";
import wave3 from "../assets/bottom wave 3.png";
import wave4 from "../assets/bottom wave 4.png";
import petronLogo from "../assets/brand-images/PetronLogo.png";
import shellLogo from "../assets/brand-images/ShellLogo.png";
import image1 from "../assets/image1.png";
import image1NoBg from "../assets/image1nobg.png";

// Mock station data for UI (replace with real API calls)
const MOCK_NEAREST = [
  { fuelLocID: 1, brandLogo: petronLogo, stationAdd: "Petron - España Blvd, Sampaloc, Manila" },
  { fuelLocID: 2, brandLogo: shellLogo, stationAdd: "Shell - Commonwealth Ave, Quezon City" },
  { fuelLocID: 3, brandLogo: petronLogo, stationAdd: "Petron - EDSA, Mandaluyong City" },
];
const MOCK_TOP_VISITS = [
  { fuelLocID: 1, brandLogo: petronLogo, stationAdd: "Reg Trading Rizal Avenue - Malabon Street, Sta. Cruz, Manila" },
  { fuelLocID: 2, brandLogo: shellLogo, stationAdd: "Shell - C5 Road, Pasig City" },
  { fuelLocID: 3, brandLogo: petronLogo, stationAdd: "Petron - Aurora Blvd, Quezon City" },
];

const GasPriceDigits = ({ digits = "00.00" }) => {
  const parts = digits.split(".");
  const intPart = (parts[0] || "00").padStart(3, "0").split("");
  const decPart = (parts[1] || "00").padStart(2, "0").split("");
  return (
    <div className="flex flex-nowrap flex-row justify-between items-center w-[14.5vw]">
      {intPart.map((d, i) => (
        <span key={`i${i}`} className="digit-box">{d}</span>
      ))}
      <span className="digit-box">.</span>
      {decPart.map((d, i) => (
        <span key={`d${i}`} className="digit-box">{d}</span>
      ))}
    </div>
  );
};

const StationCard = ({ brandLogo, stationAdd, onSelect }) => (
  <div
    className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
    style={{
      gap: "clamp(12px, 1.2vw, 18px)",
      padding: "clamp(10px, 1vw, 14px) 0",
      borderBottom: "1px solid #1c618c18",
    }}
    onClick={onSelect}
  >
    <img
      src={brandLogo}
      alt="logo"
      style={{
        width: "clamp(48px, 5vw, 72px)",
        height: "clamp(48px, 5vw, 72px)",
        objectFit: "contain",
        flexShrink: 0,
      }}
    />
    <p
      className="font-mono text-[#3178ad]"
      style={{
        fontSize: "clamp(12px, 1vw, 15px)",
        lineHeight: 1.45,
        flex: 1,
      }}
    >
      {stationAdd}
    </p>
  </div>
);

export default function HomePage() {
  const [locations, setLocations] = useState([]);
  const [brands, setBrands] = useState([]);

  const navigate = useNavigate();

  const user = getSessionUser();
  const isLoggedIn = !!user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchTab, setActiveSearchTab] = useState("results"); 
  const [locationGranted, setLocationGranted] = useState(false);
  const [mapSrc, setMapSrc] = useState("");
  const [navZ, setNavZ] = useState(300);

  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);
  const wave3Ref = useRef(null);
  const wave4Ref = useRef(null);

  // Scroll wave animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      if (wave1Ref.current) wave1Ref.current.style.transform = `translate(${scrollTop * 0.04 - 40}vw, -24vw)`;
      if (wave2Ref.current) wave2Ref.current.style.transform = `translate(-${scrollTop * 0.02}vw, -11vw)`;
      if (wave3Ref.current) wave3Ref.current.style.transform = `translate(${scrollTop * 0.023 - 25}vw, -4vw)`;
      if (wave4Ref.current) wave4Ref.current.style.transform = `translate(-${scrollTop * 0.0127}vw, 7vw)`;
      const zVal = 300 - scrollTop;
      setNavZ(zVal);
      if (zVal < 0) {
        setMenuOpen(false);
        setSettingsOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Geolocation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocationGranted(true);
          setMapSrc(
            `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d13758.385273920467!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sgas%20station!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph`
          );
        },
        () => {}
      );
    }
  };

  useEffect(() => { handleGetLocation(); }, []);

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

  if(user?.userPermissionLevel >= 50){
  navigate("/admin");
}
},

  "Log Out": () => {
  setMenuOpen(false);
  logoutSession();
  navigate("/login");
},

 "Log In": () => {
    setMenuOpen(false);
    navigate("/login");
}
};

  const filteredStations = MOCK_NEAREST.filter((s) =>
    s.stationAdd.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Font imports via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=ZCOOL+QingKe+HuangYou&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background-color: #fffbf4; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 0; }

        .digit-box {
          font-family: "ZCOOL QingKe HuangYou", sans-serif;
          font-size: 3vw;
          text-align: center;
          background-color: #a1e3f9;
          color: #3178ad;
          width: 2vw;
          display: inline-block;
        }

        #homePageWave1 {
          width: 140vw; position: absolute; z-index: 0;
          transform: translate(-40vw, -24vw);
        }
        #homePageWave2 {
          width: 120vw; position: absolute; z-index: 1;
          transform: translate(0vw, -11vw);
        }
        #homePageWave3 {
          width: 125vw; position: absolute; z-index: 3;
          transform: translate(-25vw, -4vw);
        }
        #homePageWave4 {
          width: 115vw; position: absolute; z-index: 4;
          transform: translate(0vw, 7vw);
        }

        #homePageTopStationSampleImage {
          position: relative;
          border-radius: 1vw; height: 12vw; width: 50vw;
          object-fit: cover; transform: translate(80%, -154%);
        }
        #homePageTopStationSampleImageOverlay {
          position: absolute; border-radius: 1vw;
          height: 27vw; width: 50vw; object-fit: cover;
          transform: translate(80%, -144%);
        }
        #homePageFavoritesSampleImage {
          border-radius: 1vw; height: 12vw; width: 50vw;
          object-fit: cover; transform: translate(0%, -60%);
        }
        #homePageFavoritesSampleImageOverlay {
          position: absolute; border-radius: 1vw;
          height: 27vw; width: 50vw; object-fit: cover;
          transform: translate(-100%, -54%);
        }
        #homePageWaveDivider {
          width: 100vw; position: absolute;
          transform: translate(0vw, -55vw);
          clip-path: polygon(0 16%, 100% 16%, 100% 100%, 0% 100%);
        }

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
          font-weight: 700;
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
        style={{ position: "fixed", zIndex: navZ, transform: "translate(0%,0%)", width: "100vw" }}
      >
        {/* Top Nav Row */}
        <div
          className="flex flex-row flex-nowrap justify-between items-center w-full"
          style={{ padding: "1.5vw 2.5vw 0 2.5vw" }}
        >
          {/* Left: Hamburger + Search */}
          <div className="flex flex-row flex-nowrap justify-around items-center" style={{ width: "25vw", height: "5vw", position: "relative" }}>
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
            
            ...(user?.userPermissionLevel >= 50
              ? ["Switch as Admin"]
              : []),

            "Log Out",
          ]
        : ["Log In"]),
    ]}
    actions={burgerActions}
  />
)}            <div className="flex flex-row flex-nowrap justify-between items-center" style={{ width: "17.5vw" }}>
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
                onChange={(e) => { setSearchQuery(e.target.value); openSearch("results"); }}
                onClick={() => openSearch("results")}
                className="border-none outline-none text-[#1c618c] text-[1vw] font-mono"
                style={{ width: "15vw", backgroundColor: "#fffbf4" }}
                placeholder="Search stations..."
              />
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center items-center" >
            <div
  className="absolute"
  onClick={() => navigate("/")}
  style={{
    marginTop:"5vw",
    zIndex: searchOpen ? 500 : "inherit",
    cursor:"pointer"
  }}
>
  <img
    src={philUpLogo}
    alt="Phil Up"
    style={{
      width:"12.5vw",
      height:"12.5vw"
    }}
  />
</div>
          </div>

          {/* Right: Bell + Profile */}
          <div
            className="flex flex-row flex-nowrap justify-end items-center"
            style={{ width: "25vw", height: "5vw" }}
          >
            <div className="flex flex-row flex-nowrap justify-around items-center" style={{ width: "10vw" }}>
              <button className="text-[2vw] text-[#1c618c] bg-transparent border-none cursor-pointer" aria-label="Notifications">
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
          style={{ padding: "0 2.5vw"}}
        >
          <div className="flex flex-row flex-nowrap justify-between items-center w-full">
              <div  style={{ width: "25vw", height: 0, borderRadius: "0.25vw", border: "0.25vw solid #1c618c", margin: "1vw" }} />
              <div  style={{ width: "25vw", height: 0, borderRadius: "0.25vw", margin: "1vw" }} />
              <div  style={{ width: "25vw", height: 0, borderRadius: "0.25vw", border: "0.25vw solid #1c618c", margin: "1vw" }} />
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

      {/* ====== HERO HEADER ====== */}
      <div
        id="homePageContentHeader"
        style={{ position: "relative", width: "100vw", height: "70vw", overflow: "hidden" }}
      >
        <img id="homePageWave1" className="max-w-none" ref={wave1Ref} src={wave1} alt="wave1" />
        <img id="homePageWave2" className="max-w-none" ref={wave2Ref} src={wave2} alt="wave2" />
        <img id="homePageWave3" className="max-w-none" ref={wave3Ref} src={wave3} alt="wave3" />
        <img id="homePageWave4" className="max-w-none" ref={wave4Ref} src={wave4} alt="wave4" />
        <img
          src={nozzleGas}
          alt="Gas Nozzle"
          style={{ height: "50vw", position: "fixed", zIndex: 2, transform: "translate(-5vw, 3%)" }}
        />
        <div
          style={{
            position: "fixed", color: "#1c618c", fontWeight: 700,
            fontFamily: '"Roboto Mono", monospace',
            transform: "translate(35vw, 23vw)", fontSize: "6vw", zIndex: 3,
          }}
        >
          <p>Top Lowest</p>
          <p style={{ width: "30vw", fontSize: "2vw" }}>
            <u>Discover real-time low gas prices near you</u>
          </p>
        </div>
      </div>

      {/* ====== MAIN CONTENT ====== */}
      <div style={{ width: "100vw", fontSize: "10vw", zIndex: 5 }}>
        <div className="relative z-5" style={{ backgroundColor: "#1c618c", width: "100vw" }}>

          {/* ---- TOP VISITS ---- */}
          <div id="homePageTopVisits" >
            <div
              style={{
                display: "flex", flexWrap: "wrap", flexDirection: "row",
                justifyContent: "space-between", alignItems: "flex-end",
                margin: "0 5vw", width: "90vw",
                color: "#fffbf4", fontFamily: '"Roboto Mono", monospace', fontSize: "1.5vw",
              }}
            >
              {/* Station Info */}
              <div>
                <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", fontSize: "2vw", height: "6vw" }}>
                  <img src={petronLogo} alt="Petron" style={{ height: "6vw" }} />
                  <p>Reg Trading Rizal Avenue - Malabon Street, Sta. Cruz, Manila</p>
                </div>

                {/* Gas Prices */}
                <div
                  style={{
                    width: "35vw", padding: "1vw", borderRadius: "1vw",
                    backgroundColor: "#fffbf4", color: "#4592d6", fontWeight: 700,
                  }}
                >
                  {[
                    "Blaze 100 Euro 6 (Gasoline)",
                    "XCS Euro 4 (Gasoline)",
                    "Max Euro 4 (Diesel)",
                    "Xtra Advance Euro 4 (Gasoline)",
                    "Turbo (Diesel)",
                  ].map((name, i) => (
                    <div key={i}>
                      <div>{name}</div>
                      <GasPriceDigits digits="123.45" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Station Images */}
              <div style={{ position: "relative" }}>
                <img id="homePageTopStationSampleImage" src={image1} alt="Station" />
                <img id="homePageTopStationSampleImageOverlay" src={image1NoBg} alt="Station Overlay" />
              </div>
            </div>

            <div className="m-20" style={{ marginTop: "1vw" }}>
              <p
                style={{
                  width: "100vw", color: "#fffbf4", textAlign: "center",
                  fontWeight: 700, fontFamily: '"Roboto Mono", monospace', fontSize: "2vw",
                }}
              >
                <u>Explore More Top Lowest Price Gas Station Near You</u>
              </p>
            </div>
          </div>

          {/* ---- MAP NEAREST ---- */}
          <div
            style={{
              color: "#1c618c", backgroundColor: "#fffbf4",
              fontFamily: '"Roboto Mono", monospace',
              display: "flex", alignItems: "center", justifyContent: "flex-start",
              flexDirection: "column",
            }}
          >
            <div
              id="homePageMapNearestTitleHolder"
              style={{ fontWeight: 700, fontSize: "5vw", width: "50vw", position: "relative" }}
            >
              <p style={{ padding: "1vw", width: "30vw" }}>EXPLORE YOUR</p>
              {!locationGranted && (
                <p
                  onClick={handleGetLocation}
                  style={{
                    position: "absolute", zIndex: 1,
                    transform: "translate(15vw, -8vw)",
                    fontSize: "2vw", cursor: "pointer",
                  }}
                >
                  <u>Share your location and get started</u>
                </p>
              )}
              <p
                style={{
                  padding: "1vw",
                  width: locationGranted ? "100%" : "30vw",
                  position: locationGranted ? "relative" : "absolute",
                  color: locationGranted ? "#1c618c" : "#fffbf4",
                  zIndex: 1,
                }}
              >
                NEAREST STATIONS
              </p>
            </div>

            <div
              style={{
                width: "50vw", height: "30vw", borderRadius: "1vw",
                border: "solid #1c618c 0.5vw", overflow: "hidden",
                filter: locationGranted ? "none" : "brightness(50%)",
              }}
            >
              {locationGranted && mapSrc ? (
                <iframe
                  src={mapSrc}
                  style={{ width: "100%", height: "100%", borderRadius: "1vw", border: "none" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nearest Map"
                />
              ) : (
                <div
                  style={{
                    width: "100%", height: "100%",
                    backgroundColor: "#ccc", borderRadius: "1vw",
                  }}
                />
              )}
            </div>
          </div>

          {/* ---- FOOTER ---- */}
          <div
            style={{
              width: "100vw", height: "20vw", backgroundColor: "#fffbf4",
              fontSize: "1vw", fontFamily: '"Roboto Mono", monospace',
              color: "#1c618c", display: "flex", flexWrap: "wrap",
              alignItems: "center", justifyContent: "space-around",
            }}
          >
            <div>
              <img src={philUpLogo} alt="Phil Up" style={{ width: "12.5vw", height: "12.5vw", margin: "2vw" }} />
            </div>
            <div style={{ color: "#1c618c", width: "25vw" }}>
              <p><b>INFORMATION</b></p>
              <p>Partners</p>
              <p>About Us</p>
              <p>Area Coverage</p>
            </div>
            <div style={{ color: "#1c618c", width: "25vw" }}>
              <p><b>CONTACT US</b></p>
              <p>+63905-505-0505</p>
              <p>[Address]</p>
              <p>philup_ph@gmail.com</p>
            </div>
            <div style={{ color: "#1c618c", width: "25vw" }}>
              <div style={{ display: "flex", gap: "1vw", fontSize: "2vw", marginBottom: "1vw" }}>
                <FaFacebookSquare />
                <FaInstagramSquare />
                <FaLinkedin />
                <FaSquareXTwitter />
              </div>
              <p>
                <a href="#" style={{ color: "#1c618c" }}>Terms &amp; Conditions</a>
                {" - "}
                <a href="#" style={{ color: "#1c618c" }}>Privacy Policy</a>
              </p>
              <p>2025 (c) PhilUp Philippines, All Rights Reserved</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
