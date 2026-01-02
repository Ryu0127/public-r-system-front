import React from 'react';
import { CurrentWeather, WeatherData } from '../data/mockDashboardData';

interface WeatherWidgetProps {
  currentWeather: CurrentWeather;
  weeklyWeather: WeatherData[];
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ currentWeather, weeklyWeather }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">天気情報</h2>

      {/* 現在の天気 */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{currentWeather.location}</p>
            <div className="flex items-center gap-2">
              <span className="text-5xl">{currentWeather.weatherIcon}</span>
              <div>
                <p className="text-4xl font-bold text-gray-800">{currentWeather.temperature}°C</p>
                <p className="text-gray-600">{currentWeather.weatherText}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <p className="text-sm text-gray-600">湿度</p>
              <p className="text-lg font-semibold text-gray-800">{currentWeather.humidity}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">風速</p>
              <p className="text-lg font-semibold text-gray-800">{currentWeather.windSpeed} m/s</p>
            </div>
          </div>
        </div>
      </div>

      {/* 週間天気予報 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">週間天気</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyWeather.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <p className="text-xs text-gray-600 mb-1">{day.dayOfWeek}</p>
              <span className="text-2xl mb-1">{day.weatherIcon}</span>
              <p className="text-xs text-gray-500 mb-1">{day.precipitationProbability}%</p>
              <div className="flex gap-1 text-xs">
                <span className="text-red-500 font-semibold">{day.maxTemp}°</span>
                <span className="text-blue-500">{day.minTemp}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
