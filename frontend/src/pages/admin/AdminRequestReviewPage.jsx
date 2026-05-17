import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";

import PetronLogo from "../../assets/PetronLogo.png";
import ShellLogo from "../../assets/ShellLogo.png";
import CleanFuelLogo from "../../assets/CleanFuelLogo.png";
import TotalLogo from "../../assets/TotalLogo.png";
import SeaoilLogo from "../../assets/SeaoilLogo.png";
import MetroOilLogo from "../../assets/MetroOilLogo.png";

const logoMap = {
  Petron: PetronLogo,
  Shell: ShellLogo,
  "Clean Fuel": CleanFuelLogo,
  Total: TotalLogo,
  Seaoil: SeaoilLogo,
  MetroOil: MetroOilLogo,
};

const requestData = {
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
      {
        id: "PR-502",
        brand: "Shell",
        station: "Shell Sta. Cruz",
        address: "Felix Huertas Road, Sta. Cruz, Manila",
        fuelType: "Diesel",
        price: "PHP 56.80",
        submittedBy: "Maria Santos",
        status: "Pending",
      },
      {
        id: "PR-503",
        brand: "Seaoil",
        station: "Seaoil Quezon City",
        address: "Gregorio Araneta Ave, Quezon City",
        fuelType: "Kerosene",
        price: "PHP 64.20",
        submittedBy: "Carlo Reyes",
        status: "Pending",
      },
    ],
  },
  location: {
    title: "Station Location Requests",
    description: "Review submitted gas station locations before adding them to the map.",
    columns: ["Request ID", "Station", "Address", "Coordinates", "Submitted By", "Status", "Action"],
    rows: [
      {
        id: "LR-201",
        brand: "Total",
        station: "Total San Lazaro",
        address: "San Lazaro Street, Sta. Cruz, Manila",
        coordinates: "14.6177, 120.9827",
        submittedBy: "Ana Lopez",
        status: "Pending",
      },
      {
        id: "LR-202",
        brand: "Clean Fuel",
        station: "Clean Fuel Manila",
        address: "Rizal Avenue, Manila",
        coordinates: "14.6042, 120.9822",
        submittedBy: "Mark Rivera",
        status: "Pending",
      },
      {
        id: "LR-203",
        brand: "MetroOil",
        station: "MetroOil Quezon City",
        address: "Maria Clara St, Quezon City",
        coordinates: "14.6252, 121.0018",
        submittedBy: "Liza Cruz",
        status: "Pending",
      },
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

function StationCell({ brand, station, address }) {
  const logo = logoMap[brand];

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.55vw" }}>
      {logo && (
        <img
          src={logo}
          alt={`${brand} logo`}
          style={{
            width: "2vw",
            height: "2vw",
            objectFit: "contain",
            borderRadius: "50%",
            flexShrink: 0,
          }}
        />
      )}
      <div>
        <div style={{ color: "#1c618c", fontWeight: 700 }}>{station}</div>
        {address && (
          <div style={{ color: "#3178ad", fontSize: "0.72vw", marginTop: "0.2vw" }}>
            {address}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminRequestReviewPage({ type }) {
  const page = requestData[type] ?? requestData.price;
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(page.rows);

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
                  <td style={cellStyle}>{row.submittedBy}</td>
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

const cellStyle = {
  borderBottom: "0.08vw solid rgba(28, 97, 140, 0.25)",
  padding: "0.75vw 0.45vw",
  lineHeight: 1.35,
  verticalAlign: "top",
};
