// server.ts
import express, { Request, Response } from 'express';

const app = express();
const port = 3001;

let ballPosition: [number, number] | null = null;
let goalPosition: [number, number] | null = null;

app.use(express.json());

// Endpoint to update ball position
app.post('/update-ball-position', (req: Request, res: Response) => {
  const { position } = req.body;
  ballPosition = position;
  res.sendStatus(200);
});

// Endpoint to fetch goal position
app.get('/fetch-goal-position', (req: Request, res: Response) => {
  if (!ballPosition) {
    return res.status(400).json({ error: 'Ball position not available.' });
  }

  // Generate a random goal coordinate within 1km radius of the ball position
  const generateRandomGoalCoordinate = (): [number, number] => {
    const earthRadius = 6371; // Earth's radius in km
    const maxDistance = 1; // Maximum distance from ball in km

    const distance = Math.sqrt(Math.random()) * maxDistance;
    const angle = Math.random() * Math.PI * 2;

    const newLat = ballPosition[0] + (distance / earthRadius) * (180 / Math.PI) * Math.cos(angle);
    const newLng = ballPosition[1] + (distance / earthRadius) * (180 / Math.PI) * Math.sin(angle) / Math.cos(ballPosition[0] * Math.PI / 180);

    return [newLat, newLng];
  };

  goalPosition = generateRandomGoalCoordinate();
  res.json({ goalPosition });
});

// Endpoint to check if the ball has reached the goal
app.get('/check-goal-reached', (req: Request, res: Response) => {
  if (!ballPosition || !goalPosition) {
    return res.status(400).json({ error: 'Ball or goal position not available.' });
  }

  const distance = Math.sqrt(Math.pow(goalPosition[0] - ballPosition[0], 2) + Math.pow(goalPosition[1] - ballPosition[1], 2));
  if (distance < 0.01) { // 10 meters in km
    res.json({ goalReached: true });
  } else {
    res.json({ goalReached: false });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
