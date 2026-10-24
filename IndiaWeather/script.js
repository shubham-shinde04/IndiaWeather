/* =========================================================
   INDIA WEATHER - FINAL SCRIPT
   HTML + CSS + JavaScript
   Real API: Open-Meteo
========================================================= */

const GEO_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";

const AIR_API =
    "https://air-quality-api.open-meteo.com/v1/air-quality";


/* =========================================================
   DOM
========================================================= */

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");

const locationBtn = document.getElementById("locationBtn");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const currentWeather = document.getElementById("currentWeather");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const currentDate = document.getElementById("currentDate");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");

const tempHigh = document.getElementById("tempHigh");
const tempLow = document.getElementById("tempLow");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const rainChance =
    document.getElementById("rainChance");

const visibility =
    document.getElementById("visibility");

const pressure =
    document.getElementById("pressure");

const cloudCover =
    document.getElementById("cloudCover");

const uvIndex =
    document.getElementById("uvIndex");

const windDirection =
    document.getElementById("windDirection");

const hourlyForecast =
    document.getElementById("hourlyForecast");

const dailyForecast =
    document.getElementById("dailyForecast");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const daylight =
    document.getElementById("daylight");

const favoriteBtn =
    document.getElementById("favoriteBtn");

const favoriteCities =
    document.getElementById("favoriteCities");

const recentSearches =
    document.getElementById("recentSearches");

const clearHistory =
    document.getElementById("clearHistory");

const themeToggle =
    document.getElementById("themeToggle");

const unitToggle =
    document.getElementById("unitToggle");

const aqiValue =
    document.getElementById("aqiValue");

const aqiStatus =
    document.getElementById("aqiStatus");

const pm25 =
    document.getElementById("pm25");

const pm10 =
    document.getElementById("pm10");

const no2 =
    document.getElementById("no2");

const o3 =
    document.getElementById("o3");


/* =========================================================
   STATE
========================================================= */

let currentLocation = null;

let weatherData = null;

let airQualityData = null;

let unit = localStorage.getItem("temperatureUnit") || "C";

let searchTimeout;


/* =========================================================
   WEATHER CODES
========================================================= */

const weatherCodes = {

    0: {
        text: "Clear Sky",
        icon: "fa-sun",
        type: "sunny"
    },

    1: {
        text: "Mainly Clear",
        icon: "fa-sun",
        type: "sunny"
    },

    2: {
        text: "Partly Cloudy",
        icon: "fa-cloud-sun",
        type: "cloudy"
    },

    3: {
        text: "Overcast",
        icon: "fa-cloud",
        type: "cloudy"
    },

    45: {
        text: "Fog",
        icon: "fa-smog",
        type: "fog"
    },

    48: {
        text: "Fog",
        icon: "fa-smog",
        type: "fog"
    },

    51: {
        text: "Light Drizzle",
        icon: "fa-cloud-rain",
        type: "rain"
    },

    53: {
        text: "Drizzle",
        icon: "fa-cloud-rain",
        type: "rain"
    },

    55: {
        text: "Heavy Drizzle",
        icon: "fa-cloud-rain",
        type: "rain"
    },

    61: {
        text: "Light Rain",
        icon: "fa-cloud-rain",
        type: "rain"
    },

    63: {
        text: "Moderate Rain",
        icon: "fa-cloud-showers-heavy",
        type: "rain"
    },

    65: {
        text: "Heavy Rain",
        icon: "fa-cloud-showers-heavy",
        type: "rain"
    },

    71: {
        text: "Light Snow",
        icon: "fa-snowflake",
        type: "snow"
    },

    73: {
        text: "Moderate Snow",
        icon: "fa-snowflake",
        type: "snow"
    },

    75: {
        text: "Heavy Snow",
        icon: "fa-snowflake",
        type: "snow"
    },

    80: {
        text: "Light Showers",
        icon: "fa-cloud-rain",
        type: "rain"
    },

    81: {
        text: "Showers",
        icon: "fa-cloud-showers-heavy",
        type: "rain"
    },

    82: {
        text: "Heavy Showers",
        icon: "fa-cloud-showers-heavy",
        type: "rain"
    },

    95: {
        text: "Thunderstorm",
        icon: "fa-cloud-bolt",
        type: "storm"
    },

    96: {
        text: "Thunderstorm with Hail",
        icon: "fa-cloud-bolt",
        type: "storm"
    },

    99: {
        text: "Heavy Thunderstorm",
        icon: "fa-cloud-bolt",
        type: "storm"
    }

};


