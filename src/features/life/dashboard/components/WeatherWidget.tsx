import React from 'react';
import { CurrentWeather, DailyWeather } from '../data/mockDashboardData';

interface WeatherWidgetProps {
  currentWeather: CurrentWeather;
  dailyWeather: DailyWeather[];
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ currentWeather, dailyWeather }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 現在の天気（横長タイル） */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">現在の天気</h2>
        <p className="text-xs text-gray-600 mb-2">{currentWeather.location}</p>

        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl">{currentWeather.weatherIcon}</span>
          <div>
            <p className="text-4xl font-bold text-gray-800">{currentWeather.temperature}°C</p>
            <p className="text-base text-gray-600 mt-1">{currentWeather.weatherText}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-xs text-gray-600">湿度</p>
            <p className="text-lg font-bold text-blue-700">{currentWeather.humidity}%</p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-2">
            <p className="text-xs text-gray-600">風速</p>
            <p className="text-lg font-bold text-cyan-700">{currentWeather.windSpeed} m/s</p>
          </div>
        </div>
      </div>

      {/* 週間天気予報タイル（スクロール可能） */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">週間天気</h2>

        <div className="overflow-y-auto max-h-[280px] space-y-2 pr-2" style={{ scrollbarWidth: 'thin' }}>
          {dailyWeather.map((day, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between flex-shrink-0"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-3xl">{day.weatherIcon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{day.dayLabel}</p>
                  <p className="text-xs text-gray-500">{day.weatherText}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xl font-bold text-red-600">{day.maxTemp}°</span>
                  <span className="text-lg text-blue-600">{day.minTemp}°</span>
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
