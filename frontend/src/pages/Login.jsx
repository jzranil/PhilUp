import { useState, useEffect, useRef } from "react";
import logo from "../assets/Phil UP 2.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LOGO_SRC = logo;

const PhilUpSVGLogo = () => (
  <svg
    width="200"
    height="130"
    viewBox="0 0 210 135"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="4"
      y="48"
      fontFamily="Georgia,serif"
      fontSize="36"
      fontWeight="700"
      fill="#1a3a5c"
      letterSpacing="4"
    >
      PHIL
    </text>
    <rect x="108" y="10" width="16" height="54" rx="5" fill="#1a3a5c" />
    <rect x="142" y="10" width="16" height="54" rx="5" fill="#1a3a5c" />
    <path
      d="M108 57 Q108 84 133 84 Q158 84 158 57"
      fill="none"
      stroke="#1a3a5c"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <clipPath id="uClip2">
      <path d="M116 38 L116 66 Q116 76 133 76 Q150 76 150 66 L150 38 Z" />
    </clipPath>
    <rect
      x="116"
      y="38"
      width="34"
      height="42"
      clipPath="url(#uClip2)"
      fill="#f5a623"
    />
    <rect x="159" y="16" width="10" height="28" rx="4" fill="#1a3a5c" />
    <rect x="154" y="42" width="20" height="8" rx="4" fill="#1a3a5c" />
    <path
      d="M164 54 C164 54 158 65 158 70 C158 77 170 77 170 70 C170 65 164 54 164 54Z"
      fill="#f5a623"
    />
  </svg>
);

