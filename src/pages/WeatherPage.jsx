import React, { useEffect, useState } from "react";
import TopButtons from "../component/Weather/TopButtons";
import Inputs from "../component/Weather/Inputs";
import TimeAndLocation from "../component/Weather/TimeAndLocation";
import TempAndDetails from "../component/Weather/TempAndDetails";
import Forcast from "../component/Weather/Forcast";
import getFormattedWeatherData from "../services/WeatherService";

const WeatherPage = () => {
  const [query, setQuery] = useState({ q: "Ayagama" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      await getFormattedWeatherData({ ...query, units }).then((data) =>
        setWeather(data)
      );
    };
    getWeather();
  }, [query, units]);

  // Get weather condition for styling
  const getWeatherCondition = () => {
    if (!weather) return "default";
    const desc = weather.details.toLowerCase();
    if (desc.includes("clear") || desc.includes("sunny")) return "sunny";
    if (desc.includes("rain") || desc.includes("drizzle")) return "rainy";
    if (desc.includes("cloud")) return "cloudy";
    if (desc.includes("snow")) return "snowy";
    if (desc.includes("thunder") || desc.includes("storm")) return "stormy";
    return "default";
  };

  const condition = getWeatherCondition();

  const conditionColors = {
    sunny: {
      bg: "from-amber-50 to-orange-50",
      accent: "from-amber-500 to-orange-500",
      border: "border-amber-200",
      text: "text-amber-600",
    },
    rainy: {
      bg: "from-blue-50 to-cyan-50",
      accent: "from-blue-500 to-cyan-500",
      border: "border-blue-200",
      text: "text-blue-600",
    },
    cloudy: {
      bg: "from-gray-50 to-blue-50",
      accent: "from-gray-500 to-blue-500",
      border: "border-gray-200",
      text: "text-gray-600",
    },
    snowy: {
      bg: "from-blue-50 to-indigo-50",
      accent: "from-blue-400 to-indigo-400",
      border: "border-blue-200",
      text: "text-blue-600",
    },
    stormy: {
      bg: "from-purple-50 to-indigo-50",
      accent: "from-purple-500 to-indigo-500",
      border: "border-purple-200",
      text: "text-purple-600",
    },
    default: {
      bg: "from-emerald-50 to-teal-50",
      accent: "from-emerald-500 to-teal-500",
      border: "border-emerald-200",
      text: "text-emerald-600",
    },
  };

  const getWeatherEmoji = () => {
    switch (condition) {
      case "sunny": return "☀️";
      case "rainy": return "🌧️";
      case "cloudy": return "☁️";
      case "snowy": return "❄️";
      case "stormy": return "⛈️";
      default: return "🌤️";
    }
  };

  const getWeatherTips = () => {
    if (!weather) return [];
    
    const tips = [];
    
    // Temperature tips
    if (weather.temp > 30) {
      tips.push("High temperature - ensure proper hydration for plants");
    } else if (weather.temp < 10) {
      tips.push("Low temperature - consider protecting sensitive plants");
    }
    
    // Humidity tips
    if (weather.humidity > 80) {
      tips.push("High humidity - monitor for fungal diseases");
    } else if (weather.humidity < 30) {
      tips.push("Low humidity - plants may need extra watering");
    }
    
    // Wind tips
    if (weather.speed > 20) {
      tips.push("Strong winds - secure outdoor plants and equipment");
    }
    
    // Rain tips
    if (weather.details.toLowerCase().includes("rain")) {
      tips.push("Rain expected - natural watering for your garden");
    }
    
    // Default tip if none apply
    if (tips.length === 0) {
      tips.push("Perfect weather conditions for plant growth today!");
    }
    
    return tips;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${conditionColors[condition].bg} py-8 px-4 md:px-8 transition-all duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className={`bg-gradient-to-r ${conditionColors[condition].accent} rounded-2xl shadow-lg mb-8 p-6 text-white`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-4xl mr-3">{getWeatherEmoji()}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Weather Forecast</h1>
                  <p className="text-white/80 mt-2">Real-time weather updates for your location</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <p className="text-sm">Current Location</p>
              <p className="text-xl font-semibold">{weather ? `${weather.name}, ${weather.country}` : "Loading..."}</p>
            </div>
          </div>
        </div>

        {/* Main Weather Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-200">
          {/* Top Section with Search */}
          <div className={`bg-gradient-to-r ${conditionColors[condition].bg} p-6 border-b ${conditionColors[condition].border}`}>
            <TopButtons setQuery={setQuery} />
            <Inputs setQuery={setQuery} setUnits={setUnits} />
          </div>

          {/* Current Weather Section */}
          {weather && (
            <div className="p-6 md:p-8">
              {/* Time and Location */}
              <div className={`bg-gradient-to-r ${conditionColors[condition].bg} rounded-xl p-6 mb-6 border ${conditionColors[condition].border}`}>
                <TimeAndLocation weather={weather} />
              </div>

              {/* Current Weather Display */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Side - Main Weather Info */}
                <div className={`bg-gradient-to-br ${conditionColors[condition].bg} rounded-2xl p-6 shadow-sm border ${conditionColors[condition].border}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Current Weather</h2>
                      <p className={`${conditionColors[condition].text} font-medium mt-1 text-lg`}>{weather.details}</p>
                    </div>
                    <div className="text-5xl">{getWeatherEmoji()}</div>
                  </div>
                  
                  <TempAndDetails weather={weather} units={units} />
                </div>

                {/* Right Side - Weather Stats */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Weather Statistics</h2>
                  
                  <div className="space-y-4">
                    {/* Temperature Range */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Temperature Range</span>
                        <span className="font-bold text-gray-800">{weather.temp_min.toFixed()}° - {weather.temp_max.toFixed()}°</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-red-500 h-3 rounded-full" 
                          style={{ 
                            width: `${((weather.temp - weather.temp_min) / (weather.temp_max - weather.temp_min)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Humidity</span>
                        <span className="font-bold text-gray-800">{weather.humidity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" 
                          style={{ width: `${weather.humidity}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Wind Speed */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Wind Speed</span>
                        <span className="font-bold text-gray-800">
                          {weather.speed} {units === "metric" ? "km/h" : "m/s"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">💨</span>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" 
                            style={{ width: `${Math.min(weather.speed * 3, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Feels Like */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="mr-2">🌡️</span>
                          <span className="text-gray-600">Feels Like</span>
                        </div>
                        <span className="font-bold text-gray-800">{weather.feels_like.toFixed()}°</span>
                      </div>
                      <div className="mt-2">
                        {weather.feels_like > weather.temp ? (
                          <span className="text-sm text-orange-600">Warmer than actual temperature</span>
                        ) : weather.feels_like < weather.temp ? (
                          <span className="text-sm text-blue-600">Cooler than actual temperature</span>
                        ) : (
                          <span className="text-sm text-green-600">Similar to actual temperature</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Sections */}
              <div className="mb-8">
                <div className={`bg-gradient-to-r ${conditionColors[condition].accent} rounded-t-2xl p-6`}>
                  <h2 className="text-2xl font-bold text-white">Weather Forecast</h2>
                </div>
                
                <div className="bg-white rounded-b-2xl p-6 shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`bg-gradient-to-br ${conditionColors[condition].bg} rounded-xl p-6 border ${conditionColors[condition].border}`}>
                      <Forcast title="Hourly Forecast" data={weather.hourly} />
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                      <Forcast title="Daily Forecast" data={weather.daily} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Tips Section */}
              <div className={`bg-gradient-to-r ${conditionColors[condition].bg} rounded-2xl p-6 border ${conditionColors[condition].border}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🌱</span> Plant Care Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getWeatherTips().map((tip, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-start">
                        <span className={`text-lg mr-2 ${conditionColors[condition].text}`}>•</span>
                        <p className="text-gray-600 text-sm">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Sunrise/Sunset Info */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">🌅</span>
                        <div>
                          <p className="text-gray-600">Sunrise</p>
                          <p className="text-lg font-bold text-gray-800">{weather.sunrise}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">🌇</span>
                        <div>
                          <p className="text-gray-600">Sunset</p>
                          <p className="text-lg font-bold text-gray-800">{weather.sunset}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="mb-2">Weather data provided by OpenWeatherMap</p>
            <p className="text-gray-400">Last updated: {weather ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Loading...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;