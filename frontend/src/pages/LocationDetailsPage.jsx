import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

  // Example: Fetch data based on locationId here
  // useEffect(() => { fetchStation(locationId) }, [locationId]);

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
  }, [locationId]);

  const station = MOCK_STATION; 

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
          onClick={() => navigate(`/upload-price/${locationId}`)}
        >
          Request Update?
        </button>
      </div>

      {/* RIGHT MAP DISPLAY */}
      <div style={{ width: "60vw" }}>
        <StationMap locationForm={locationForm} />
      </div>
    </div>
  );
}