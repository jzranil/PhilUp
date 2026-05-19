import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import philUpLogo from "../assets/Phil Up 2.png";
import shellLogo from "../assets/ShellLogo.png";

import {
getSessionUser,
isLoggedIn,
logoutSession
}
from "../utils/session";

// ─── Replace with real API call using `id` ────────────────────────────────────
const MOCK_STATION = {
  brandLogo: shellLogo,
  brandName: "Shell",
  stationAdd: "Gregorio Araneta Ave - Maria Clara St., Quezon City",
  lastProposedBy: "BrotherNiJ43",
  fuels: [
    { id: 1, name: "V-Power Racing (Gasoline)", price: "067.25" },
    { id: 2, name: "V-Power (Gasoline)",        price: "066.80" },
    { id: 3, name: "V-Power (Diesel)",          price: "052.98" },
    { id: 4, name: "FuelSave (Gasoline)",        price: "065.43" },
    { id: 5, name: "FuelSave (Diesel)",          price: "050.85" },
  ],
};

// ─── Wave canvas ─────────────────────────────────────────────────────────────
function WaveCanvas() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
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
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0,
      width: "100vw", height: "100vh",
      zIndex: 0, pointerEvents: "none",
    }} />
  );
}

// ─── Static digit display ──────────────────────────────────────────────────────
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

// ─── Editable digit input ──────────────────────────────────────────────────────
function PriceInput({ value, onChange }) {
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

  // Parse value into int digits + dec digits
  const [intRaw = "000", decRaw = "00"] = value.split(".");
  const intPart = intRaw.padStart(3, "0").split("");
  const decPart = decRaw.padStart(2, "0").split("");

  // On change we just update the whole value via a hidden input approach
  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    onChange(cleaned);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "10px", position: "relative" }}>
      {/* Visible styled display */}
      {intPart.map((d, i) => <span key={`i${i}`} style={box}>{d || "0"}</span>)}
      <span style={box}>.</span>
      {decPart.map((d, i) => <span key={`d${i}`} style={box}>{d || "0"}</span>)}

      {/* Invisible real input on top */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        maxLength={6}
        placeholder="000.00"
        style={{
          position: "absolute", inset: 0,
          opacity: 0, cursor: "text",
          width: "100%", height: "100%",
          fontSize: "inherit",
        }}
      />
    </div>
  );
}

