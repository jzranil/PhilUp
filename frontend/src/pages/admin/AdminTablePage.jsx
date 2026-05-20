import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

const getLogoUrl = (brandName) => {
  // Guard clause to handle missing or undefined brand names gracefully
  if (!brandName) return ""; 
  const fileName = brandName.replace(/\s+/g, ""); 
  return `/src/assets/brand-images/${fileName}Logo.png`;
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

const cardStyle = {
  border: "0.2vw solid #1c618c",
  borderRadius: "1vw",
  padding: "1.2vw",
  backgroundColor: "#fffbf4",
  fontFamily: '"Roboto Mono", monospace',
};

export default function AdminTablePage({ tableKey }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [locationRequests, setLocationRequests] = useState([]);
  const [priceRequests, setPriceRequests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [prices, setPrices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [users, setUsers] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          responseUser,
          responseLocationRequest,
          responsePriceRequest,
          responseLocations,
          responsePrices,
          responseBrands,
          responseFuelTypes,
          responseLogs,
        ] = await Promise.all([
          axios.get("http://localhost:9000/api/users/"),
          axios.get("http://localhost:9000/api/station-location-requests/"),
          axios.get("http://localhost:9000/api/fuel-price-requests/"),
          axios.get("http://localhost:9000/api/station-locations/"),
          axios.get("http://localhost:9000/api/fuel-prices/"),
          axios.get("http://localhost:9000/api/brands/"),
          axios.get("http://localhost:9000/api/fuel-types/"),
          axios.get("http://localhost:9000/api/logs/"),
        ]);

        setUsers(responseUser.data);
        setLocationRequests(responseLocationRequest.data);
        setPriceRequests(responsePriceRequest.data);
        setLocations(responseLocations.data);
        setPrices(responsePrices.data);
        setBrands(responseBrands.data);
        setFuelTypes(responseFuelTypes.data);
        setLogs(responseLogs.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const tableData = useMemo(() => {
    return {
      "registered-users": {
        title: "Registered Users",
        description: "Manage user accounts registered in Phil UP.",
        columns: ["User ID", "Name", "UserName", "Email", "Contact", "Date Created", "Action"],
        rows: users
          .filter((user) => user.userPermissionLevel < 2)
          .map((user) => ({
            id: user._id,
            name: `${user.userFName} ${user.userLName}`,
            username: user.userName,
            email: user.userEmail,
            contact: user.userContact,
            dateCreated: user.dateCreated
                ? new Date(user.dateCreated).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A",
          })),
      },
      admins: {
        title: "Admins",
        description: "Manage administrator accounts and access.",
        columns: ["Admin ID", "Name", "Username", "Email", "Contact Number", "Role", "Action"],
        rows: users
          .map((user) => ({
            id: user._id,
            name: `${user.userFName} ${user.userLName}`,
            username: user.userName,
            email: user.userEmail,
            contact: user.userContact,
            role: user.userPermissionLevel >= 100 ? "Super Admin" : user.userPermissionLevel >= 2 ? "Admin" : "User",
          }))
          .filter((user) => user.role === "Super Admin" || user.role === "Admin"),
      },
      "registered-locations": {
        title: "Registered Locations",
        description: "View accepted gas station locations.",
        columns: ["Location ID", "Station", "Address", "Coordinates", "Uploaded By", "Status", "Action"],
        rows: locations
          .map((request) => {
            const brand = brands.find((b) => b._id === request.brandID);
            const user = users.find((u) => u._id === request.uploadedBy);
            return {
              id: request._id,
              station: brand ? brand.brandDesc : request.brandID,
              address: request.stationAddress,
              coordinates: `${request.stationLat}, ${request.stationLong}`,
              uploadedBy: user ? user.userName : request.uploadedBy,
              status: request.isAccepted === 0 ? "Pending" : "Approved",
            };
          })
          .filter((request) => request.status === "Approved"),
      },
      "gas-prices": {
        title: "Gas Prices",
        description: "Review current accepted fuel price records.",
        columns: ["Price ID", "Station", "Address", "Fuel Type", "Price", "Date Updated", "Status", "Action"],
        rows: prices
          .map((price) => {
            const station = locations.find((loc) => loc._id === price.stationLocID);
            const brand = station ? brands.find((b) => b._id === station.brandID) : null;
            const user = users.find((u) => u._id === price.uploadedBy);
            const fuelType = fuelTypes.find((ft) => ft._id === price.fuelTypeID);
            return {
              id: price._id,
              station: brand ? brand.brandDesc : price.brandID,
              address: station ? station.stationAddress : price.stationLocID,
              fuelType: fuelType ? fuelType.fuelTypeDesc : price.fuelTypeID,
              price: `PHP ${price.fuelPrice?.toFixed(2)}`,
              dateUpdated: price.dateUpdated
                ? new Date(price.dateUpdated).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A",
              status: price.isAccepted === 0 ? "Pending" : "Approved",
            };
          })
          .filter((price) => price.status === "Approved"),
      },
      "admin-log": {
        title: "Admin Log",
        description: "Track admin actions across the system.",
        columns: ["Log ID", "Role", "Level", "Activity", "Trace ID", "Timestamp"],
        rows: logs
          .map((log) => {
            const user = users.find((u) => u._id === log.userID) || {};
            return {
              id: log._id,
              role: user.userPermissionLevel >= 100 ? "Super Admin" : user.userPermissionLevel >= 2 ? "Admin" : "User",
              level: log.level,
              activity: log.activity,
              traceId: log.traceID,
              timestamp: log.dateCreated
                ? new Date(log.dateCreated).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A",
            };
          })
          .filter((log) => log.role === "Super Admin" || log.role === "Admin"),
      },
      "user-log": {
        title: "User Log",
        description: "Track user submissions and account activity.",
        columns: ["Log ID", "User", "Level", "Activity", "Trace ID", "Timestamp"],
        rows: logs
          // 1. Filter logs to only include users with a permission level less than 2
          .filter((log) => {
            const user = users.find((u) => u._id === log.userID);
            return user && user.userPermissionLevel < 2;
          })
          // 2. Map the filtered logs to your table structure
          .map((log) => {
            const user = users.find((u) => u._id === log.userID) || {};
            return {
              id: log._id,
              User: user.userName || "Unknown",
              level: log.level,
              activity: log.activity,
              traceId: log.traceID,
              timestamp: log.dateCreated
                ? new Date(log.dateCreated).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A",
            };
          }),
      },
    };
  }, [users, locations, prices, brands, fuelTypes, logs]);

  const actionButtonStyle = (action) => {
    const actionThemes = {
      promote: { bg: "#e6f4ea", text: "#137333", border: "#137333" },
      demote: { bg: "#fef7e0", text: "#b06000", border: "#b06000" },
      edit: { bg: "#e8f0fe", text: "#1a73e8", border: "#1a73e8" },
      delete: { bg: "#fce8e6", text: "#e53535", border: "#e53535" },
      remove: { bg: "#fce8e6", text: "#e53535", border: "#e53535" },
    };

    const theme = actionThemes[action] || { bg: "#f1f3f4", text: "#1c618c", border: "#1c618c" };

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
      textTransform: "capitalize",
    };
  };

  const tableActionConfig = {
    "registered-users": ["promote", "edit", "delete"],
    admins: ["promote", "demote", "edit", "delete"],
    "registered-locations": ["remove"],
    "gas-prices": ["remove"],
    "admin-log": [],
    "user-log": [],
  };

  const currentActions = tableActionConfig[tableKey] || [];
  const page = tableData[tableKey] ?? tableData["registered-users"];

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return page.rows;

    return page.rows.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(query)
    );
  }, [page.rows, searchQuery]);

  const handleActionUpdate = (id, action) => {
    console.log(`Performing ${action} on ID: ${id}`);
    if(tableKey === "gas-prices" && action === "remove") {
      // Call API to delete fuel price
      axios.delete(`http://localhost:9000/api/fuel-prices/${id}`)
        .then(() => {
          // Refresh the table or update the state to reflect the deletion
          console.log(`Fuel price deleted successfully: ${id}`);
        })
        .catch((error) => {
          console.error(`Error deleting fuel price: ${error.message}`);
        });
    }
      //palagay dito yung others

  };

  return (
    <AdminLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1vw", marginBottom: "1vw" }}>
          <div>
            <h1 style={{ color: "#1c618c", fontSize: "1.7vw", fontWeight: 700, marginBottom: "0.35vw" }}>
              {page.title}
            </h1>
            <p style={{ color: "#3178ad", fontSize: "0.9vw" }}>{page.description}</p>
          </div>
          <div style={{ border: "0.12vw solid #1c618c", borderRadius: "0.6vw", color: "#1c618c", fontSize: "0.85vw", fontWeight: 700, padding: "0.45vw 0.65vw", whiteSpace: "nowrap" }}>
            {filteredRows.length} Records
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "2vw", textAlign: "center", color: "#1c618c", fontWeight: 700 }}>
              Loading data...
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#3178ad", fontSize: "0.85vw" }}>
              <thead>
                <tr>
                  {page.columns.map((column) => (
                    <th key={column} style={{ color: "#1c618c", fontWeight: 700, textAlign: "left", borderBottom: "0.12vw solid #1c618c", padding: "0.65vw 0.45vw" }}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const rowValues = Object.values(row);

                  return (
                    <tr key={row.id || rowValues.join("-")}>
                      {rowValues.map((cell, index) => {
                        // 1. Identify if we are in the 'Station' column
                        const isStationColumn = page.columns[index] === "Station";
                        // 2. Identify if the active table is one of our target tables
                        const isTargetTable = tableKey === "gas-prices" || tableKey === "registered-locations";

                        return (
                          <td
                            key={`${cell}-${index}`}
                            style={{
                              borderBottom: "0.08vw solid rgba(28, 97, 140, 0.25)",
                              padding: "0.75vw 0.45vw",
                              lineHeight: 1.35,
                              verticalAlign: "middle", 
                            }}
                          >
                            {/* 3. Conditionally render StationCell or normal text */}
                            {isTargetTable && isStationColumn ? (
                              <StationCell station={cell} />
                            ) : (
                              cell
                            )}
                          </td>
                        );
                      })}

                      <td style={{ borderBottom: "0.08vw solid rgba(28, 97, 140, 0.25)", padding: "0.75vw 0.45vw", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4vw", alignItems: "stretch" }}>
                          {currentActions.map((action) => (
                            <button
                              key={action}
                              type="button"
                              onClick={() => handleActionUpdate(row.id, action)}
                              style={{ ...actionButtonStyle(action), textAlign: "center" }}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={page.columns.length} style={{ color: "#3178ad", padding: "1vw 0.45vw", textAlign: "center" }}>
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}