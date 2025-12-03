// UPDATE LIVE DATA
const API_KEY = "d123d3b5d27857f0562837ad646b4149";
const API_ENDPOINT = `http://api.openweathermap.org/data/2.5/weather?q=Batangas&APPID=${API_KEY}`;

const tempData = document.querySelector("#temp-data");
const humidityData = document.querySelector("#humidity-data");
const windData = document.querySelector("#wind-data");
const pressureData = document.querySelector("#pressure-data");
const skyData = document.querySelector("#sky-data");
const rainData = document.querySelector("#rain-data");
const sunriseData = document.querySelector("#sunrise-data");
const sunsetData = document.querySelector("#sunset-data");
const livePills = document.querySelectorAll(".live-pill");

const RATE_LIMIT_MS = 300000; // 5 minutes

const kelvinToCelsius = (kelvin) => {
    return parseFloat((kelvin - 273.15).toFixed(1));
}

const convertUnixToLocalTime = (unixTimestamp) => {
    // Required by Javascript is milliseconds
    const date = new Date(unixTimestamp * 1000);
    
    const timeOptions = {
        hour: '2-digit',    
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Manila'
    };
    
    const localTimeString = date.toLocaleTimeString('en-US', timeOptions);
    
    return localTimeString;
}

const convertMsToKmh = (metersPerSecond) => {
    // The conversion factor is 3.6
    const kmh = metersPerSecond * 3.6;
    
    return parseFloat(kmh.toFixed(1));
}

const getRainChancesDisplay = (weatherMain, cloudCoverAll) => {
    // 1. Check if it's currently precipitating (highest priority)
    if (weatherMain === "Rain" || weatherMain === "Drizzle" || weatherMain === "Thunderstorm") {
        return "High (Currently Precipitating)";
    } 
    // 2. Check for high cloud cover (Suggests potential rain soon)
    else if (weatherMain === "Clouds" && cloudCoverAll > 90) {
        // This handles your specific case where main is "Clouds" and cloud cover is 98%
        return "Medium to High (Overcast)";
    }
    // 3. Check for moderate cloud cover (Partly cloudy)
    else if (weatherMain === "Clouds" && cloudCoverAll > 50) {
        return "Medium (Partly Cloudy)";
    }
    // 4. Low cloud cover or mostly clear
    else if (weatherMain === "Clouds" && cloudCoverAll <= 50) {
        return "Low (Scattered Clouds)";
    }
    // 5. Clear conditions
    else if (weatherMain === "Clear") {
        return "Very Low (Clear Sky)";
    }  
    // Fallback for any unexpected weather condition
    else {
        return "Unavailable / Check Weather Description";
    }
}

// Yung nabasa kong documentation states to not request MULTIPLE TIMES, or else it will be blocked
// This is a safe measure lang
const fetchWeatherWithRateLimit = async (apiUrl) => {
    const now = Date.now();
    const lastCallTime = parseInt(localStorage.getItem("lastWeatherApiCallTime") || '0', 10);
    const timeSinceLastCall = now - lastCallTime;
    
    // Check if we are still within the rate limit
    if (timeSinceLastCall < RATE_LIMIT_MS) {
        const remainingTimeSeconds = Math.ceil((RATE_LIMIT_MS - timeSinceLastCall) / 1000);
        console.warn(`[API Rate Limit] Call skipped. Next call allowed in ${remainingTimeSeconds} seconds.`);
        
        // --- NEW: Return the cached data if available ---
        const cachedDataString = localStorage.getItem("cachedWeatherData");
        if (cachedDataString) {
            console.log('[API Rate Limit] Returning cached data.');
            return JSON.parse(cachedDataString);
        }
        
        console.warn('[API Rate Limit] No cached data available to return.');
        return null; // Indicate that no data (fresh or cached) could be returned
    }

    console.log('[API Call] Rate limit expired. Making new request...');

    try {
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // --- NEW: Update both timestamp AND data upon success ---
                localStorage.setItem("lastWeatherApiCallTime", now.toString());
                localStorage.setItem("cachedWeatherData", JSON.stringify(data));
                
                console.log('[API Call] Success. Fresh data and timestamp cached.');
                return data;

            } catch (error) {
                if (attempt === maxRetries) {
                    throw error; // Throw error after final failed attempt
                }
                const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
                console.warn(`[API Call] Attempt ${attempt} failed. Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        
        // --- NEW: On complete failure, try to return stale cached data as fallback ---
        const cachedDataString = localStorage.getItem("cachedWeatherData");
        if (cachedDataString) {
            console.log('[API Fallback] Returning stale cached data after fetch failure.');
            return JSON.parse(cachedDataString);
        }
        
        return null; // Return null if fetching failed and no cache exists
    }
}

const updateWeatherForecast = async () => {
    const res = await fetchWeatherWithRateLimit(API_ENDPOINT);

    if(res) {
        console.log(res);

        for(let i = 0; i < livePills.length; i++) {
            livePills[i].classList.remove('hidden');
        }

        tempData.innerHTML = `${kelvinToCelsius(res.main.temp)}°c (Feels like ${kelvinToCelsius(res.main.feels_like)}°c)`;
        humidityData.innerHTML = res.main.humidity + "%";
        windData.innerHTML = convertMsToKmh(res.wind.speed) + " km/h";
        pressureData.innerHTML = res.main.pressure + " hPa";
        skyData.innerHTML = res.weather[0].main;
        rainData.innerHTML = getRainChancesDisplay(res.weather[0].main, res.clouds.all);
        sunriseData.innerHTML = convertUnixToLocalTime(res.sys.sunrise);
        sunsetData.innerHTML = convertUnixToLocalTime(res.sys.sunset);
    }
}

// FOR THE DISASTERS
document.addEventListener('DOMContentLoaded', () => {
    updateWeatherForecast();

    const navButtons = document.querySelectorAll('.disaster-btn');
    const hazardCards = document.querySelectorAll('.hazard-card');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const hazardType = button.getAttribute('data-hazard');

            // 1. Update button active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Update content visibility
            hazardCards.forEach(card => card.classList.remove('active-content'));
            document.getElementById(hazardType).classList.add('active-content');
        });
    });
});


