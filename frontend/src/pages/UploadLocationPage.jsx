import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  if (!loggedIn) return null;

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5vw", position: "relative", zIndex: 2 }}>
      {/* LEFT */}
      <div style={{ width: "30%" }}>
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={{ width: "100%", marginBottom: "1vw", padding: "1vw", borderRadius: "1vw", border: "2px solid #3178ad" }}
        />
        <input
          type="text"
          placeholder="Station Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", marginBottom: "1vw", padding: "1vw", borderRadius: "1vw", border: "2px solid #3178ad" }}
        />
        <button style={{ width: "100%", padding: "1vw", borderRadius: "1vw", border: "none", backgroundColor: "#3178ad", color: "white", marginTop: "2vw", cursor: "pointer" }}>
          Submit
        </button>
      </div>

      {/* RIGHT */}
      <div style={{ width: "65%" }}>
        <h1 style={{ marginBottom: "1vw" }}>Request Station Location</h1>
        <iframe
          src="https://maps.google.com/maps?q=manila&t=&z=13&ie=UTF8&iwloc=&output=embed"
          style={{ width: "100%", height: "35vw", borderRadius: "1vw", border: "none" }}
        />
      </div>
    </div>
  );
}