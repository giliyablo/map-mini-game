// src/App.tsx
import React, { useState, useEffect } from 'react';
import Map from './Map';
import Markers from './Markers';

const App: React.FC = () => {
  const [ballPosition, setBallPosition] = useState<google.maps.LatLng | null>(null);
  const [goalPosition, setGoalPosition] = useState<google.maps.LatLng | null>(null);

  // Function to update ball position
  const updateBallPosition = (newPosition: google.maps.LatLng) => {
    setBallPosition(newPosition);
  };

  // Simulated function to fetch goal position
  const fetchGoalPosition = () => {
    // Simulate fetching goal position from server
    const randomLat = Math.random() * 0.02 + 40.71; // Random latitude around NYC
    const randomLng = Math.random() * 0.02 - 74.01; // Random longitude around NYC
    const goalPos = new google.maps.LatLng(randomLat, randomLng);
    setGoalPosition(goalPos);
  };

  // Fetch goal position when component mounts
  useEffect(() => {
    fetchGoalPosition();
  }, []);

  // Alert message when ball is within 10 meters of goal
  useEffect(() => {
    if (!ballPosition || !goalPosition) return;

    const distance = google.maps.geometry.spherical.computeDistanceBetween(ballPosition, goalPosition);
    if (distance < 10) {
      alert('GOAL!');
    }
  }, [ballPosition, goalPosition]);

  return (
    <div>
      <h1>Navigation Game</h1>
      <Map apiKey="AIzaSyCdtGPc2gg0Wh8UWRWDGDy8ChwLNyB5DnI" /> {/* Pass apiKey prop */}
      <Markers map={null} ballPosition={ballPosition} goalPosition={goalPosition} />
    </div>
  );
};

export default App;
