import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";

const tableData = {
  "registered-users": {
    title: "Registered Users",
    description: "Manage user accounts registered in Phil UP.",
    columns: ["User ID", "Name", "Email", "Contact", "Date Created"],
    rows: [
      ["U-1001", "Juan Dela Cruz", "juan@example.com", "0917 123 4567", "May 13, 2025"],
      ["U-1002", "Maria Santos", "maria@example.com", "0918 222 4433", "May 14, 2025"],
      ["U-1003", "Carlo Reyes", "carlo@example.com", "0999 312 1200", "May 15, 2025"],
    ],
  },
  admins: {
    title: "Admins",
    description: "Manage administrator accounts and access.",
    columns: ["Admin ID", "Name", "Role", "Email", "Status"],
    rows: [
      ["A-001", "System Admin", "Super Admin", "admin@philup.com", "Active"],
      ["A-002", "Price Reviewer", "Moderator", "prices@philup.com", "Active"],
      ["A-003", "Location Reviewer", "Moderator", "locations@philup.com", "Active"],
    ],
  },
  "registered-locations": {
    title: "Registered Locations",
    description: "View accepted gas station locations.",
    columns: ["Location ID", "Brand", "Address", "Uploaded By", "Status"],
    rows: [
      ["L-201", "Petron", "Sampaloc, Manila", "U-1001", "Accepted"],
      ["L-202", "Shell", "Sta. Cruz, Manila", "U-1002", "Accepted"],
      ["L-203", "Seaoil", "Quezon City", "U-1003", "Accepted"],
    ],
  },
  "gas-prices": {
    title: "Gas Prices",
    description: "Review current accepted fuel price records.",
    columns: ["Price ID", "Station", "Fuel Type", "Price", "Date Updated"],
    rows: [
      ["P-501", "Petron Sampaloc", "Gasoline", "PHP 62.15", "May 13, 2025"],
      ["P-502", "Shell Sta. Cruz", "Diesel", "PHP 56.80", "May 13, 2025"],
      ["P-503", "Seaoil Quezon City", "Kerosene", "PHP 64.20", "May 14, 2025"],
    ],
  },
  approvals: {
    title: "Approvals",
    description: "Review pending location and price submissions.",
    columns: ["Request ID", "Type", "Submitted By", "Submitted On", "Status"],
    rows: [
      ["R-701", "Gas Price", "U-1001", "May 13, 2025", "Pending"],
      ["R-702", "Location", "U-1002", "May 14, 2025", "Pending"],
      ["R-703", "Gas Price", "U-1003", "May 15, 2025", "Pending"],
    ],
  },
  "admin-log": {
    title: "Admin Log",
    description: "Track admin actions across the system.",
    columns: ["Log ID", "Admin", "Action", "Date", "Time"],
    rows: [
      ["AL-001", "System Admin", "Approved location L-201", "May 13, 2025", "01:46:25"],
      ["AL-002", "Price Reviewer", "Approved price P-501", "May 13, 2025", "02:17:14"],
      ["AL-003", "Location Reviewer", "Rejected location R-702", "May 15, 2025", "04:12:43"],
    ],
  },
  "user-log": {
    title: "User Log",
    description: "Track user submissions and account activity.",
    columns: ["Log ID", "User", "Action", "Date", "Time"],
    rows: [
      ["UL-001", "Juan Dela Cruz", "Submitted gas price", "May 13, 2025", "01:46:25"],
      ["UL-002", "Maria Santos", "Submitted location", "May 14, 2025", "02:17:14"],
      ["UL-003", "Carlo Reyes", "Updated profile", "May 15, 2025", "04:12:43"],
    ],
  },
};

const cardStyle = {
  border: "0.2vw solid #1c618c",
  borderRadius: "1vw",
  padding: "1.2vw",
  backgroundColor: "#fffbf4",
  fontFamily: '"Roboto Mono", monospace',
};

export default function AdminTablePage({ tableKey }) {
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
              {filteredRows.map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell, index) => (
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
}
