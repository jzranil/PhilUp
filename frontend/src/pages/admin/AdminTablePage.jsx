import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import { getSessionUser } from "../../utils/session";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

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
  const [autocomplete, setAutocomplete] = useState(null);

const { isLoaded } = useLoadScript({
googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  libraries: ["places"],
});

const [locationModalOpen, setLocationModalOpen] = useState(false);
const [priceModalOpen, setPriceModalOpen] = useState(false);
const [modalMode, setModalMode] = useState("add");
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

const [priceForm, setPriceForm] = useState({
  stationLocID: "",
  fuelTypeID: "",
  fuelPrice: "",
  uploadedBy: getSessionUser()?._id || "",
  isAccepted: 0,
  forEval: 1,
});

  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
 userName:"",
 userFName:"",
 userLName:"",
 userEmail:"",
 userContact:"",
 userAddress:"",
});

const [selectedRole, setSelectedRole] = useState(1);

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
columns: [
 "User ID",
 "Name",
 "Username",
 "Email",
 "Contact Number",
 "Role",
 "Date Created",
 "Action"
],
        rows: users.map((user) => ({
            id: user._id,
            name: `${user.userFName} ${user.userLName}`,
            username: user.userName,
            email: user.userEmail,
            contact: user.userContact,
role:
  user.userPermissionLevel === 100
    ? "Super Admin"
    : user.userPermissionLevel === 50
    ? "Admin"
    : "User",
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
columns: [
 "User ID",
 "Name",
 "Username",
 "Email",
 "Contact Number",
 "Role",
 "Date Created",
 "Action"
],
        rows: users
  .map((user) => ({
    id: user._id,
    name: `${user.userFName} ${user.userLName}`,
    username: user.userName,
    email: user.userEmail,
    contact: user.userContact,
    role:
      user.userPermissionLevel === 100
        ? "Super Admin"
        : user.userPermissionLevel === 50
        ? "Admin"
        : "User",

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
role:
  user.userPermissionLevel === 100
    ? "Super Admin"
    : user.userPermissionLevel === 50
    ? "Admin"
    : "User",
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
    "admins": ["edit", "promote", "delete"],
    "registered-locations": ["edit", "remove"],
    "gas-prices": ["edit", "remove"],
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

  const handleActionUpdate = async (id, action) => {
  if (tableKey === "registered-locations" && action === "edit") {
    const record = locations.find((loc) => loc._id === id);
    if (!record) return;

    setSelectedRecord(record);
    setModalMode("edit");
    setLocationForm({
      brandID: record.brandID || "",
      stationAddress: record.stationAddress || "",
      stationLat: record.stationLat || "",
      stationLong: record.stationLong || "",
      uploadedBy: record.uploadedBy || getSessionUser()?._id || "",
      isAccepted: record.isAccepted ?? 1,
      forEval: record.forEval ?? 0,
    });
    setLocationModalOpen(true);
    return;
  }

  if (tableKey === "gas-prices" && action === "edit") {
    const record = prices.find((price) => price._id === id);
    if (!record) return;

    setSelectedRecord(record);
    setModalMode("edit");
    setPriceForm({
      stationLocID: record.stationLocID || "",
      fuelTypeID: record.fuelTypeID || "",
      fuelPrice: record.fuelPrice || "",
      uploadedBy: record.uploadedBy || getSessionUser()?._id || "",
      isAccepted: record.isAccepted ?? 1,
      forEval: record.forEval ?? 0,
    });
    setPriceModalOpen(true);
    return;
  }

  if (tableKey === "registered-locations" && action === "remove") {
    await axios.delete(`http://localhost:9000/api/station-locations/${id}`);
    setLocations((prev) => prev.filter((loc) => loc._id !== id));
    return;
  }

  if (tableKey === "gas-prices" && action === "remove") {
    await axios.delete(`http://localhost:9000/api/fuel-prices/${id}`);
    setPrices((prev) => prev.filter((p) => p._id !== id));
    return;
  }

  if (tableKey === "registered-users" || tableKey === "admins") {
    const user = users.find((u) => u._id === id);
    if (!user) return;

    if (action === "delete") {
      const currentUser = getSessionUser();

      if (user._id === currentUser?._id) {
        alert("You cannot delete your own account.");
        return;
      }

      const superAdmins = users.filter((u) => u.userPermissionLevel === 100);

      if (user.userPermissionLevel === 100 && superAdmins.length === 1) {
        alert("Cannot delete the only Super Admin");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      );

      if (!confirmDelete) return;

      await axios.delete(`http://localhost:9000/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      return;
    }

    if (action === "edit") {
      setSelectedUser(user);
      setEditForm({
        userName: user.userName || "",
        userFName: user.userFName || "",
        userLName: user.userLName || "",
        userEmail: user.userEmail || "",
        userContact: user.userContact || "",
        userAddress: user.userAddress || "",
      });
      setEditModalOpen(true);
      return;
    }

    if (action === "promote") {
      setSelectedUser(user);
      setSelectedRole(user.userPermissionLevel || 1);
      setRoleModalOpen(true);
      return;
    }
  }
};

const handleEditUserSave = async () => {
  if (!selectedUser) return;

  const res = await axios.put(
    `http://localhost:9000/api/users/${selectedUser._id}`,
    editForm
  );

  const updatedUser = res.data.user || res.data;

  setUsers((prev) =>
    prev.map((u) => (u._id === selectedUser._id ? updatedUser : u))
  );

  setEditModalOpen(false);
  setEditForm({
    userName: "",
    userFName: "",
    userLName: "",
    userEmail: "",
    userContact: "",
    userAddress: "",
  });
  setSelectedUser(null);
};

const handleRoleSave = async () => {
  if (!selectedUser) return;

  const res = await axios.patch(
    `http://localhost:9000/api/users/${selectedUser._id}/permissions`,
    { userPermissionLevel: Number(selectedRole) }
  );

  const updatedUser = res.data.user || res.data;

  setUsers((prev) =>
    prev.map((u) => (u._id === selectedUser._id ? updatedUser : u))
  );

  setRoleModalOpen(false);
  setSelectedRole(1);
  setSelectedUser(null);
};

const handleSaveLocation = async () => {
  try {
    if (modalMode === "add") {
      const res = await axios.post(
  "http://localhost:9000/api/station-locations",
  {
    ...locationForm,
    isAccepted: 0,
    forEval: 1,
  }
);
alert("Submitted for review successfully.");
    } else {
      if (!selectedRecord) return;

      const res = await axios.put(
        `http://localhost:9000/api/station-locations/${selectedRecord._id}`,
        {
          ...locationForm,
          isAccepted: 0,
          forEval: 1,
        }
      );

      setLocations((prev) =>
        prev.map((loc) =>
          loc._id === selectedRecord._id ? res.data : loc
        )
      );
    }

    setLocationModalOpen(false);
    setSelectedRecord(null);
  } catch (error) {
    console.log(error);
    alert("Failed saving station");
  }
};

const handleSavePrice = async () => {
  try {
    if (modalMode === "add") {
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
{tableKey === "registered-locations" && (
  <button
    style={modalSaveButtonStyle}
    onClick={() => {
      setModalMode("add");
      setSelectedRecord(null);
      setLocationForm({
        brandID: "",
        stationAddress: "",
        stationLat: "",
        stationLong: "",
        uploadedBy: getSessionUser()?._id || "",
        isAccepted: 0,
        forEval: 1,
      });
      setLocationModalOpen(true);
    }}
  >
    Add Gas Station
  </button>
)}

{tableKey === "gas-prices" && (
  <button
    style={modalSaveButtonStyle}
    onClick={() => {
      setModalMode("add");
      setSelectedRecord(null);
      setPriceForm({
        stationLocID: "",
        fuelTypeID: "",
        fuelPrice: "",
        uploadedBy: getSessionUser()?._id || "",
        isAccepted: 0,
        forEval: 1,
      });
      setPriceModalOpen(true);
    }}
  >
    Add Gas Price
  </button>
)}
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

{editModalOpen && selectedUser && (
    <div style={modalOverlayStyle}>
    <div style={modalBoxStyle}>
      <h2 style={modalTitleStyle}>Edit User</h2>

      {[
"userName",
"userFName",
"userLName",
"userEmail",
"userContact",
"userAddress"
].map((field) => (
        <input
          key={field}
          value={editForm[field]}
placeholder={
 field==="userName" ? "Username" :
 field==="userFName" ? "First Name" :
 field==="userLName" ? "Last Name" :
 field==="userEmail" ? "Email" :
 field==="userContact" ? "Contact Number" :
 "Address"
}
          onChange={(e) =>
            setEditForm({ ...editForm, [field]: e.target.value })
          }
          style={modalInputStyle}
        />
      ))}

      <div style={modalButtonRowStyle}>
        <button style={modalCancelButtonStyle} onClick={() => setEditModalOpen(false)}>
          Cancel
        </button>
        <button style={modalSaveButtonStyle} onClick={handleEditUserSave}>
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

{roleModalOpen && selectedUser && (
    <div style={modalOverlayStyle}>
    <div style={modalBoxStyle}>
      <h2 style={modalTitleStyle}>Change User Role</h2>

      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        style={modalInputStyle}
      >
        <option value={1}>User</option>
        <option value={50}>Admin</option>
        <option value={100}>Super Admin</option>
      </select>

      <div style={modalButtonRowStyle}>
        <button style={modalCancelButtonStyle} onClick={() => setRoleModalOpen(false)}>
          Cancel
        </button>
        <button style={modalSaveButtonStyle} onClick={handleRoleSave}>
          Update Role
        </button>
      </div>
    </div>
  </div>
)}

{locationModalOpen && (
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
      const place = autocomplete?.getPlace();

      if (!place?.geometry?.location) {
        alert("Please select a valid location from the dropdown.");
        return;
      }

      setLocationForm({
        ...locationForm,
        stationAddress: place.formatted_address || place.name || "",
        stationLat: place.geometry.location.lat(),
        stationLong: place.geometry.location.lng(),
      });
    }}
  >
    <input
      style={modalInputStyle}
      placeholder="Search station address"
      value={locationForm.stationAddress}
      onChange={(e) =>
        setLocationForm({
          ...locationForm,
          stationAddress: e.target.value,
        })
      }
    />
  </Autocomplete>
) : (
  <input
    style={modalInputStyle}
    placeholder="Loading Google Maps..."
    disabled
  />
)}

     <input
  style={modalInputStyle}
  placeholder="Latitude"
  value={locationForm.stationLat}
  readOnly
/>

<input
  style={modalInputStyle}
  placeholder="Longitude"
  value={locationForm.stationLong}
  readOnly
/>

      <div style={modalButtonRowStyle}>
        <button style={modalCancelButtonStyle} onClick={() => setLocationModalOpen(false)}>
          Cancel
        </button>
        <button style={modalSaveButtonStyle} onClick={handleSaveLocation}>
          Save
        </button>
      </div>
    </div>
  </div>
)}

{priceModalOpen && (
  <div style={modalOverlayStyle}>
    <div style={modalBoxStyle}>
      <h2 style={modalTitleStyle}>
        {modalMode === "add" ? "Add Gas Price" : "Edit Gas Price"}
      </h2>

      <select
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

    </AdminLayout>
  );
}