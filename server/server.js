"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
var express_1 = require("express");
var turf_1 = require("@turf/turf");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
// Sample current ball position (latitude, longitude)
var currentBallPosition = [40.7128, -74.0060]; // New York City coordinates
// Generate random coordinate within 1km radius of current ball position
function generateRandomGoalCoordinate() {
    var options = { units: 'kilometers' };
    var randomGoalPoint = (0, turf_1.randomPoint)(currentBallPosition, 1, options);
    return randomGoalPoint.geometry.coordinates;
}
// Determine if ball has reached the goal
function checkGoalReached(ballPosition, goalPosition, radius) {
    var ballPoint = (0, turf_1.point)(ballPosition);
    var goalPoint = (0, turf_1.point)(goalPosition);
    var dist = (0, turf_1.distance)(ballPoint, goalPoint, { units: 'kilometers' });
    return dist <= radius;
}
// API endpoint to generate random goal coordinate
app.get('/generate-goal-coordinate', function (req, res) {
    var goalCoordinate = generateRandomGoalCoordinate();
    res.json({ goalCoordinate: goalCoordinate });
});
// API endpoint to check if ball has reached the goal
app.post('/check-goal-reached', function (req, res) {
    // For simplicity, assuming ball position and goal position are provided in request body
    var _a = req.body, ballPosition = _a.ballPosition, goalPosition = _a.goalPosition;
    var radius = 0.01; // 10 meters (adjust as needed)
    var goalReached = checkGoalReached(ballPosition, goalPosition, radius);
    res.json({ goalReached: goalReached });
});
// Start the server
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