/* =========================================================
   GET WEATHER INFO
========================================================= */

function getWeatherInfo(code) {

    return weatherCodes[code] || {
        text: "Unknown",
        icon: "fa-cloud",
        type: "cloudy"
    };

}


/* =========================================================
   TEMPERATURE CONVERSION
========================================================= */

function convertTemperature(celsius) {

    if (unit === "C") {

        return Math.round(celsius);

    }

    return Math.round(
        (celsius * 9 / 5) + 32
    );

}


/* =========================================================
   TEMPERATURE DISPLAY
========================================================= */

function temp(celsius) {

    return `${convertTemperature(celsius)}°`;

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(dateString) {

    const date = new Date(dateString);

    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   WIND DIRECTION
========================================================= */

function getWindDirection(degrees) {

    const directions = [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW"
    ];

    return directions[
        Math.round(degrees / 45) % 8
    ];

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    loading.style.display = "block";

    errorMessage.style.display = "none";

    currentWeather.style.display = "none";

}


/* =========================================================
   HIDE LOADING
========================================================= */

function hideLoading() {

    loading.style.display = "none";

}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    loading.style.display = "none";

    currentWeather.style.display = "none";

    errorMessage.style.display = "flex";

    errorMessage.querySelector("p")
        .textContent = message;

}


/* =========================================================
   SEARCH LOCATION
========================================================= */

async function searchLocation(query) {

    query = query.trim();

    if (query.length < 2) {

        searchResults.style.display = "none";

        return;

    }

    try {

        const url =
            `${GEO_API}?name=${encodeURIComponent(query)}` +
            `&count=10&language=en&countryCode=IN`;

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const data =
            await response.json();

        if (!data.results) {

            showError(
                "No Indian location found."
            );

            return;

        }

        displaySearchResults(
            data.results
        );

    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to search location."
        );

    }

}


/* =========================================================
   SEARCH RESULTS
========================================================= */

function displaySearchResults(results) {

    searchResults.innerHTML = "";

    results.forEach(location => {

        const result =
            document.createElement("div");

        result.className =
            "search-result";

        result.innerHTML = `

            <i class="fa-solid fa-location-dot"></i>

            <div>

                <strong>
                    ${location.name}
                </strong>

                <small>
                    ${location.admin1 || ""}
                    ${location.admin2 ? ", " + location.admin2 : ""}
                    , India
                </small>

            </div>

        `;

        result.addEventListener(
            "click",
            () => {

                searchResults.style.display =
                    "none";

                cityInput.value =
                    location.name;

                loadWeather(location);

            }
        );

        searchResults.appendChild(result);

    });

    searchResults.style.display =
        "block";

}


/* =========================================================
   LOAD WEATHER
========================================================= */

async function loadWeather(location) {

    showLoading();

    currentLocation =
        location;

    try {

        const params =
            new URLSearchParams({

                latitude:
                    location.latitude,

                longitude:
                    location.longitude,

                current: [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "apparent_temperature",
                    "precipitation",
                    "rain",
                    "weather_code",
                    "cloud_cover",
                    "pressure_msl",
                    "wind_speed_10m",
                    "wind_direction_10m"
                ].join(","),

                hourly: [
                    "temperature_2m",
                    "apparent_temperature",
                    "precipitation_probability",
                    "precipitation",
                    "weather_code",
                    "relative_humidity_2m",
                    "wind_speed_10m",
                    "visibility"
                ].join(","),

                daily: [
                    "weather_code",
                    "temperature_2m_max",
                    "temperature_2m_min",
                    "precipitation_probability_max",
                    "sunrise",
                    "sunset",
                    "daylight_duration",
                    "uv_index_max"
                ].join(","),

                timezone: "auto",

                forecast_days: "7"

            });


        const response =
            await fetch(
                `${WEATHER_API}?${params}`
            );


        if (!response.ok) {

            throw new Error(
                "Weather API failed"
            );

        }


        weatherData =
            await response.json();


        /* Air Quality */

        await loadAirQuality(
            location.latitude,
            location.longitude
        );


        updateCurrentWeather();

        updateHourly();

        updateDaily();

        updateSun();

        updateAirQuality();

        updateDynamicTheme();

        saveRecentSearch(
            location
        );

        renderRecentSearches();

        renderFavorites();

        updateFavoriteButton();


        hideLoading();

        currentWeather.style.display =
            "block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to load weather. Please try again."
        );

    }

}


