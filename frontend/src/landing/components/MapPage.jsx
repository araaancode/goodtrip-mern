import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapPage({ currentHouse }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && currentHouse?.lat && currentHouse?.lng) {
      mapRef.current.flyTo([currentHouse.lat, currentHouse.lng], 15);
    }
  }, [currentHouse]);

  if (!currentHouse?.lat || !currentHouse?.lng) {
    return (
      <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">نقشه در دسترس نیست</p>
      </div>
    );
  }

  return (
    <div className="h-96 rounded-xl overflow-hidden relative">
      <MapContainer
        center={[currentHouse.lat, currentHouse.lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[currentHouse.lat, currentHouse.lng]}>
          <Popup>
            <div className="text-right">
              <h3 className="font-bold">{currentHouse.name}</h3>
              <p className="text-gray-600">{currentHouse.address}</p>
              <p className="text-sm text-gray-500 mt-1">
                {currentHouse.city}, {currentHouse.province}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}