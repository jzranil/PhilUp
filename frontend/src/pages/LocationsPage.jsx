import { useState, useEffect, useRef } from "react";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import BurgerDropdown from "../components/BurgerDropdown";

import philUpLogo from "../assets/Phil UP 2.png";
import petronLogo from "../assets/PetronLogo.png";
import shellLogo  from "../assets/ShellLogo.png";
import seaoilLogo from "../assets/SeaoilLogo.png";
import unioilLogo from "../assets/UnoFuelLogo.png";

// ─── Mock data — replace with real API ────────────────────────────────────────
const MOCK_STATIONS = [
  {
    fuelLocID: 1,
    brandLogo: petronLogo,
    brandName: "Petron",
    stationAdd: "Reg Trading Rizal Avenue - Malabon Street, Sta. Cruz, Manila",
    lastUpdatedBy: "AnaFuelWatch",
    lastUpdatedAt: "May 17, 2026, 8:45 AM",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.746!2d120.9804!3d14.6046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sPetron!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph",
    fuels: [
      { id: 1, name: "Blaze 100 Euro 6", price: "069.80" },
      { id: 2, name: "XCS", price: "066.35" },
      { id: 3, name: "Diesel Max", price: "052.10" },
    ],
  },
  {
    fuelLocID: 2,
    brandLogo: shellLogo,
    brandName: "Shell",
    stationAdd: "Shell - Commonwealth Ave, Quezon City",
    lastUpdatedBy: "Jonathan43",
    lastUpdatedAt: "May 17, 2026, 9:10 AM",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.746!2d121.0702!3d14.6783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sShell%20Commonwealth%20Ave!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph",
    fuels: [
      { id: 1, name: "V-Power Racing (Gasoline)", price: "067.25" },
      { id: 2, name: "FuelSave (Gasoline)", price: "065.43" },
      { id: 3, name: "FuelSave (Diesel)", price: "050.85" },
    ],
  },
  {
    fuelLocID: 3,
    brandLogo: shellLogo,
    brandName: "Shell",
    stationAdd: "Gregorio Araneta Ave - Maria Clara St., Quezon City",
    lastUpdatedBy: "BrotherNiJ43",
    lastUpdatedAt: "May 17, 2026, 7:30 AM",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.746!2d121.0114!3d14.6249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b79e040706e1%3A0x6e8e10bd3f0da5c!2sShell!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph",
    fuels: [
      { id: 1, name: "V-Power Racing (Gasoline)", price: "067.25" },
      { id: 2, name: "V-Power (Gasoline)", price: "066.80" },
      { id: 3, name: "V-Power (Diesel)", price: "052.98" },
      { id: 4, name: "FuelSave (Gasoline)", price: "065.43" },
      { id: 5, name: "FuelSave (Diesel)", price: "050.85" },
    ],
  },
  {
    fuelLocID: 4,
    brandLogo: seaoilLogo,
    brandName: "Seaoil",
    stationAdd: "San Lazaro Street - Felix Huertas Road Sta. Cruz, Manila",
    lastUpdatedBy: "MnlDriver",
    lastUpdatedAt: "May 16, 2026, 6:20 PM",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.746!2d120.9863!3d14.6171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sSeaoil%20San%20Lazaro!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph",
    fuels: [
      { id: 1, name: "Extreme 97", price: "066.70" },
      { id: 2, name: "Unleaded 95", price: "064.90" },
      { id: 3, name: "Diesel", price: "050.40" },
    ],
  },
  {
    fuelLocID: 5,
    brandLogo: petronLogo,
    brandName: "Petron",
    stationAdd: "España Blvd corner Lacson Ave, Sampaloc, Manila" },
  {
    fuelLocID: 6,
    brandLogo: unioilLogo,
    brandName: "Unioil",
    stationAdd: "Unioil E. Rodriguez Sr. Avenue, Quezon City",
    lastUpdatedBy: "QCCommuter",
    lastUpdatedAt: "May 17, 2026, 10:00 AM",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.746!2d121.0267!3d14.6185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sUnioil%20E.%20Rodriguez!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph",
    fuels: [
      { id: 1, name: "Euro 5 Gasoline 95", price: "064.15" },
      { id: 2, name: "Euro 5 Gasoline 91", price: "062.80" },
      { id: 3, name: "Euro 5 Diesel", price: "049.95" },
    ],
  },
];

