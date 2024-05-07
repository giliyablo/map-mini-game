// Map.tsx
import React, { useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import googleMapsApiKey from './googleMapsApiKey'; // Import API key from the file where it's stored

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  ballPosition: [number, number] | null;
  goalPosition: [number, number] | null;
  goalReached: boolean;
}

const Map: React.FC<MapProps> = ({ center, zoom, ballPosition, goalPosition, goalReached }) => { // Accept children prop
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey,
  });
  
  useEffect(() => {
    if (ballPosition && goalPosition && isLoaded) {
      // Render map with markers
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: ballPosition[0], lng: ballPosition[1] },
        zoom: 15,
      });

      const ballMarker = new window.google.maps.Marker({
        position: { lat: ballPosition[0], lng: ballPosition[1] },
        map,
        title: 'Ball',
        icon: {
          url: 'http://localhost:3001/ball.png', // Path to ball image
          scaledSize: new window.google.maps.Size(40, 40), // Size of the image
        },
      });

      const goalMarker = new window.google.maps.Marker({
        position: { lat: goalPosition[0], lng: goalPosition[1] },
        map,
        title: 'Goal',
        icon: {
          url: 'http://localhost:3001/goal.png', // Path to goal image
          scaledSize: new window.google.maps.Size(40, 40), // Size of the image
        },
      });

      if (goalReached) {
        alert('GOAL!');
      }
    }
  }, [ballPosition, goalPosition, goalReached, isLoaded]);
  
  return isLoaded ? (
    <div id="map" style={{ height: '400px', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={center}
        zoom={zoom}
      ></GoogleMap>
    </div>
  ) : null;
};

export default Map;
