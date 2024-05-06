// src/Markers.tsx
import React, { useEffect } from 'react';

interface MarkersProps {
  map: google.maps.Map | null;
  ballPosition: google.maps.LatLng | null;
  goalPosition: google.maps.LatLng | null;
}

const Markers: React.FC<MarkersProps> = ({ map, ballPosition, goalPosition }) => {
  useEffect(() => {
    if (!map || !ballPosition || !goalPosition) return;

    const ballMarker = new window.google.maps.Marker({
      position: ballPosition,
      map,
      title: 'Ball',
    });

    const goalMarker = new window.google.maps.Marker({
      position: goalPosition,
      map,
      title: 'Goal',
    });

    return () => {
      ballMarker.setMap(null);
      goalMarker.setMap(null);
    };
  }, [map, ballPosition, goalPosition]);

  return null;
};

export default Markers;
