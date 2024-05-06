import React, { useEffect, useState } from 'react';

// Initialize Google Maps API
declare global {
  interface Window { google: any; }
}
const google = window.google;

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [ballMarker, setBallMarker] = useState<any>(null);
  const [goalMarker, setGoalMarker] = useState<any>(null);

  useEffect(() => {
    // Initialize map
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 },
      zoom: 10
    });
    setMap(map);

    // Initialize ball marker
    const ballMarker = new google.maps.Marker({
      position: { lat: 0, lng: 0 },
      map: map,
      title: 'Ball Marker'
    });
    setBallMarker(ballMarker);

    // Get goal marker from server (replace with actual API call)
    const goalMarkerPosition = { lat: 10, lng: 10 };
    const goalMarker = new google.maps.Marker({
      position: goalMarkerPosition,
      map: map,
      title: 'Goal Marker'
    });
    setGoalMarker(goalMarker);

    // Track user's position and update ball marker
    navigator.geolocation.watchPosition((position) => {
      const userLatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      ballMarker.setPosition(userLatLng);
      map.setCenter(userLatLng);

      // Check if ball is within 10-meter radius of the goal
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(userLatLng),
        new google.maps.LatLng(goalMarkerPosition)
      );
      if (distance <= 10) {
        alert('GOAL!');
        // You can also add auditory alert using additional libraries
      }
    });
  }, []);

  return (
    <div id="map" style={{ width: '100%', height: '400px' }}></div>
  );
};

export default MapComponent;
