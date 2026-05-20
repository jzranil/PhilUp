import React from "react";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "./SkeletonCard"; // Adjust this path if your SkeletonCard is located elsewhere

// Bundled Station Card Sub-component
const StationCard = ({ brandLogo, stationAddress, onSelect }) => (
  <div
    className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
    style={{
      gap: "clamp(12px, 1.2vw, 18px)",
      padding: "clamp(10px, 1vw, 14px) 0",
      borderBottom: "1px solid #1c618c18",
    }}
    onClick={onSelect}
  >
    <img
      src={brandLogo}
      alt="logo"
      style={{
        width: "clamp(48px, 5vw, 72px)",
        height: "clamp(48px, 5vw, 72px)",
        objectFit: "contain",
        flexShrink: 0,
      }}
    />
    <p
      className="font-mono text-[#3178ad]"
      style={{
        fontSize: "clamp(12px, 1vw, 15px)",
        lineHeight: 1.45,
        flex: 1,
      }}
    >
      {stationAddress}
    </p>
  </div>
);

export default function HomeSearchPanel({
  isOpen,
  searchQuery,
  filteredStations = [],
  topThreeNearest = [],
  loading,
  activeSearchTab,
  mapSrc,
  onSelectStation = () => {},
}) {
  const navigate = useNavigate();

  // Guard clause: If panel isn't toggled open, render nothing
  if (!isOpen) return null;

  return (
    <div className="home-search-panel">
      <div className="home-search-grid">
        
        {/* LEFT PANEL: Lists and Data Tiers */}
        <div className="home-search-left">
          
          {/* Section A: Search Queries / Matching Results */}
          <section className="home-search-section">
            <h1 className="home-search-title">Results</h1>
            {searchQuery ? (
              filteredStations.length > 0 ? (
                filteredStations.slice(0, 3).map((s) => (
                  <StationCard
                    key={s.fuelLocID || s._id}
                    brandLogo={s.brandLogo}
                    stationAddress={s.stationAddress || s.stationAdd}
                    onSelect={() => onSelectStation(s)}
                  />
                ))
              ) : (
                <div>
                  <p className="home-search-empty">No stations match your search.</p>
                  <p
                    className="home-search-empty hover:underline hover:text-blue-500 hover:cursor-pointer hover:font-bold"
                    onClick={() => navigate("/upload-location")}
                  >
                    Looking for a specific station? Request to add it.
                  </p>
                </div>
              )
            ) : (
              <p className="home-search-empty">Search for a station to show matching results.</p>
            )}
          </section>

          {/* Section B: Geolocation / Stations Nearby */}
          <section className="home-search-section">
            <h1 className="home-search-title">Stations Nearby</h1>
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              topThreeNearest.slice(0, 3).map((s) => (
                <StationCard
                  key={s._id}
                  brandLogo={s.brandLogo}
                  stationAddress={s.stationAddress || s.stationAdd}
                  onSelect={() => onSelectStation(s)}
                />
              ))
            )}
          </section>

          {/* Section C: Optional Top Visits Tab */}
          {activeSearchTab === "topVisits" && (
            <section className="home-search-section">
              <h1 className="home-search-title">Top Visits</h1>
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                topThreeNearest.slice(0, 3).map((s) => (
                  <StationCard
                    key={s._id}
                    brandLogo={s.brandLogo}
                    stationAddress={s.stationAddress || s.stationAdd}
                    onSelect={() => onSelectStation(s)}
                  />
                ))
              )}
            </section>
          )}

          {/* Section D: Optional Favorites Tab */}
          {activeSearchTab === "favorites" && (
            <section className="home-search-section">
              <h1 className="home-search-title">Favorites</h1>
              <p className="home-search-empty">Log in to see your favorites.</p>
            </section>
          )}
        </div>

        {/* RIGHT PANEL: Live Interactive Map Embed */}
        <section className="home-search-right">
          <h1 className="home-search-title">Stations Near You</h1>
          <iframe
            src={mapSrc}
            className="home-search-map"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Search Map"
          />
        </section>

      </div>
    </div>
  );
}