// server.ts
import express, { Request, Response } from 'express';
import { randomPoint, point, distance } from '@turf/turf';

const app = express();
const PORT = process.env.PORT || 3000;

// Sample current ball position (latitude, longitude)
const currentBallPosition: [number, number] = [40.7128, -74.0060]; // New York City coordinates

// Generate random coordinate within 1km radius of current ball position
function generateRandomGoalCoordinate(): [number, number] {
  const options = { units: 'kilometers' };
  const randomGoalPoint = randomPoint(currentBallPosition, 1, options);
  return randomGoalPoint.geometry.coordinates as [number, number];
}

// Determine if ball has reached the goal
function checkGoalReached(ballPosition: [number, number], goalPosition: [number, number], radius: number): boolean {
  const ballPoint = point(ballPosition);
  const goalPoint = point(goalPosition);
  const dist = distance(ballPoint, goalPoint, { units: 'kilometers' });
  return dist <= radius;
}

// API endpoint to generate random goal coordinate
app.get('/generate-goal-coordinate', (req: Request, res: Response) => {
  const goalCoordinate = generateRandomGoalCoordinate();
  res.json({ goalCoordinate });
});

// API endpoint to check if ball has reached the goal
app.post('/check-goal-reached', (req: Request, res: Response) => {
  // For simplicity, assuming ball position and goal position are provided in request body
  const { ballPosition, goalPosition } = req.body as { ballPosition: [number, number], goalPosition: [number, number] };
  const radius = 0.01; // 10 meters (adjust as needed)
  const goalReached = checkGoalReached(ballPosition, goalPosition, radius);
  res.json({ goalReached });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
