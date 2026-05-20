import React, { useState, useEffect } from 'react';

function StationMap({ locationForm }) {
  const [defaultCoords, setDefaultCoords] = useState({ lat: 14.5995, lng: 120.9842 });
  const [isMapLoading, setIsMapLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDefaultCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation declined or unavailable, using fallback city.", error);
        }
      );
    }
  }, []);

  const lat = locationForm?.stationLat ? parseFloat(locationForm.stationLat) : defaultCoords.lat;
  const lng = locationForm?.stationLong ? parseFloat(locationForm.stationLong) : defaultCoords.lng;

  useEffect(() => {
    setIsMapLoading(true);
  }, [lat, lng]);

  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
  
  return (
    <div style={{ position: "relative", width: "100%", height: "30vw" }}>
      
      {isMapLoading && (
        <div style={{ 
          position: "absolute", inset: 0, backgroundColor: "#fffbf4", border: "0.2vw solid #1c618c",
          borderRadius: "1vw", display: "flex", flexDirection: "column", alignItems: "center", 
          justifyContent: "center", zIndex: 5, fontFamily: '"Roboto Mono", monospace', color: "#1c618c", fontWeight: 700
        }}>
          <div style={{
            width: "2.5vw", height: "2.5vw", border: "0.3vw solid rgba(28, 97, 140, 0.2)",
            borderTop: "0.3vw solid #1c618c", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "0.8vw"
          }} />
          <span style={{ fontSize: "1.1vw" }}>Locating your station...</span>

          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      <iframe
        key={`${lat}-${lng}`}
        title="Live Station Location"
        src={mapUrl}
        style={{ width: "100%", height: "30vw", borderRadius: "1vw", border: "0.2vw solid #1c618c" }}
        allowFullScreen=""
        loading="lazy"
        onLoad={() => setIsMapLoading(false)}
      />
    </div>
  );
}

export default StationMap;