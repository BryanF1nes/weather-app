export async function getWeatherData(query) {
    const API_KEY = "N7NHQ32CK4NXFVCFTFVD5H86T";
    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${API_KEY}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
    }
}
