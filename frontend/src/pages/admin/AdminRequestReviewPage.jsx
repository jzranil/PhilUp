import { useMemo, useState, useEffect } from "react";
import axios from "axios"; // Added missing import
import AdminLayout from "./AdminLayout";

import PetronLogo from "../../assets/brand-images/PetronLogo.png";
import ShellLogo from "../../assets/brand-images/ShellLogo.png";
import CleanFuelLogo from "../../assets/brand-images/CleanFuelLogo.png";
import TotalLogo from "../../assets/brand-images/TotalLogo.png";
import SeaoilLogo from "../../assets/brand-images/SeaoilLogo.png";
import MetroOilLogo from "../../assets/brand-images/MetroOilLogo.png";

const logoMap = {
  Petron: PetronLogo,
  Shell: ShellLogo,
  "Clean Fuel": CleanFuelLogo,
  Total: TotalLogo,
  Seaoil: SeaoilLogo,
  MetroOil: MetroOilLogo,
};

const getLogoUrl = (brandName) => {
  // Removes spaces to turn "Clean Fuel" into "CleanFuelLogo.png"
  const fileName = brandName.replace(/\s+/g, ""); 
  return `/src/assets/brand-images/${fileName}Logo.png`;
};

const cardStyle = {
  border: "0.2vw solid #1c618c",
  borderRadius: "1vw",
  padding: "1.2vw",
  backgroundColor: "#fffbf4",
  fontFamily: '"Roboto Mono", monospace',
};

const actionButtonStyle = (variant) => ({
  border: "0.1vw solid #1c618c",
  borderRadius: "0.45vw",
  backgroundColor: variant === "accept" ? "#a1e3f9" : "#fffbf4",
  color: variant === "accept" ? "#1c618c" : "#e53535",
  cursor: "pointer",
  fontFamily: '"Roboto Mono", monospace',
  fontSize: "0.72vw",
  fontWeight: 700,
  padding: "0.35vw 0.55vw",
});

const cellStyle = {
  borderBottom: "0.08vw solid rgba(28, 97, 140, 0.25)",
  padding: "0.75vw 0.45vw",
  lineHeight: 1.35,
  verticalAlign: "top",
};

function StationCell({ brand, station, address }) {
  try{

  return (
    <div className="flex items-start ">
      <div className="flex flex-wrap items-center justify-center gap-2" style={{ minWidth: 0 }}>
          {
        station && (
          <img
            src={getLogoUrl(station)}
            alt={`${station} logo`}
            className="h-8 contain rounded-full flex-shrink-0"
          />
        )}
        <div style={{ color: "#1c618c", fontWeight: 700 }}>{station}</div>
        {address && (
          <div style={{ color: "#3178ad", fontSize: "0.72vw", marginTop: "0.2vw" }}>
            {address}
          </div>
        )}
      </div>
    </div>
  );
  } catch (error) {
        console.error("Failed to load station cell requests", error);
      }
}

