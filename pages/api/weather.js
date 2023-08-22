import "dotenv/config";

export default async function handler(req, res) {
  const body = req.body;

  if (!body.airport) {
    res.status(400).json({ message: "Must provide a valid airport" });
  }

  try {
    const { latitude_deg, longitude_deg, ...airport } = await fetch(
      `https://airportdb.io/api/v1/airport/${body.airport}?apiToken=${process.env.AIRPORT_DB_API_KEY}`
    ).then((response) => response.json());

    if (airport.message) {
      res.status(airport.statusCode || 500).json({ message: airport.message });
    }

    if (!(latitude_deg && longitude_deg)) {
      res.status(500).json({ message: "Something went wrong :(" });
    }

    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude_deg}&lon=${longitude_deg}&appid=${process.env.WEATHER_API_KEY}`
    ).then((response) => response.json());

    if (weather.message) {
      res.status(weather.cod || 500).json({ message: weather.message });
    }

    res.status(200).json({
      weather,
      airport,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch" });
  }
}
