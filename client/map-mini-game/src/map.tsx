// src/Map.tsx
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface MapProps {
  apiKey: string;
}

const Map: React.FC<MapProps> = ({ apiKey }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.onload = () => {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 8,
      });
    };

    return () => {
      if (googleMapScript.parentNode) {
        googleMapScript.parentNode.removeChild(googleMapScript);
      }
    };
  }, [apiKey]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default Map;