// ─── Shared navbar ─────────────────────────────────────────────────────────────
function Navbar({ navigate, menuOpen, setMenuOpen, settingsOpen, setSettingsOpen, isLoggedIn }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "#fffbf4" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5vw 2.5vw 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", width: "25vw", height: "5vw" }}>
          <button onClick={() => { setMenuOpen(v => !v); setSettingsOpen(false); }} style={NAV_BTN}><FaBars /></button>
          <button onClick={() => navigate("/locations")} style={NAV_BTN}><FaSearch /></button>
          <span style={{ color: "#1c618c55", fontFamily: '"Roboto Mono", monospace', fontSize: "1vw" }}>Search stations...</span>
        </div>
        <a href="/" style={{ position: "absolute", left: "50%", transform: "translateX(-50%) translateY(1vw)", zIndex: 10 }}>
          <img src={philUpLogo} alt="Phil Up" style={{ width: "10vw", height: "10vw" }} />
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", width: "25vw", justifyContent: "flex-end" }}>
          <button style={NAV_BTN}><FaBell /></button>
          <button onClick={() => { setSettingsOpen(v => !v); setMenuOpen(false); }} style={NAV_BTN}>
            <FaUserCircle style={{ fontSize: "2.3vw" }} />
          </button>
        </div>
      </div>
      {/* Dividers */}
      <div style={{ display: "flex", flexDirection: "column", padding: "0 2.5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={LINE} /><div style={{ ...LINE, border: "none" }} /><div style={LINE} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ ...LINE, width: "20vw" }} /><div style={{ ...LINE, width: "20vw", border: "none" }} />
          <div style={{ ...LINE, width: "20vw", border: "none" }} /><div style={{ ...LINE, width: "20vw" }} />
        </div>
      </div>
      {menuOpen && (
<div style={DROPDOWN}>

<p
style={DROP_ITEM}
onClick={()=>navigate("/locations")}
>
Top Lowest
</p>

<p
style={DROP_ITEM}
onClick={()=>navigate("/locations")}
>
Most Visited
</p>

<p
style={DROP_ITEM}
onClick={()=>navigate("/locations")}
>
Locations
</p>

<p
style={DROP_ITEM}
onClick={()=>navigate("/locations")}
>
Nearest
</p>

{isLoggedIn && (
<>
<p
style={DROP_ITEM}
onClick={()=>navigate("/profile")}
>
{getSessionUser()?.userName}
</p>

{getSessionUser()?.userPermissionLevel>0 && (
<p
style={DROP_ITEM}
onClick={()=>navigate("/admin")}
>
Switch as Admin
</p>
)}

<p
style={DROP_ITEM}
onClick={()=>{
logoutSession();
navigate("/login");
}}
>
Log Out
</p>
</>
)}

{!isLoggedIn && (
<p
style={DROP_ITEM}
onClick={()=>navigate("/login")}
>
Log In
</p>
)}

</div>
)}
      {settingsOpen && (
        <div style={{ ...DROPDOWN, left: "auto", right: "2.5vw" }}>
          {isLoggedIn
            ? <><a href="/profile" style={DROP_LINK}>Profile</a><a href="/settings" style={DROP_LINK}>Settings</a></>
            : <a href="/login" style={DROP_LINK}>Log In</a>
          }
        </div>
      )}
    </div>
  );
}

const NAV_BTN  = { background: "transparent", border: "none", cursor: "pointer", color: "#1c618c", fontSize: "2vw", display: "flex", alignItems: "center" };
const LINE     = { width: "25vw", height: 0, borderRadius: "0.25vw", border: "0.25vw solid #1c618c", margin: "1vw" };
const DROPDOWN = { position: "absolute", zIndex: 200, background: "#fffbf4", border: "0.25vw solid #1c618c", borderRadius: "0 0 2vw 2vw", padding: "2vw", width: "20.5vw", fontFamily: '"Roboto Mono", monospace', fontSize: "2vw", fontWeight: 700, color: "#1c618c" };
const DROP_ITEM = { cursor: "pointer", marginBottom: "0.5vw" };
const DROP_LINK = { display: "block", color: "#1c618c", textDecoration: "none", marginBottom: "0.5vw" };

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function UploadPricePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = getSessionUser();
  const loggedIn = isLoggedIn();

  const station = MOCK_STATION;
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  // Proposed prices keyed by fuel id, initialised to empty
  const [proposed, setProposed] = useState(
    station.fuels.reduce((acc, f) => ({ ...acc, [f.id]: "" }), {})
  );

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const handleProposedChange = (fuelId, value) => {
    setProposed(prev => ({ ...prev, [fuelId]: value }));
  };

  const handleSubmit = () => {
    // TODO: POST proposed prices to backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      navigate(`/locations/${id}`);
    }, 2000);
  };

  const PRICE_BOX_STYLE = {
    background: "#fffbf4",
    border: "2px solid #1c618c",
    borderRadius: "14px",
    padding: "clamp(14px, 1.5vw, 24px)",
    animation: "boxIn .5s ease .15s both",
  };

  const FUEL_NAME_STYLE = {
    color: "#1c618c",
    fontFamily: '"Roboto Mono", monospace',
    fontSize: "clamp(11px, 1.1vw, 16px)",
    fontWeight: 700,
    marginBottom: "4px",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=ZCOOL+QingKe+HuangYou&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fffbf4; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 0; }

        .upp-wrap {
          opacity: 0; transform: translateY(16px);
          transition: opacity .5s ease, transform .5s ease;
        }
        .upp-wrap.in { opacity: 1; transform: none; }

        @keyframes boxIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }

        .upp-submit-btn {
          width: 100%;
          background: #3178ad;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-family: "Roboto Mono", monospace;
          font-weight: 700;
          font-size: clamp(13px, 1.2vw, 20px);
          cursor: pointer;
          margin-top: 12px;
          transition: background .2s, transform .15s;
        }
        .upp-submit-btn:hover { background: #1e5a85; transform: translateY(-1px); }
        .upp-submit-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }

        .upp-success {
          background: #22c55e; color: #fff;
          border-radius: 8px; padding: 14px;
          font-family: "Roboto Mono", monospace;
          font-weight: 700; font-size: 14px;
          text-align: center; margin-top: 12px;
          animation: boxIn .3s ease;
        }
      `}</style>

      <WaveCanvas />

 <Navbar
  navigate={navigate}
  menuOpen={menuOpen}
  setMenuOpen={setMenuOpen}
  settingsOpen={settingsOpen}
  setSettingsOpen={setSettingsOpen}
  isLoggedIn={loggedIn}
/>

      <div
        className={`upp-wrap${mounted ? " in" : ""}`}
        style={{
          position: "relative", zIndex: 1,
          padding: `clamp(100px, 13vw, 180px) clamp(20px, 4vw, 60px) 60px`,
          minHeight: "100vh",
          display: "flex",
          gap: "clamp(20px, 3vw, 60px)",
          alignItems: "flex-start",
          fontFamily: '"Roboto Mono", monospace',
        }}
      >
        {/* ── LEFT COLUMN — current prices ── */}
        <div style={{ width: "clamp(260px, 36%, 500px)", flexShrink: 0 }}>

          {/* Station header */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: "clamp(10px, 1.5vw, 24px)", marginBottom: "clamp(14px, 1.5vw, 24px)",
            animation: "boxIn .4s ease .05s both",
          }}>
            <img src={station.brandLogo} alt={station.brandName}
              style={{ width: "clamp(48px, 5vw, 80px)", height: "clamp(48px, 5vw, 80px)", objectFit: "contain", flexShrink: 0 }} />
            <p style={{ color: "#1c618c", fontFamily: '"Roboto Mono", monospace', fontSize: "clamp(12px, 1.3vw, 20px)", fontWeight: 700, lineHeight: 1.4 }}>
              {station.stationAdd}
            </p>
          </div>

          {/* Current prices box */}
          <div style={PRICE_BOX_STYLE}>
            {station.fuels.map(fuel => (
              <div key={fuel.id}>
                <p style={FUEL_NAME_STYLE}>{fuel.name}</p>
                <GasPriceDigits digits={fuel.price} />
              </div>
            ))}
          </div>

          {/* Changes proposal bar */}
          <div style={{
            background: "#3178ad", color: "#fff",
            fontFamily: '"Roboto Mono", monospace', fontWeight: 700,
            fontSize: "clamp(12px, 1.1vw, 18px)", padding: "14px 20px",
            borderRadius: "8px", textAlign: "center",
          }}>
            Changes Proposal by {station.lastProposedBy}
          </div>
        </div>

        {/* ── RIGHT COLUMN — proposed price inputs ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            color: "#1c618c", fontFamily: '"Roboto Mono", monospace',
            fontWeight: 700, fontSize: "clamp(18px, 2vw, 32px)",
            marginBottom: "clamp(14px, 1.5vw, 24px)",
            animation: "boxIn .4s ease .1s both",
          }}>
            Request Price Change
          </h2>

          {/* Proposed prices box */}
          <div style={{ ...PRICE_BOX_STYLE, animation: "boxIn .5s ease .2s both" }}>
            {station.fuels.map(fuel => (
              <div key={fuel.id}>
                <p style={FUEL_NAME_STYLE}>{fuel.name}</p>
                <PriceInput
                  value={proposed[fuel.id]}
                  onChange={v => handleProposedChange(fuel.id, v)}
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            className="upp-submit-btn"
            onClick={handleSubmit}
            disabled={submitted}
          >
            {submitted ? "Submitting…" : "Submit"}
          </button>

          {submitted && (
            <div className="upp-success">
              Submitted! Redirecting you back…
            </div>
          )}
        </div>
      </div>
    </>
  );
}