// App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './Map';

const App: React.FC = () => {
  const url = "http://localhost:3001";
  const defaultCenter: google.maps.LatLngLiteral = { lat: 51.5074, lng: -0.1278 }; // Default center
  const defaultZoom = 15; // Default zoom level

  const [ballPosition, setBallPosition] = useState<[number, number] | null>([51.5074, -0.1278]);
  const [goalPosition, setGoalPosition] = useState<[number, number] | null>(null);
  const [goalReached, setGoalReached] = useState(false);
  // // Function to execute when ballPosition changes
  // const ballPositionVarCheck = () => {
  //   // Check if ballPosition has a value
  //   if (ballPosition !== null) {
  //     console.log('ballPosition has a value:', ballPosition);
  //   }
  // };

  // // Function to execute when goalPosition changes
  // const goalPositionVarCheck = () => {
  //   // Check if goalPosition has a value
  //   if (goalPosition !== null) {
  //     console.log('goalPosition has a value:', goalPosition);
  //   }
  // };

  // // Function to execute when goalReached changes
  // const goalReachedVarCheck = () => {
  //   // Check if goalReached has a value
  //   if (goalReached !== null) {
  //     console.log('goalReached has a value:', goalReached);
  //   }
  // };

  // useEffect(() => {
  //   // Call ballPositionVarCheck when ballPosition changes
  //   ballPositionVarCheck();
  // }, [ballPosition]); // Add ballPosition to the dependency array

  // useEffect(() => {
  //   // Call goalPositionVarCheck when goalPosition changes
  //   goalPositionVarCheck();
  // }, [goalPosition]); // Add goalPosition to the dependency array

  // useEffect(() => {
  //   // Call goalReachedVarCheck when goalReached changes
  //   goalReachedVarCheck();
  // }, [goalReached]); // Add goalReached to the dependency array

  // // Simulate setting a value to myVariable after a delay
  // const simulateAsyncTask = () => {
  //   setTimeout(() => {
  //     setMyVariable('example value');
  //   }, 2000); // Simulated delay of 2 seconds
  // };

  // Update ball position on user movement
  const handleMovement = (event: any) => {
    const newPosition: [number, number] = [event.coords.latitude, event.coords.longitude];
    console.log("newPosition: " + newPosition)
    setBallPosition(newPosition);
  };

  // Fetch goal position from the server
  const fetchGoalPosition = async () => {
    try {
      console.log("ballPosition: " + ballPosition);
      const response = await axios.post(url + '/generate-goal-coordinate', { ballPosition: ballPosition });
      console.log("response.data.goalPosition: " + response.data.goalPosition);
      setGoalPosition(response.data.goalPosition);
    } catch (error) {
      console.error('Error fetching goal position:', error);
    }
  };

  // Check if the ball has reached the goal
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

  // Make the ball move towards the goal 
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
    
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(handleMovement);
    }
    fetchGoalPosition();
  }, []);

  useEffect(() => {

    if (ballPosition && goalPosition) {
      checkGoalReached();
      // fetchNewBallPosition();
    }
  }, [ballPosition]);

  console.log("ballPosition: " + ballPosition);
  console.log("goalPosition: " + goalPosition);

  return (
    <div>
      <h1>Navigation Game</h1>
      <Map center={ballPosition ? { lat: ballPosition[0], lng: ballPosition[1] } : defaultCenter} zoom={defaultZoom} ballPosition={ballPosition} goalPosition={goalPosition} goalReached={goalReached} />
    </div>
  );
};

export default App;
