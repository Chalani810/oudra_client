// path: oudra-client/src/pages/WeatherPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidePanel from "../component/SidePanel";
import getFormattedWeatherData from "../services/WeatherService";
import {
  Wind, Droplets, Thermometer, Eye, Gauge, Sun,
  RefreshCw, Search, MapPin, Sunrise, Sunset,
  Leaf, AlertTriangle, ArrowLeft, Trees,
  Cloud, CloudRain, CloudSnow, CloudLightning,
  CloudDrizzle, CloudFog, CloudSun, Cloudy,
} from "lucide-react";

// ─── Map OWM icon code → Lucide component ─────────────────────────────────────
// OWM icon codes: 01=clear, 02=few clouds, 03=scattered, 04=broken,
//                 09=shower, 10=rain, 11=thunderstorm, 13=snow, 50=mist
const getWeatherIcon = (iconCode, size = 40, className = "") => {
  if (!iconCode) return <Sun size={size} className={`text-yellow-400 ${className}`} />;
  const code = iconCode.replace("d", "").replace("n", "");
  const props = { size, className };
  const map = {
    "01": <Sun        {...props} className={`text-yellow-400 ${className}`} />,
    "02": <CloudSun   {...props} className={`text-yellow-300 ${className}`} />,
    "03": <Cloud      {...props} className={`text-gray-400  ${className}`} />,
    "04": <Cloudy     {...props} className={`text-gray-500  ${className}`} />,
    "09": <CloudDrizzle {...props} className={`text-blue-400 ${className}`} />,
    "10": <CloudRain  {...props} className={`text-blue-500  ${className}`} />,
    "11": <CloudLightning {...props} className={`text-purple-500 ${className}`} />,
    "13": <CloudSnow  {...props} className={`text-blue-200  ${className}`} />,
    "50": <CloudFog   {...props} className={`text-gray-400  ${className}`} />,
  };
  return map[code] ?? <Cloud {...props} className={`text-gray-400 ${className}`} />;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, unit, iconColor = "text-gray-600", bgColor = "bg-gray-50" }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg ${bgColor}`}>
      <Icon size={20} className={iconColor} />
    </div>
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-800">
        {value ?? "—"}
        {value != null && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </p>
    </div>
  </div>
);

// ─── Plant Tips ───────────────────────────────────────────────────────────────
const getPlantTips = (weather) => {
  if (!weather) return [];
  const tips = [];
  if (weather.temp > 30)     tips.push({ Icon: Thermometer, text: "High temperature — ensure tree hydration",      level: "warn", color: "text-red-500"    });
  if (weather.temp < 10)     tips.push({ Icon: CloudSnow,   text: "Low temp — protect sensitive saplings",         level: "warn", color: "text-blue-500"   });
  if (weather.humidity > 80) tips.push({ Icon: Droplets,    text: "High humidity — monitor for fungal growth",     level: "warn", color: "text-blue-400"   });
  if (weather.humidity < 30) tips.push({ Icon: Droplets,    text: "Low humidity — increase watering frequency",    level: "warn", color: "text-orange-400" });
  if (weather.speed > 20)    tips.push({ Icon: Wind,        text: "Strong winds — secure young trees & equipment", level: "warn", color: "text-cyan-500"   });
  if (tips.length === 0)     tips.push({ Icon: Leaf,        text: "Ideal growing conditions today",                level: "ok",   color: "text-green-600"  });
  return tips;
};

const CITIES = ["Colombo", "Kandy", "Galle", "Matara", "Jaffna", "Ayagama"];

// ═════════════════════════════════════════════════════════════════════════════
const WeatherPage = () => {
  const navigate = useNavigate();

  const [query,   setQuery]   = useState({ q: "Ayagama" });
  const [units,   setUnits]   = useState("metric");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [error,   setError]   = useState(null);

  useEffect(() => { fetchWeather(); }, [query, units]); // eslint-disable-line

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      setWeather(data);
    } catch {
      setError("Could not load weather data. Check the city name or API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { setQuery({ q: search.trim() }); setSearch(""); }
  };

  const tempUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";
  const tips     = getPlantTips(weather);

  // Safe value helpers — avoid NaN / undefined showing up
  const safeVisibility = (v) => {
    if (!v || isNaN(v)) return null;
    return (v / 1000).toFixed(1);
  };
  const safePressure = (v) => (!v || isNaN(v) ? null : v);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel />

      <div className="flex-1 ml-0 md:ml-64 overflow-auto">

        {/* ── Top Bar ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Map</span>
            </button>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Weather Forecast</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {loading ? "Loading weather data…"
                  : weather ? `${weather.name}, ${weather.country} — Live conditions`
                  : "Enter a city to begin"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Unit toggle */}
            <div className="flex bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {["metric", "imperial"].map((u) => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    units === u ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {u === "metric" ? "°C" : "°F"}
                </button>
              ))}
            </div>

            <button
              onClick={fetchWeather}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-green-500" : "text-gray-600"} />
            </button>
          </div>
        </div>

        {/* ── Page Body ──────────────────────────────────────── */}
        <div className="p-6 space-y-6">

          {/* Search + Quick Cities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search city…"
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Search size={14} /> Search
                </button>
              </form>

              <div className="flex gap-2 flex-wrap">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setQuery({ q: c })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      weather?.name === c
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Skeleton */}
          {loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-24 border border-gray-100" />
              ))}
            </div>
          )}

          {/* ── Weather Content ──────────────────────────── */}
          {!loading && weather && (
            <>
              {/* Hero Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={15} className="text-green-200" />
                        <span className="text-base font-semibold">{weather.name}, {weather.country}</span>
                      </div>
                      <p className="capitalize text-green-200 text-sm">{weather.details}</p>
                      <p className="text-5xl font-bold mt-3">{Math.round(weather.temp)}{tempUnit}</p>
                      <p className="text-green-200 text-sm mt-1">
                        Feels like {Math.round(weather.feels_like)}{tempUnit}
                        &nbsp;·&nbsp;H:{Math.round(weather.temp_max)}{tempUnit}
                        &nbsp;L:{Math.round(weather.temp_min)}{tempUnit}
                      </p>
                    </div>
                    {/* Large weather icon — Lucide, always renders */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-white/20 rounded-2xl p-4">
                        {getWeatherIcon(weather.icon, 52, "drop-shadow-sm")}
                      </div>
                      <p className="text-green-200 text-sm">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sunrise / Sunset */}
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                  {[
                    { Icon: Sunrise, label: "Sunrise", val: weather.sunrise, bg: "bg-amber-50",  color: "text-amber-500"  },
                    { Icon: Sunset,  label: "Sunset",  val: weather.sunset,  bg: "bg-orange-50", color: "text-orange-500" },
                  ].map(({ Icon, label, val, bg, color }) => (
                    <div key={label} className="flex items-center gap-3 p-4">
                      <div className={`p-2 ${bg} rounded-lg`}><Icon size={18} className={color} /></div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-bold text-gray-800">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat Grid — only show cards where data actually exists */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard
                  icon={Droplets} label="Humidity"
                  value={weather.humidity} unit="%"
                  iconColor="text-blue-500" bgColor="bg-blue-50"
                />
                <StatCard
                  icon={Wind} label="Wind Speed"
                  value={weather.speed != null ? Math.round(weather.speed) : null} unit={windUnit}
                  iconColor="text-cyan-500" bgColor="bg-cyan-50"
                />
                <StatCard
                  icon={Thermometer} label="Feels Like"
                  value={weather.feels_like != null ? Math.round(weather.feels_like) : null} unit={tempUnit}
                  iconColor="text-red-400" bgColor="bg-red-50"
                />
                {safePressure(weather.pressure) && (
                  <StatCard
                    icon={Gauge} label="Pressure"
                    value={safePressure(weather.pressure)} unit="hPa"
                    iconColor="text-gray-500" bgColor="bg-gray-50"
                  />
                )}
                {safeVisibility(weather.visibility) && (
                  <StatCard
                    icon={Eye} label="Visibility"
                    value={safeVisibility(weather.visibility)} unit="km"
                    iconColor="text-purple-500" bgColor="bg-purple-50"
                  />
                )}
              </div>

              {/* Forecasts + Care */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Hourly */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" /> Hourly Forecast
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {weather.hourly?.map((h, i) => (
                      <div key={i} className="flex flex-col items-center bg-gray-50 rounded-xl p-3 min-w-[72px] border border-gray-100 gap-1">
                        <p className="text-xs text-gray-400 font-medium text-center leading-tight">{h.title}</p>
                        <div className="my-1">{getWeatherIcon(h.icon, 26)}</div>
                        <p className="text-sm font-bold text-gray-800">{Math.round(h.temp)}°</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full" /> 7-Day Forecast
                  </h3>
                  <div className="space-y-3">
                    {weather.daily?.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 w-12">{d.title}</span>
                        <div className="flex-1 flex justify-center">{getWeatherIcon(d.icon, 24)}</div>
                        <span className="font-semibold text-gray-800 w-14 text-right">{Math.round(d.temp)}{tempUnit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tree & Crop Care */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Leaf size={14} className="text-green-600" /> Tree &amp; Crop Care
                  </h3>

                  <div className="space-y-2 mb-4">
                    {tips.map(({ Icon, text, level, color }, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 rounded-lg p-3 text-sm ${
                          level === "ok"
                            ? "bg-green-50 border border-green-100 text-green-800"
                            : "bg-amber-50 border border-amber-100 text-amber-800"
                        }`}
                      >
                        <Icon size={16} className={`mt-0.5 shrink-0 ${color}`} />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Conditions Summary — mirrors Tree Health Status legend */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="font-semibold mb-3 text-gray-800 text-sm">Conditions Summary</p>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: "Temperature", val: `${Math.round(weather.temp)}${tempUnit}`,    ok: weather.temp >= 10 && weather.temp <= 30 },
                        { label: "Humidity",    val: `${weather.humidity}%`,                       ok: weather.humidity >= 40 && weather.humidity <= 70 },
                        { label: "Wind Speed",  val: `${Math.round(weather.speed)} ${windUnit}`,   ok: weather.speed <= 20 },
                      ].map(({ label, val, ok }) => (
                        <div key={label} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${ok ? "bg-green-500" : "bg-yellow-400"}`} />
                            <span className="text-gray-700">{label}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Back to map */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full flex items-center justify-center gap-2 text-xs text-green-700 font-medium bg-green-50 hover:bg-green-100 rounded-lg py-2 transition-colors"
                    >
                      <Trees size={13} /> Back to Tree Map
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-400">
            Powered by OpenWeatherMap API · Data for precision agriculture
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;