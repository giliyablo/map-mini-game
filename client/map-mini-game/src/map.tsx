// src/Map.tsx
import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

interface MapProps {
  center: { lat: number; lng: number } | null;
  zoom: number;
}

const Map: React.FC<MapProps> = ({ center, zoom }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

  return isLoaded ? (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={center}
        zoom={zoom}
      ></GoogleMap>
    </div>
  ) : null;
};

export default Map;
