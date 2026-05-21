import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import shellLogo from "../assets/brand-images/ShellLogo.png";
import {
  showSuccess,
  showError,
  showWarning,
  showConfirm,
} from "../utils/swal";

// MOCK API data
const MOCK_STATION = {
  brandLogo: shellLogo,
  brandName: "Shell",
  stationAdd: "Gregorio Araneta Ave - Maria Clara St., Quezon City",
  lastProposedBy: "BrotherNiJ43",
  fuels: [
    { id: 1, name: "V-Power Racing (Gasoline)", price: "067.25" },
    { id: 2, name: "V-Power (Gasoline)",        price: "066.80" },
  ],
};

export default function UploadPricePage() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const station = MOCK_STATION;
  
  const [proposed, setProposed] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationForm, setLocationForm] = useState({
      brandID: "",
      stationAddress: "",
      stationLat: "",
      stationLong: "",
      uploadedBy: "",
      isAccepted: 0,
      forEval: 1,
    });

  useEffect(() => {
    async function fetchData() {
      try {
        const [responseBrands, responseLocations] = await Promise.all([
          axios.get("http://localhost:9000/api/brands/"),
          axios.get(`http://localhost:9000/api/locations/${locationId}`),
        ]);
        setBrands(responseBrands.data);
        setLocationForm(responseLocations.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    }
    fetchData();
    
  }, []);

  const handleProposedChange = (id, val) => setProposed(p => ({ ...p, [id]: val }));
  
  const handleSubmit = async () => {
  const hasInput = Object.values(proposed).some(
    (value) => value && value.trim() !== ""
  );

  if (!hasInput) {
    showWarning(
      "No Price Entered",
      "Please enter at least one proposed fuel price."
    );
    return;
  }

  const result = await showConfirm(
    "Submit Price Change?",
    "Your price change request will be sent for admin review.",
    "Submit"
  );

  if (!result.isConfirmed) return;

  try {
    setSubmitted(true);

    // temporary success, replace with API later
    await showSuccess(
      "Submitted",
      "Your price change request has been sent for review."
    );

    navigate("/locations");
  } catch (error) {
    showError(
      "Submission Failed",
      error.response?.data?.message || "Failed to submit price change."
    );
  } finally {
    setSubmitted(false);
  }
};

  return (
    <div style={{ display: "flex", gap: "20px", padding: "2vw", position: "relative", zIndex: 2 }}>
      {/* ── LEFT COLUMN ── */}
      <div style={{ width: "clamp(280px, 38%, 520px)", flexShrink: 0 }}>
        <div className="upp-station-header">
          <img src={station.brandLogo} alt={station.brandName} className="upp-brand-logo" />
          <p className="upp-station-addr">{station.stationAdd}</p>
        </div>
        <div className="upp-blue-bar">Changes Proposal by {station.lastProposedBy}</div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ color: "#1c618c", marginBottom: "clamp(14px, 1.5vw, 24px)" }}>
          Request Price Change for Location {locationId}
        </h2>

        <div className="upp-price-box">
          {station.fuels.map(fuel => (
            <div key={fuel.id}>
              <p className="upp-fuel-name">{fuel.name}</p>
              {/* Substitute with your PriceInput component */}
              <input 
                type="text" 
                placeholder={fuel.price}
                value={proposed[fuel.id] || ""} 
                onChange={(e) => handleProposedChange(fuel.id, e.target.value)} 
              />
            </div>
          ))}
        </div>

        <button className="upp-submit-btn" onClick={handleSubmit} disabled={submitted}>
          {submitted ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}