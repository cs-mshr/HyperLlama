import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with Webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationMapProps {
  location: Location;
}

const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([location.latitude, location.longitude], 13);
  }, [location, map]);

  return (
    <MapContainer center={[location.latitude, location.longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[location.latitude, location.longitude]}>
        <Popup>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;
