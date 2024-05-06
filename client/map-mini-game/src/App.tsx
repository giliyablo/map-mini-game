// App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './Map';
import Markers from './Markers';

const App: React.FC = () => {

  const url = "http://localhost:3001"
  const defaultCenter: google.maps.LatLngLiteral = { lat: 51.5074, lng: -0.1278 }; // Default center
  const defaultZoom = 15; // Default zoom level

  const [ballPosition, setBallPosition] = useState<[number, number] | null>(null);
  const [goalPosition, setGoalPosition] = useState<[number, number] | null>(null);
  const [goalReached, setGoalReached] = useState(false);

  // Update ball position on user movement
  useEffect(() => {
    const handleMovement = (event: any) => {
      const newPosition: [number, number] = [event.coords.latitude, event.coords.longitude];
      console.log("newPosition: " + newPosition)
      setBallPosition(newPosition);
      console.log("ballPosition: " + ballPosition)
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(handleMovement);
    }
  }, [ballPosition]);

  // Fetch goal position from the server
  useEffect(() => {
    const fetchGoalPosition = async () => {
      try {
        console.log("ballPosition test  " + ballPosition)
        const response = await axios.post(url + '/generate-goal-coordinate', { ballPosition: ballPosition });
        console.log("response.data.goalPosition: " + response.data.goalPosition)
        setGoalPosition(response.data.goalPosition);
        console.log("goalPosition: " + goalPosition)
      } catch (error) {
        console.error('Error fetching goal position:', error);
      }
    };

    fetchGoalPosition();
  }, [goalPosition]);

  // Check if the ball has reached the goal
  useEffect(() => {
    const checkGoalReached = async () => {
      try {
        const response = await axios.post(url + '/check-goal-reached', { ballPosition: ballPosition, goalPosition: goalPosition });
        
        setGoalReached(response.data.goalReached);
        if (response.data.goalReached) {
          alert('GOAL!');
        }
      } catch (error) {
        console.error('Error checking goal reached:', error);
      }
    };
    const fetchNewBallPosition = async () => {
      try {
        const response = await axios.post(url + '/update-ball-position', { ballPosition: ballPosition, goalPosition: goalPosition });
        console.log("response.data.newBallPosition: " + response.data.newBallPosition)
        if(response.data.newBallPosition) {
          setBallPosition(response.data.newBallPosition);
          console.log("ballPosition: " + ballPosition)
        }
      } catch (error) {
        console.error('Error fetching goal position:', error);
      }
    };

    if (ballPosition && goalPosition) {
      checkGoalReached();
      fetchNewBallPosition();
    }
  }, [ballPosition, goalPosition]);

  return (
    <div>
      <h1>Navigation Game</h1>
      <Map center={ballPosition ? { lat: ballPosition[0], lng: ballPosition[1] } : defaultCenter} 
           zoom={defaultZoom} />
      <Markers ballPosition={ballPosition} goalPosition={goalPosition} goalReached={goalReached} />
    </div>
  );
};

export default App;
