// Weather widget (External API via backend)
// Frontend -> backend: GET /api/external/weather?city=...
// Backend uses Open-Meteo (no API key required).

document.addEventListener('DOMContentLoaded', () => {
  const cityElement = document.getElementById('weatherCity');
  const tempElement = document.getElementById('weatherTemp');
  const descElement = document.getElementById('weatherDesc');
  const weatherWidget = document.getElementById('weatherWidget');

  if (!cityElement || !tempElement || !descElement || !weatherWidget) return;

  const CACHE_KEY = 'weatherCacheV2';
  const MAX_AGE_MS = 30 * 60 * 1000; // 30 min

  function setUI({ city, country, temperatureC, windKph }) {
    cityElement.textContent = `${city}${country ? ', ' + country : ''}`;
    tempElement.textContent = `${Math.round(temperatureC)}°C`;
    descElement.textContent = `💨 Wind ${Math.round(windKph)} km/h`;
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.timestamp) return null;
      if (Date.now() - data.timestamp > MAX_AGE_MS) return null;
      return data;
    } catch {
      return null;
    }
  }

  function saveCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
    } catch {}
  }

  async function guessCity() {
    // If the user blocks geolocation, we fall back to Astana.
    try {
      const resp = await fetch('https://ipapi.co/json/');
      if (!resp.ok) throw new Error('ipapi error');
      const data = await resp.json();
      return {
        city: (data && data.city) ? data.city : 'Astana',
        country: (data && data.country_name) ? data.country_name : ''
      };
    } catch {
      return { city: 'Astana', country: 'Kazakhstan' };
    }
  }

  async function fetchWeather(city) {
    const res = await fetch(`/api/external/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Weather error');

    // Open-Meteo returns temperature in C and wind speed in km/h.
    return {
      city: data.location?.name || city,
      country: data.location?.country || '',
      temperatureC: data.current?.temperature_2m,
      windKph: data.current?.wind_speed_10m
    };
  }

  async function refresh(force = false) {
    weatherWidget.classList.add('loading');
    try {
      if (!force) {
        const cached = loadCache();
        if (cached) {
          setUI(cached);
          return;
        }
      }

      const loc = await guessCity();
      const w = await fetchWeather(loc.city);
      // Prefer country from ipapi if backend doesn't return one.
      if (!w.country && loc.country) w.country = loc.country;

      setUI(w);
      saveCache(w);
    } catch (e) {
      cityElement.textContent = 'Weather unavailable';
      tempElement.textContent = '--°C';
      descElement.textContent = 'Try again';
      console.error('Weather error:', e);
    } finally {
      weatherWidget.classList.remove('loading');
      weatherWidget.title = `Click to refresh | Updated: ${new Date().toLocaleTimeString()}`;
    }
  }

  weatherWidget.style.cursor = 'pointer';
  weatherWidget.addEventListener('click', () => {
    localStorage.removeItem(CACHE_KEY);
    refresh(true);
  });

  refresh(false);
});
