import React from 'react';
import { CurrentWeather, HourlyWeather } from '../data/mockDashboardData';

interface WeatherWidgetProps {
  currentWeather: CurrentWeather;
  hourlyWeather: HourlyWeather[];
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ currentWeather, hourlyWeather }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">天気情報</h2>

      <div className="flex gap-6">
        {/* 現在の天気 */}
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-3">{currentWeather.location}</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-6xl">{currentWeather.weatherIcon}</span>
            <div>
              <p className="text-5xl font-bold text-gray-800">{currentWeather.temperature}°C</p>
              <p className="text-lg text-gray-600">{currentWeather.weatherText}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">湿度</p>
              <p className="text-xl font-semibold text-blue-700">{currentWeather.humidity}%</p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">風速</p>
              <p className="text-xl font-semibold text-cyan-700">{currentWeather.windSpeed} m/s</p>
            </div>
          </div>
        </div>

        {/* 3時間ごとの天気予報 */}
        <div className="flex flex-col gap-3">
          {hourlyWeather.map((hour, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 min-w-[280px]"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-3xl">{hour.weatherIcon}</span>
                <div>
                  <p className="text-sm text-gray-600">{hour.time}</p>
                  <p className="text-xs text-gray-500">{hour.weatherText}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{hour.temperature}°C</p>
                <p className="text-xs text-gray-500">降水 {hour.precipitationProbability}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
