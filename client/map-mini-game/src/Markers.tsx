// Markers.tsx
import React, { useEffect } from 'react';

interface MarkersProps {
  ballPosition: [number, number] | null;
  goalPosition: [number, number] | null;
  goalReached: boolean;
}

const Markers: React.FC<MarkersProps> = ({ ballPosition, goalPosition, goalReached }) => {
  useEffect(() => {
    if (ballPosition && goalPosition) {
      // Render markers using Google Maps JavaScript API
      const ballMarker = new window.google.maps.Marker({
        position: { lat: ballPosition[0], lng: ballPosition[1] },
        title: 'Ball',
        icon: {
          url: 'http://localhost:3001/ball.png', // Path to ball image
          scaledSize: new window.google.maps.Size(40, 40), // Size of the image
        },
      });

      const goalMarker = new window.google.maps.Marker({
        position: { lat: goalPosition[0], lng: goalPosition[1] },
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
  }, [ballPosition, goalPosition, goalReached]);

  return null; // Markers are rendered using Google Maps JavaScript API directly
};

export default Markers;
