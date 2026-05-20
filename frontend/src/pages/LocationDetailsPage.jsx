import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import philUpLogo from "../assets/Phil Up 2.png";
import shellLogo from "../assets/brand-images/ShellLogo.png";
import { getSessionUser, logoutSession } from "../utils/session";

// ─── Replace with real API call using `id` from useParams ───────────────────
const MOCK_STATION = {
  brandLogo: shellLogo,
  brandName: "Shell",
  stationAdd: "Gregorio Araneta Ave - Maria Clara St., Quezon City",
  lastUpdatedBy: "Jonathan43",
  mapSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.746!2d121.0114!3d14.6249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b79e040706e1%3A0x6e8e10bd3f0da5c!2sShell!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph",
  fuels: [
    { id: 1, name: "V-Power Racing (Gasoline)", price: "067.25" },
    { id: 2, name: "V-Power (Gasoline)",        price: "066.80" },
    { id: 3, name: "V-Power (Diesel)",          price: "052.98" },
    { id: 4, name: "FuelSave (Gasoline)",        price: "065.43" },
    { id: 5, name: "FuelSave (Diesel)",          price: "050.85" },
  ],
};

// ─── Wave canvas — same technique as Login.jsx, fills the full page bg ───────
function WaveCanvas() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Four layers — same colours as Login.jsx WaveCanvasLeft
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
          ctx.lineTo(cx + Math.sin(y * freq + tRef.current * speed + phase) * amp, y);
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      });

      tRef.current += 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0,
        width: "100vw", height: "100vh",
        zIndex: 0, pointerEvents: "none",
      }}
    />
  );
}

// ─── Digit display boxes — identical to HomePage ──────────────────────────────
function GasPriceDigits({ digits = "000.00" }) {
  const [intRaw = "000", decRaw = "00"] = digits.split(".");
  const intPart = intRaw.padStart(3, "0").split("");
  const decPart = decRaw.padStart(2, "0").split("");
  const box = {
    fontFamily: '"ZCOOL QingKe HuangYou", sans-serif',
    fontSize: "clamp(18px, 2.2vw, 32px)",
    textAlign: "center",
    backgroundColor: "#a1e3f9",
    color: "#3178ad",
    width: "clamp(18px, 1.9vw, 28px)",
    display: "inline-block",
    borderRadius: "3px",
    lineHeight: 1.1,
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "10px" }}>
      {intPart.map((d, i) => <span key={`i${i}`} style={box}>{d}</span>)}
      <span style={box}>.</span>
      {decPart.map((d, i) => <span key={`d${i}`} style={box}>{d}</span>)}
    </div>
  );
}

// ─── Shared navbar matching HomePage exactly ──────────────────────────────────
function Navbar({ navigate, menuOpen, setMenuOpen, settingsOpen, setSettingsOpen, isLoggedIn }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0,
      zIndex: 100, backgroundColor: "#fffbf4",
    }}>
      {/* Top row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.5vw 2.5vw 0",
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", width: "25vw", height: "5vw" }}>
          <button onClick={() => { setMenuOpen(v => !v); setSettingsOpen(false); }}
            style={NAV_BTN}><FaBars /></button>
          <button onClick={() => navigate("/locations")} style={NAV_BTN}><FaSearch /></button>
          <span style={{ color: "#1c618c55", fontFamily: '"Roboto Mono", monospace', fontSize: "1vw" }}>
            Search stations...
          </span>
        </div>

       {/* Centre logo */}
<div
  onClick={() => {
    navigate("/");
  }}
  style={{
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%) translateY(1vw)",
    zIndex: 10,
    cursor: "pointer",
  }}
>
  <img
    src={philUpLogo}
    alt="Phil Up"
    style={{
      width: "10vw",
      height: "10vw",
    }}
  />