/* =========================================================
   AIR QUALITY
========================================================= */

async function loadAirQuality(
    latitude,
    longitude
) {

    try {

        const params =
            new URLSearchParams({

                latitude,

                longitude,

                current: [
                    "us_aqi",
                    "pm2_5",
                    "pm10",
                    "nitrogen_dioxide",
                    "ozone",
                    "uv_index"
                ].join(","),

                timezone: "auto"

            });


        const response =
            await fetch(
                `${AIR_API}?${params}`
            );


        if (!response.ok) {

            throw new Error(
                "Air API failed"
            );

        }


        airQualityData =
            await response.json();

    }

    catch (error) {

        console.error(
            "Air quality error:",
            error
        );

        airQualityData = null;

    }

}


/* =========================================================
   CURRENT WEATHER UI
========================================================= */

function updateCurrentWeather() {

    const current =
        weatherData.current;

    const daily =
        weatherData.daily;

    const info =
        getWeatherInfo(
            current.weather_code
        );


    cityName.textContent =
        currentLocation.name;


    countryName.textContent =
        `${currentLocation.admin1 || ""}, India`;


    currentDate.textContent =
        formatDate(
            current.time
        );


    temperature.textContent =
        temp(
            current.temperature_2m
        );


    feelsLike.textContent =
        temp(
            current.apparent_temperature
        );


    tempHigh.textContent =
        temp(
            daily.temperature_2m_max[0]
        );


    tempLow.textContent =
        temp(
            daily.temperature_2m_min[0]
        );


    weatherDescription.textContent =
        info.text;


    weatherIcon.className =
        `fa-solid ${info.icon}`;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    windSpeed.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    cloudCover.textContent =
        `${current.cloud_cover}%`;


    pressure.textContent =
        `${Math.round(
            current.pressure_msl
        )} hPa`;


    windDirection.textContent =
        getWindDirection(
            current.wind_direction_10m
        );


    rainChance.textContent =
        `${getCurrentRainChance()}%`;


    visibility.textContent =
        getCurrentVisibility();


    if (airQualityData) {

        uvIndex.textContent =
            airQualityData.current.uv_index
                ?.toFixed(1) || "N/A";

    }

}


/* =========================================================
   RAIN CHANCE
========================================================= */

function getCurrentRainChance() {

    const times =
        weatherData.hourly.time;

    const current =
        weatherData.current.time;


    let index = 0;


    for (
        let i = 0;
        i < times.length;
        i++
    ) {

        if (
            times[i] <= current
        ) {

            index = i;

        }

    }


    return (
        weatherData
            .hourly
            .precipitation_probability[
                index
            ] || 0
    );

}


/* =========================================================
   VISIBILITY
========================================================= */

function getCurrentVisibility() {

    const times =
        weatherData.hourly.time;

    const current =
        weatherData.current.time;


    let index = 0;


    for (
        let i = 0;
        i < times.length;
        i++
    ) {

        if (
            times[i] <= current
        ) {

            index = i;

        }

    }


    const meters =
        weatherData
            .hourly
            .visibility[index];


    if (!meters) {

        return "N/A";

    }


    return (
        (meters / 1000)
            .toFixed(1) + " km"
    );

}


/* =========================================================
   HOURLY
========================================================= */

