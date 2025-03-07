const apiKey = 'aa8dc65e3eba924619dfb8cbeb89aa24'; // Sample OpenWeatherMap API key
const weatherDiv = document.getElementById('weather');
const cityInput = document.getElementById('cityInput');

// DOM Elements
const cityName = document.getElementById('cityName');
const date = document.getElementById('date');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const weatherIcon = document.getElementById('weatherIcon');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');

// Initialize the app
function init() {
    // Set current date
    updateDate();
    // Load default city
    getWeather('London');
    
    // Add enter key listener for search
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
}

// Update date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    date.textContent = now.toLocaleDateString('en-US', options);
}

// Search weather for entered city
function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
        setLoadingState(true);
        getWeather(city);
        cityInput.value = '';
    }
}

// Fetch weather data from API
async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            showError('City not found. Please try again.');
        }
    } catch (error) {
        showError('Failed to fetch weather data. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Display weather data
function displayWeather(data) {
    const { name, main, weather, wind } = data;

    // Update city name and weather condition
    cityName.textContent = name;
    condition.textContent = weather[0].description.charAt(0).toUpperCase() + 
                          weather[0].description.slice(1);

    // Update temperature and details
    temperature.textContent = `${Math.round(main.temp)}°C`;
    feelsLike.textContent = `${Math.round(main.feels_like)}°C`;
    humidity.textContent = `${main.humidity}%`;
    windSpeed.textContent = `${Math.round(wind.speed)} m/s`;
    pressure.textContent = `${main.pressure} hPa`;

    // Update weather icon
    updateWeatherIcon(weather[0].id);
}

// Update weather icon based on condition code
function updateWeatherIcon(weatherId) {
    let iconClass = 'fas ';
    
    if (weatherId >= 200 && weatherId < 300) {
        iconClass += 'fa-bolt';
    } else if (weatherId >= 300 && weatherId < 500) {
        iconClass += 'fa-cloud-rain';
    } else if (weatherId >= 500 && weatherId < 600) {
        iconClass += 'fa-rain';
    } else if (weatherId >= 600 && weatherId < 700) {
        iconClass += 'fa-snowflake';
    } else if (weatherId >= 700 && weatherId < 800) {
        iconClass += 'fa-smog';
    } else if (weatherId === 800) {
        iconClass += 'fa-sun';
    } else {
        iconClass += 'fa-cloud';
    }

    weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;
}

// Show error message
function showError(message) {
    cityName.textContent = 'Error';
    condition.textContent = message;
    temperature.textContent = '--°C';
    feelsLike.textContent = '--°C';
    humidity.textContent = '--%';
    windSpeed.textContent = '-- m/s';
    pressure.textContent = '-- hPa';
    weatherIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
}

// Set loading state
function setLoadingState(isLoading) {
    const loadingClass = 'loading';
    if (isLoading) {
        weatherDiv.classList.add(loadingClass);
    } else {
        weatherDiv.classList.remove(loadingClass);
    }
}

// Initialize the app
init();