</div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", width: "25vw", justifyContent: "flex-end" }}>
          <button style={NAV_BTN}><FaBell /></button>
          <button onClick={() => { setSettingsOpen(v => !v); setMenuOpen(false); }} style={NAV_BTN}>
            <FaUserCircle style={{ fontSize: "2.3vw" }} />
          </button>
        </div>
      </div>

      {/* Dividers */}
      <div style={{ display: "flex", flexDirection: "column", padding: "0 2.5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={LINE} /><div style={{ ...LINE, border: "none" }} /><div style={LINE} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ ...LINE, width: "20vw" }} />
          <div style={{ ...LINE, width: "20vw", border: "none" }} />
          <div style={{ ...LINE, width: "20vw", border: "none" }} />
          <div style={{ ...LINE, width: "20vw" }} />
        </div>
      </div>

      {/* Menu dropdown */}
      {menuOpen && (
  <div style={DROPDOWN}>
    {[
      "Top Lowest",
      "Most Visited",
      "Locations",
      "Nearest",

      ...(isLoggedIn
        ? [
            getSessionUser()?.userName,

            ...(getSessionUser()?.userPermissionLevel > 0
              ? ["Switch as Admin"]
              : []),

            "Log Out"
          ]
        : ["Log In"])
    ].map(label => (
      <p
        key={label}
        style={DROP_ITEM}
        onClick={() => {

          if(label==="Log In"){
   setMenuOpen(false);
   navigate("/login");
}

          else if(label==="Log Out"){
   setMenuOpen(false);
   logoutSession();
   navigate("/login");
}

          else if(label==="Switch as Admin"){
   setMenuOpen(false);
   navigate("/admin");
}

          else if(label===getSessionUser()?.userName){
   setMenuOpen(false);
   navigate("/profile");
}

         else{
   setMenuOpen(false);
   navigate("/locations");
}

        }}
      >
        {label}
      </p>
    ))}
  </div>
)}

      {/* Settings dropdown */}
      {settingsOpen && (
        <div style={{ ...DROPDOWN, left: "auto", right: "2.5vw" }}>
         {isLoggedIn ? (
<>
<p
style={{cursor:"pointer"}}
onClick={()=>{
setSettingsOpen(false);
navigate("/profile");
}}
>
{getSessionUser()?.userName}
</p>

{getSessionUser()?.userPermissionLevel>0 && (
<p
style={{cursor:"pointer"}}
onClick={()=>{
setSettingsOpen(false);
navigate("/admin");
}}
>
Switch as Admin
</p>
)}

<p
style={{cursor:"pointer"}}
onClick={()=>{
setSettingsOpen(false);
logoutSession();
navigate("/login");
}}
>
Log Out
</p>

</>
) : (
<p
style={{cursor:"pointer"}}
onClick={()=>{
   setSettingsOpen(false);
   navigate("/login");
}}
>
Log In
</p>
)}
        </div>
      )}
    </div>
  );
}

