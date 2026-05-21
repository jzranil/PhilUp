import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

const getLogoUrl = (brandName) => {
  // Guard clause to handle missing or undefined brand names gracefully
  if (!brandName) return ""; 
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

const actionButtonStyle = (variant) => {
  const themes = {
    accept: { bg: "#e6f4ea", text: "#22a855", border: "#22a855" },
    decline: { bg: "#fce8e6", text: "#e53535", border: "#e53535" },
  };

  const theme = themes[variant] || themes.accept;

  return {
    border: `0.1vw solid ${theme.border}`,
    borderRadius: "0.45vw",
    backgroundColor: theme.bg,
    color: theme.text,
    cursor: "pointer",
    fontFamily: '"Roboto Mono", monospace',
    fontSize: "0.72vw",
    fontWeight: 700,
    padding: "0.35vw 0.55vw",
    textAlign: "center",
  };
};

const cellStyle = {
  borderBottom: "0.08vw solid rgba(28, 97, 140, 0.25)",
  padding: "0.75vw 0.45vw",
  lineHeight: 1.35,
  verticalAlign: "top",
};

function StationCell({ brand, station, address }) {
  // Render guard: if there's no station, return null to avoid crashing React
  if (!station) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-1 text-center" style={{ minWidth: 0 }}>
      <img
        src={getLogoUrl(station)}
        alt={`${station} logo`}
        // Removed w-8 so the image can take its natural width based on the h-8 height
        className="h-8 object-contain rounded-full flex-shrink-0"
      />
      <div style={{ color: "#1c618c", fontWeight: 700, fontSize: "0.75vw" }}>
        {station}
      </div>
    </div>
  );
}