function updateHourly() {

    hourlyForecast.innerHTML = "";


    const times =
        weatherData.hourly.time;

    const current =
        weatherData.current.time;


    let start = 0;


    for (
        let i = 0;
        i < times.length;
        i++
    ) {

        if (times[i] >= current) {

            start = i;

            break;

        }

    }


    const end =
        Math.min(
            start + 24,
            times.length
        );


    for (
        let i = start;
        i < end;
        i++
    ) {

        const info =
            getWeatherInfo(
                weatherData
                    .hourly
                    .weather_code[i]
            );


        const card =
            document.createElement("div");


        card.className =
            "hour-card";


        if (i === start) {

            card.classList.add(
                "active"
            );

        }


        card.innerHTML = `

            <div class="time">

                ${
                    i === start
                        ? "Now"
                        : formatTime(
                            times[i]
                        )
                }

            </div>

            <i class="fa-solid ${info.icon}">
            </i>

            <h3>
                ${temp(
                    weatherData
                        .hourly
                        .temperature_2m[i]
                )}
            </h3>

            <div class="rain-percent">

                <i class="fa-solid fa-droplet"></i>

                ${
                    weatherData
                        .hourly
                        .precipitation_probability[i]
                    || 0
                }%

            </div>

        `;


        hourlyForecast.appendChild(
            card
        );

    }

}


/* =========================================================
   DAILY
========================================================= */

function updateDaily() {

    dailyForecast.innerHTML = "";


    weatherData.daily.time
        .forEach(
            (date, index) => {

                const info =
                    getWeatherInfo(
                        weatherData
                            .daily
                            .weather_code[index]
                    );


                const day =
                    index === 0
                        ? "TODAY"
                        : new Date(date)
                            .toLocaleDateString(
                                "en-IN",
                                {
                                    weekday: "short"
                                }
                            )
                            .toUpperCase();


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "day-row";


                row.innerHTML = `

                    <div class="day-name">
                        ${day}
                    </div>

                    <div class="day-weather">

                        <i class="fa-solid ${info.icon}">
                        </i>

                    </div>

                    <div class="day-condition">
                        ${info.text}
                    </div>

                    <div class="temperature-range">

                        <span class="high">
                            ${temp(
                                weatherData
                                    .daily
                                    .temperature_2m_max[index]
                            )}
                        </span>

                        <span>—</span>

                        <span class="low">
                            ${temp(
                                weatherData
                                    .daily
                                    .temperature_2m_min[index]
                            )}
                        </span>

                    </div>

                    <div class="rain-probability">

                        <i class="fa-solid fa-droplet"></i>

                        ${
                            weatherData
                                .daily
                                .precipitation_probability_max[index]
                            || 0
                        }%

                    </div>

                `;


                dailyForecast.appendChild(
                    row
                );

            }
        );

}


/* =========================================================
   SUN
========================================================= */

function updateSun() {

    const sunriseValue =
        weatherData.daily.sunrise[0];

    const sunsetValue =
        weatherData.daily.sunset[0];

    const seconds =
        weatherData.daily.daylight_duration[0];


    sunrise.textContent =
        formatTime(
            sunriseValue
        );


    sunset.textContent =
        formatTime(
            sunsetValue
        );


    const hours =
        Math.floor(
            seconds / 3600
        );


    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );


    daylight.textContent =
        `${hours}h ${minutes}m`;

}


/* =========================================================
   AIR QUALITY UI
========================================================= */

function updateAirQuality() {

    if (!airQualityData) {

        aqiValue.textContent =
            "N/A";

        aqiStatus.textContent =
            "Unavailable";

        pm25.textContent =
            "N/A";

        pm10.textContent =
            "N/A";

        no2.textContent =
            "N/A";

        o3.textContent =
            "N/A";

        return;

    }


    const air =
        airQualityData.current;


    const aqi =
        air.us_aqi;


    aqiValue.textContent =
        aqi ?? "N/A";


    pm25.textContent =
        air.pm2_5?.toFixed(1)
        ?? "N/A";


    pm10.textContent =
        air.pm10?.toFixed(1)
        ?? "N/A";


    no2.textContent =
        air.nitrogen_dioxide?.toFixed(1)
        ?? "N/A";


    o3.textContent =
        air.ozone?.toFixed(1)
        ?? "N/A";


    aqiStatus.textContent =
        getAQIStatus(aqi);

}


/* =========================================================
   AQI STATUS
========================================================= */

