import React from 'react';
import { CurrentWeather, DailyWeather } from '../data/mockDashboardData';

interface WeatherWidgetProps {
  currentWeather: CurrentWeather;
  dailyWeather: DailyWeather[];
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ currentWeather, dailyWeather }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 現在の天気（横長タイル） */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">現在の天気</h2>
        <p className="text-sm text-gray-600 mb-4">{currentWeather.location}</p>

        <div className="flex items-center gap-6 mb-6">
          <span className="text-7xl">{currentWeather.weatherIcon}</span>
          <div>
            <p className="text-6xl font-bold text-gray-800">{currentWeather.temperature}°C</p>
            <p className="text-xl text-gray-600 mt-2">{currentWeather.weatherText}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">湿度</p>
            <p className="text-2xl font-bold text-blue-700">{currentWeather.humidity}%</p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">風速</p>
            <p className="text-2xl font-bold text-cyan-700">{currentWeather.windSpeed} m/s</p>
          </div>
        </div>
      </div>

      {/* 週間天気予報タイル（スクロール可能） */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">週間天気</h2>

        <div className="overflow-y-auto max-h-[400px] space-y-3 pr-2" style={{ scrollbarWidth: 'thin' }}>
          {dailyWeather.map((day, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 flex items-center justify-between flex-shrink-0"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-4xl">{day.weatherIcon}</span>
                <div>
                  <p className="font-semibold text-gray-800">{day.dayLabel}</p>
                  <p className="text-sm text-gray-500">{day.weatherText}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-red-600">{day.maxTemp}°</span>
                  <span className="text-xl text-blue-600">{day.minTemp}°</span>
                </div>
                <p className="text-xs text-gray-500">降水 {day.precipitationProbability}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
