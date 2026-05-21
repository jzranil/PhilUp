import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getSessionUser } from "../utils/session";
import shellLogo from "../assets/brand-images/ShellLogo.png";
import StationMap from '../components/StationMap';
import GasPriceBoard from '../components/GasPriceBoard';

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

  
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [locations , setLocations] = useState([]);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [priceForm, setPriceForm] = useState({
    stationLocID: "",
    fuelTypeID: "",
    fuelPrice: "",
    uploadedBy: getSessionUser()?._id || "",
    isAccepted: 0,
    forEval: 1,
  });

  const [brands, setBrands] = useState([]);
  const [userUploader, setUserUploader] = useState("");
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [locationForm, setLocationForm] = useState({
      brandID: "",
      stationAddress: "",
      stationLat: "",
      stationLong: "",
      uploadedBy: "",
      isAccepted: 0,
      forEval: 1,
    });
  const [brandForm, setBrandForm] = useState({
      brandDesc: "",
      brandImage: ""
    });

  useEffect(() => {
    async function fetchData() {
      try {
        const [responseBrands, responseLocations, responsePrices, responseFuelTypes] = await Promise.all([
          axios.get("http://localhost:9000/api/brands/"),
          axios.get(`http://localhost:9000/api/station-locations/coverage/${locationId}`),
          axios.get(`http://localhost:9000/api/fuel-prices/station/${locationId}`),
          axios.get(`http://localhost:9000/api/fuel-types/`),
        ]);

        const brandsData = responseBrands.data;
        const locationData = responseLocations.data;
        const pricesData = responsePrices.data;
        const fuelTypesData = responseFuelTypes.data;
        
        const latestPrice = pricesData.reduce((latest, price) => {
          return new Date(price.dateCreated) > new Date(latest.dateCreated) ? price : latest;
        }, pricesData[0]);
        const uploadedByUser = latestPrice? await axios.get(`http://localhost:9000/api/users/${latestPrice.uploadedBy}`) : null;
        setUserUploader(uploadedByUser?`Uploaded by ${uploadedByUser.data.userName}` : "No price updates yet");
        const matchedBrand = brandsData.find(b => b._id === locationData.brandID);

        setBrands(brandsData);
        setLocationForm(locationData);
        setLocations([locationData]);
        setPrices(pricesData);
        setBrandForm(matchedBrand);
        setFuelTypes(fuelTypesData);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    }
    fetchData();

      if (locations.length > 0) {
      setPriceForm(prev => ({
        ...prev,
        stationLocID: locations[0]._id
      }));
    }
  }, [locationId, locations.length]);

  const handleSavePrice = async () => {
  try {
    if (modalMode === "add") {
            console.log("Submitting updated price data:", priceForm);
      const res = await axios.post(
  "http://localhost:9000/api/fuel-prices",
  {
    ...priceForm,
    isAccepted: 0,
    forEval: 1,
  }
);
alert("Submitted for review successfully.");
    } else {
      if (!selectedRecord) return;


      const res = await axios.put(
        `http://localhost:9000/api/fuel-prices/${selectedRecord._id}`,
        {
          ...priceForm,
          isAccepted: 0,
          forEval: 1,
        }
      );

      setPrices((prev) =>
        prev.map((price) =>
          price._id === selectedRecord._id ? res.data : price
        )
      );
    }

    setPriceModalOpen(false);
    setSelectedRecord(null);
  } catch (error) {
    console.log(error);
    alert("Failed saving fuel price");
  }
};

  const modalOverlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const modalBoxStyle = {
    width: "32vw",
    backgroundColor: "#fffbf4",
    border: "0.2vw solid #1c618c",
    borderRadius: "1vw",
    padding: "2vw",
    fontFamily: '"Roboto Mono", monospace',
    boxShadow: "0 0.4vw 1.2vw rgba(0,0,0,0.25)",
  };

  const modalTitleStyle = {
    color: "#1c618c",
    fontSize: "1.5vw",
    fontWeight: 700,
    marginBottom: "1.2vw",
  };

  const modalInputStyle = {
    width: "100%",
    padding: "0.75vw",
    marginBottom: "0.8vw",
    border: "0.12vw solid #1c618c",
    borderRadius: "0.5vw",
    backgroundColor: "#fffbf4",
    color: "#1c618c",
    fontFamily: '"Roboto Mono", monospace',
    fontWeight: 700,
  };

  const modalButtonRowStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.8vw",
    marginTop: "1vw",
  };

  const modalCancelButtonStyle = {
    padding: "0.65vw 1vw",
    border: "0.12vw solid #1c618c",
    borderRadius: "0.5vw",
    backgroundColor: "transparent",
    color: "#1c618c",
    fontWeight: 700,
    cursor: "pointer",
  };

  const modalSaveButtonStyle = {
    padding: "0.65vw 1vw",
    border: "none",
    borderRadius: "0.5vw",
    backgroundColor: "#1c618c",
    color: "#fffbf4",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "2vw", position: "relative", zIndex: 2 }}>
      {/* LEFT COLUMN */}
      <div style={{ width: "clamp(280px, 38%, 520px)", flexShrink: 0 }}>
        <div className="flex items-center gap-4 m-4">
          <img style={{ height: "6vw" }} src={brandForm.brandImage} alt={brandForm.brandDesc} className="ldp-brand-logo" />
          <p className="text-[#1c618c] font-bold">{locationForm.stationAddress}</p>
        </div>

        <GasPriceBoard 
          gasData={prices.map(price => {
            return {
              fuelDesc: price.fuelDesc || "Unknown Fuel",
              fuelPrice: price.fuelPrice.toFixed(2)
            };
          })}
        />
        {userUploader && <div className="text-[#a1e3f9] font-bold font-size-lg mt-2">{userUploader}</div>}

        <button 
          className="text-[#a1e3f9] font-bold font-size-lg mt-4 px-4 py-2 underline hover:opacity-80 transition-opacity" 
          onClick={() => setPriceModalOpen(true)}
        >
          Request Update?
        </button>
      </div>
      {priceModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <h2 style={modalTitleStyle}>
              {modalMode === "add" ? "Add Gas Price" : "Edit Gas Price"}
            </h2>

            <select
              disabled
              style={modalInputStyle}
              value={priceForm.stationLocID}
              onChange={(e) => setPriceForm({ ...priceForm, stationLocID: e.target.value })}
            >
              {locations.map((loc) => {
                const brand = brands.find((b) => b._id === loc.brandID);
                return (
                  <option key={loc._id} value={loc._id}>
                    {brand?.brandDesc || "Unknown Station"} - {loc.stationAddress}
                  </option>
                );
              })}
            </select>

            <select
              style={modalInputStyle}
              value={priceForm.fuelTypeID}
              onChange={(e) => setPriceForm({ ...priceForm, fuelTypeID: e.target.value })}
            >
              <option value="">Select Fuel Type</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel._id} value={fuel._id}>
                  {fuel.fuelTypeDesc}
                </option>
              ))}
            </select>

            <input
              style={modalInputStyle}
              type="text"
              placeholder="Fuel Title/Description"
              value={priceForm.fuelDesc}
              onChange={(e) => setPriceForm({ ...priceForm, fuelDesc: e.target.value })}
            />

            <input
              style={modalInputStyle}
              type="number"
              placeholder="Fuel Price"
              value={priceForm.fuelPrice}
              onChange={(e) => setPriceForm({ ...priceForm, fuelPrice: Number(e.target.value) })}
            />

            <div style={modalButtonRowStyle}>
              <button style={modalCancelButtonStyle} onClick={() => setPriceModalOpen(false)}>
                Cancel
              </button>
              <button style={modalSaveButtonStyle} onClick={handleSavePrice}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT MAP DISPLAY */}
      <div style={{ width: "60vw" }}>
        <StationMap locationForm={locationForm} />
      </div>
    </div>
  );
}