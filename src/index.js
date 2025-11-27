import "./styles.css";
import { getWeatherData } from "./modules/fetchData.js";

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

// Main section
const locationEl = document.querySelector(".location");
const tempEl = document.querySelector(".temp");
const forecastEl = document.querySelector(".forecast");

// Additional items
const feelsLikeEl = document.querySelector(".feels-like");
const windEl = document.querySelector(".wind");
const barometerEl = document.querySelector(".barometer");
const visibilityEl = document.querySelector(".visibility");
const humidityEl = document.querySelector(".humidity");
const dewPointEl = document.querySelector(".dew-point");

// Forecast container
const fiveDay = document.querySelector(".five-day");

// Form
const form = document.querySelector(".search form");

function updateMainSection(day, locationName) {
    locationEl.textContent = locationName;
    tempEl.textContent = `${Math.round(day.temp || day.tempmax)}°F`; // fallback to tempmax
    forecastEl.textContent = day.conditions;

    feelsLikeEl.textContent = `Feels Like: ${Math.round(day.feelslike)}°F`;
    windEl.textContent = `Wind: ${day.windspeed} mph`;
    barometerEl.textContent = `Barometer: ${day.pressure} mb`;
    visibilityEl.textContent = `Visibility: ${day.visibility} mi`;
    humidityEl.textContent = `Humidity: ${day.humidity}%`;
    dewPointEl.textContent = `Dew Point: ${Math.round(day.dew)}°F`;
}

async function renderWeather(location) {
    const data = await getWeatherData(location);

    updateMainSection(data.days[0], data.resolvedAddress);

    fiveDay.innerHTML = "";

    const days = data.days;

    for (const day of days.slice(0, 6)) {
        const card = document.createElement("div");
        card.className = "card";

        // Format date
        const date = new Date(day.datetime);
        const dateMonth = date.toLocaleString("en-US", { month: "long" });
        const dateDay = date.getDate();
        const formatted = `${dateMonth} ${dateDay}${getOrdinal(dateDay)}`;

        // Dynamic icon import
        let iconUrl;
        try {
            const iconModule = await import(`./assets/icons/${day.icon}.svg`);
            iconUrl = iconModule.default;
        } catch {
            iconUrl = "./assets/icons/clear-day.svg"; // fallback
        }

        card.innerHTML = `
            <p>${formatted}</p>
            <img src="${iconUrl}" />
            <p>${Math.round(day.tempmax)}°H | <span>${Math.round(day.tempmin)}°L</span></p>
            <p>${day.conditions}</p>
        `;

        card.addEventListener("click", () => {
            updateMainSection(day, data.resolvedAddress);
            // Highlight selected card
            document.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
        });

        fiveDay.appendChild(card);
    }

    if (fiveDay.firstChild) fiveDay.firstChild.classList.add("selected");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value.trim();
    if (!searchValue) return;

    renderWeather(searchValue);
});

renderWeather("London, United Kingdom");
