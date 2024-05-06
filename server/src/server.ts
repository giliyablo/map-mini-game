import * as express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 3001;

app.use(express.json());

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

app.get('/generate-goal-coordinate', (req: Request, res: Response) => {
  const { ballPosition } = req.query;

  if (!ballPosition) {
    return res.status(400).json({ error: 'Ball position is required.' });
  }

  try {
    const ballPositionArray: [number, number] = JSON.parse(ballPosition as string);
    const goalCoordinate = generateRandomGoalCoordinate(ballPositionArray);
    res.json({ goalCoordinate });
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
  if (distance < 0.01) {
    return res.json({ goalReached: true });
  } else {
    return res.json({ goalReached: false });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
