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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors aspect-square flex flex-col ${
              device.type === 'thermometer' ? '' : 'cursor-pointer'
            }`}
            onClick={() => device.type !== 'thermometer' && onToggleDevice?.(device.id)}
          >
            {/* アイコンとトグル */}
            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">{getDeviceIcon(device.type)}</span>
              {device.type !== 'thermometer' && (
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                    device.isOn ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDevice?.(device.id);
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      device.isOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            </div>

            {/* デバイス名 */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-2">{device.name}</p>
              </div>

              {/* デバイス詳細情報 */}
              {device.type === 'thermometer' && (
                <div className="space-y-2">
                  <div className="bg-blue-50 rounded p-2">
                    <p className="text-xs text-gray-600">温度</p>
                    <p className="text-xl font-bold text-blue-600">{device.temperature}°C</p>
                  </div>
                  <div className="bg-cyan-50 rounded p-2">
                    <p className="text-xs text-gray-600">湿度</p>
                    <p className="text-xl font-bold text-cyan-600">{device.humidity}%</p>
                  </div>
                </div>
              )}

              {device.type === 'aircon' && (
                <div className="space-y-2">
                  {device.isOn ? (
                    <>
                      <div className="bg-blue-50 rounded p-2">
                        <p className="text-xs text-gray-600 mb-1">モード</p>
                        <p className="text-sm font-semibold text-blue-800">{getAirconModeText(device.mode)}</p>
                      </div>
                      <div className="bg-orange-50 rounded p-2">
                        <p className="text-xs text-gray-600 mb-1">設定温度</p>
                        <div className="flex items-center justify-between">
                          <button
                            className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 text-sm font-bold shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              device.targetTemp && onChangeAirconTemp?.(device.id, device.targetTemp - 1);
                            }}
                          >
                            -
                          </button>
                          <span className="text-lg font-bold text-orange-700">
                            {device.targetTemp}°
                          </span>
                          <button
                            className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 text-sm font-bold shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              device.targetTemp && onChangeAirconTemp?.(device.id, device.targetTemp + 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <p className="text-sm text-gray-500">オフ</p>
                    </div>
                  )}
                </div>
              )}

              {device.type === 'light' && (
                <div>
                  {device.isOn ? (
                    <div className="bg-yellow-50 rounded p-2 text-center">
                      <p className="text-sm text-yellow-800 font-semibold">点灯中</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <p className="text-sm text-gray-500">消灯中</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwitchBotWidget;
