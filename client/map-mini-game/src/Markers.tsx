// src/Markers.tsx
import React, { useEffect } from 'react';
import { Marker, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

interface MarkersProps {
  ballPosition: [number, number] | null;
  goalPosition: [number, number] | null;
  goalReached: boolean;
}

const Markers: React.FC<MarkersProps> = ({ ballPosition, goalPosition, goalReached }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCdtGPc2gg0Wh8UWRWDGDy8ChwLNyB5DnI',
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

  return (
    <div id="map" style={{ width: '100%', height: '400px' }}></div>
  );
};

export default Markers;
