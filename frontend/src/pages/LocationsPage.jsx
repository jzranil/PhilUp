import { useState } from "react";
import { useNavigate } from "react-router-dom";


// Replace with MOCK_STATIONS array
const MOCK_STATIONS = [];

export default function LocationsPage() {
  const navigate = useNavigate();
  const [stations, setStations] = useState(MOCK_STATIONS);

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "2vw", position: "relative", zIndex: 2 }}>
      <h1 style={{ color: "#fffbf4", marginBottom: "2vw" }}>All Locations</h1>
      
      <div className="lp-grid-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vw" }}>
        {stations.map(station => (
          <div 
            key={station.fuelLocID} 
            className="lp-station-card" 
            onClick={() => navigate(`/locations/${station.fuelLocID}`)}
            style={{ backgroundColor: "#fff", padding: "1vw", borderRadius: "8px", cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
              <img src={station.brandLogo} alt={station.brandName} style={{ width: "50px" }} />
              <p style={{ color: "#1c618c", fontWeight: "bold" }}>{station.stationAdd}</p>
            </div>
            {/* Show other station details */}
          </div>
        ))}
      </div>
    </div>
  );
}