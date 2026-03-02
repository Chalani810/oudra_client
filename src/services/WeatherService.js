import { DateTime } from "luxon";

const API_KEY = "42d601f2a30a6db9a35697acfba6ad38";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = async (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ 
    ...searchParams, 
    appid: API_KEY,
    units: searchParams.units || "metric" // Default to metric if not provided
  });
  
  try {
    console.log("Fetching from:", url.toString()); // Debug log
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${infoType}:`, error);
    throw error;
  }
};

const iconUrlFromCode = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`; // Use HTTPS

const formatToLocalTime = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a "
) => DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0];
  const formattedLocalTime = formatToLocalTime(dt, timezone);
  
  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, "hh:mm a"),
    sunset: formatToLocalTime(sunset, timezone, "hh:mm a"),
    speed,
    details,
    icon: iconUrlFromCode(icon),
    formattedLocalTime,
    dt,
    timezone,
    lat,
    lon,
  };
};

const formatForcastWeather = (secs, offset, data) => {
  if (!data || !Array.isArray(data)) {
    console.error("Invalid forecast data:", data);
    return { hourly: [], daily: [] };
  }

  const hourly = data
    .filter((f) => f.dt > secs)
    .slice(0, 5)
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }));

  const daily = data
    .filter((f) => f.dt_txt && f.dt_txt.slice(-8) === "00:00:00")
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "ccc"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }));

  return { hourly, daily };
};

const getFormattedWeatherData = async (searchParams) => {
  try {
    // Ensure searchParams has required fields
    if (!searchParams || (!searchParams.q && !searchParams.lat)) {
      throw new Error("Missing search parameters");
    }

    const formattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams
    ).then(formatCurrent);

    const { dt, lat, lon, timezone } = formattedCurrentWeather;
    
    const forecastData = await getWeatherData("forecast", {
      lat,
      lon,
      units: searchParams.units || "metric",
    });
    
    const formattedForcastWeather = formatForcastWeather(
      dt, 
      timezone, 
      forecastData.list
    );

    return { ...formattedCurrentWeather, ...formattedForcastWeather };
  } catch (error) {
    console.error("Error in getFormattedWeatherData:", error);
    throw error; // Re-throw to handle in your component
  }
};

export default getFormattedWeatherData;