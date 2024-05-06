"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var cors = require('cors');
var app = express();
var port = 3001;
app.use(express.json());
app.use(cors()); // Adding cors middleware to allow cross-origin requests
// Generate a random number between min and max
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
// Generate a random goal coordinate within 1km radius of the ball position
function generateRandomGoalCoordinate(ballPosition) {
    var earthRadius = 6371; // Earth's radius in km
    var maxDistance = 1; // Maximum distance from ball in km
    // Generate a random distance between 0 and maxDistance
    var distance = Math.sqrt(Math.random()) * maxDistance;
    // Generate a random angle
    var angle = Math.random() * Math.PI * 2;
    // Calculate the new latitude and longitude
    var newLat = ballPosition[0] + (distance / earthRadius) * (180 / Math.PI) * Math.cos(angle);
    var newLng = ballPosition[1] + (distance / earthRadius) * (180 / Math.PI) * Math.sin(angle) / Math.cos(ballPosition[0] * Math.PI / 180);
    return [newLat, newLng];
}
// Function to calculate the direction and distance between two points
function calculateDirectionAndDistance(ballPosition, goalPosition) {
    var deltaX = goalPosition[0] - ballPosition[0];
    var deltaY = goalPosition[1] - ballPosition[1];
    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // Ensure direction always has exactly two elements
    var direction = [deltaX / distance, deltaY / distance]; // Normalize the direction vector
    return { direction: direction, distance: distance };
}
// Function to update the ball position towards the goal
function moveBallTowardsGoal(ballPosition, goalPosition, speed) {
    var _a = calculateDirectionAndDistance(ballPosition, goalPosition), direction = _a.direction, distance = _a.distance;
    // Calculate the new ball position
    var newBallPosition = [
        ballPosition[0] + direction[0] * speed,
        ballPosition[1] + direction[1] * speed
    ];
    return newBallPosition;
}
// Handler for updating ball position towards the goal
app.post('/update-ball-position', function (req, res) {
    var _a = req.body, ballPosition = _a.ballPosition, goalPosition = _a.goalPosition;
    if (!ballPosition || !goalPosition) {
        return res.status(400).json({ error: 'Ball position and goal position are required.' });
    }
    // Move the ball towards the goal with a speed of 0.1 units per iteration
    var newBallPosition = moveBallTowardsGoal(ballPosition, goalPosition, 0.1);
    // Send the updated ball position back to the client
    res.json({ newBallPosition: newBallPosition });
});
app.post('/generate-goal-coordinate', function (req, res) {
    var ballPosition = req.query.ballPosition;
    if (!ballPosition) {
        return res.status(400).json({ error: 'Ball position is required.' });
    }
    try {
        var ballPositionArray = JSON.parse(ballPosition);
        var goalCoordinate = generateRandomGoalCoordinate(ballPositionArray);
        res.json({ goalCoordinate: goalCoordinate });
    }
    catch (error) {
        res.status(400).json({ error: 'Invalid ball position format.' });
    }
});
// Check if the ball has reached the goal
app.post('/check-goal-reached', function (req, res) {
    var _a = req.body, ballPosition = _a.ballPosition, goalPosition = _a.goalPosition;
    if (!ballPosition || !goalPosition) {
        return res.status(400).json({ error: 'Ball position and goal position are required.' });
    }
    // Calculate the distance between ball and goal
    var distance = Math.sqrt(Math.pow(goalPosition[0] - ballPosition[0], 2) + Math.pow(goalPosition[1] - ballPosition[1], 2));
    // Check if the distance is less than 0.01km (10 meters)
    if (distance < 0.01) {
        return res.json({ goalReached: true });
    }
    else {
        return res.json({ goalReached: false });
    }
});
app.listen(port, function () {
    console.log("Server is listening at http://localhost:".concat(port));
});
