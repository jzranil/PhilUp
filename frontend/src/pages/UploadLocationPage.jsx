import { useState, useEffect } from "react";

import {
  FaBars,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import philUpLogo from "../assets/Phil UP 2.png";

import { isLoggedIn } from "../utils/session";

export default function UploadLocationPage() {
  const navigate = useNavigate();

  const loggedIn = isLoggedIn();
  
  const [brand, setBrand] = useState("");
  const [address, setAddress] = useState("");

useEffect(() => {
  if (!loggedIn) {
    navigate("/login");
  }
}, [loggedIn, navigate]);

if (!loggedIn) {
  return null;
}

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#1c618c",
        fontFamily: '"Roboto Mono", monospace',
        color: "#fffbf4",
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "2vw",
          backgroundColor: "#fffbf4",
          color: "#1c618c",
        }}
      >
        <FaBars
        size={35}
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
        />

        <img
          src={philUpLogo}
          alt="logo"
          onClick={() => navigate("/")}
          style={{
            width: "10vw",
            cursor: "pointer",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "2vw",
          }}
        >
          <FaBell size={30} />
<FaUserCircle
  size={35}
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/profile")}
/>    
    </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          display: "flex",
          padding: "5vw",
          gap: "4vw",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            width: "35%",
            backgroundColor: "#fffbf4",
            padding: "2vw",
            borderRadius: "1vw",
            color: "#1c618c",
          }}
        >
          <input
            type="text"
            placeholder="Station Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "1vw",
              padding: "1vw",
              borderRadius: "1vw",
              border: "2px solid #3178ad",
            }}
          />

          <input
            type="text"
            placeholder="Station Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "1vw",
              padding: "1vw",
              borderRadius: "1vw",
              border: "2px solid #3178ad",
            }}
          />

          <button
            style={{
              width: "100%",
              padding: "1vw",
              borderRadius: "1vw",
              border: "none",
              backgroundColor: "#3178ad",
              color: "white",
              marginTop: "2vw",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>

        {/* RIGHT */}
        <div
          style={{
            width: "65%",
          }}
        >
          <h1
            style={{
              marginBottom: "1vw",
            }}
          >
            Request Station Location
          </h1>

          <iframe
            src="https://maps.google.com/maps?q=manila&t=&z=13&ie=UTF8&iwloc=&output=embed"
            style={{
              width: "100%",
              height: "35vw",
              borderRadius: "1vw",
              border: "0.25vw solid white",
            }}
            loading="lazy"
            title="map"
          />
        </div>
      </div>
    </main>
  );
}