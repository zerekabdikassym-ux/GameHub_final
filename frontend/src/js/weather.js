
document.addEventListener('DOMContentLoaded', async () => {
  const cityElement = document.getElementById('weatherCity');
  const tempElement = document.getElementById('weatherTemp');
  const descElement = document.getElementById('weatherDesc');
  const weatherWidget = document.getElementById('weatherWidget');
  
  if (!cityElement || !tempElement || !descElement) return;
  
  
  async function getWeatherByLocation() {
    return new Promise(async (resolve, reject) => {
    try {
      const locationResponse = await fetch('https://ipapi.co/json/');
      const locationData = await locationResponse.json();
      
      const city = locationData.city || 'Astana';
      const country = locationData.country_name || '';
      
      const weatherResponse = await fetch(`https://wttr.in/${city}?format=j1`);
      const weatherData = await weatherResponse.json();
      
      
      const current = weatherData.current_condition[0];
      const temp = current.temp_C;
      const desc = current.weatherDesc[0].value;
      const humidity = current.humidity;
      const windSpeed = current.windspeedKmph;
      
      
      cityElement.textContent = `${city}, ${country}`;
      tempElement.textContent = `${temp}°C`;
      descElement.textContent = desc;
      
      
      const weatherIcon = getWeatherIcon(desc);
      descElement.textContent = `${weatherIcon} ${desc}`;
      
      
      const weatherCache = {
        city: city,
        country: country,
        temp: temp,
        desc: desc,
        icon: weatherIcon,
        timestamp: Date.now()
      };
      localStorage.setItem('weatherCache', JSON.stringify(weatherCache));
      
      
      weatherWidget.title = `Humidity: ${humidity}%, Wind: ${windSpeed} km/h | Click to refresh`;
      
      resolve();
    } catch (error) {
      console.error('Weather API Error:', error);
      useFallbackWeather();
      reject(error);
    }
    });
  }
  
  
  function useFallbackWeather() {
    cityElement.textContent = 'Astana, Kazakhstan';
    tempElement.textContent = '0°C';
    descElement.textContent = 'Weather unavailable';
  }
  
  
  function loadCachedWeather() {
    const cached = localStorage.getItem('weatherCache');
    if (cached) {
      const weatherCache = JSON.parse(cached);
      const age = Date.now() - weatherCache.timestamp;
      const maxAge = 30 * 60 * 1000; 
      
      if (age < maxAge) {
        cityElement.textContent = `${weatherCache.city}, ${weatherCache.country}`;
        tempElement.textContent = `${weatherCache.temp}°C`;
        descElement.textContent = `${weatherCache.icon} ${weatherCache.desc}`;
        return true;
      }
    }
    return false;
  }
  
  
  function getWeatherIcon(desc) {
    const lowerDesc = desc.toLowerCase();
    if (lowerDesc.includes('sun') || lowerDesc.includes('clear')) return '☀️';
    if (lowerDesc.includes('cloud')) return '☁️';
    if (lowerDesc.includes('rain') || lowerDesc.includes('drizzle')) return '🌧️';
    if (lowerDesc.includes('snow')) return '❄️';
    if (lowerDesc.includes('thunder') || lowerDesc.includes('storm')) return '⛈️';
    if (lowerDesc.includes('fog') || lowerDesc.includes('mist')) return '🌫️';
    if (lowerDesc.includes('wind')) return '💨';
    return '🌤️';
  }
  
  
  if (!loadCachedWeather()) {
    getWeatherByLocation();
  }
  
  
  weatherWidget.style.cursor = 'pointer';
  weatherWidget.addEventListener('click', () => {
    
    weatherWidget.classList.add('loading');
    weatherWidget.title = 'Updating weather data...';
    localStorage.removeItem('weatherCache');
    
    
    setTimeout(() => {
      getWeatherByLocation().then(() => {
        weatherWidget.classList.remove('loading');
        weatherWidget.title = `Click to refresh | Last updated: ${new Date().toLocaleTimeString()}`;
      }).catch(() => {
        weatherWidget.classList.remove('loading');
      });
    }, 100);
  });
});