function getAQIStatus(aqi) {

    if (aqi == null) {

        return "Unavailable";

    }


    if (aqi <= 50) {

        return "Good";

    }

    if (aqi <= 100) {

        return "Moderate";

    }

    if (aqi <= 150) {

        return "Unhealthy for Sensitive Groups";

    }

    if (aqi <= 200) {

        return "Unhealthy";

    }

    if (aqi <= 300) {

        return "Very Unhealthy";

    }

    return "Hazardous";

}


/* =========================================================
   DYNAMIC WEATHER THEME
========================================================= */

function updateDynamicTheme() {

    const code =
        weatherData.current.weather_code;


    const info =
        getWeatherInfo(code);


    document.body.dataset.weather =
        info.type;


    document.body.classList.remove(
        "weather-sunny",
        "weather-cloudy",
        "weather-rain",
        "weather-storm",
        "weather-fog",
        "weather-snow"
    );


    document.body.classList.add(
        `weather-${info.type}`
    );


    weatherIcon.className =
        `fa-solid ${info.icon}`;


    /* Icon colors */

    if (info.type === "sunny") {

        weatherIcon.style.color =
            "#f59e0b";

    }

    else if (info.type === "cloudy") {

        weatherIcon.style.color =
            "#64748b";

    }

    else if (info.type === "rain") {

        weatherIcon.style.color =
            "#3b82f6";

    }

    else if (info.type === "storm") {

        weatherIcon.style.color =
            "#7c3aed";

    }

    else if (info.type === "fog") {

        weatherIcon.style.color =
            "#94a3b8";

    }

    else if (info.type === "snow") {

        weatherIcon.style.color =
            "#38bdf8";

    }


    /* Day / Night */

    const now =
        new Date(
            weatherData.current.time
        );

    const sunriseTime =
        new Date(
            weatherData.daily.sunrise[0]
        );

    const sunsetTime =
        new Date(
            weatherData.daily.sunset[0]
        );


    if (
        now < sunriseTime ||
        now > sunsetTime
    ) {

        document.body.classList.add(
            "night"
        );

    }

    else {

        document.body.classList.remove(
            "night"
        );

    }

}


/* =========================================================
   RECENT SEARCH
========================================================= */

function saveRecentSearch(location) {

    let list =
        JSON.parse(
            localStorage.getItem(
                "recentSearches"
            )
        ) || [];


    list =
        list.filter(
            item =>
                item.name.toLowerCase()
                !==
                location.name.toLowerCase()
        );


    list.unshift({
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        admin1: location.admin1 || ""
    });


    list =
        list.slice(0, 6);


    localStorage.setItem(
        "recentSearches",
        JSON.stringify(list)
    );

}


/* =========================================================
   RECENT UI
========================================================= */

function renderRecentSearches() {

    const list =
        JSON.parse(
            localStorage.getItem(
                "recentSearches"
            )
        ) || [];


    recentSearches.innerHTML = "";


    if (!list.length) {

        recentSearches.innerHTML = `
            <p style="color:#718096;font-size:13px;">
                No recent searches yet.
            </p>
        `;

        return;

    }


    list.forEach(location => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "recent-item";


        item.innerHTML = `

            <i class="fa-solid fa-clock"></i>

            <span>
                ${location.name}
            </span>

        `;


        item.onclick =
            () => loadWeather(location);


        recentSearches.appendChild(
            item
        );

    });

}


/* =========================================================
   FAVORITES
========================================================= */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem(
            "favoriteCities"
        )
    ) || [];

}


function saveFavorite() {

    if (!currentLocation) {
        return;
    }


    let list =
        getFavorites();


    const exists =
        list.some(
            item =>
                item.name ===
                currentLocation.name
        );


    if (exists) {

        list =
            list.filter(
                item =>
                    item.name !==
                    currentLocation.name
            );

    }

    else {

        list.push({
            name: currentLocation.name,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            admin1: currentLocation.admin1 || ""
        });

    }


    localStorage.setItem(
        "favoriteCities",
        JSON.stringify(list)
    );


    renderFavorites();

    updateFavoriteButton();

}


