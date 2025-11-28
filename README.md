# Weather App Project

This project was built as a personal exploration of Promises, async/await, and general best practices around modern JavaScript workflows. The primary goal was to deepen my understanding of asynchronous operations—specifically fetching and handling external API data—while keeping the architecture clean and modular.

## Project Overview

The application retrieves real-time and forecasted weather information using the free Visual Crossing Weather API. To maintain clean architecture, I separated all data-fetching logic into its own module whose only responsibility is to accept a location and return processed weather data. This helped minimize global variables and kept each part of the codebase focused on a single purpose.

After completing the initial functionality, I expanded the project to experiment with the Geolocation API, which introduced me to the world of geocoding. With geocoding, the app converts latitude and longitude from getCurrentPosition() into a usable location string for weather lookup.

## Tools & Technologies

JavaScript (ES6+)

Promises, Async/Await

Visual Crossing Weather API

Geolocation API

Webpack for bundling

ESLint + Prettier for formatting and code consistency

## Notes & Challenges

One known limitation of this project is the inability to fully secure API keys on the client side. Since the APIs used are free and non-sensitive, I opted not to pursue more advanced workarounds like proxy servers or encrypted environment variable setups—though these would be necessary for production-level applications.

## Live Demo

You can view the finished project here: https://bryanf1nes.github.io/weather-app/
