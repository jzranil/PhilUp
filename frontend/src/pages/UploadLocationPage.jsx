import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/session";
import { getSessionUser } from "../utils/session";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import StationMap from '../components/StationMap';

// Styles moved outside to keep component clean
const modalOverlayStyle = { position: "relative", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 };
const modalBoxStyle = { width: "32vw", backgroundColor: "#fffbf4", border: "0.2vw solid #1c618c", borderRadius: "1vw", padding: "2vw", fontFamily: '"Roboto Mono", monospace', boxShadow: "0 0.4vw 1.2vw rgba(0,0,0,0.25)" };
const modalTitleStyle = { color: "#1c618c", fontSize: "1.5vw", fontWeight: 700, marginBottom: "1.2vw" };
const modalInputStyle = { width: "100%", padding: "0.75vw", marginBottom: "0.8vw", border: "0.12vw solid #1c618c", borderRadius: "0.5vw", backgroundColor: "#fffbf4", color: "#1c618c", fontFamily: '"Roboto Mono", monospace', fontWeight: 700 };
const modalButtonRowStyle = { display: "flex", justifyContent: "flex-end", gap: "0.8vw", marginTop: "1vw" };
const modalCancelButtonStyle = { padding: "0.65vw 1vw", border: "0.12vw solid #1c618c", borderRadius: "0.5vw", backgroundColor: "transparent", color: "#1c618c", fontWeight: 700, cursor: "pointer" };
const modalSaveButtonStyle = { padding: "0.65vw 1vw", border: "none", borderRadius: "0.5vw", backgroundColor: "#1c618c", color: "#fffbf4", fontWeight: 700, cursor: "pointer" };

export default function UploadLocationPage() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [modalMode, setModalMode] = useState("add");
  const [autocomplete, setAutocomplete] = useState(null);
  
  // Missing states added back here for structural safety
  const [locations, setLocations] = useState([]);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [locationForm, setLocationForm] = useState({
    brandID: "",
    stationAddress: "",
    stationLat: "",
    stationLong: "",
    uploadedBy: getSessionUser()?._id || "",
    isAccepted: 0,
    forEval: 1,
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // FIXED: Moved handleSaveLocation inside the component so it has access to states
  const handleSaveLocation = async () => {
    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:9000/api/station-locations", {
          ...locationForm,
          isAccepted: 0,
          forEval: 1,
        });
        alert("Submitted for review successfully.");
      } else {
        if (!selectedRecord) return;

        const res = await axios.put(`http://localhost:9000/api/station-locations/${selectedRecord._id}`, {
          ...locationForm,
          isAccepted: 0,
          forEval: 1,
        });

        setLocations((prev) =>
          prev.map((loc) => (loc._id === selectedRecord._id ? res.data : loc))
        );
      }

      setLocationModalOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error(error);
      alert("Failed saving station");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [responseBrands] = await Promise.all([
          axios.get("http://localhost:9000/api/brands/"),
        ]);
        setBrands(responseBrands.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    }
    fetchData();
    
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);

  if (!loggedIn) return null;

  return (
    <div className="flex space-between gap-5 relative z-2">
      {/* LEFT FORM FORMULATION */}
      <div style={modalOverlayStyle}>
        <div style={modalBoxStyle}>
          <h2 style={modalTitleStyle}>
            {modalMode === "add" ? "Add Gas Station" : "Edit Gas Station"}
          </h2>

          <select
            style={modalInputStyle}
            value={locationForm.brandID}
            onChange={(e) => setLocationForm({ ...locationForm, brandID: e.target.value })}
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.brandDesc}
              </option>
            ))}
          </select>

          {isLoaded ? (
            <Autocomplete
              onLoad={(auto) => setAutocomplete(auto)}
              onPlaceChanged={() => {
                if (autocomplete !== null) {
                  const place = autocomplete.getPlace();

                  if (!place?.geometry?.location) {
                    alert("Please select a valid location from the dropdown.");
                    return;
                  }

                  // Setting these numerical positions triggers the map update instantly
                  setLocationForm({
                    ...locationForm,
                    stationAddress: place.formatted_address || place.name || "",
                    stationLat: place.geometry.location.lat(),
                    stationLong: place.geometry.location.lng(),
                  });
                }
              }}
            >
              <input
                style={modalInputStyle}
                placeholder="Search station address"
                value={locationForm.stationAddress}
                onChange={(e) => setLocationForm({ ...locationForm, stationAddress: e.target.value })}
              />
            </Autocomplete>
          ) : (
            <input style={modalInputStyle} placeholder="Loading Google Maps..." disabled />
          )}

          <input style={modalInputStyle} placeholder="Latitude" value={locationForm.stationLat} readOnly />
          <input style={modalInputStyle} placeholder="Longitude" value={locationForm.stationLong} readOnly />

          <div style={modalButtonRowStyle}>
            <button style={modalCancelButtonStyle} onClick={() => navigate("/")}>
              Cancel
            </button>
            <button style={modalSaveButtonStyle} onClick={handleSaveLocation}>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT MAP DISPLAY */}
      <div style={{ width: "60vw" }}>
        <StationMap locationForm={locationForm} />
      </div>
    </div>
  );
}