// ─── Wave canvas ──────────────────────────────────────────────────────────────
function WaveCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);
  const t   = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const layers = [
      { color: "#5aabda", xBase: 0.78, amp: 40, freq: 0.009, speed: 0.0007, phase: 0.0 },
      { color: "#2e87be", xBase: 0.83, amp: 44, freq: 0.011, speed: 0.0005, phase: 4.5 },
      { color: "#1e6a9a", xBase: 0.88, amp: 38, freq: 0.013, speed: 0.0004, phase: 9.3 },
      { color: "#1a4f78", xBase: 0.93, amp: 34, freq: 0.010, speed: 0.0003, phase: 14.0 },
    ];

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      layers.forEach(({ color, xBase, amp, freq, speed, phase }) => {
        const cx = W * xBase;
        ctx.beginPath();
        ctx.moveTo(W, 0);
        for (let y = 0; y <= H + 4; y += 3)
          ctx.lineTo(cx + Math.sin(y * freq + t.current * speed + phase) * amp, y);
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      });
      t.current += 1;
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: "fixed", inset: 0,
      width: "100vw", height: "100vh",
      zIndex: 0, pointerEvents: "none",
    }} />
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LocationsPage() {
  const [query,        setQuery]        = useState("");
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoggedIn]                    = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [proposedPrices, setProposedPrices] = useState({});
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  // Geolocation for map
  const [mapSrc, setMapSrc] = useState(
    "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d13758.385273920467!2d120.9842!3d14.6091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sgas%20station!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph"
  );
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setMapSrc(`https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d13758.385273920467!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sgas%20station!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph`);
    }, () => {});
  }, []);

  const hasSearch = query.trim().length > 0;
  const filtered = MOCK_STATIONS.filter(s =>
    s.stationAdd.toLowerCase().includes(query.toLowerCase()) ||
    s.brandName.toLowerCase().includes(query.toLowerCase())
  );

  const activeStation = hasSearch && selectedStation &&
    filtered.some(s => s.fuelLocID === selectedStation.fuelLocID)
      ? selectedStation
      : null;

  const handleSelectStation = (station) => {
    if (!hasSearch) return;
    setSelectedStation(station);
    setRequestOpen(false);
    setRequestSubmitted(false);
    setProposedPrices(
      (station.fuels ?? []).reduce((acc, fuel) => ({ ...acc, [fuel.id]: "" }), {})
    );
  };

  const handleRequestChange = (fuelId, value) => {
    const cleaned = value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1").slice(0, 6);
    setProposedPrices(prev => ({ ...prev, [fuelId]: cleaned }));
  };

  const handleSubmitRequest = (event) => {
    event.preventDefault();
    setRequestSubmitted(true);
  };

  const closeBurgerMenu = () => setMenuOpen(false);
  const burgerActions = {
    "Top Lowest": closeBurgerMenu,
    "Most Visited": closeBurgerMenu,
    Locations: closeBurgerMenu,
    Nearest: closeBurgerMenu,
    username: closeBurgerMenu,
    "Switch as Admin": closeBurgerMenu,
    "Log Out": closeBurgerMenu,
  };

  const selectedFuels = activeStation?.fuels ?? [
    { id: 1, name: "Blaze 100 Euro 6", price: "069.25" },
    { id: 2, name: "Xtra Advance", price: "064.85" },
    { id: 3, name: "Turbo Diesel", price: "052.45" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fffbf4; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 0; }

        .lp-wrap { opacity: 0; transform: translateY(16px); transition: opacity .5s ease, transform .5s ease; }
        .lp-wrap.in { opacity: 1; transform: none; }

        /* ── Navbar ── */
        .lp-navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: #fffbf4;
        }
        .lp-nav-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5vw 2.5vw 0;
        }
        .lp-nav-left  { display: flex; align-items: center; gap: 1vw; width: 25vw; height: 5vw; position: relative; }
        .lp-nav-right { display: flex; align-items: center; gap: 1vw; width: 25vw; justify-content: flex-end; }
        .lp-icon-btn  { background: none; border: none; cursor: pointer; color: #1c618c; font-size: 2vw; display: flex; align-items: center; }
        .lp-dividers  { display: flex; flex-direction: column; padding: 0 2.5vw; }
        .lp-div-row   { display: flex; justify-content: space-between; align-items: center; }
        .lp-line      { height: 0; width: 25vw; border-radius: 0.25vw; border: 0.25vw solid #1c618c; margin: 1vw; }
        .lp-line-blank { height: 0; width: 25vw; border: none; margin: 1vw; }
        .lp-dropdown  {
          position: absolute; z-index: 200; background: #fffbf4;
          border: 0.25vw solid #1c618c; border-radius: 0 0 2vw 2vw;
          padding: 2vw; width: 20.5vw;
          font-family: "Roboto Mono", monospace; font-size: 2vw; font-weight: 700; color: #1c618c;
        }
        .lp-drop-item { cursor: pointer; margin-bottom: 0.5vw; transition: opacity .15s; }
        .lp-drop-item:hover { opacity: .6; }
        .lp-drop-link { display: block; color: #1c618c; text-decoration: none; margin-bottom: 0.5vw; }

        /* ── Body layout ── */
        .lp-body {
          display: grid;
          grid-template-columns: clamp(280px, 38%, 520px) 1fr;
          min-height: 100vh;
          padding-top: clamp(100px, 13vw, 180px);
        }

        /* ── Left panel ── */
        .lp-left {
          padding: clamp(20px, 2.5vw, 40px);
          border-right: 1.5px solid #1c618c22;
          overflow-y: auto;
          max-height: calc(100vh - clamp(100px, 13vw, 180px));
          position: sticky;
          top: clamp(100px, 13vw, 180px);
        }

        /* ── Station card ── */
        .lp-card {
          display: flex; align-items: center; gap: clamp(10px, 1.2vw, 20px);
          padding: clamp(10px, 1.2vw, 18px) clamp(8px, 0.8vw, 14px);
          border-radius: 12px;
          cursor: pointer;
          transition: background .15s, padding-left .18s;
          opacity: 0;
          animation: cardIn .35s ease forwards;
        }
        .lp-card:hover { background: #e8f4fa99; padding-left: clamp(14px, 1.5vw, 24px); }
        .lp-card + .lp-card { border-top: 1px solid #1c618c14; }
        @keyframes cardIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: none; }
        }
        .lp-card-logo   { width: clamp(40px, 4.5vw, 70px); height: clamp(40px, 4.5vw, 70px); object-fit: contain; flex-shrink: 0; }
        .lp-card-brand  { color: #1c618c; font-family: "Roboto Mono", monospace; font-size: clamp(12px, 1.1vw, 17px); font-weight: 700; margin-bottom: 3px; }
        .lp-card-addr   { color: #3178ad; font-family: "Roboto Mono", monospace; font-size: clamp(11px, 1vw, 15px); line-height: 1.45; }
        .lp-empty       { color: #3178ad88; font-family: "Roboto Mono", monospace; font-size: clamp(12px, 1vw, 15px); padding: 20px 0; }

        /* ── Right panel (map) ── */
        .lp-right {
          padding: clamp(20px, 2.5vw, 40px);
          display: flex; flex-direction: column; gap: 16px;
          background: #f8f4ee;
        }
        .lp-map-title {
          color: #1c618c; font-family: "Roboto Mono", monospace;
          font-weight: 700; font-size: clamp(16px, 1.8vw, 28px);
        }
        .lp-map-frame {
          flex: 1; min-height: 400px; width: 100%;
          border-radius: 14px; border: 2px solid #1c618c44;
        }
        .lp-details-area {
          display: flex; gap: clamp(14px, 1.6vw, 24px);
          align-items: flex-start; width: 100%;
        }
        .lp-details-panel, .lp-request-panel {
          background: #fffbf4;
          border: 2px solid #1c618c;
          border-radius: 14px;
          padding: clamp(14px, 1.5vw, 22px);
          box-shadow: 0 14px 32px #1c618c18;
          animation: detailsIn .3s ease both;
        }
        .lp-details-panel { flex: 1.15; min-width: min(100%, 340px); }
        .lp-request-panel { flex: .85; min-width: min(100%, 280px); }
        @keyframes detailsIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
        .lp-detail-head {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 14px;
        }
        .lp-detail-logo {
          width: clamp(44px, 4.5vw, 72px);
          height: clamp(44px, 4.5vw, 72px);
          object-fit: contain; flex-shrink: 0;
        }
        .lp-detail-brand {
          color: #1c618c; font-family: "Roboto Mono", monospace;
          font-size: clamp(16px, 1.6vw, 26px); font-weight: 700;
        }
        .lp-detail-address, .lp-update-info {
          color: #3178ad; font-family: "Roboto Mono", monospace;
          font-size: clamp(11px, 1vw, 15px); line-height: 1.45;
        }
        .lp-price-row {
          display: flex; justify-content: space-between; gap: 12px;
          padding: 10px 0; border-top: 1px solid #1c618c18;
          color: #1c618c; font-family: "Roboto Mono", monospace;
          font-size: clamp(11px, 1vw, 15px); font-weight: 700;
        }
        .lp-price-value { color: #3178ad; white-space: nowrap; }
        .lp-detail-map {
          width: 100%; height: clamp(210px, 25vw, 340px);
          border-radius: 12px; border: 2px solid #1c618c44;
          margin: 14px 0;
        }
        .lp-action-btn {
          width: 100%; background: #3178ad; color: #fff;
          border: none; border-radius: 8px;
          padding: 13px 16px; cursor: pointer;
          font-family: "Roboto Mono", monospace; font-weight: 700;
          font-size: clamp(12px, 1vw, 16px);
          transition: background .2s, transform .15s;
        }
        .lp-action-btn:hover { background: #1e5a85; transform: translateY(-1px); }
        .lp-request-title {
          color: #1c618c; font-family: "Roboto Mono", monospace;
          font-size: clamp(14px, 1.3vw, 20px); font-weight: 700;
          margin-bottom: 12px;
        }
        .lp-request-field { margin-bottom: 12px; }
        .lp-request-label {
          display: block; color: #1c618c; font-family: "Roboto Mono", monospace;
          font-size: clamp(11px, .95vw, 14px); font-weight: 700;
          margin-bottom: 5px;
        }
        .lp-request-input {
          width: 100%; border: 2px solid #1c618c44; border-radius: 8px;
          background: #fff; color: #1c618c; outline: none;
          padding: 10px 12px; font-family: "Roboto Mono", monospace;
          font-size: 14px;
        }
        .lp-request-input:focus { border-color: #3178ad; }
        .lp-success {
          background: #22c55e; color: #fff;
          border-radius: 8px; padding: 12px;
          font-family: "Roboto Mono", monospace; font-weight: 700;
          font-size: 13px; text-align: center; margin-top: 10px;
        }
        @media (max-width: 980px) {
          .lp-body { grid-template-columns: 1fr; }
          .lp-left { position: relative; top: auto; max-height: none; border-right: none; }
          .lp-details-area { flex-direction: column; }
          .lp-details-panel, .lp-request-panel { width: 100%; }
        }
      `}</style>

      {/* Wave background */}
      <WaveCanvas />

      {/* ── Navbar ── */}
      <div className="lp-navbar">
        <div className="lp-nav-row">
          <div className="lp-nav-left">
            <button className="lp-icon-btn" onClick={() => { setMenuOpen(v => !v); setSettingsOpen(false); }}><FaBars /></button>
            {menuOpen && <BurgerDropdown actions={burgerActions} />}
            <button className="lp-icon-btn"><FaSearch /></button>
            <input
              type="text"
              placeholder="Search stations..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                border: "none", outline: "none", background: "transparent",
                color: "#1c618c", fontFamily: '"Roboto Mono", monospace',
                fontSize: "1vw", width: "15vw",
              }}
            />
          </div>

          {/* Centre logo */}
          <a href="/" style={{ position: "absolute", left: "50%", transform: "translateX(-50%) translateY(1vw)", zIndex: 10 }}>
            <img src={philUpLogo} alt="Phil Up" style={{ width: "10vw", height: "10vw" }} />
          </a>

          <div className="lp-nav-right">
            <button className="lp-icon-btn"><FaBell /></button>
            <button className="lp-icon-btn" onClick={() => { setSettingsOpen(v => !v); setMenuOpen(false); }}>
              <FaUserCircle style={{ fontSize: "2.3vw" }} />
            </button>
          </div>
        </div>

        {/* Dividers */}
        <div className="lp-dividers">
          <div className="lp-div-row">
            <div className="lp-line" /><div className="lp-line-blank" /><div className="lp-line" />
          </div>
          <div className="lp-div-row">
            <div style={{ ...{height:0, borderRadius:"0.25vw", border:"0.25vw solid #1c618c", margin:"1vw"}, width:"20vw" }} />
            <div style={{ width:"20vw", margin:"1vw" }} />
            <div style={{ width:"20vw", margin:"1vw" }} />
            <div style={{ ...{height:0, borderRadius:"0.25vw", border:"0.25vw solid #1c618c", margin:"1vw"}, width:"20vw" }} />
          </div>
        </div>

        {settingsOpen && (
          <div className="lp-dropdown" style={{ left: "auto", right: "2.5vw" }}>
            {isLoggedIn
              ? <><a href="/profile" className="lp-drop-link">Profile</a><a href="/settings" className="lp-drop-link">Settings</a></>
              : <a href="/login" className="lp-drop-link">Log In</a>
            }
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className={`lp-wrap${mounted ? " in" : ""}`} style={{ position: "relative", zIndex: 1 }}>
        <div className="lp-body">

          {/* Left: station list */}
          <div className="lp-left">
            {filtered.length === 0
              ? <p className="lp-empty">No stations match your search.</p>
              : filtered.map((s, i) => (
                <div
                  key={s.fuelLocID}
                  className="lp-card"
                  style={{ animationDelay: `${i * 55}ms` }}
                  onClick={() => handleSelectStation(s)}
                >
                  <img src={s.brandLogo} alt={s.brandName} className="lp-card-logo" />
                  <div>
                    <p className="lp-card-brand">{s.brandName}</p>
                    <p className="lp-card-addr">{s.stationAdd}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Right: map or searched station details */}
          <div className="lp-right">
            {activeStation ? (
              <>
                <h2 className="lp-map-title">Station Details</h2>
                <div className="lp-details-area">
                  <section className="lp-details-panel" aria-label={`${activeStation.brandName} station details`}>
                    <div className="lp-detail-head">
                      <img src={activeStation.brandLogo} alt={activeStation.brandName} className="lp-detail-logo" />
                      <div>
                        <p className="lp-detail-brand">{activeStation.brandName}</p>
                        <p className="lp-detail-address">{activeStation.stationAdd}</p>
                      </div>
                    </div>

                    {selectedFuels.map(fuel => (
                      <div className="lp-price-row" key={fuel.id}>
                        <span>{fuel.name}</span>
                        <span className="lp-price-value">PHP {fuel.price}</span>
                      </div>
                    ))}

                    <iframe
                      src={activeStation.mapSrc ?? mapSrc}
                      className="lp-detail-map"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${activeStation.brandName} Map`}
                    />

                    <p className="lp-update-info">
                      Latest update: {activeStation.lastUpdatedAt ?? "May 17, 2026"} by {activeStation.lastUpdatedBy ?? "PhilUp user"}
                    </p>

                    <button
                      type="button"
                      className="lp-action-btn"
                      style={{ marginTop: 14 }}
                      onClick={() => {
                        setRequestOpen(true);
                        setRequestSubmitted(false);
                      }}
                    >
                      Request Price Change
                    </button>
                  </section>

                  {requestOpen && (
                    <form className="lp-request-panel" onSubmit={handleSubmitRequest}>
                      <h3 className="lp-request-title">Request Price Change</h3>
                      {selectedFuels.map(fuel => (
                        <label className="lp-request-field" key={fuel.id}>
                          <span className="lp-request-label">{fuel.name}</span>
                          <input
                            className="lp-request-input"
                            inputMode="decimal"
                            placeholder={fuel.price}
                            value={proposedPrices[fuel.id] ?? ""}
                            onChange={e => handleRequestChange(fuel.id, e.target.value)}
                          />
                        </label>
                      ))}

                      <button type="submit" className="lp-action-btn">Submit for Review</button>
                      {requestSubmitted && (
                        <div className="lp-success">Price change request submitted for review.</div>
                      )}
                    </form>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="lp-map-title">Stations Near You</h2>
                <iframe
                  src={mapSrc}
                  className="lp-map-frame"
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Stations Map"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
