"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var turf = require("@turf/turf");
var app = (0, express_1.default)();
var port = 3000;
// Generate a random coordinate within a 1km radius of the current ball position
app.get('/api/goal-coordinate', function (req, res) {
    // Dummy current ball position (replace with actual coordinates from client)
    var currentBallPosition = turf.point([0, 0]); // Creating a Point geometry
    // Generate random bearing and distance
    var bearing = Math.random() * 360;
    var distance = Math.random() * 1000; // 1km in meters
    // Calculate destination point
    var destination = turf.destination(currentBallPosition, distance, bearing, { units: 'meters' });
    var goalCoordinate = turf.getCoords(destination);
    res.json({ goalCoordinate: goalCoordinate });
});
// Determine if the ball has reached the goal
app.post('/api/check-goal-reached', function (req, res) {
    // Dummy ball position and goal position (replace with actual coordinates from client)
    var ballPosition = turf.point([0, 0]); // Creating a Point geometry
    var goalPosition = turf.point([10, 10]); // Creating a Point geometry
    // Calculate distance between ball and goal using Turf.js
    var distance = turf.distance(ballPosition, goalPosition, { units: 'meters' });
    // Check if the distance is less than or equal to 10 meters
    var goalReached = distance <= 10;
    res.json({ goalReached: goalReached });
});
app.listen(port, function () {
    console.log("Server is running on http://localhost:".concat(port));
});
