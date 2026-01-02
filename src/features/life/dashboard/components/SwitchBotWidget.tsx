import React from 'react';
import { SwitchBotDevice } from '../data/mockDashboardData';

interface SwitchBotWidgetProps {
  devices: SwitchBotDevice[];
  onToggleDevice?: (deviceId: string) => void;
  onChangeAirconMode?: (deviceId: string, mode: string) => void;
  onChangeAirconTemp?: (deviceId: string, temp: number) => void;
}

const SwitchBotWidget: React.FC<SwitchBotWidgetProps> = ({
  devices,
  onToggleDevice,
  onChangeAirconMode,
  onChangeAirconTemp,
}) => {
  // デバイスタイプ別にアイコンを取得
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'light':
        return '💡';
      case 'aircon':
        return '❄️';
      case 'thermometer':
        return '🌡️';
      default:
        return '📱';
    }
  };

  // エアコンモードの表示テキスト
  const getAirconModeText = (mode?: string) => {
    switch (mode) {
      case 'cool':
        return '冷房';
      case 'heat':
        return '暖房';
      case 'auto':
        return '自動';
      case 'dry':
        return '除湿';
      case 'fan':
        return '送風';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">SwitchBot デバイス</h2>

      <div className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            {/* デバイス名とアイコン */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getDeviceIcon(device.type)}</span>
                <div>
                  <p className="font-semibold text-gray-800">{device.name}</p>
                  {device.type === 'thermometer' && (
                    <p className="text-xs text-gray-500">温湿度計</p>
                  )}
                </div>
              </div>
              {device.type !== 'thermometer' && (
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    device.isOn ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => onToggleDevice?.(device.id)}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      device.isOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            </div>

            {/* デバイス詳細情報 */}
            {device.type === 'thermometer' && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">温度</p>
                  <p className="text-2xl font-bold text-blue-600">{device.temperature}°C</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">湿度</p>
                  <p className="text-2xl font-bold text-cyan-600">{device.humidity}%</p>
                </div>
              </div>
            )}

            {device.type === 'aircon' && device.isOn && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">モード</span>
                  <select
                    className="border border-gray-300 rounded px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={device.mode}
                    onChange={(e) => onChangeAirconMode?.(device.id, e.target.value)}
                  >
                    <option value="cool">冷房</option>
                    <option value="heat">暖房</option>
                    <option value="auto">自動</option>
                    <option value="dry">除湿</option>
                    <option value="fan">送風</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">設定温度</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold"
                      onClick={() => device.targetTemp && onChangeAirconTemp?.(device.id, device.targetTemp - 1)}
                    >
                      -
                    </button>
                    <span className="text-lg font-bold text-gray-800 w-12 text-center">
                      {device.targetTemp}°C
                    </span>
                    <button
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold"
                      onClick={() => device.targetTemp && onChangeAirconTemp?.(device.id, device.targetTemp + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {device.type === 'light' && device.isOn && (
              <div className="mt-3">
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-yellow-800">点灯中</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwitchBotWidget;