/* ── Wave Canvas: draws from LEFT edge (login mode) ── */
function WaveCanvasLeft({ xOffset = 0 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);
  const xOffRef = useRef(xOffset);
  useEffect(() => {
    xOffRef.current = xOffset;
  }, [xOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const layers = [
      {
        color: "#5aabda",
        xBase: 0.57,
        amp: 40,
        freq: 0.009,
        speed: 0.0007,
        phase: 0.0,
      },
      {
        color: "#2e87be",
        xBase: 0.52,
        amp: 44,
        freq: 0.011,
        speed: 0.0005,
        phase: 4.5,
      },
      {
        color: "#1e6a9a",
        xBase: 0.47,
        amp: 38,
        freq: 0.013,
        speed: 0.0004,
        phase: 9.3,
      },
      {
        color: "#1a4f78",
        xBase: 0.42,
        amp: 34,
        freq: 0.01,
        speed: 0.0003,
        phase: 14.0,
      },
    ];
    const draw = () => {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      layers.forEach(({ color, xBase, amp, freq, speed, phase }) => {
        const cx = W * xBase + xOffRef.current;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let y = 0; y <= H + 4; y += 3)
          ctx.lineTo(
            cx + Math.sin(y * freq + tRef.current * speed + phase) * amp,
            y,
          );
        ctx.lineTo(0, H);
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
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    />
  );
}

/* ── Wave Canvas: draws from RIGHT edge (signup mode) ── */
function WaveCanvasRight() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const layers = [
      {
        color: "#5aabda",
        xBase: 0.43,
        amp: 40,
        freq: 0.009,
        speed: 0.0007,
        phase: 0.0,
      },
      {
        color: "#2e87be",
        xBase: 0.48,
        amp: 44,
        freq: 0.011,
        speed: 0.0005,
        phase: 4.5,
      },
      {
        color: "#1e6a9a",
        xBase: 0.53,
        amp: 38,
        freq: 0.013,
        speed: 0.0004,
        phase: 9.3,
      },
      {
        color: "#1a4f78",
        xBase: 0.58,
        amp: 34,
        freq: 0.01,
        speed: 0.0003,
        phase: 14.0,
      },
    ];
    const draw = () => {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      layers.forEach(({ color, xBase, amp, freq, speed, phase }) => {
        const cx = W * xBase;
        ctx.beginPath();
        ctx.moveTo(W, 0);
        for (let y = 0; y <= H + 4; y += 3)
          ctx.lineTo(
            cx - Math.sin(y * freq + tRef.current * speed + phase) * amp,
            y,
          );
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
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    />
  );
}

/* ── Sweep wave overlay: animates across the full screen ── */
function SweepWave({ active, onDone }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width,
      H = canvas.height;
    const DURATION = 900; // ms — total sweep duration
    const start = performance.now();

    /*
      Phase 1 (0 → 60%): wave band sweeps from left-of-screen to right-of-screen
      Phase 2 (60% → 100%): band wraps: reappears from left, fades out
    */
    const drawFrame = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, W, H);

      // Band centre x:
      // Phase 1: goes from -W*0.3 → W*1.3  (across screen)
      // Phase 2: jumps back to -W*0.3 and continues to W*0.5 then fades
      let cx, alpha;
      if (t <= 0.6) {
        const p = t / 0.6;
        const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        cx = -W * 0.25 + e * W * 1.5;
        alpha = 1;
      } else {
        const p = (t - 0.6) / 0.4;
        const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        cx = -W * 0.25 + e * W * 0.8;
        alpha = 1 - p;
      }

      const bandW = W * 0.45;
      const colors = ["#5aabda", "#2e87be", "#1e6a9a", "#1a4f78"];

      colors.forEach((color, i) => {
        const offset = (i - 1.5) * (bandW / colors.length) * 0.6;
        const amp = 38 - i * 6;
        const freq = 0.008 + i * 0.002;

        ctx.globalAlpha = alpha * (0.75 - i * 0.05);
        ctx.beginPath();
        // left wavy edge
        ctx.moveTo(cx + offset - bandW * 0.5, 0);
        for (let y = 0; y <= H; y += 3) {
          const wx = cx + offset - bandW * 0.5 + Math.sin(y * freq + i) * amp;
          ctx.lineTo(wx, y);
        }
        // right wavy edge (reversed)
        for (let y = H; y >= 0; y -= 3) {
          const wx =
            cx + offset + bandW * 0.5 + Math.sin(y * freq + i + 2) * amp;
          ctx.lineTo(wx, y);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(drawFrame);
      } else {
        ctx.clearRect(0, 0, W, H);
        onDone && onDone();
      }
    };

    rafRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 50,
        pointerEvents: "none",
        display: active ? "block" : "none",
      }}
    />
  );
}

/* ── Main ── */
export default function PhilUpApp() {
  const [mode, setMode] = useState("login");
  const [animating, setAnimating] = useState(false);
  const [sweeping, setSweeping] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const [showSignup, setShowSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPass2, setRegPass2] = useState("");
  const [focusedReg, setFocusedReg] = useState(null);

  const navigate = useNavigate();
const API_URL = "http://localhost:9000/api";

const handleLogin = async () => {

  if (!username || !password) {
  alert("Please enter username and password");
  return;
}

  try {
    const res = await axios.post(`${API_URL}/login`, {
  userName: username,
  userPassword: password,
});

console.log("LOGIN USER:", res.data.user);

localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));

navigate("/profile");

if (res.data.user.userPermissionLevel >= 50) {
        navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Login failed.");
  }
};

const handleSignup = async () => {
  const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactRegex = /^09\d{9}$/;
const today = new Date().toISOString().split("T")[0];

if (!firstName || !lastName || !email || !contact || !regPass || !regPass2) {
  alert("Please fill all required fields.");
  return;
}

if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
  alert("Names should not contain numbers or special characters.");
  return;
}

if (!emailRegex.test(email)) {
  alert("Please enter a valid email address.");
  return;
}

if (firstName.length > 30 || lastName.length > 30) {
  alert("First name and last name must be 30 characters only.");
  return;
}

if (email.length > 50) {
  alert("Email must be 50 characters only.");
  return;
}

if (contact.length > 11) {
  alert("Contact number must be 11 digits.");
  return;
}

if (!contactRegex.test(contact)) {
  alert("Contact number must be 11 digits and start with 09.");
  return;
}

const birthDate = new Date(birthday);

const minBirthDate = new Date();
minBirthDate.setFullYear(minBirthDate.getFullYear() - 13);

if (birthDate > minBirthDate) {
  alert("You must be at least 13 years old.");
  return;
}

if (regPass.length < 6) {
  alert("Password must be at least 6 characters.");
  return;
}

  if (regPass !== regPass2) {
    alert("Passwords do not match.");
    return;
  }

  try {
    await axios.post(`${API_URL}/users`, {
      userFName: firstName,
      userLName: lastName,
      userBirthDate: birthday,
      userAddress: address,
      userEmail: email,
      userContact: contact,
      userName: email,
      userPassword: regPass,
    });

    alert("Account created successfully!");

    setUsername(email);
setPassword(regPass);

    setFirstName("");
setLastName("");
setBirthday("");
setAddress("");
setEmail("");
setContact("");
setRegPass("");
setRegPass2("");

    goToLogin();
  } catch (error) {
    alert(error.response?.data?.message || "Signup failed.");
  }
};

  const SLIDE_MS = 700;

  /* Navigate login → signup with wave sweep */
  const goToSignup = () => {
    if (animating || sweeping) return;
    setSweeping(true);
    setShowSignup(true);

    // After sweep peak (≈55% through), flip the panels
    setTimeout(() => {
      setAnimating(true);
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / SLIDE_MS, 1);
        const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        setXOffset(e * window.innerWidth * 0.5);
        if (p < 1) requestAnimationFrame(step);
        else {
          setMode("signup");
          setAnimating(false);
        }
      };
      requestAnimationFrame(step);
    }, 350);
  };

  const onSweepDone = () => setSweeping(false);

  /* Navigate signup → login */
  const goToLogin = () => {
    if (animating) return;
    setAnimating(true);
    const W = window.innerWidth * 0.5;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / SLIDE_MS, 1);
      const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setXOffset((1 - e) * W);
      if (p < 1) requestAnimationFrame(step);
      else {
        setXOffset(0);
        setMode("login");
        setShowSignup(false);
        setAnimating(false);
      }
    };
    requestAnimationFrame(step);
  };

  const progress =
    xOffset / (typeof window !== "undefined" ? window.innerWidth * 0.5 : 1);
  const loginOpacity = Math.max(0, 1 - progress * 2.2);
  const signupOpacity = Math.max(0, (progress - 0.45) * 2.2);

  const inputBase = {
    padding: "10px 14px",
    borderRadius: "8px",
    outline: "none",
    fontSize: "0.93rem",
    boxSizing: "border-box",
    background: "#fff",
    transition: "border 0.2s",
    border: "2px solid transparent",
    width: "100%",
  };
  const loginLabelStyle = {
    color: "#c8e2f0",
    fontSize: "0.85rem",
    marginBottom: "5px",
    display: "block",
  };
  const regLabelStyle = {
    color: "#c8e2f0",
    fontSize: "0.88rem",
    marginBottom: "5px",
    display: "block",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        position: "relative",
        overflow: "hidden",
        background: "#dfe4e8",
      }}
    >
      {/* ══ SWEEP WAVE OVERLAY ══ */}
      <SweepWave active={sweeping} onDone={onSweepDone} />

      {/* ══ LOGIN SCREEN ══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          zIndex: 2,
          opacity: loginOpacity,
          pointerEvents: mode === "login" && !animating ? "auto" : "none",
        }}
      >
        <WaveCanvasLeft xOffset={xOffset} />

        {/* Login form — LEFT 58% */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            flex: "0 0 58%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "50px 60px",
          }}
        >
          <h1
            style={{
              color: "#fff",
              fontSize: "2rem",
              fontWeight: "800",
              margin: "0 0 24px",
            }}
          >
            Log in your account
          </h1>

          <label style={loginLabelStyle}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setUserFocused(true)}
            onBlur={() => setUserFocused(false)}
            style={{
              ...inputBase,
              width: "85%",
              marginBottom: "14px",
              border: userFocused
                ? "2px solid #f5a623"
                : "2px solid transparent",
            }}
          />

          <label style={loginLabelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
            style={{
              ...inputBase,
              width: "85%",
              marginBottom: "22px",
              border: passFocused
                ? "2px solid #f5a623"
                : "2px solid transparent",
            }}
          />

          <button
  onClick={handleLogin}
  style={{
    width: "220px",
    padding: "13px 0",
    borderRadius: "50px",
    border: "none",
    background: "#2e6d9e",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "18px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
  }}
>
  Log In
</button>

          <p style={{ color: "#c8e2f0", fontSize: "0.85rem", margin: 0 }}>
            Not a member yet?{" "}
            <span
              onClick={goToSignup}
              style={{
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* Beige branding — RIGHT */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            padding: "40px 28px",
          }}
        >
          <p
            style={{
              color: "#1a3a5c",
              fontWeight: "800",
              fontSize: "1.2rem",
              textAlign: "center",
              margin: 0,
            }}
          >
            Save money with every trip!
          </p>
          {LOGO_SRC ? (
            <img src={LOGO_SRC} alt="PhilUp" style={{ width: "200px" }} />
          ) : (
            <PhilUpSVGLogo />
          )}
          <p
            style={{
              color: "#1a3a5c",
              fontWeight: "800",
              fontSize: "1.2rem",
              textAlign: "center",
              margin: 0,
            }}
          >
            Track. Compare. Drive.
          </p>
        </div>
      </div>

      {/* ══ SIGNUP SCREEN ══ */}
      {showSignup && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            zIndex: 3,
            opacity: signupOpacity,
            pointerEvents: mode === "signup" && !animating ? "auto" : "none",
          }}
        >
          {/* ── BEIGE branding panel — LEFT ── */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              flex: "0 0 38%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "40px 28px",
              background: "#f5efe6" /* ← BEIGE */,
            }}
          >
            <p
              style={{
                color: "#1a3a5c",
                fontWeight: "800",
                fontSize: "1.2rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              Save money with every trip!
            </p>
            {LOGO_SRC ? (
              <img src={LOGO_SRC} alt="PhilUp" style={{ width: "200px" }} />
            ) : (
              <PhilUpSVGLogo />
            )}
            <p
              style={{
                color: "#1a3a5c",
                fontWeight: "800",
                fontSize: "1.2rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              Track. Compare. Drive.
            </p>
          </div>

          {/* ── Wave canvas sits over the seam between panels ── */}
          <WaveCanvasRight />

          {/* ── Dark blue form panel — RIGHT ── */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "36px 52px 28px",
              background: "#1a4f78",
            }}
          >
            <h1
              style={{
                color: "#fff",
                fontSize: "2rem",
                fontWeight: "800",
                margin: "0 0 22px",
                textAlign: "center",
              }}
            >
              Create a new account
            </h1>

            {/* First + Last Name */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label style={regLabelStyle}>First Name</label>
                <input
  type="text"
  value={firstName}
  maxLength={30}
  pattern="[A-Za-z\s]+"
  onChange={(e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setFirstName(value.slice(0, 30));
  }}
  onFocus={() => setFocusedReg("fn")}
  onBlur={() => setFocusedReg(null)}
  style={{
    ...inputBase,
    border:
      focusedReg === "fn"
        ? "2px solid #f5a623"
        : "2px solid transparent",
  }}
/>
              </div>
              <div>
                <label style={regLabelStyle}>Last Name</label>
                <input
  type="text"
  value={lastName}
  maxLength={30}
  pattern="[A-Za-z\s]+"
  onChange={(e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setLastName(value.slice(0, 30));
  }}
  onFocus={() => setFocusedReg("ln")}
  onBlur={() => setFocusedReg(null)}
  style={{
    ...inputBase,
    border:
      focusedReg === "ln"
        ? "2px solid #f5a623"
        : "2px solid transparent",
  }}
/>
              </div>
            </div>

            {/* Birthday */}
            <div style={{ marginBottom: "14px" }}>
              <label style={regLabelStyle}>Birthday</label>
              <input
  type="date"
  value={birthday}
  max={new Date(
    new Date().setFullYear(
      new Date().getFullYear() - 13
    )
  ).toISOString().split("T")[0]}
  onChange={(e) => setBirthday(e.target.value)}
                onFocus={() => setFocusedReg("bd")}
                onBlur={() => setFocusedReg(null)}
                style={{
                  ...inputBase,
                  border:
                    focusedReg === "bd"
                      ? "2px solid #f5a623"
                      : "2px solid transparent",
                }}
              />
            </div>

            {/* Address */}
            <div style={{ marginBottom: "14px" }}>
              <label style={regLabelStyle}>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onFocus={() => setFocusedReg("addr")}
                onBlur={() => setFocusedReg(null)}
                style={{
                  ...inputBase,
                  border:
                    focusedReg === "addr"
                      ? "2px solid #f5a623"
                      : "2px solid transparent",
                }}
              />
            </div>

            {/* Email + Contact */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label style={regLabelStyle}>Email Address</label>
                <input
  type="email"
  value={email}
  maxLength={50}
  onChange={(e) => {
    setEmail(e.target.value.slice(0, 50));
  }}
  onFocus={() => setFocusedReg("em")}
  onBlur={() => setFocusedReg(null)}
  style={{
    ...inputBase,
    border:
      focusedReg === "em"
        ? "2px solid #f5a623"
        : "2px solid transparent",
  }}
/>
              </div>
              <div>
                <label style={regLabelStyle}>Contact Number</label>
                <input
  type="tel"
  value={contact}
  maxLength={11}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      setContact(value);
    }
  }}
                  onFocus={() => setFocusedReg("ct")}
                  onBlur={() => setFocusedReg(null)}
                  style={{
                    ...inputBase,
                    border:
                      focusedReg === "ct"
                        ? "2px solid #f5a623"
                        : "2px solid transparent",
                  }}
                />
              </div>
            </div>

            {/* Password + Confirm */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "10px",
              }}
            >
              <div>
                <label style={regLabelStyle}>Password</label>
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  onFocus={() => setFocusedReg("pw")}
                  onBlur={() => setFocusedReg(null)}
                  style={{
                    ...inputBase,
                    border:
                      focusedReg === "pw"
                        ? "2px solid #f5a623"
                        : "2px solid transparent",
                  }}
                />
              </div>
              <div>
                <label style={regLabelStyle}>Confirm Password</label>
                <input
                  type="password"
                  value={regPass2}
                  onChange={(e) => setRegPass2(e.target.value)}
                  onFocus={() => setFocusedReg("pw2")}
                  onBlur={() => setFocusedReg(null)}
                  style={{
                    ...inputBase,
                    border:
                      focusedReg === "pw2"
                        ? "2px solid #f5a623"
                        : "2px solid transparent",
                  }}
                />
              </div>
            </div>

            {/* Terms */}
            <p
              style={{
                color: "#a8d0e8",
                fontSize: "0.75rem",
                margin: "4px 0 14px",
                lineHeight: 1.5,
              }}
            >
              By clicking Sign Up, you agree to our{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Terms
              </span>
              ,{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Privacy Policy
              </span>{" "}
              and{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Cookies Policy
              </span>
              . You may receive SMS Notifications from us and can opt out any
              time.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <button
  onClick={handleSignup}
  style={{
    width: "260px",
    padding: "14px 0",
    borderRadius: "50px",
    border: "none",
    background: "#2e6d9e",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
  }}
>
  Sign Up
</button>
              <p style={{ color: "#c8e2f0", fontSize: "0.85rem", margin: 0 }}>
                Already have an account?{" "}
                <span
                  onClick={goToLogin}
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Log In
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
