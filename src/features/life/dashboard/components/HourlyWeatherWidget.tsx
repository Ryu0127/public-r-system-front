import React from 'react';
import { HourlyWeather } from '../data/mockDashboardData';

interface HourlyWeatherWidgetProps {
  hourlyWeather: HourlyWeather[];
}

const HourlyWeatherWidget: React.FC<HourlyWeatherWidgetProps> = ({ hourlyWeather }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-2">本日の天気（3時間ごと）</h2>

      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {hourlyWeather.map((hour, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 flex flex-col items-center min-w-[80px] flex-shrink-0"
            >
              <p className="text-xs font-semibold text-gray-700 mb-1">{hour.time}</p>
              <span className="text-3xl mb-1">{hour.weatherIcon}</span>
              <p className="text-lg font-bold text-gray-800">{hour.temperature}°C</p>
              <p className="text-xs text-gray-500">{hour.precipitationProbability}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyWeatherWidget;
