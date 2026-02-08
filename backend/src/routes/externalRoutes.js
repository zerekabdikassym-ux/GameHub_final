const router = require("express").Router();

const fetchFn = global.fetch ? global.fetch.bind(global) : require('node-fetch');

// GET /api/external/weather?city=Astana
router.get("/weather", async (req, res, next) => {
  try {
    const city = String(req.query.city || "").trim();
    if (!city) return res.status(400).json({ message: "city is required" });

    // 1) geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResp = await fetchFn(geoUrl);
    const geo = await geoResp.json();

    if (!geo.results || geo.results.length === 0) {
      return res.status(404).json({ message: "City not found" });
    }

    const { latitude, longitude, name, country } = geo.results[0];

    // 2) forecast
    const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;
    const wResp = await fetchFn(wUrl);
    const w = await wResp.json();

    res.json({
      location: { name, country, latitude, longitude },
      current: w.current
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
