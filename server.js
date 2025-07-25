const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const { scrapeFlights } = require('./scraper');
const { getWeather } = require('./weather');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

let flightData = {
  departure: [],
  arrival: [],
  lastUpdated: null
};

async function updateFlightData() {
  try {
    console.log('Updating flight data...');
    const data = await scrapeFlights();
    flightData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    console.log(`Updated: ${flightData.departure.length} departures, ${flightData.arrival.length} arrivals`);
  } catch (error) {
    console.error('Error updating flight data:', error);
  }
}

app.get('/api/flights', (req, res) => {
  const type = req.query.type || 'departure';
  res.json({
    flights: flightData[type] || [],
    lastUpdated: flightData.lastUpdated,
    type
  });
});

app.get('/api/weather', async (req, res) => {
  const weather = await getWeather();
  res.json(weather);
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  await updateFlightData();
  
  cron.schedule('*/3 * * * *', updateFlightData);
  console.log('Scheduled flight data updates every 3 minutes');
});