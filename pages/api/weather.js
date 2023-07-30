import 'dotenv/config'

export default async function handler(req, res) {
  const body = req.body;

  if (!body.airport) {
    return res.status(400).json({ data: "Airport not found" });
  }

  const { latitude_deg, longitude_deg, ...airport } = await fetch(
    `https://airportdb.io/api/v1/airport/${body.airport}?apiToken=${process.env.AIRPORT_DB_API_KEY}`
  )
    .then((response) => response.json())

  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude_deg}&lon=${longitude_deg}&appid=${process.env.WEATHER_API_KEY}`
  )
    .then((response) => response.json());

  res.status(200).json({
    weather,
    airport
  });
}