function renderFavorites() {

    const list =
        getFavorites();


    favoriteCities.innerHTML = "";


    if (!list.length) {

        favoriteCities.innerHTML = `
            <p style="color:#718096;font-size:13px;">
                No favorite cities yet.
                Click the heart icon to add one.
            </p>
        `;

        return;

    }


    list.forEach(location => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "favorite-city";


        card.innerHTML = `

            <h3>
                ${location.name}
            </h3>

            <p>
                ${location.admin1 || "India"}
            </p>

            <div class="fav-temp">
                <i class="fa-solid fa-cloud-sun"></i>
                View Weather
            </div>

        `;


        card.onclick =
            () => loadWeather(location);


        favoriteCities.appendChild(
            card
        );

    });

}


function updateFavoriteButton() {

    if (!currentLocation) {
        return;
    }


    const exists =
        getFavorites().some(
            item =>
                item.name ===
                currentLocation.name
        );


    favoriteBtn.innerHTML =
        exists
            ? `<i class="fa-solid fa-heart"
                 style="color:#ef4444;"></i>`
            : `<i class="fa-regular fa-heart"></i>`;

}


/* =========================================================
   SEARCH EVENTS
========================================================= */

searchBtn.addEventListener(
    "click",
    () => {

        searchLocation(
            cityInput.value
        );

    }
);


cityInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchLocation(
                cityInput.value
            );

        }

    }
);


/* =========================================================
   LIVE SEARCH
========================================================= */

cityInput.addEventListener(
    "input",
    () => {

        clearTimeout(
            searchTimeout
        );


        const query =
            cityInput.value.trim();


        if (query.length < 3) {

            searchResults.style.display =
                "none";

            return;

        }


        searchTimeout =
            setTimeout(
                () => searchLocation(query),
                500
            );

    }
);


/* =========================================================
   CLOSE SEARCH
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".search-section"
            )
        ) {

            searchResults.style.display =
                "none";

        }

    }
);


/* =========================================================
   FAVORITE
========================================================= */

favoriteBtn.addEventListener(
    "click",
    saveFavorite
);


/* =========================================================
   CLEAR HISTORY
========================================================= */

clearHistory.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "recentSearches"
        );

        renderRecentSearches();

    }
);


/* =========================================================
   DARK MODE
========================================================= */

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const dark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            dark
        );


        themeToggle.innerHTML =
            dark
                ? `<i class="fa-solid fa-sun"></i>`
                : `<i class="fa-solid fa-moon"></i>`;

    }
);


function loadTheme() {

    const dark =
        localStorage.getItem(
            "darkMode"
        ) === "true";


    if (dark) {

        document.body.classList.add(
            "dark"
        );

        themeToggle.innerHTML =
            `<i class="fa-solid fa-sun"></i>`;

    }

}


/* =========================================================
   UNIT TOGGLE
========================================================= */

unitToggle.textContent =
    unit === "C"
        ? "°C"
        : "°F";


unitToggle.addEventListener(
    "click",
    () => {

        unit =
            unit === "C"
                ? "F"
                : "C";


        localStorage.setItem(
            "temperatureUnit",
            unit
        );


        unitToggle.textContent =
            unit === "C"
                ? "°C"
                : "°F";


        if (weatherData) {

            updateCurrentWeather();

            updateHourly();

            updateDaily();

        }

    }
);


/* =========================================================
   MY LOCATION
========================================================= */

locationBtn.addEventListener(
    "click",
    () => {

        if (
            !navigator.geolocation
        ) {

            showError(
                "Geolocation is not supported by your browser."
            );

            return;

        }


        showLoading();


        navigator.geolocation.getCurrentPosition(

            position => {

                const location = {

                    name: "Your Location",

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude,

                    admin1:
                        "India"

                };


                loadWeather(
                    location
                );

            },

            () => {

                showError(
                    "Location permission was denied. Please search your city manually."
                );

            }

        );

    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

renderRecentSearches();

renderFavorites();

loadTheme();


const defaultLocation = {

    name: "Nashik",

    latitude: 20.0059,

    longitude: 73.7897,

    admin1: "Maharashtra"

};


loadWeather(
    defaultLocation
);