export default function AdminRequestReviewPage({ type }) {
  const [locationRequest, setLocationRequest] = useState([]);
  const [locations, setLocations] = useState([]);
  const [priceRequest, setPriceRequest] = useState([]);
  const [brands, setBrands] = useState([]);
  const [users, setUsers] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Tracks evaluated status changes made by the admin locally
  const [evaluatedStatuses, setEvaluatedStatuses] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          resLocReqs,
          resBrands,
          resUsers,
          resPriceReqs,
          resFuelTypes,
          resLocations,
        ] = await Promise.all([
          axios.get("http://localhost:9000/api/station-location-requests/"),
          axios.get("http://localhost:9000/api/brands/"),
          axios.get("http://localhost:9000/api/users/"),
          axios.get("http://localhost:9000/api/fuel-price-requests/"),
          axios.get("http://localhost:9000/api/fuel-types/"),
          axios.get("http://localhost:9000/api/station-locations/"),
        ]);

        setLocationRequest(resLocReqs.data);
        setBrands(resBrands.data);
        setUsers(resUsers.data);
        setPriceRequest(resPriceReqs.data);
        setFuelTypes(resFuelTypes.data);
        setLocations(resLocations.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data setup", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute live columns and rows without storing sync states
  const pageData = useMemo(() => {
    const isPriceType = type === "price" || !type;

    if (isPriceType) {
      const rows = priceRequest.map((request) => {
        const station = locations.find((s) => s._id === request.stationLocID);
        const brand = station ? brands.find((b) => b._id === station.brandID) : null;
        const user = users.find((u) => u._id === request.uploadedBy);
        const fuelType = fuelTypes.find((ft) => ft._id === request.fuelTypeID);

        // Fallback to local evaluation change status if present
        const currentStatus = evaluatedStatuses[request._id] || (request.forEval === 0 ? "Approved" : "Pending");

        return {
          id: request._id,
          brand: brand ? brand.brandImage : request.brandID,
          station: brand ? brand.brandDesc : request.brandID,
          address: station ? station.stationAddress : request.stationLocID,
          fuelType: fuelType ? fuelType.fuelTypeDesc : request.fuelTypeID,
          price: `PHP ${(request.fuelPrice || 0).toFixed(2)}`,
          uploadedBy: user ? user.userName : request.uploadedBy,
          status: currentStatus,
        };
      });

      return {
        title: "Price Change Requests",
        description: "Review submitted fuel price updates before they go live.",
        columns: ["Request ID", "Station", "Address", "Fuel Type", "New Price", "Submitted By", "Status", "Action"],
        rows,
      };
    } else {
      const rows = locationRequest
        .map((request) => {
          const brand = request.brandID ? brands.find((b) => b._id === request.brandID) : null;
          const user = users.find((u) => u._id === request.uploadedBy);
          const currentStatus = evaluatedStatuses[request._id] || (request.forEval === 0 ? "Approved" : "Pending");

          return {
            id: request._id,
            brand: brand ? brand.brandImage : request.brandID,
            station: brand ? brand.brandDesc : request.brandID,
            address: request.stationAddress,
            coordinates: `${request.stationLat}, ${request.stationLong}`,
            uploadedBy: user ? user.userName : request.uploadedBy,
            status: currentStatus,
          };
        })
        .filter((request) => request.status === "Pending" || evaluatedStatuses[request.id]);

      return {
        title: "Station Location Requests",
        description: "Review submitted gas station locations before adding them to the map.",
        columns: ["Request ID", "Station", "Address", "Coordinates", "Submitted By", "Status", "Action"],
        rows,
      };
    }
  }, [type, locationRequest, priceRequest, brands, users, fuelTypes, evaluatedStatuses]);

  // Handle client search on computed dataset
  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return pageData.rows;

    return pageData.rows.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(query)
    );
  }, [pageData.rows, searchQuery]);

  const updateStatus = async (id, action) => {
  try {
    const isPriceType = type === "price" || !type;

    if (action === "Declined") {
      if (isPriceType) {
        await axios.delete(`http://localhost:9000/api/fuel-price-requests/${id}`);
        setPriceRequest((prev) => prev.filter((req) => req._id !== id));
      } else {
        await axios.delete(`http://localhost:9000/api/station-location-requests/${id}`);
        setLocationRequest((prev) => prev.filter((req) => req._id !== id));
      }
      return;
    }

    if (isPriceType) {
      const newRequest = priceRequest.find((req) => req._id === id);

      const oldApproved = priceRequest.find(
        (req) =>
          req._id !== id &&
          req.stationLocID === newRequest.stationLocID &&
          req.fuelTypeID === newRequest.fuelTypeID &&
          req.isAccepted === 1
      );

      if (oldApproved) {
        await axios.put(`http://localhost:9000/api/fuel-prices/${oldApproved._id}`, {
          isAccepted: 0,
        });
      }

      await axios.put(`http://localhost:9000/api/fuel-prices/${id}`, {
        isAccepted: 1,
        forEval: 0,
      });

      setPriceRequest((prev) =>
        prev.map((req) => {
          if (oldApproved && req._id === oldApproved._id) {
            return { ...req, isAccepted: 0 };
          }

          if (req._id === id) {
            return { ...req, isAccepted: 1, forEval: 0 };
          }

          return req;
        })
      );

      return;
    }

    const newRequest = locationRequest.find((req) => req._id === id);

    const oldApproved = locationRequest.find(
      (req) =>
        req._id !== id &&
        Number(req.stationLong) === Number(newRequest.stationLong) &&
        Number(req.stationLat) === Number(newRequest.stationLat) &&
        req.isAccepted === 1
    );

    if (oldApproved) {
      await axios.put(`http://localhost:9000/api/station-location-requests/${oldApproved._id}`, {
        isAccepted: 0,
      });
    }

    await axios.put(`http://localhost:9000/api/station-location-requests/${id}`, {
      isAccepted: 1,
      forEval: 0,
    });

    setLocationRequest((prev) =>
      prev.map((req) => {
        if (oldApproved && req._id === oldApproved._id) {
          return { ...req, isAccepted: 0 };
        }

        if (req._id === id) {
          return { ...req, isAccepted: 1, forEval: 0 };
        }

        return req;
      })
    );
  } catch (error) {
    console.error("Request action failed:", error);
    alert("Action failed. Please try again.");
  }
};

  if (loading) {
    return (
      <AdminLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "50vh", gap: "1vw", color: "#1c618c" }}>
          <svg width="3vw" height="3vw" viewBox="0 0 50 50" stroke="#1c618c" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <g transform="translate(1 1)" strokeWidth="4">
                <circle strokeOpacity=".3" cx="24" cy="24" r="24" />
                <path d="M48 24c0-9.94-8.06-18-18-18">
                  <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="1s" repeatCount="indefinite" />
                </path>
              </g>
            </g>
          </svg>
          <span style={{ fontSize: "1.2vw", fontWeight: 600 }}>Loading requests...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1vw", marginBottom: "1vw" }}>
          <div>
            <h1 style={{ color: "#1c618c", fontSize: "1.7vw", fontWeight: 700, marginBottom: "0.35vw" }}>{pageData.title}</h1>
            <p style={{ color: "#3178ad", fontSize: "0.9vw" }}>{pageData.description}</p>
          </div>
          <div style={{ border: "0.12vw solid #1c618c", borderRadius: "0.6vw", color: "#1c618c", fontSize: "0.85vw", fontWeight: 700, padding: "0.45vw 0.65vw", whiteSpace: "nowrap" }}>
            {filteredRows.length} Requests
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#3178ad", fontSize: "0.85vw" }}>
            <thead>
              <tr>
                {pageData.columns.map((column) => (
                  <th key={column} style={{ color: "#1c618c", fontWeight: 700, textAlign: "left", borderBottom: "0.12vw solid #1c618c", padding: "0.65vw 0.45vw" }}>
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
                    <StationCell station={row.station} />
                  </td>
                  {type === "price" || !type ? (
                    <>
                      <td style={cellStyle}>{row.address}</td>
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
                    <span style={{ color: row.status === "Accepted" ? "#22a855" : row.status === "Declined" ? "#e53535" : "#3178ad", fontWeight: 700 }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: "flex", gap: "0.4vw", flexWrap: "wrap" }}>
                      <button type="button" onClick={() => updateStatus(row.id, "Accepted")} style={actionButtonStyle("accept")}>
                        Accept
                      </button>
                      <button type="button" onClick={() => updateStatus(row.id, "Declined")} style={actionButtonStyle("decline")}>
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={pageData.columns.length} style={{ color: "#3178ad", padding: "1vw 0.45vw", textAlign: "center" }}>
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