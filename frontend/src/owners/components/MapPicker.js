// // MapPicker.js
// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import axios from 'axios';

// const MapPicker = ({ onLocationSelect }) => {
//   const [position, setPosition] = useState([35.6892, 51.3890]); // 
//   const [address, setAddress] = useState('');

//   const markerIcon = new L.Icon({
//     iconUrl: 'https://www.svgrepo.com/show/312483/location-indicator-red.svg',
//     iconSize: [65, 65],
//   });

//   // گرفتن مختصات هنگام کلیک روی نقشه
//   const MapClickHandler = () => {
//     useMapEvents({
//       click(e) {
//         const { lat, lng } = e.latlng;
//         setPosition([lat, lng]); // 👈 این درسته
//       },
//     });
//     return null;
//   };



//   // گرفتن آدرس فارسی از API نشان
//   const fetchAddress = async (lat, lng) => {
//     try {
//       const response = await axios.get(
//         `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
//         {
//           headers: {
//             'Api-Key': 'web.2e006ef7f0d549df981ae95c3923eeaf', // ← کلید خودتو بذار
//           },
//         }
//       );
//       setAddress(response.data.formatted_address);
//       onLocationSelect({ lat, lng, address: response.data.formatted_address });
//     } catch (error) {
//       console.error('خطا در گرفتن آدرس:', error);
//     }
//   };

//   return (
//     <div>
//       <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={position} icon={markerIcon} />
//         <MapClickHandler />
//       </MapContainer>
//       <div style={{ marginTop: '10px' }}>
//         <p>عرض جغرافیایی: {position[0]}</p>
//         <p>طول جغرافیایی: {position[1]}</p>
//         <p>آدرس: {address || 'انتخاب نشده'}</p>
//       </div>
//     </div>
//   );
// };

// export default MapPicker;

import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://www.svgrepo.com/show/312483/location-indicator-red.svg',
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
//   shadowSize: [55, 55],
});

const MapPicker = () => {
  const [position, setPosition] = useState([35.6892, 51.3890]); // تهران
  const markerRef = useRef(null);

  // وقتی روی نقشه کلیک می‌کنیم
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  // وقتی مارکر کشیده و رها می‌شود
  const onDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
    }
  };

  return (
    <div>
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker
          draggable={true}
          eventHandlers={{ dragend: onDragEnd }}
          position={position}
          icon={markerIcon}
          ref={markerRef}
        />
        <MapClickHandler />
      </MapContainer>

      <div style={{ marginTop: '10px' }}>
        <p><strong>موقعیت فعلی:</strong></p>
        <p>Latitude: {position[0]}</p>
        <p>Longitude: {position[1]}</p>
      </div>
    </div>
  );
};

export default MapPicker;