export default function AdminRequestReviewPage({ type }) {
  const [locationRequest, setLocationRequest] = useState([]);
  const [priceRequest, setPriceRequest] = useState([]);
  const [brands, setBrands] = useState([]);
  const [users, setUsers] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseLocations = await axios.get("http://localhost:9000/api/station-locations/");
        setLocationRequest(responseLocations.data);
        const responseBrands = await axios.get("http://localhost:9000/api/brands/");
        setBrands(responseBrands.data);
        const responseUsers = await axios.get("http://localhost:9000/api/users/");
        setUsers(responseUsers.data);
        const responsePriceRequests = await axios.get("http://localhost:9000/api/fuel-prices/");
        setPriceRequest(responsePriceRequests.data);
        const responseFuelTypes = await axios.get("http://localhost:9000/api/fuel-types/");
        setFuelTypes(responseFuelTypes.data);
        console.log("Fetched fuel types:", responseFuelTypes.data);
        console.log("Fetched location requests:", responseLocations.data);
        console.log("Fetched brands:", responseBrands.data);
        console.log("Fetched users:", responseUsers.data);
        console.log("Fetched price requests:", responsePriceRequests.data);
      } catch (error) {
        console.error("Failed to fetch location requests", error);
      }
    }

    fetchData();
  }, []);

  // 2. requestData is calculated dynamically based on state
  const requestData = useMemo(() => ({
    price: {
      title: "Price Change Requests",
      description: "Review submitted fuel price updates before they go live.",
      columns: ["Request ID", "Station", "Fuel Type", "New Price", "Submitted By", "Status", "Action"],
      rows: [
  {
    id: "PR-501",
    brand: "Petron",
    station: "Petron Sampaloc",
    address: "Legarda St, Sampaloc, Manila",
    fuelType: "Gasoline",
    price: "PHP 62.15",
    submittedBy: "Juan Dela Cruz",
    status: "Pending",
  },

  ...priceRequest.map((request) => {
          const brand = brands.find((b) => b._id === request.brandID);
          const user = users.find((u) => u._id === request.uploadedBy);
          const fuelType = fuelTypes.find((ft) => ft._id === request.fuelTypeID);
          return {
            id: request._id,
            brand: brand ? `../../..${brand.brandImage}` : request.brandID,
            station: brand ? brand.brandDesc : request.brandID,
            address: request.stationAddress,
            fuelType: fuelType ? fuelType.fuelTypeDesc : request.fuelTypeID,
            price: `PHP ${request.newPrice.toFixed(2)}`,
            uploadedBy: user ? user.userName : request.uploadedBy,
            status: request.forEval === 0 ? "Pending" : "Approved",
            }
        })
        ,
      ],
    },
    location: {
      title: "Station Location Requests",
      description: "Review submitted gas station locations before adding them to the map.",
      columns: ["Request ID", "Station", "Address", "Coordinates", "Submitted By", "Status", "Action"],
      rows: locationRequest
        .map((request) => {
          const brand = brands.find((b) => b._id === request.brandID);
          const user = users.find((u) => u._id === request.uploadedBy);
          return {
            id: request._id,
            brand: brand ? `../../..${brand.brandImage}` : request.brandID,
            station: brand ? brand.brandDesc : request.brandID,
            address: request.stationAddress,
            coordinates: `${request.stationLat}, ${request.stationLong}`,
            uploadedBy: user ? user.userName : request.uploadedBy,
            status: request.forEval === 0 ? "Approved" : "Pending",
          };
        }).filter((request) => request.status === "Pending")
        ,
    },
  }), [locationRequest, brands, users]);

  console.log("Current requestData:", requestData);
  const page = requestData[type] ?? requestData.price;

  // 3. Sync local 'rows' state when data finishes fetching or type changes
  useEffect(() => {
    setRows(page.rows);
  }, [locationRequest, brands, type, page.rows]);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(query)
    );
  }, [rows, searchQuery]);

  const updateStatus = (id, status) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, status } : row))
    );
  };

  return (
    <AdminLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1vw",
            marginBottom: "1vw",
          }}
        >
          <div>
            <h1
              style={{
                color: "#1c618c",
                fontSize: "1.7vw",
                fontWeight: 700,
                marginBottom: "0.35vw",
              }}
            >
              {page.title}
            </h1>
            <p style={{ color: "#3178ad", fontSize: "0.9vw" }}>
              {page.description}
            </p>
          </div>
          <div
            style={{
              border: "0.12vw solid #1c618c",
              borderRadius: "0.6vw",
              color: "#1c618c",
              fontSize: "0.85vw",
              fontWeight: 700,
              padding: "0.45vw 0.65vw",
              whiteSpace: "nowrap",
            }}
          >
            {filteredRows.length} Requests
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "#3178ad",
              fontSize: "0.85vw",
            }}
          >
            <thead>
              <tr>
                {page.columns.map((column) => (
                  <th
                    key={column}
                    style={{
                      color: "#1c618c",
                      fontWeight: 700,
                      textAlign: "left",
                      borderBottom: "0.12vw solid #1c618c",
                      padding: "0.65vw 0.45vw",
                    }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td style={cellStyle}>{row.id}</td>
                  <td style={cellStyle}>
                    <StationCell
                      brand={row.brand}
                      station={row.station}
                      address={type === "price" ? row.address : ""}
                    />
                  </td>
                  {type === "price" ? (
                    <>
                      <td style={cellStyle}>{row.fuelType}</td>
                      <td style={cellStyle}>{row.price}</td>
                    </>
                  ) : (
                    <>
                      <td style={cellStyle}>{row.address}</td>
                      <td style={cellStyle}>{row.coordinates}</td>
                    </>
                  )}
                  <td style={cellStyle}>{row.uploadedBy}</td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        color:
                          row.status === "Accepted"
                            ? "#22a855"
                            : row.status === "Declined"
                              ? "#e53535"
                              : "#3178ad",
                        fontWeight: 700,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: "flex", gap: "0.4vw", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => updateStatus(row.id, "Accepted")}
                        style={actionButtonStyle("accept")}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(row.id, "Declined")}
                        style={actionButtonStyle("decline")}
                      >
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={page.columns.length}
                    style={{
                      color: "#3178ad",
                      padding: "1vw 0.45vw",
                      textAlign: "center",
                    }}
                  >
                    No matching requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}