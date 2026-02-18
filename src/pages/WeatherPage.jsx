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

  const getWeatherTips = () => {
    if (!weather) return [];
    const tips = [];
    if (weather.temp > 30) tips.push("High temperature - ensure hydration");
    if (weather.temp < 10) tips.push("Low temperature - protect sensitive plants");
    if (weather.humidity > 80) tips.push("High humidity - monitor for fungi");
    if (weather.humidity < 30) tips.push("Low humidity - extra watering needed");
    if (weather.speed > 20) tips.push("Strong winds - secure equipment");
    if (tips.length === 0) tips.push("Ideal conditions for growth today.");
    return tips;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section - Matching Virtual Tree Map Style */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Weather Forecast</h1>
            <p className="text-sm text-gray-500">
              {weather ? `${weather.name}, ${weather.country}` : "Loading location..."}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition text-sm font-medium">
              <span>🔄</span> Refresh
            </button>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Search/Filter Bar - Grey background like Map Controls */}
          <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <TopButtons setQuery={setQuery} />
            <Inputs setQuery={setQuery} setUnits={setUnits} />
          </div>

          {weather && (
            <div className="p-6">
              {/* Current Status Banner */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8 flex justify-between items-center">
                <TimeAndLocation weather={weather} />
                <div className="hidden md:block text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Local Time</span>
                  <p className="text-lg font-semibold text-emerald-900">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Main Stats Card */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Atmospheric Overview</h2>
                    <TempAndDetails weather={weather} units={units} />
                  </div>

                  {/* Forecast Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-100 rounded-xl p-4">
                        <Forcast title="Hourly Forecast" data={weather.hourly} />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-4">
                        <Forcast title="Daily Forecast" data={weather.daily} />
                    </div>
                  </div>
                </div>

                {/* Right: Plant Care & Details (Sidebar style) */}
                <div className="space-y-6">
                  
                  {/* Plant Care Card - Using the Green Theme */}
                  <div className="bg-emerald-600 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <span>🌱</span> Plant Care
                    </h3>
                    <div className="space-y-3">
                      {getWeatherTips().map((tip, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-sm border border-white/20">
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sun Path Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Daylight Cycle</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <p className="text-2xl">🌅</p>
                        <p className="text-sm font-bold">{weather.sunrise}</p>
                      </div>
                      <div className="h-[1px] flex-grow bg-gray-100 mx-4"></div>
                      <div className="text-center">
                        <p className="text-2xl">🌇</p>
                        <p className="text-sm font-bold">{weather.sunset}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Powered by OpenWeatherMap API • Data for precision agriculture
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;