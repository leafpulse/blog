// Replace with your OpenWeatherMap API key
const API_KEY = "0e6d2cec9a5fa6f320348c904c48bc69";

// Function to get user's location
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation not supported"));
    }
  });
}

// Function to fetch soil data
async function fetchSoilData(lat, lon) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      soilTemp: data.current.soil_temperature,
      soilMoisture: (data.current.soil_moisture * 100).toFixed(0) // Convert to percentage
    };
  } catch (error) {
    console.error("Error fetching soil data:", error);
    return null;
  }
}

// Function to display soil data
function displaySoilData(data) {
  const widget = document.getElementById("soil-widget");
  if (data) {
    widget.innerHTML = `
      <h3>Current Soil Conditions</h3>
      <p>Soil Temperature: ${data.soilTemp}°C</p>
      <p>Soil Moisture: ${data.soilMoisture}%</p>
    `;
  } else {
    widget.innerHTML = `<p>Unable to fetch soil conditions. Please try again later.</p>`;
  }
}

// Main function to initialize the widget
async function initSoilWidget() {
  try {
    const { lat, lon } = await getUserLocation();
    const soilData = await fetchSoilData(lat, lon);
    displaySoilData(soilData);
  } catch (error) {
    console.error("Error initializing widget:", error);
    displaySoilData(null);
  }
}

// Run the widget on page load
window.onload = initSoilWidget;
