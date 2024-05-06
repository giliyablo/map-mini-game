import React, { useState, useEffect } from 'react';
import Map from './Map';
import Markers from './Markers';
import axios from 'axios'; // Import Axios for making HTTP requests

const App: React.FC = () => {
  const [ballPosition, setBallPosition] = useState<google.maps.LatLng | null>(null);
  const [goalPosition, setGoalPosition] = useState<google.maps.LatLng | null>(null);

  // Function to update ball position
  const updateBallPosition = (newPosition: google.maps.LatLng) => {
    setBallPosition(newPosition);
  };

  // Function to fetch goal position from server
  const fetchGoalPosition = async () => {
    try {
      const response = await axios.get('/generate-goal-coordinate'); // Assuming server is running on the same host
      const goalCoordinate = response.data.goalCoordinate;
      const goalPos = new google.maps.LatLng(goalCoordinate[0], goalCoordinate[1]);
      setGoalPosition(goalPos);
    } catch (error) {
      console.error('Error fetching goal position:', error);
    }
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
      <Map apiKey="AIzaSyCdtGPc2gg0Wh8UWRWDGDy8ChwLNyB5DnI" />
      <Markers map={null} ballPosition={ballPosition} goalPosition={goalPosition} />
    </div>
  );
};

export default App;
