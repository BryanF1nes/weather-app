import { getWeatherData } from "./fetchData.js";

export const GeoLocation = (() => {
    const el = {
        locationEl: () => document.querySelector(".location"),
        tempEl: () => document.querySelector(".temp"),
        forecastEl: () => document.querySelector(".forecast"),
        feelsLikeEl: () => document.querySelector(".feels-like"),
        windEl: () => document.querySelector(".wind"),
        barometerEl: () => document.querySelector(".barometer"),
        visibilityEl: () => document.querySelector(".visibility"),
        humidityEl: () => document.querySelector(".humidity"),
        dewPointEl: () => document.querySelector(".dew-point"),
        fiveDay: () => document.querySelector(".five-day"),
        form: () => document.querySelector(".search form"),
    }

    const init = () => {
        geolocation();
    };

    const updateMainSection = (day, locationName) => {
        el.locationEl().textContent = locationName;
        el.tempEl().textContent = `${Math.round(day.temp || day.tempmax)}°F`; // fallback to tempmax
        el.forecastEl().textContent = day.conditions;

        el.feelsLikeEl().textContent = `Feels Like: ${Math.round(day.feelslike)}°F`;
        el.windEl().textContent = `Wind: ${day.windspeed} mph`;
        el.barometerEl().textContent = `Barometer: ${day.pressure} mb`;
        el.visibilityEl().textContent = `Visibility: ${day.visibility} mi`;
        el.humidityEl().textContent = `Humidity: ${day.humidity}%`;
        el.dewPointEl().textContent = `Dew Point: ${Math.round(day.dew)}°F`;
    }

    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    }

    const getLocation = async (lat, long) => {
        const API_KEY = "6928c39a71261149465181pgucaef70";
        const URL = `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=${API_KEY}`;
        const response = await fetch(URL);
        const data = await response.json();
        return data;
    }

    const geolocation = () => {
        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getLocation(latitude, longitude).then((data) => {
                console.log(data);
                const location = `${data.address.county} ${data.address.state}, ${data.address.country}`;
                renderWeather(location);
            });
        }

        function error() {
            const message = "Unable to retrieve your location";
            return message;
        }

        if (!navigator.geolocation) {
            console.log("Geolocation is not supported by your browser");
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }
    const renderWeather = async (location) => {
        const data = await getWeatherData(location);

        updateMainSection(data.days[0], data.resolvedAddress);

        el.fiveDay().innerHTML = "";

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
                const iconModule = await import(`../assets/icons/${day.icon}.svg`);
                iconUrl = iconModule.default;
            } catch {
                iconUrl = "../assets/icons/clear-day.svg"; // fallback
            }

            card.innerHTML = `
            <p>${formatted}</p>
            <img src="${iconUrl}" />
            <p>${Math.round(day.tempmax)}°H | <span>${Math.round(day.tempmin)}°L</span></p>
            <p>${day.conditions}</p>
        `;

            card.addEventListener("click", () => {
                updateMainSection(day, data.resolvedAddress);
                document.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
            });

            el.fiveDay().appendChild(card);
        }

        if (el.fiveDay().firstChild) el.fiveDay().firstChild.classList.add("selected");
    }

    el.form().addEventListener("submit", (e) => {
        e.preventDefault();
        const searchValue = e.target.search.value.trim();
        if (!searchValue) return;

        renderWeather(searchValue);
    });

    return { init }
})()
