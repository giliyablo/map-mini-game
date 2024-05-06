// App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import Map from './Map';
import Markers from './Markers';

const App: React.FC = () => {
  const [ballPosition, setBallPosition] = useState<[number, number] | null>(null);
  const [goalPosition, setGoalPosition] = useState<[number, number] | null>(null);
  const [goalReached, setGoalReached] = useState(false);

  // Update ball position on user movement
  useEffect(() => {
    const handleMovement = (event: any) => {
      const newPosition: [number, number] = [event.coords.latitude, event.coords.longitude];
      setBallPosition(newPosition);
      axios.post('/update-ball-position', { position: newPosition });
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(handleMovement);
    }
  }, []);

  // Fetch goal position from the server
  useEffect(() => {
    const fetchGoalPosition = async () => {
      try {
        const response = await axios.get('/fetch-goal-position');
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
        const response = await axios.get('/check-goal-reached');
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
      <Map apiKey="AIzaSyCdtGPc2gg0Wh8UWRWDGDy8ChwLNyB5DnI" />
      <Markers ballPosition={ballPosition} goalPosition={goalPosition} goalReached={goalReached} />
    </div>
  );
};

export default App;
