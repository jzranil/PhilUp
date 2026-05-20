import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import shellLogo from "../assets/brand-images/ShellLogo.png";

// Replace with API integration
const MOCK_STATION = {
  brandLogo: shellLogo,
  brandName: "Shell",
  stationAdd: "Gregorio Araneta Ave - Maria Clara St., Quezon City",
  lastUpdatedBy: "Jonathan43",
  mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.746!2d121.0114!3d14.6249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b79e040706e1%3A0x6e8e10bd3f0da5c!2sShell!5e0!3m2!1sen!2sph!4v1746668755734!5m2!1sen!2sph",
  fuels: [
    { id: 1, name: "V-Power Racing (Gasoline)", price: "067.25" },
    { id: 2, name: "V-Power (Gasoline)",        price: "066.80" },
  ],
};

export default function LocationDetailsPage() {
  const { locationId } = useParams(); // Captures :locationId from the route
  const navigate = useNavigate();

  // Example: Fetch data based on locationId here
  // useEffect(() => { fetchStation(locationId) }, [locationId]);

  const station = MOCK_STATION; 

  return (
    <div style={{ display: "flex", gap: "20px", padding: "2vw", position: "relative", zIndex: 2 }}>
      {/* LEFT COLUMN */}
      <div style={{ width: "clamp(280px, 38%, 520px)", flexShrink: 0 }}>
        <div className="ldp-station-header">
          <img src={station.brandLogo} alt={station.brandName} className="ldp-brand-logo" />
          <p className="ldp-station-addr">{station.stationAdd}</p>
        </div>

        <div className="ldp-price-box">
          {station.fuels.map(fuel => (
            <div key={fuel.id}>
              <p className="ldp-fuel-name">{fuel.name}</p>
              <div className="ldp-price-digits">{fuel.price}</div>
            </div>
          ))}
        </div>

        <div className="ldp-blue-bar">Last updated by {station.lastUpdatedBy}</div>

        <button 
          className="ldp-bar-btn" 
          onClick={() => navigate(`/upload-price/${locationId}`)}
        >
          Request Update?
        </button>
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <iframe
          src={station.mapSrc}
          className="ldp-map-frame"
          style={{ width: "100%", height: "70vh", borderRadius: "10px", border: "none" }}
          allowFullScreen loading="lazy"
        />
      </div>
    </div>
  );
}