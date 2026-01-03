import React from 'react';
import { HourlyWeather } from '../data/mockDashboardData';

interface HourlyWeatherWidgetProps {
  hourlyWeather: HourlyWeather[];
}

const HourlyWeatherWidget: React.FC<HourlyWeatherWidgetProps> = ({ hourlyWeather }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">本日の天気（3時間ごと）</h2>

      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {hourlyWeather.map((hour, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 flex flex-col items-center min-w-[100px] flex-shrink-0"
            >
              <p className="text-sm font-semibold text-gray-700 mb-2">{hour.time}</p>
              <span className="text-4xl mb-2">{hour.weatherIcon}</span>
              <p className="text-2xl font-bold text-gray-800 mb-1">{hour.temperature}°C</p>
              <p className="text-xs text-gray-500">降水 {hour.precipitationProbability}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyWeatherWidget;