// ─── Shared style constants ────────────────────────────────────────────────────
const NAV_BTN = {
  background: "transparent", border: "none", cursor: "pointer",
  color: "#1c618c", fontSize: "2vw", display: "flex", alignItems: "center",
};
const LINE = {
  width: "25vw", height: 0, borderRadius: "0.25vw",
  border: "0.25vw solid #1c618c", margin: "1vw",
};
const DROPDOWN = {
  position: "absolute", zIndex: 200, background: "#fffbf4",
  border: "0.25vw solid #1c618c", borderRadius: "0 0 2vw 2vw",
  padding: "2vw", width: "20.5vw",
  fontFamily: '"Roboto Mono", monospace', fontSize: "2vw",
  fontWeight: 700, color: "#1c618c",
};
const DROP_ITEM = { cursor: "pointer", marginBottom: "0.5vw", transition: "opacity .15s" };
const DROP_LINK = { display: "block", color: "#1c618c", textDecoration: "none", marginBottom: "0.5vw" };
const BLUE_BAR = {
  background: "#3178ad", color: "#fff",
  fontFamily: '"Roboto Mono", monospace', fontWeight: 700,
  fontSize: "clamp(12px, 1.1vw, 18px)", padding: "12px 20px",
  borderRadius: "8px", textAlign: "center",
  marginBottom: "12px", cursor: "default",
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LocationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

const user = getSessionUser();
const isLoggedIn = !!user;

  const station = MOCK_STATION; // replace with useEffect fetch
  const [menuOpen,    setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=ZCOOL+QingKe+HuangYou&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fffbf4; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 0; }

        .ldp-wrap {
          opacity: 0; transform: translateY(16px);
          transition: opacity .5s ease, transform .5s ease;
        }
        .ldp-wrap.in { opacity: 1; transform: none; }

        .ldp-price-box {
          background: #fffbf4;
          border: 2px solid #1c618c;
          border-radius: 14px;
          padding: clamp(14px, 1.5vw, 24px);
          margin-bottom: 14px;
          animation: boxIn .5s ease .15s both;
        }
        @keyframes boxIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }

        .ldp-fuel-name {
          color: #1c618c;
          font-family: "Roboto Mono", monospace;
          font-size: clamp(11px, 1.1vw, 16px);
          font-weight: 700;
          margin-bottom: 4px;
        }

        .ldp-bar-btn {
          width: 100%;
          background: #3178ad;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 14px 20px;
          font-family: "Roboto Mono", monospace;
          font-weight: 700;
          font-size: clamp(12px, 1.1vw, 18px);
          text-align: center;
          margin-bottom: 12px;
          cursor: pointer;
          transition: background .2s, transform .15s;
        }
        .ldp-bar-btn:hover { background: #1e5a85; transform: translateY(-1px); }

        .ldp-map-frame {
          width: 100%;
          height: clamp(300px, 42vw, 600px);
          border-radius: 14px;
          border: 2px solid #1c618c44;
          display: block;
          animation: boxIn .5s ease .25s both;
        }

        .ldp-station-header {
          display: flex; align-items: center; gap: clamp(10px, 1.5vw, 24px);
          margin-bottom: clamp(14px, 1.5vw, 24px);
          animation: boxIn .4s ease .05s both;
        }
        .ldp-brand-logo {
          width: clamp(48px, 5vw, 80px);
          height: clamp(48px, 5vw, 80px);
          object-fit: contain; flex-shrink: 0;
        }
        .ldp-station-addr {
          color: #1c618c;
          font-family: "Roboto Mono", monospace;
          font-size: clamp(12px, 1.3vw, 20px);
          font-weight: 700;
          line-height: 1.4;
        }
      `}</style>

      {/* Wave background */}
      <WaveCanvas />

      {/* Navbar */}
      <Navbar
        navigate={navigate}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen}
        isLoggedIn={isLoggedIn}
      />

      {/* Page body — pushed below fixed navbar */}
      <div
        className={`ldp-wrap${mounted ? " in" : ""}`}
        style={{
          position: "relative", zIndex: 1,
          paddingTop: "clamp(100px, 13vw, 180px)",
          paddingBottom: "60px",
          display: "flex",
          gap: "clamp(20px, 3vw, 60px)",
          alignItems: "flex-start",
          padding: `clamp(100px, 13vw, 180px) clamp(20px, 4vw, 60px) 60px`,
          minHeight: "100vh",
          fontFamily: '"Roboto Mono", monospace',
        }}
      >
        {/* ── LEFT COLUMN ── */}
        <div style={{ width: "clamp(280px, 38%, 520px)", flexShrink: 0 }}>

          {/* Station header */}
          <div className="ldp-station-header">
            <img src={station.brandLogo} alt={station.brandName} className="ldp-brand-logo" />
            <p className="ldp-station-addr">{station.stationAdd}</p>
          </div>

          {/* Fuel prices */}
          <div className="ldp-price-box">
            {station.fuels.map(fuel => (
              <div key={fuel.id}>
                <p className="ldp-fuel-name">{fuel.name}</p>
                <GasPriceDigits digits={fuel.price} />
              </div>
            ))}
          </div>

          {/* Last updated bar */}
          <div style={BLUE_BAR}>
            Last updated by {station.lastUpdatedBy}
          </div>

          {/* Request Update button → goes to UploadPricePage */}
          <button
            className="ldp-bar-btn"
            onClick={() => navigate(`/upload-price/${id}`)}
          >
            Request Update?
          </button>
        </div>

        {/* ── RIGHT COLUMN — Map ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <iframe
            src={station.mapSrc}
            className="ldp-map-frame"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Station Map"
          />
        </div>
      </div>
    </>
  );
}