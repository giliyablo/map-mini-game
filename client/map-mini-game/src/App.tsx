// App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './Map';
import Markers from './Markers';

const App: React.FC = () => {

  const url = "http://localhost:3001"
  const defaultCenter: google.maps.LatLngLiteral = { lat: 51.5074, lng: -0.1278 }; // Default center
  const defaultZoom = 10; // Default zoom level

  const [ballPosition, setBallPosition] = useState<[number, number] | null>(null);
  const [goalPosition, setGoalPosition] = useState<[number, number] | null>(null);
  const [goalReached, setGoalReached] = useState(false);

  // Update ball position on user movement
  useEffect(() => {
    const handleMovement = (event: any) => {
      const newPosition: [number, number] = [event.coords.latitude, event.coords.longitude];
      setBallPosition(newPosition);
      
      const fetchNewBallPosition = async () => {
        try {
          const response = await axios.post(url + '/update-ball-position', { ballPosition: ballPosition });
          setBallPosition(response.data.newBallPosition);
        } catch (error) {
          console.error('Error fetching goal position:', error);
        }
      };
      if (ballPosition) {
        // sleep(30);
        fetchNewBallPosition();
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(handleMovement);
    }
  }, []);

  // Fetch goal position from the server
  useEffect(() => {
    const fetchGoalPosition = async () => {
      try {
        const response = await axios.post(url + '/generate-goal-coordinate', { ballPosition: ballPosition });
        setGoalPosition(response.data.goalPosition);
      } catch (error) {
        console.error('Error fetching goal position:', error);
      }
    };

    fetchGoalPosition();
  }, []);

  // Check if the ball has reached the goal
  useEffect(() => {
    const checkGoalReached = async () => {
      try {
        const response = await axios.post(url + '/check-goal-reached', { ballPosition: ballPosition , goalPosition: goalPosition });
        setGoalReached(response.data.goalReached);
        if (response.data.goalReached) {
          alert('GOAL!');
        }
      } catch (error) {
        console.error('Error checking goal reached:', error);
      }
    };

    if (ballPosition && goalPosition) {
      checkGoalReached();
    }
  }, [ballPosition, goalPosition]);

  return (
    <div>
      <h1>Navigation Game</h1>
      <Map center={defaultCenter} zoom={defaultZoom} />
      <Markers ballPosition={ballPosition} goalPosition={goalPosition} goalReached={goalReached} />
    </div>
  );
};

export default App;
