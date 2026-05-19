import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

const cardStyle = {
  border: "0.2vw solid #1c618c",
  borderRadius: "1vw",
  padding: "1.2vw",
  backgroundColor: "#fffbf4",
  fontFamily: '"Roboto Mono", monospace',
};

export default function AdminTablePage({ tableKey }) {
  try {
    const [user, setUser] = useState([]);
    
useEffect(() => {
  async function fetchData() {
      try {
        const responseUser = await axios.get("http://localhost:9000/api/users/");
        setUser(responseUser.data);
        console.log("Fetched user data:", responseUser.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    }
       fetchData();
  }, []);
  
const tableData = {
  "registered-users": {
    title: "Registered Users",
    description: "Manage user accounts registered in Phil UP.",
    columns: ["User ID", "Name", "UserName","Email", "Contact", "Date Created"],
    rows: user
        .map((users) => {
          return {
            id: users._id,
            name: `${users.userFName} ${users.userLName}`,
            username: users.userName,
            email: users.userEmail,
            contact: users.userContact,
            role: users.userPermissionLevel >= 100 ? "Super Admin" : users.userPermissionLevel >= 1 ? "Admin" : "User",
          };
        }).filter((user) => user.role === "User")
  ,
  },
  admins: {
    title: "Admins",
    description: "Manage administrator accounts and access.",
    columns: ["Admin ID", "Name","Username", "Email","Contact Number", "Role"],
    rows: user
        .map((users) => {
          return {
            id: users._id,
            name: `${users.userFName} ${users.userLName}`,
            username: users.userName,
            email: users.userEmail,
            contact: users.userContact,
            role: users.userPermissionLevel >= 100 ? "Super Admin" : users.userPermissionLevel >= 1 ? "Admin" : "User",
          };
        }).filter((user) => user.role === "Super Admin" || user.role === "Admin")
  ,},
  "registered-locations": {
    title: "Registered Locations",
    description: "View accepted gas station locations.",
    columns: ["Location ID", "Station", "Address", "Coordinates", "Uploaded By", "Status"],
    rows: [{
        id: "L-201",
        station: "Petron",
        address: "Sampaloc, Manila",
        coordinates: "14.5995° N, 120.9842° E",
        uploadedBy: "U-1001",
        status: "Accepted",
    },
    ],
  },
  "gas-prices": {
    title: "Gas Prices",
    description: "Review current accepted fuel price records.",
    columns: ["Price ID", "Station","Address", "Fuel Type", "Price", "Date Updated"],
    rows: [{
      id: "P-501",
      station: "Petron Sampaloc",
      address: "Sampaloc, Manila",
      fuelType: "Gasoline",
      price: "PHP 62.15",
      dateUpdated: "May 13, 2025",
    },
    ],
  },
  // approvals: {
  //   title: "Approvals",
  //   description: "Review pending location and price submissions.",
  //   columns: ["Request ID", "Type", "Submitted By", "Submitted On", "Status"],
  //   rows: [
  //     ["R-701", "Gas Price", "U-1001", "May 13, 2025", "Pending"],
  //     ["R-702", "Location", "U-1002", "May 14, 2025", "Pending"],
  //     ["R-703", "Gas Price", "U-1003", "May 15, 2025", "Pending"],
  //   ],
  // },
  "admin-log": {
    title: "Admin Log",
    description: "Track admin actions across the system.",
    columns: ["Log ID", "Role","Level", "Action","Trace ID", "Timestamp"],
    rows: [
      {
        id: "AL-001",
        role: "Admin",
        level: "INFO",
        action: "Updated gas price",
        traceId: "HIibiUu87nuYu8g8gbgt6uU6wyy8u",
        timestamp: "May 13, 2025 01:46:25"
      }
    ],
  },
  "user-log": {
    title: "User Log",
    description: "Track user submissions and account activity.",
    columns: ["Log ID", "User","Level", "Action","Trace ID", "Timestamp"],
    rows: [{
        id: "UL-001",
        user: "U-1001",
        level: "INFO",
        action: "Submitted gas price update",
        traceId: "HIibiUu87nuYu8g8gbgt6uU6wyy8u",
        timestamp: "May 13, 2025 01:50:10"
    }
    ],
  },
};
  console.log("Table data for admins:", tableData.admins);
  
  const [searchQuery, setSearchQuery] = useState("");
  const page = tableData[tableKey] ?? tableData["registered-users"];
  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return page.rows;
    return page.rows.filter((row) =>
      row.join(" ").toLowerCase().includes(query)
    );
  }, [page.rows, searchQuery]);

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
            {filteredRows.length} Records
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
              {filteredRows.map((row, rowIndex) => {
                // Extract the values from the row object into an array
                const rowValues = Object.values(row);

                return (
                  <tr key={row.id || rowValues.join("-")}>
                    {rowValues.map((cell, index) => (
                      <td
                        key={`${cell}-${index}`}
                        style={{
                          borderBottom: "0.08vw solid rgba(28, 97, 140, 0.25)",
                          padding: "0.75vw 0.45vw",
                          lineHeight: 1.35,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
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
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
  } catch (error) {
          return console.error("Failed to fetch user data", error);
      }
}
