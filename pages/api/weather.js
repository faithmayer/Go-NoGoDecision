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
      `https://api.openweathermap.org/data/2.5/weather?` +
      `lat=${latitude_deg}&` +
      `lon=${longitude_deg}&` +
      `appid=${process.env.WEATHER_API_KEY}&` +
      `units=imperial`
    ).then((response) => response.json());

    if (weather.message) {
      res.status(weather.cod || 500).json({ message: weather.message });
    }

    // Discard any closed runways
    airport.runways = airport.runways.filter(runway => runway.closed === "0")

    // Figure out what the headings of the runways are
    let runways = airport.runways.map(runway => {
      return [{
        name: runway.le_ident,
        length: runway.length_ft,
        heading: Number(runway.le_ident.slice(0, 2)) * 10
      }, {
        name: runway.he_ident,
        length: runway.length_ft,
        heading: Number(runway.he_ident.slice(0, 2)) * 10
      }]
    }).flat()

    // Pick the best runway based on the wind direction
    // (whichever the wind direction is closest to)
    let {deg, speed, gust} = weather.wind
    let noramlizedDirection = deg > 180 ? deg - 180 : deg + 180
    let diffs = runways.map(runway => {
      let normalizedHeading = runway.heading > 180 ? runway.heading - 180 : runway.heading + 180
      return normalizedHeading - noramlizedDirection
    })
    let absDiffs = diffs.map(diff => Math.abs(diff))
    let desiredIndex = absDiffs.indexOf(Math.min(...absDiffs))
    let crosswind = diffs[desiredIndex]
    let desiredRunway = runways[desiredIndex]

    // Convert speed to knots (from MPH)
    speed = speed / 1.151
    gust = gust / 1.151
    // Calculate crosswind component
    let crosswindComponent = speed * Math.sin(crosswind * (Math.PI / 180))

    res.status(200).json({
      weather,
      airport,
      optimalRunway: {
        ...desiredRunway,
        crosswindComponent,
        crosswindDirection: crosswind > 0 ? "left" : "right",
        wind: {
          gustKnots: gust,
          speedKnots: speed,
          direction: deg
        }
      }
    });
  } catch (e) {
    res.status(500).json({ message: `Failed to compute: ${e}` });
  }
}
