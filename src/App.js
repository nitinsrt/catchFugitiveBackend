const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  // other options...
};


const app = express();
const PORT = 3001; // Change as needed

// In-memory data structures
const cities = [
  { name: "Yapkashnagar", distance: 60, image: "city1.png" },
  { name: "Lihaspur", distance: 50, image: "city2.png" },
  { name: "Narmis City", distance: 40, image: "city3.png" },
  { name: "Shekharvati", distance: 30, image: "city4.png" },
  { name: "Nuravgram", distance: 20, image: "city5.png" },
];

const vehicles = [
  { name: "EV Bike", distance: 60, count: 2, image: "bike.png" },
  { name: "EV Car", distance: 100, count: 1, image: "car.png" },
  { name: "EV SUV", distance: 120, count: 1, image: "suv.png" },
];

let fugitiveLocation = null;
let copsChoices = [];
let captureResults = [];

app.use(bodyParser.json());
app.use(cors(corsOptions));

// Endpoint to get cities
app.get("/cities", (req, res) => {
  res.json(cities);
});

// Endpoint to get vehicles
app.get("/vehicles", (req, res) => {
  res.json(vehicles);
});

// Endpoint to simulate fugitive location
app.get("/simulate-fugitive-location", (req, res) => {
  fugitiveLocation = cities[Math.floor(Math.random() * cities.length)];
  res.json(fugitiveLocation);
});

// Endpoint to handle cop's choice
app.post("/cop-choice", (req, res) => {
  const { copName, city, vehicle } = req.body;
  copsChoices.push({ copName, city, vehicle });
  res.json({ success: true });
});

// Endpoint to determine capture results
app.get("/capture-results", (req, res) => {
  copsChoices.map((choice) => {
    if (
      choice.city === fugitiveLocation.name &&
      vehicles.find((v) => v.name === choice.vehicle).distance >=
        2 * fugitiveLocation.distance
    ) {
      captureResults.push({
        copName: choice.copName,
        result: "captured the fugitive. He was hiding in" + " " + choice.city,
        captured: true,
      });
    } else if (
      choice.city != fugitiveLocation.name &&
      vehicles.find((v) => v.name === choice.vehicle).distance >=
        2 * fugitiveLocation.distance
    ) {
      captureResults.push({
        copName: choice.copName,
        result: "reached the city but fugitive was not there",
        captured: false,
      });
    } else if (
      vehicles.find((v) => v.name === choice.vehicle).distance <
      2 * fugitiveLocation.distance
    ) {
      captureResults.push({
        copName: choice.copName,
        result: "vehicle distance was not enough",
        captured: false,
      });
    }
  });
  const results = [...captureResults];
  copsChoices = [];
  captureResults = [];
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
