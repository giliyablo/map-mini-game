import express, { Request, Response } from 'express';
import * as turf from '@turf/turf';

const app = express();
const port = 3000;

// Generate a random coordinate within a 1km radius of the current ball position
app.get('/api/goal-coordinate', (req: Request, res: Response) => {
  // Dummy current ball position (replace with actual coordinates from client)
  const currentBallPosition = turf.point([0, 0]); // Creating a Point geometry

  // Generate random bearing and distance
  const bearing = Math.random() * 360;
  const distance = Math.random() * 1000; // 1km in meters

  // Calculate destination point
  const destination = turf.destination(currentBallPosition, distance, bearing, { units: 'meters' });
  const goalCoordinate = turf.getCoords(destination);

  res.json({ goalCoordinate });
});

// Determine if the ball has reached the goal
app.post('/api/check-goal-reached', (req: Request, res: Response) => {
  // Dummy ball position and goal position (replace with actual coordinates from client)
  const ballPosition = turf.point([0, 0]); // Creating a Point geometry
  const goalPosition = turf.point([10, 10]); // Creating a Point geometry

  // Calculate distance between ball and goal using Turf.js
  const distance = turf.distance(ballPosition, goalPosition, { units: 'meters' });

  // Check if the distance is less than or equal to 10 meters
  const goalReached = distance <= 10;

  res.json({ goalReached });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
