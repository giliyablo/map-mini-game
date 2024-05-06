const express = require('express');
const cors = require('cors');
import { Request, Response } from 'express';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors()); // Adding cors middleware to allow cross-origin requests

// Generate a random number between min and max
function getRandomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Generate a random goal coordinate within 1km radius of the ball position
function generateRandomGoalCoordinate(ballPosition: [number, number]): [number, number] {
  const earthRadius = 6371; // Earth's radius in km
  const maxDistance = 1; // Maximum distance from ball in km

  // Generate a random distance between 0 and maxDistance
  const distance = Math.sqrt(Math.random()) * maxDistance;

  // Generate a random angle
  const angle = Math.random() * Math.PI * 2;

  // Calculate the new latitude and longitude
  const newLat = ballPosition[0] + (distance / earthRadius) * (180 / Math.PI) * Math.cos(angle);
  const newLng = ballPosition[1] + (distance / earthRadius) * (180 / Math.PI) * Math.sin(angle) / Math.cos(ballPosition[0] * Math.PI / 180);

  return [newLat, newLng];
}

// Function to calculate the direction and distance between two points
function calculateDirectionAndDistance(ballPosition: [number, number], goalPosition: [number, number]): { direction: [number, number], distance: number } {
  const deltaX = goalPosition[0] - ballPosition[0];
  const deltaY = goalPosition[1] - ballPosition[1];
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  // Ensure direction always has exactly two elements
  const direction: [number, number] = [deltaX / distance, deltaY / distance]; // Normalize the direction vector

  return { direction, distance };
}

// Function to update the ball position towards the goal
function moveBallTowardsGoal(ballPosition: [number, number], goalPosition: [number, number], speed: number): [number, number] {
  const { direction, distance } = calculateDirectionAndDistance(ballPosition, goalPosition);

  // Calculate the new ball position
  const newBallPosition: [number, number] = [
    ballPosition[0] + direction[0] * speed,
    ballPosition[1] + direction[1] * speed
  ];

  return newBallPosition;
}

app.post('/generate-goal-coordinate', (req: Request, res: Response) => {
  const { ballPosition } = req.body;
  if (!ballPosition) {
    console.log("ballPosition is null or undefined");
    return res.status(400).json({ error: 'Ball position is required.' });
  }
  
  try {
    console.log("ballPosition: " + ballPosition);
    const goalPosition = generateRandomGoalCoordinate(ballPosition);
    console.log("goalPosition: " + goalPosition);
    res.json({ goalPosition });
  } catch (error) {
    res.status(400).json({ error: 'Invalid ball position format.' });
  }
});

// Check if the ball has reached the goal
app.post('/check-goal-reached', (req: Request, res: Response) => {
  const { ballPosition, goalPosition } = req.body;

  if (!ballPosition || !goalPosition) {
    return res.status(400).json({ error: 'Ball position and goal position are required.' });
  }

  // Calculate the distance between ball and goal
  const distance = Math.sqrt(Math.pow(goalPosition[0] - ballPosition[0], 2) + Math.pow(goalPosition[1] - ballPosition[1], 2));

  // Check if the distance is less than 0.01km (10 meters)
  console.log("distance: " + distance)
  if (distance < 0.01) {
    return res.json({ goalReached: true });
  } else {
    return res.json({ goalReached: false });
  }
});

// Handler for updating ball position towards the goal
app.post('/update-ball-position', (req: Request, res: Response) => {
  const { ballPosition, goalPosition } = req.body;

  if (!ballPosition || !goalPosition) {
    return res.status(400).json({ error: 'Ball position and goal position are required.' });
  }

  // Move the ball towards the goal with a speed of 0.1 units per iteration
  const newBallPosition = moveBallTowardsGoal(ballPosition, goalPosition, 0.1);

  console.log("newBallPosition: " + newBallPosition)
  // Send the updated ball position back to the client
  res.json({ newBallPosition });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
