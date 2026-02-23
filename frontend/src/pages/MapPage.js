import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";

/* ---------- FIX DEFAULT ICON ---------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

/* ---------- COLORS ---------- */
const DAY_COLORS = [
  "#FF4D4D",
  "#33CC33",
  "#3399FF",
  "#CC33FF",
  "#FF9933"
];

/* ---------- FIT BOUNDS ---------- */
function FitBounds({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [coords, map]);

  return null;
}

function MapPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const itinerary = state?.itinerary || {};
  const destination =
    state?.destination?.destination ||
    state?.destination ||
    "";

  const days = useMemo(
    () => Object.keys(itinerary),
    [itinerary]
  );

  const [dayIndex, setDayIndex] = useState(0);
  const [allData, setAllData] = useState([]);
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(true);

  /* ---------- SMART PLACE EXTRACTOR ---------- */
  const extractPlaces = (text) => {
    if (!text) return [];

    const matches = text.match(
      /[A-Z][a-z]+(?:\s(?:of|the|and|ka|de|la|[A-Z][a-z]+))*/g
    );

    if (!matches) return [];

    const blacklist = [
      "Start", "Spend", "Wrap", "Enjoy",
      "Head", "Begin", "After",
      "Morning", "Afternoon", "Evening",
      "Day"
    ];

    return matches.filter(
      word =>
        !blacklist.includes(word) &&
        word.length > 3
    );
  };

  /* ---------- GEOCODER ---------- */
  const geocode = async (place) => {
    try {
      const query = `${place}, ${destination}, India`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );

      const data = await res.json();

      if (data.length > 0) {
        return [
          parseFloat(data[0].lat),
          parseFloat(data[0].lon)
        ];
      }
    } catch (err) {
      console.error(err);
    }

    return null;
  };

  /* ---------- OSRM REAL ROUTE ---------- */
  const fetchRoute = async (coords) => {
    if (coords.length < 2) return [];

    const coordString = coords
      .map(c => `${c[1]},${c[0]}`)
      .join(";");

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
      );

      const data = await res.json();

      if (data.routes?.length > 0) {
        return data.routes[0].geometry.coordinates.map(
          c => [c[1], c[0]]
        );
      }
    } catch (err) {
      console.error(err);
    }

    return [];
  };

  /* ---------- FETCH EVERYTHING ---------- */
  useEffect(() => {
    const fetchAll = async () => {
      if (days.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const collected = [];
      const routeMap = {};

      for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const plan = itinerary[day];
        const times = ["Morning", "Afternoon", "Evening"];
        const dayCoords = [];

        for (const time of times) {
          const places = extractPlaces(plan?.[time]);

          for (const place of places) {
            const coord = await geocode(place);

            if (coord) {
              collected.push({
                day,
                dayIndex: i,
                place,
                coord
              });
              dayCoords.push(coord);
            }

            await new Promise(r => setTimeout(r, 350));
          }
        }

        const route = await fetchRoute(dayCoords);
        routeMap[i] = route;
      }

      setAllData(collected);
      setRoutes(routeMap);
      setLoading(false);
    };

    fetchAll();
  }, [itinerary, destination, days]);

  if (!state?.itinerary) {
    return <h2>No itinerary found</h2>;
  }

  const currentDayData = allData.filter(
    d => d.dayIndex === dayIndex
  );

  const currentCoords = currentDayData.map(
    d => d.coord
  );

  /* ---------- DESTINATION PIN MARKER ---------- */
  const createDestinationIcon = (dIdx) => {
    const color =
      DAY_COLORS[dIdx % DAY_COLORS.length];

    return L.divIcon({
      html: `
        <div style="
          width:34px;
          height:34px;
          background:${color};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          position:relative;
          box-shadow:0 4px 10px rgba(0,0,0,0.4);
          border:2px solid white;
        ">
          <div style="
            transform:rotate(45deg);
            position:absolute;
            top:6px;
            left:6px;
            font-size:16px;
            color:white;
          ">
            📍
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      className: ""
    });
  };

  return (
    <div className="map-page">
      <h1>🗺️ {days[dayIndex]}</h1>

      {loading ? (
        <div style={{ padding: "100px" }}>
          Mapping destinations...
        </div>
      ) : (
        <MapContainer
          center={currentCoords[0] || [20.5937, 78.9629]}
          zoom={13}
          style={{ height: "600px" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {currentDayData.map((data, idx) => (
            <Marker
              key={idx}
              position={data.coord}
              icon={createDestinationIcon(data.dayIndex)}
            >
              <Popup>
                <strong>{data.place}</strong>
              </Popup>
            </Marker>
          ))}

          {routes[dayIndex]?.length > 0 && (
            <Polyline
              positions={routes[dayIndex]}
              color={
                DAY_COLORS[
                  dayIndex %
                  DAY_COLORS.length
                ]
              }
              weight={5}
            />
          )}

          <FitBounds coords={currentCoords} />
        </MapContainer>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          disabled={dayIndex === 0}
          onClick={() =>
            setDayIndex(p => p - 1)
          }
        >
          ⬅ Previous
        </button>

        <button
          onClick={() =>
            navigate("/trip-result", { state })
          }
          style={{ margin: "0 20px" }}
        >
          Back
        </button>

        <button
          disabled={
            dayIndex === days.length - 1
          }
          onClick={() =>
            setDayIndex(p => p + 1)
          }
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default MapPage;